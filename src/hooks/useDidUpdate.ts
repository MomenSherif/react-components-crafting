import { useEffect, useRef, EffectCallback, DependencyList } from 'react';

/**
 * Calls a callback after each update in the dependency list
 * @param callback - Imperative function that can return a cleanup function
 * @param deps -  If present, effect will only activate if the values in the list change.
 */
export function useDidUpdate(
  callback: EffectCallback,
  deps?: DependencyList,
): void {
  const isMountedRef = useRef(false);

  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      return;
    }

    const cleanUp = callbackRef.current();
    return cleanUp;
  }, deps);
}

export default useDidUpdate;
