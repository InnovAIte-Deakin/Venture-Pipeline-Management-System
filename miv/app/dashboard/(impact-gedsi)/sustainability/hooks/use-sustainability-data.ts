"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type {
  GEDSIMetric,
  SustainabilityViewProps,
  Venture,
} from "../types/sustainability.types";

interface VenturesResponse {
  ventures?: Venture[];
}

export function useSustainabilityData(): {
  loading: boolean;
  viewProps: SustainabilityViewProps;
} {
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [gedsiMetrics, setGedsiMetrics] = useState<GEDSIMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDigitalTwinActive, setIsDigitalTwinActive] = useState(false);
  const [carbonCredits, setCarbonCredits] = useState(0);

  const fetchSustainabilityData = useCallback(async () => {
    try {
      setLoading(true);

      const venturesResponse = await fetch("/api/ventures?limit=100");

      if (!venturesResponse.ok) {
        return;
      }

      const data = (await venturesResponse.json()) as VenturesResponse;
      const ventureData = data.ventures ?? [];

      setVentures(ventureData);

      const allGedsiMetrics = ventureData.flatMap(
        (venture) => venture.gedsiMetrics ?? [],
      );
      setGedsiMetrics(allGedsiMetrics);

      const totalFunding = ventureData.reduce(
        (sum, venture) => sum + (venture.fundingRaised || 0),
        0,
      );
      const calculatedCredits = Math.floor(totalFunding / 10000) * 5;
      setCarbonCredits(calculatedCredits);
    } catch (error) {
      console.error("Error fetching sustainability data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchSustainabilityData();
  }, [fetchSustainabilityData]);

  const regenerativeData = useMemo(() => {
    const totalFunding = ventures.reduce(
      (sum, venture) => sum + (venture.fundingRaised || 0),
      0,
    );
    const carbonOffset = Math.floor(totalFunding / 100000) * 12;

    const completedMetrics = gedsiMetrics.filter(
      (metric) =>
        metric.status === "VERIFIED" || metric.status === "COMPLETED",
    ).length;

    const inclusionFocusVentures = ventures.filter(
      (venture) =>
        venture.inclusionFocus && venture.inclusionFocus.length > 0,
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

    const sustainableSectors = ventures.filter(
      (venture) =>
        venture.sector === "CleanTech" ||
        venture.sector === "Agriculture" ||
        venture.sector === "HealthTech",
    ).length;

    const inclusiveFounders = ventures.filter((venture) => {
      try {
        const founderTypes = JSON.parse(
          venture.founderTypes || "[]",
        ) as string[];

        return founderTypes.some(
          (type) =>
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
      carbonOffset,
      biodiversityScore,
      circularityIndex,
      natureBasedSolutions: ventures.filter(
        (venture) =>
          venture.sector === "CleanTech" ||
          venture.sector === "Agriculture" ||
          venture.sector === "Environmental",
      ).length,
      regenerativeVentures: inclusionFocusVentures + sustainableSectors,
    };
  }, [ventures, gedsiMetrics]);

  const digitalTwinData = useMemo(
    () =>
      ventures.map((venture) => {
        const isCleanTech = venture.sector === "CleanTech";
        const isAgriculture = venture.sector === "Agriculture";
        const hasInclusionFocus =
          venture.inclusionFocus && venture.inclusionFocus.length > 0;

        const carbonFootprint = isCleanTech ? 25 : isAgriculture ? 45 : 65;
        const energyEfficiency = isCleanTech
          ? 85
          : hasInclusionFocus
            ? 70
            : 55;
        const circularityScore =
          isCleanTech || isAgriculture ? 75 : hasInclusionFocus ? 60 : 45;
        const biodiversityImpact = isAgriculture
          ? 85
          : isCleanTech
            ? 75
            : hasInclusionFocus
              ? 65
              : 45;

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
      }),
    [ventures],
  );

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

  const toggleDigitalTwin = useCallback(() => {
    setIsDigitalTwinActive((active) => !active);
  }, []);

  const viewProps: SustainabilityViewProps = {
    ventures,
    regenerativeData,
    digitalTwinData,
    timelineData,
    carbonCredits,
    isDigitalTwinActive,
    onToggleDigitalTwin: toggleDigitalTwin,
    onSyncData: () => {
      void fetchSustainabilityData();
    },
  };

  return { loading, viewProps };
}