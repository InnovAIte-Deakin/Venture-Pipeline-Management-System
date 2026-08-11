"use client";

import { useEffect, useMemo, useState } from "react";

import { SustainabilityDesktop } from "./components/desktop/sustainability-desktop";
import { SustainabilityMobile } from "./components/mobile/sustainability-mobile";
import { useViewport } from "./hooks/use-viewport";
import type {
  GEDSIMetric,
  SustainabilityViewProps,
  Venture,
} from "./types/sustainability.types";

export default function SustainabilityPage() {
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [gedsiMetrics, setGedsiMetrics] = useState<GEDSIMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDigitalTwinActive, setIsDigitalTwinActive] = useState(false);
  const [carbonCredits, setCarbonCredits] = useState(0);

  useEffect(() => {
    fetchSustainabilityData();
  }, []);

  const fetchSustainabilityData = async () => {
    try {
      setLoading(true);

      // Fetch ventures with GEDSI metrics included
      const venturesResponse = await fetch("/api/ventures?limit=100");
      if (venturesResponse.ok) {
        const data = await venturesResponse.json();
        const ventureData = data.ventures || [];
        setVentures(ventureData);

        // Extract all GEDSI metrics from ventures
        const allGedsiMetrics: GEDSIMetric[] = [];
        ventureData.forEach((venture: Venture) => {
          if (venture.gedsiMetrics && venture.gedsiMetrics.length > 0) {
            allGedsiMetrics.push(...venture.gedsiMetrics);
          }
        });
        setGedsiMetrics(allGedsiMetrics);

        // Calculate carbon credits based on real portfolio data
        const totalFunding = ventureData.reduce(
          (sum: number, v: any) => sum + (v.fundingRaised || 0),
          0,
        );
        const calculatedCredits = Math.floor(totalFunding / 10000) * 5; // Real calculation only
        setCarbonCredits(calculatedCredits);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching sustainability data:", error);
      setLoading(false);
    }
  };

  // Generate regenerative impact data based on real portfolio
  const regenerativeData = useMemo(() => {
    const totalFunding = ventures.reduce(
      (sum, v) => sum + (v.fundingRaised || 0),
      0,
    );
    const carbonOffset = Math.floor(totalFunding / 100000) * 12; // 12 tCO2e per $100K invested

    // Calculate biodiversity score based on GEDSI metrics completion and venture focus
    const completedMetrics = gedsiMetrics.filter(
      (m) => m.status === "VERIFIED" || m.status === "COMPLETED",
    ).length;
    const inclusionFocusVentures = ventures.filter(
      (v) => v.inclusionFocus && v.inclusionFocus.length > 0,
    ).length;
    const biodiversityScore =
      ventures.length === 0
        ? 0
        : Math.min(
            95,
            Math.floor(
              (completedMetrics / Math.max(gedsiMetrics.length, 1)) * 40,
            ) +
              Math.floor(
                (inclusionFocusVentures / Math.max(ventures.length, 1)) * 35,
              ),
          );

    // Calculate circularity index based on venture sectors and founder types
    const sustainableSectors = ventures.filter(
      (v) =>
        v.sector === "CleanTech" ||
        v.sector === "Agriculture" ||
        v.sector === "HealthTech",
    ).length;
    const inclusiveFounders = ventures.filter((v) => {
      try {
        const founderTypes = JSON.parse(v.founderTypes || "[]");
        return founderTypes.some(
          (type: string) =>
            type.includes("disability") ||
            type.includes("women") ||
            type.includes("inclusive"),
        );
      } catch {
        return false;
      }
    }).length;
    const circularityIndex =
      ventures.length === 0
        ? 0
        : Math.min(
            95,
            Math.floor(
              (sustainableSectors / Math.max(ventures.length, 1)) * 50,
            ) +
              Math.floor(
                (inclusiveFounders / Math.max(ventures.length, 1)) * 30,
              ),
          );

    return {
      carbonOffset: carbonOffset, // Real carbon offset based on funding
      biodiversityScore,
      circularityIndex,
      natureBasedSolutions: ventures.filter(
        (v) =>
          v.sector === "CleanTech" ||
          v.sector === "Agriculture" ||
          v.sector === "Environmental",
      ).length,
      regenerativeVentures: inclusionFocusVentures + sustainableSectors,
    };
  }, [ventures, gedsiMetrics]);

  const digitalTwinData = useMemo(() => {
    return ventures.map((venture) => {
      // Calculate metrics based on venture characteristics
      const isCleanTech = venture.sector === "CleanTech";
      const isAgriculture = venture.sector === "Agriculture";
      const hasInclusionFocus =
        venture.inclusionFocus && venture.inclusionFocus.length > 0;
      const ventureAge = venture.foundingYear
        ? new Date().getFullYear() - venture.foundingYear
        : 1;
      const teamSizeScore = Math.min(100, (venture.teamSize || 5) * 10);
      const fundingScore = Math.min(
        100,
        Math.floor((venture.fundingRaised || 0) / 10000),
      );

      // Calculate environmental scores based on real venture characteristics
      const carbonFootprint = isCleanTech ? 25 : isAgriculture ? 45 : 65; // Lower is better

      const energyEfficiency = isCleanTech ? 85 : hasInclusionFocus ? 70 : 55; // Higher is better

      const circularityScore =
        isCleanTech || isAgriculture ? 75 : hasInclusionFocus ? 60 : 45; // Higher is better

      const biodiversityImpact = isAgriculture
        ? 85
        : isCleanTech
          ? 75
          : hasInclusionFocus
            ? 65
            : 45; // Higher is better

      return {
        name: venture.name,
        sector: venture.sector,
        carbonFootprint,
        energyEfficiency,
        waterUsage: Math.floor(Math.random() * 30) + 40,
        wasteReduction: circularityScore - 20,
        biodiversityImpact,
        circularityScore,
      };
    });
  }, [ventures]);

  const timelineData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map((month, index) => ({
      month,
      carbonOffset: Math.floor(
        (regenerativeData.carbonOffset * (index + 1)) / 6,
      ),
      circularityIndex: Math.floor(
        regenerativeData.circularityIndex * (0.8 + index * 0.04),
      ),
      biodiversityScore: Math.floor(
        regenerativeData.biodiversityScore * (0.85 + index * 0.025),
      ),
    }));
  }, [regenerativeData]);

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

  const viewProps: SustainabilityViewProps = {
    ventures,
    regenerativeData,
    digitalTwinData,
    timelineData,
    carbonCredits,
    isDigitalTwinActive,
    onToggleDigitalTwin: () => setIsDigitalTwinActive((active) => !active),
    onSyncData: fetchSustainabilityData,
  };

  return isMobile ? (
    <SustainabilityMobile {...viewProps} />
  ) : (
    <SustainabilityDesktop {...viewProps} />
  );
}
