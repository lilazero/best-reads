import { useEffect } from "react";

let lockCount = 0;
let previousOverflow: string | null = null;

/**
 * Locks document body scrolling while `active` is true.
 * Uses a simple module-level reference count to support nested locks.
 */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (typeof document === "undefined") return;

    if (!active) return;

    // Acquire lock
    if (lockCount === 0) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    lockCount += 1;

    return () => {
      // Release lock
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        document.body.style.overflow = previousOverflow ?? "";
        previousOverflow = null;
      }
    };
  }, [active]);
}

export default useScrollLock;
