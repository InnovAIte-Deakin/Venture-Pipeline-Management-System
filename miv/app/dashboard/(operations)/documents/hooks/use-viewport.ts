"use client";

import { useEffect, useState } from "react";

const DESKTOP_BREAKPOINT_QUERY = "(min-width: 1024px)";

export function useViewport(): { isMobile: boolean; isReady: boolean } {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(DESKTOP_BREAKPOINT_QUERY);

    const updateViewport = () => {
      setIsDesktop(mediaQueryList.matches);
      setIsReady(true);
    };

    updateViewport();
    mediaQueryList.addEventListener("change", updateViewport);

    return () => mediaQueryList.removeEventListener("change", updateViewport);
  }, []);

  return { isMobile: !isDesktop, isReady };
}
