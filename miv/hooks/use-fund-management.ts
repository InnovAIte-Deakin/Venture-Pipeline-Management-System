import { useCallback, useEffect, useRef, useState } from "react"
import { extractVentureDocuments } from "@/lib/fund-management/calculations"
import type { CapitalCall, Distribution, Fund, LimitedPartner } from "@/types/fund-management"

interface FundManagementApiResponse {
  funds?: Fund[]
  limitedPartners?: LimitedPartner[]
  capitalCalls?: CapitalCall[]
  distributions?: Distribution[]
  operationTasks?: Array<Record<string, unknown>>
  documents?: Array<Record<string, unknown>>
  reports?: Array<Record<string, unknown>>
  ventures?: Array<{
    name: string
    documents?: Array<{
      id?: string
      name?: string
      type?: string
      uploadedAt?: string
    }>
  }>
}

export function useFundManagement() {
  const [funds, setFunds] = useState<Fund[]>([])
  const [limitedPartners, setLimitedPartners] = useState<LimitedPartner[]>([])
  const [capitalCalls, setCapitalCalls] = useState<CapitalCall[]>([])
  const [distributions, setDistributions] = useState<Distribution[]>([])
  const [operationTasks, setOperationTasks] = useState<Array<Record<string, unknown>>>([])
  const [documents, setDocuments] = useState<Array<Record<string, unknown>>>([])
  const [reports, setReports] = useState<Array<Record<string, unknown>>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)
  const activeRequestRef = useRef<AbortController | null>(null)

  useEffect(() => {
    return () => {
      mountedRef.current = false
      activeRequestRef.current?.abort()
    }
  }, [])

  const refresh = useCallback(async () => {
    activeRequestRef.current?.abort()
    const controller = new AbortController()
    activeRequestRef.current = controller

    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/fund-management?includeCapitalActivities=true&includeLPs=true", {
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch fund data: ${response.status} ${response.statusText}`)
      }

      const data: FundManagementApiResponse = await response.json()

      if (!mountedRef.current || controller.signal.aborted) {
        return
      }

      const nextDocuments = extractVentureDocuments(data.ventures ?? [])
      setFunds(data.funds ?? [])
      setLimitedPartners(data.limitedPartners ?? [])
      setCapitalCalls(data.capitalCalls ?? [])
      setDistributions(data.distributions ?? [])
      setOperationTasks(data.operationTasks ?? [])
      setDocuments(nextDocuments)
      setReports(data.reports ?? [])
    } catch (err) {
      if (controller.signal.aborted || !mountedRef.current) {
        return
      }

      const message = err instanceof Error ? err.message : "Failed to fetch fund data"
      setError(message)
      setFunds([])
      setLimitedPartners([])
      setCapitalCalls([])
      setDistributions([])
      setOperationTasks([])
      setDocuments([])
      setReports([])
    } finally {
      if (mountedRef.current && !controller.signal.aborted) {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    void refresh()

    const interval = window.setInterval(() => {
      void refresh()
    }, 30000)

    return () => {
      window.clearInterval(interval)
    }
  }, [refresh])

  return {
    funds,
    limitedPartners,
    capitalCalls,
    distributions,
    operationTasks,
    documents,
    reports,
    loading,
    error,
    refresh,
  }
}
