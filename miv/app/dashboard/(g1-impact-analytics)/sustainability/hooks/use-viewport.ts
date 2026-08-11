"use client";

import { useEffect, useState } from "react";

const DESKTOP_BREAKPOINT_QUERY = "(min-width: 1024px)";

export function useViewport(): { isMobile: boolean; isReady: boolean } {
  const [isMobile, setIsMobile] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(DESKTOP_BREAKPOINT_QUERY);
    const update = () => {
      setIsMobile(!mediaQueryList.matches);
      setIsReady(true);
    };

    update();
    mediaQueryList.addEventListener("change", update);
    return () => mediaQueryList.removeEventListener("change", update);
  }, []);

  return { isMobile, isReady };
}
