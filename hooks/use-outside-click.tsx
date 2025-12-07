import React, { useEffect } from "react";

export const useOutsideClick = (
  ref: React.RefObject<HTMLElement | null>,
  callback: (event: Event) => void
) => {
  useEffect(() => {
    const listener = (event: Event) => {
      const target = event.target as Node | null;
      // DO NOTHING if the element being clicked is the target element or their children
      if (!ref.current || (target && ref.current.contains(target))) {
        return;
      }
      callback(event);
    };

    // Use pointerdown for broader device support and keep touchstart for older browsers
    document.addEventListener("pointerdown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("pointerdown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, callback]);
};
