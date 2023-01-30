import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  safePolygon,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import { useState } from 'react';

export default function TooltipBasics() {
  const [isOpen, setIsOpen] = useState(false);

  const { x, y, strategy, refs, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'top',
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context, {
      move: false,
      restMs: 150, // Waits until the user’s cursor is at “rest” over the reference element before changing the open state.
      delay: { open: 1000 }, // You can also use a fallback delay if the user’s cursor never rests, to ensure the floating element will eventually open
      handleClose: safePolygon(), // interactive
    }),
    useFocus(context),
    useDismiss(context),
    useRole(context, { role: 'tooltip' }),
  ]);

  return (
    <>
      <button
        ref={refs.setReference}
        className="bg-indigo-500 text-white px-4 py-2 rounded-md"
        {...getReferenceProps()}
      >
        Reference Element
      </button>
      <FloatingPortal>
        {isOpen && (
          <div
            ref={refs.setFloating}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              width: 'max-content',
            }}
            className="bg-slate-900 text-white px-2 py-1 text-sm rounded"
            {...getFloatingProps()}
          >
            Tooltip element
          </div>
        )}
      </FloatingPortal>
    </>
  );
}
