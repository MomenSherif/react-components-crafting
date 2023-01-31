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
  useState,
  type ReactNode,
} from 'react';
import {
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

export default function DialogExample() {
  return (
    <div className="flex space-x-5">
      <Dialog>
        <DialogTrigger className="bg-slate-900 px-4 py-1.5 rounded-md text-sm text-white">
          Scroll outside dialog
        </DialogTrigger>

        <DialogPortal>
          <DialogOverlay
            className="z-20 bg-black/50 flex flex-col items-center overflow-y-auto"
            lockScroll
          >
            <DialogContent
              className="relative bg-white p-4 m-8  shadow-lg rounded-lg
              max-w-md "
            >
              <DialogHeading className="text-3xl font-bold text-center">
                Heading for popover
              </DialogHeading>
              <DialogDescription className="flex-1 text-slate-600 mt-4 ">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde,
                ex! Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Quo nam id, voluptate totam esse voluptates labore ratione sunt
                praesentium eveniet. Lorem ipsum dolor sit amet consectetur
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet
                quia tenetur officiis pariatur ducimus magni eos, in nemo dolor
                quasi rerum. Explicabo possimus doloremque quos, debitis aperiam
                repellat tempora deserunt quae. Sunt, amet illum minus ratione
                omnis dolore natus non! Ad maiores architecto sequi amet omnis
                molestias qui. Aut quod et iure dignissimos nostrum rerum, ut
                facilis tempore nesciunt numquam nulla sint, similique,
                consequatur neque ratione cum aliquam repudiandae ab ad officia
                quis? In dignissimos nisi recusandae repellat rem. At impedit,
                eaque tempora earum labore obcaecati magnam adipisci, blanditiis
                consequatur libero, veritatis suscipit voluptatem aliquid iusto.
                Totam, itaque repellendus voluptatum facere corrupti facilis
                officiis eos! Omnis molestiae facilis, odio nam possimus
                quibusdam, vero quo magni veritatis animi pariatur molestias
                ipsa nobis aperiam, quam voluptatum nisi a. Deleniti tempora
                aperiam, dolore officia ratione quae molestiae culpa sapiente ea
                , nihil enim ipsum voluptate accusamus vero rerum voluptatem
                deleniti accusantium tempora qui quas alias. Sint ullam cumque
                maiores recusandae cupiditate temporibus, tempora ab obcaecati
                est veniam, nam ipsam. Obcaecati magni quam rem ipsa veritatis
                accusantium expedita laudantium dolor nemo earum eos quisquam
                neque praesentium, laborum voluptatum consectetur officia dicta
                nihil asperiores harum incidunt nam labore delectus cumque.
                Dolor aperiam illo ab cum molestias adipisci quae nostrum sit
                excepturi, corrupti consectetur soluta, earum iure expedita
                doloremque ducimus fugit! Sapiente nesciunt voluptates
                praesentium in quae expedita, deserunt incidunt porro veniam
                similique harum accusantium veritatis ea debitis quo nostrum
                architecto?
              </DialogDescription>
              <DialogClose className="absolute top-4 right-4 inline-flex justify-center items-center w-7 h-7 bg-red-700/20 text-red-700 rounded-full hover:bg-red-700/40 focus:bg-red-700/40">
                <span className="-mt-px">x</span>
              </DialogClose>
            </DialogContent>
          </DialogOverlay>
        </DialogPortal>
      </Dialog>

      <button>Next focusable dom element</button>
    </div>
  );
}

interface DialogOptions {
  initialOpen?: boolean;
  // open?: boolean // For controlled
  // onOpenChange?: (open: boolean) => void;
}

export function usePopover(options: DialogOptions = {}) {
  const { initialOpen = false } = options;
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [labelId, setLabelId] = useState<string | undefined>();
  const [descriptionId, setDescriptionId] = useState<string | undefined>();

  const data = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(5),
      flip({
        fallbackAxisSideDirection: 'end',
      }),
      shift({ padding: 5 }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const interactions = useInteractions([
    useClick(data.context),
    useDismiss(data.context, { outsidePressEvent: 'mousedown' }), // he outsidePressEvent option is set to 'mousedown' so that touch events become lazy and do not fall through the backdrop, as the default behavior is eager.
    useRole(data.context),
  ]);

  return useMemo(
    () => ({
      isOpen,
      setIsOpen,
      labelId,
      descriptionId,
      setLabelId,
      setDescriptionId,
      ...data,
      ...interactions,
    }),
    [isOpen, labelId, descriptionId, data, interactions],
  );
}

type DialogContextType = ReturnType<typeof usePopover> | null;
const DialogContext = createContext<DialogContextType>(null);

export const useDialogContext = () => {
  const context = useContext(DialogContext);

  if (context === null) {
    throw new Error('Popover components must be wrapped in <Popover />');
  }

  return context;
};

export const DialogOverlay = forwardRef<
  ComponentRef<typeof FloatingOverlay>,
  ComponentProps<typeof FloatingOverlay>
>(function PopoverOverlay(props, ref) {
  const context = useDialogContext();

  if (!context.isOpen) return null;

  return <FloatingOverlay ref={ref} {...props} />;
});

export function Dialog({
  children,
  ...options
}: { children: ReactNode } & DialogOptions) {
  const popover = usePopover(options);
  return (
    <DialogContext.Provider value={popover}>{children}</DialogContext.Provider>
  );
}

export const DialogTrigger = forwardRef<
  HTMLElement,
  HTMLProps<HTMLElement> & { asChild?: boolean }
>(function DialogTrigger({ children, asChild = false, ...props }, propRef) {
  const context = useDialogContext();
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

export const DialogPortal = FloatingPortal;

export const DialogContent = forwardRef<
  HTMLDivElement,
  HTMLProps<HTMLDivElement>
>(function DialogContent(props, propRef) {
  const context = useDialogContext();
  const ref = useMergeRefs([context.refs.setFloating, propRef]);

  if (!context.isOpen) return null;

  return (
    <FloatingFocusManager context={context.context}>
      <div
        ref={ref}
        aria-labelledby={context.labelId}
        aria-describedby={context.descriptionId}
        {...context.getFloatingProps(props)}
      />
    </FloatingFocusManager>
  );
});

// Only sets `aria-labelledby` on the Popover root element
// if this component is mounted inside it.
export const DialogHeading = forwardRef<
  HTMLHeadingElement,
  HTMLProps<HTMLHeadingElement>
>(function DialogHeading(props, ref) {
  const { setLabelId } = useDialogContext();

  const id = useId();

  useLayoutEffect(() => {
    setLabelId(id);
    return () => setLabelId(undefined);
  }, [id, setLabelId]);

  return <h2 {...props} id={id} ref={ref} />;
});

export const DialogDescription = forwardRef<
  HTMLParagraphElement,
  HTMLProps<HTMLParagraphElement>
>(function DialogDescription(props, ref) {
  const { setDescriptionId } = useDialogContext();

  const id = useId();

  useLayoutEffect(() => {
    setDescriptionId(id);
    return () => setDescriptionId(undefined);
  }, [id, setDescriptionId]);

  return <p {...props} id={id} ref={ref} />;
});

export const DialogClose = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(function DialogClose(props, ref) {
  const { setIsOpen } = useDialogContext();
  return <button {...props} ref={ref} onClick={() => setIsOpen(false)} />;
});
