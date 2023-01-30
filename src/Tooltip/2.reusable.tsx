import {
  cloneElement,
  createContext,
  forwardRef,
  HTMLProps,
  isValidElement,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  arrow,
  autoUpdate,
  flip,
  FloatingDelayGroup,
  FloatingPortal,
  offset,
  safePolygon,
  shift,
  useDelayGroup,
  useDelayGroupContext,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useId,
  useInteractions,
  useMergeRefs,
  useRole,
  type Placement,
} from '@floating-ui/react';

//Disabled button hack https://floating-ui.com/docs/tooltip#disabled-buttons

export default function ToolTipReusable() {
  return (
    <div className="flex space-x-2">
      <Tooltip>
        <TooltipTrigger className="bg-indigo-500 text-white px-4 py-2 rounded-md">
          Click me
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent className="bg-slate-900 text-white px-2 py-1 text-sm rounded">
            This is a tooltip
            <TooltipArrow />
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
      {/* https://floating-ui.com/docs/FloatingDelayGroup */}
      <FloatingDelayGroup delay={1000}>
        <Tooltip>
          <TooltipTrigger className="bg-indigo-500 text-white px-4 py-2 rounded-md">
            Click me
          </TooltipTrigger>
          <TooltipPortal>
            <TooltipContent className="bg-slate-900 text-white px-2 py-1 text-sm rounded">
              This is a tooltip
              <TooltipArrow />
            </TooltipContent>
          </TooltipPortal>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger className="bg-indigo-500 text-white px-4 py-2 rounded-md">
            Click me
          </TooltipTrigger>
          <TooltipPortal>
            <TooltipContent className="bg-slate-900 text-white px-2 py-1 text-sm rounded">
              This is a tooltip
              <TooltipArrow />
            </TooltipContent>
          </TooltipPortal>
        </Tooltip>
      </FloatingDelayGroup>
    </div>
  );
}

interface TooltipOptions {
  initialOpen?: boolean;
  placement?: Placement;
  delay?:
    | number
    | Partial<{
        open: number;
        close: number;
      }>;
}

export function useTooltip(options: TooltipOptions = {}) {
  const { initialOpen = false, placement = 'top', delay } = options;
  const [isOpen, setIsOpen] = useState(initialOpen);

  const arrowRef = useRef<HTMLElement>(null);

  const data = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement,
    middleware: [offset(10), flip(), shift(), arrow({ element: arrowRef })],
    whileElementsMounted: autoUpdate,
  });

  const { delay: groupDelay } = useDelayGroupContext();

  const interactions = useInteractions([
    useHover(data.context, {
      move: false,
      restMs: 400,
      delay: groupDelay || delay,
      handleClose: safePolygon(),
    }),
    useFocus(data.context),
    useDismiss(data.context),
    useRole(data.context, { role: 'tooltip' }),
  ]);

  return useMemo(
    () => ({
      isOpen,
      arrowRef,
      ...data,
      ...interactions,
    }),
    [isOpen, data, interactions],
  );
}

type TooltipContextType = ReturnType<typeof useTooltip> | null;
const TooltipContext = createContext<TooltipContextType>(null);

export const useTooltipContext = () => {
  const context = useContext(TooltipContext);

  if (context === null) {
    throw new Error('Tooltip components must be wrapped in <Tooltip />');
  }

  return context;
};

export function Tooltip({
  children,
  ...options
}: { children: ReactNode } & TooltipOptions) {
  const tooltip = useTooltip(options);
  return (
    <TooltipContext.Provider value={tooltip}>
      {children}
    </TooltipContext.Provider>
  );
}

export const TooltipTrigger = forwardRef<
  HTMLElement,
  HTMLProps<HTMLElement> & { asChild?: boolean }
>(function TooltipTrigger({ children, asChild = false, ...props }, propRef) {
  const context = useTooltipContext();
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

export const TooltipContent = forwardRef<
  HTMLDivElement,
  HTMLProps<HTMLDivElement>
>(function TooltipContent(props, propRef) {
  const context = useTooltipContext();
  const id = useId();
  // const { isInstantPhase, currentId } = useDelayGroupContext(); // can be used with useTransitionStyles & useTransitionStatus for animation
  const ref = useMergeRefs([context.refs.setFloating, propRef]);

  useDelayGroup(context.context, { id });

  if (!context.isOpen) return null;

  return (
    <div
      ref={ref}
      style={{
        position: context.strategy,
        top: context.y ?? 0,
        left: context.x ?? 0,
        visibility: context.x == null ? 'hidden' : 'visible',
        ...props.style,
      }}
      {...context.getFloatingProps(props)}
    />
  );
});

export const TooltipPortal = FloatingPortal;

const sides = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
} as const;

const TooltipArrow = forwardRef(function TooltipArrow(props, propRef) {
  const context = useTooltipContext();
  const {
    placement,
    middlewareData: { arrow },
  } = context;

  const ref = useMergeRefs([context.arrowRef, propRef]);

  return (
    <div
      ref={ref}
      id="arrow"
      className="absolute bg-inherit w-2 h-2 rotate-45"
      style={{
        left: arrow?.x != null ? `${arrow.x}px` : '',
        top: arrow?.y != null ? `${arrow?.y}px` : '',
        right: '',
        bottom: '',
        [sides[placement.split('-')[0] as keyof typeof sides]]: '-4px',
      }}
    />
  );
});
