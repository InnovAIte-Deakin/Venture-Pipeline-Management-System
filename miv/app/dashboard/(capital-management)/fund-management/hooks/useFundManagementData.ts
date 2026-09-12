"use client"

import { useCallback, useEffect, useState } from "react"
import {
  CapitalCall,
  Distribution,
  Fund,
  FundManagementPayload,
  LimitedPartner,
  OperationTask,
} from "../types/fund-management"
import {
  capitalCalls as mockCapitalCalls,
  distributions as mockDistributions,
  funds as mockFunds,
  limitedPartners as mockLimitedPartners,
  operationTasks as mockOperationTasks,
  reports as mockReports,
  documents as mockDocuments,
} from "../data/fund-management"

export function useFundManagementData() {
  const [funds, setFunds] = useState<Fund[]>([])
  const [limitedPartners, setLimitedPartners] = useState<LimitedPartner[]>([])
  const [capitalCalls, setCapitalCalls] = useState<CapitalCall[]>([])
  const [distributions, setDistributions] = useState<Distribution[]>([])
  const [operationTasks, setOperationTasks] = useState<OperationTask[]>([])
  const [documents, setDocuments] = useState<any[]>([])
  const [reports, setReports] = useState<FundManagementPayload["reports"]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedVintage, setSelectedVintage] = useState("all")
  const [selectedFundType, setSelectedFundType] = useState("all")
  const [selectedLP, setSelectedLP] = useState<LimitedPartner | null>(null)
  const [isLPDialogOpen, setIsLPDialogOpen] = useState(false)

  const loadMockData = useCallback(() => {
    setFunds(mockFunds)
    setLimitedPartners(mockLimitedPartners)
    setCapitalCalls(mockCapitalCalls)
    setDistributions(mockDistributions)
    setOperationTasks(mockOperationTasks)
    setReports(mockReports)
    setDocuments(mockDocuments)
    setLoading(false)
  }, [])

  const fetchFundData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/fund-management?includeCapitalActivities=true&includeLPs=true")

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`)
      }

      const data = (await response.json()) as FundManagementPayload

      setFunds(data.funds || [])
      setLimitedPartners(data.limitedPartners || [])
      setCapitalCalls(data.capitalCalls || [])
      setDistributions(data.distributions || [])
      setOperationTasks(data.operationTasks || [])
      setReports(data.reports || [])

      const allDocuments = data.ventures
        ? data.ventures.flatMap((venture: any) =>
            (venture.documents || []).map((doc: any) => ({
              ...doc,
              ventureName: venture.name,
            }))
          )
        : []

      setDocuments(allDocuments)
      setLoading(false)
    } catch (err) {
      console.error("Fund management load failed", err)
      setError(err instanceof Error ? err.message : "Failed to load fund management data")
      loadMockData()
    }
  }, [loadMockData])

  useEffect(() => {
    fetchFundData()
  }, [fetchFundData])

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
    searchTerm,
    selectedStatus,
    selectedVintage,
    selectedFundType,
    selectedLP,
    isLPDialogOpen,
    setSearchTerm,
    setSelectedStatus,
    setSelectedVintage,
    setSelectedFundType,
    setSelectedLP,
    setIsLPDialogOpen,
    fetchFundData,
  }
}
