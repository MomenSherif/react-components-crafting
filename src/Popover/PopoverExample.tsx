import {
  ButtonHTMLAttributes,
  cloneElement,
  ComponentProps,
  ComponentRef,
  createContext,
  forwardRef,
  HTMLProps,
  isValidElement,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  arrow,
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useId,
  useInteractions,
  useMergeRefs,
  useRole,
  type Placement,
} from '@floating-ui/react';

export default function PopoverExample() {
  return (
    <div className="flex space-x-5">
      <Popover>
        <PopoverTrigger className="relative z-10 bg-slate-900 px-4 py-1.5 rounded-md text-sm text-white">
          Add user
        </PopoverTrigger>
        <PopoverPortal>
          <PopoverOverlay className="bg-black/40" lockScroll />
          <PopoverContent className="bg-white shadow-lg border rounded-lg p-4">
            <PopoverHeading className="text-3xl font-bold text-center">
              Heading for popover
            </PopoverHeading>
            <PopoverDescription className="text-slate-600 mt-4">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, ex!
            </PopoverDescription>
            <PopoverClose className="absolute top-4 right-4 inline-flex justify-center items-center w-7 h-7 bg-red-700/20 text-red-700 rounded-full hover:bg-red-700/40 focus:bg-red-700/40">
              <span className="-mt-px">x</span>
            </PopoverClose>
            <PopoverArrow className="border-t border-l transform -translate-y-px" />
          </PopoverContent>
        </PopoverPortal>
      </Popover>

      <button>Next focusable dom element</button>
    </div>
  );
}

interface PopoverOptions {
  initialOpen?: boolean;
  placement?: Placement;
  modal?: boolean;
  // open?: boolean; // Update components to support both controlled/uncontrolled state
  // onOpenChange: (open: boolean) => void;
}

export function usePopover(options: PopoverOptions = {}) {
  const { initialOpen = false, placement = 'bottom', modal = false } = options;
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [labelId, setLabelId] = useState<string | undefined>();
  const [descriptionId, setDescriptionId] = useState<string | undefined>();

  const arrowRef = useRef<HTMLElement>(null);

  const data = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement,
    middleware: [
      offset(5),
      flip({
        fallbackAxisSideDirection: 'end',
      }),
      shift({ padding: 5 }),
      arrow({ element: arrowRef }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const interactions = useInteractions([
    useClick(data.context),
    useDismiss(data.context),
    useRole(data.context),
  ]);

  return useMemo(
    () => ({
      isOpen,
      setIsOpen,
      arrowRef,
      modal,
      labelId,
      descriptionId,
      setLabelId,
      setDescriptionId,
      ...data,
      ...interactions,
    }),
    [isOpen, modal, labelId, descriptionId, data, interactions],
  );
}

type PopoverContextType = ReturnType<typeof usePopover> | null;
const PopoverContext = createContext<PopoverContextType>(null);

export const usePopoverContext = () => {
  const context = useContext(PopoverContext);

  if (context === null) {
    throw new Error('Popover components must be wrapped in <Popover />');
  }

  return context;
};

export const PopoverOverlay = forwardRef<
  ComponentRef<typeof FloatingOverlay>,
  ComponentProps<typeof FloatingOverlay>
>(function PopoverOverlay(props, ref) {
  const context = usePopoverContext();

  if (!context.isOpen) return null;

  return <FloatingOverlay ref={ref} {...props} />;
});

export function Popover({
  children,
  ...options
}: { children: ReactNode } & PopoverOptions) {
  const popover = usePopover(options);
  return (
    <PopoverContext.Provider value={popover}>
      {children}
    </PopoverContext.Provider>
  );
}

export const PopoverTrigger = forwardRef<
  HTMLElement,
  HTMLProps<HTMLElement> & { asChild?: boolean }
>(function PopoverTrigger({ children, asChild = false, ...props }, propRef) {
  const context = usePopoverContext();
  const childrenRef = (children as any).ref;
  const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);

  if (asChild && isValidElement(children)) {
    return cloneElement(
      children,
      context.getReferenceProps({
        ref,
        ...props,
        ...children.props,
        'data-state': context.isOpen ? 'open' : 'closed',
      }),
    );
  }

  return (
    <button
      ref={ref}
      data-state={context.isOpen ? 'open' : 'closed'}
      {...context.getReferenceProps(props)}
    >
      {children}
    </button>
  );
});

export const PopoverAnchor = forwardRef<
  HTMLDivElement,
  HTMLProps<HTMLDivElement> & { asChild?: boolean }
>(function PopoverAnchor({ children, asChild = false, ...props }, propRef) {
  const context = usePopoverContext();
  const childrenRef = (children as any).ref;
  const ref = useMergeRefs([
    context.refs.setPositionReference,
    propRef,
    childrenRef,
  ]);

  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      ref,
      ...props,
      ...children.props,
      'data-state': context.isOpen ? 'open' : 'closed',
    });
  }

  return (
    <div ref={ref} data-state={context.isOpen ? 'open' : 'closed'} {...props}>
      {children}
    </div>
  );
});

export const PopoverPortal = FloatingPortal;

export const PopoverContent = forwardRef<
  HTMLDivElement,
  HTMLProps<HTMLDivElement>
>(function PopoverContent(props, propRef) {
  const context = usePopoverContext();
  const ref = useMergeRefs([context.refs.setFloating, propRef]);

  if (!context.isOpen) return null;

  return (
    <FloatingFocusManager context={context.context} modal={context.modal}>
      <div
        ref={ref}
        style={{
          position: context.strategy,
          top: context.y ?? 0,
          left: context.x ?? 0,
          visibility: context.x == null ? 'hidden' : 'visible',
          width: 'max-content',
          ...props.style,
        }}
        aria-labelledby={context.labelId}
        aria-describedby={context.descriptionId}
        {...context.getFloatingProps(props)}
      />
    </FloatingFocusManager>
  );
});

const sides = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
} as const;

const PopoverArrow = forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(
  function PopoverArrow(props, propRef) {
    const context = usePopoverContext();
    const {
      placement,
      middlewareData: { arrow },
    } = context;

    const ref = useMergeRefs([context.arrowRef, propRef]);

    return (
      <div
        ref={ref}
        id="arrow"
        {...props}
        className={`absolute bg-inherit w-2 h-2 rotate-45 ${props.className}`}
        style={{
          left: arrow?.x != null ? `${arrow.x}px` : '',
          top: arrow?.y != null ? `${arrow?.y}px` : '',
          right: '',
          bottom: '',
          [sides[placement.split('-')[0] as keyof typeof sides]]: '-4px',
        }}
      />
    );
  },
);

// Only sets `aria-labelledby` on the Popover root element
// if this component is mounted inside it.
export const PopoverHeading = forwardRef<
  HTMLHeadingElement,
  HTMLProps<HTMLHeadingElement>
>(function PopoverHeading(props, ref) {
  const { setLabelId } = usePopoverContext();

  const id = useId();

  useLayoutEffect(() => {
    setLabelId(id);
    return () => setLabelId(undefined);
  }, [id, setLabelId]);

  return <h2 {...props} id={id} ref={ref} />;
});

export const PopoverDescription = forwardRef<
  HTMLParagraphElement,
  HTMLProps<HTMLParagraphElement>
>(function PopoverHeading(props, ref) {
  const { setDescriptionId } = usePopoverContext();

  const id = useId();

  useLayoutEffect(() => {
    setDescriptionId(id);
    return () => setDescriptionId(undefined);
  }, [id, setDescriptionId]);

  return <p {...props} id={id} ref={ref} />;
});

export const PopoverClose = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(function PopoverClose(props, ref) {
  const { setIsOpen } = usePopoverContext();
  return <button {...props} ref={ref} onClick={() => setIsOpen(false)} />;
});
