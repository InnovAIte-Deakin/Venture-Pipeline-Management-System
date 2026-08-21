import { useCallback, useEffect, useState } from "react"
import { calculateFundingTimeline } from "@/lib/capital-facilitation/calculations"
import { generateInvestorPartners, transformVentureToCapitalRequest } from "@/lib/capital-facilitation/transformations"
import type {
  CapitalApiResponse,
  CapitalRequest,
  InvestorPartner,
} from "@/types/capital-facilitation"

interface CapitalFacilitationData {
  capitalRequests: CapitalRequest[]
  investorPartners: InvestorPartner[]
  fundingTimeline: Record<string, number>
}

const emptyData: CapitalFacilitationData = {
  capitalRequests: [],
  investorPartners: [],
  fundingTimeline: {},
}

export function useCapitalFacilitation() {
  const [data, setData] = useState<CapitalFacilitationData>(emptyData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/ventures?limit=100")
      if (!response.ok) throw new Error(`Failed to fetch ventures: ${response.status} ${response.statusText}`)

      const payload = (await response.json()) as CapitalApiResponse
      const requests = (payload.ventures || [])
        .filter((venture) => (venture.capitalActivities?.length || 0) > 0 || (venture.fundingRaised || 0) > 0)
        .map((venture) => transformVentureToCapitalRequest(venture))
      const investorPartners = generateInvestorPartners(requests)
      setData({ capitalRequests: requests, investorPartners, fundingTimeline: calculateFundingTimeline(requests) })
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Unknown error occurred"
      setError(`Failed to load capital facilitation data: ${message}`)
      setData(emptyData)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { ...data, loading, error, refresh }
}
