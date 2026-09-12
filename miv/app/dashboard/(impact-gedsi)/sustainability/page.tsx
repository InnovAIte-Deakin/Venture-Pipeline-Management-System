"use client";

import { SustainabilityDesktop } from "./components/desktop/sustainability-desktop";
import { SustainabilityMobile } from "./components/mobile/sustainability-mobile";
import { useSustainabilityData } from "./hooks/use-sustainability-data";
import { useViewport } from "./hooks/use-viewport";

export default function SustainabilityPage() {
  const { loading, viewProps } = useSustainabilityData();
  const { isMobile, isReady } = useViewport();

  if (loading || !isReady) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="mb-6 h-8 w-1/3 rounded bg-gray-200" />
          <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-5">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-24 rounded bg-gray-200" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return isMobile ? (
    <SustainabilityMobile {...viewProps} />
  ) : (
    <SustainabilityDesktop {...viewProps} />
  );
}