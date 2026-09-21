import { useCallback, useEffect, useMemo, useState } from "react";
import {
  calculateFundingTimeline,
  createDealPipelineStages,
  generateInvestorPartners,
  transformVentures,
} from "../lib/capital-facilitation";
import type { CapitalRequest, VentureApiItem } from "../types";

export function useCapitalFacilitation() {
  const [capitalRequests, setCapitalRequests] = useState<CapitalRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<CapitalRequest | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCapitalData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/ventures?limit=100");
      if (!response.ok)
        throw new Error(
          `Failed to fetch ventures: ${response.status} ${response.statusText}`,
        );
      const data = (await response.json()) as { ventures?: VentureApiItem[] };
      const requests = transformVentures(data.ventures ?? []);
      setCapitalRequests(requests);
      setSelectedRequest(
        (current) =>
          requests.find((request) => request.id === current?.id) ??
          requests[0] ??
          null,
      );
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : "Unknown error occurred";
      setError(`Failed to load capital facilitation data: ${message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCapitalData();
  }, [fetchCapitalData]);

  const investorPartners = useMemo(
    () => generateInvestorPartners(capitalRequests),
    [capitalRequests],
  );
  const fundingTimeline = useMemo(
    () => calculateFundingTimeline(capitalRequests),
    [capitalRequests],
  );
  const dealPipelineStages = useMemo(
    () => createDealPipelineStages(capitalRequests),
    [capitalRequests],
  );

  return {
    capitalRequests,
    dealPipelineStages,
    error,
    fetchCapitalData,
    fundingTimeline,
    investorPartners,
    loading,
    selectedRequest,
    setSelectedRequest,
  };
}
