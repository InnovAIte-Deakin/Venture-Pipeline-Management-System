import type { Fund, FundStatus, FundType } from "@/types/fund-management"

export interface FundMetrics {
  totalFunds: number
  activeFunds: number
  totalCommittedCapital: number
  totalCalledCapital: number
  totalDistributedCapital: number
  averageIRR: number
}

export interface FundFilters {
  searchTerm?: string
  status?: string
  vintage?: string
  fundType?: string
}

export interface VentureDocument {
  id: string
  name: string
  type?: string
  uploadedAt?: string
  ventureName: string
}

export interface VentureDocumentSource {
  name: string
  documents?: Array<{
    id?: string
    name?: string
    type?: string
    uploadedAt?: string
  }>
}

export function parseFinancialAmount(value: string | number | null | undefined): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0
  }

  if (typeof value !== "string") {
    return 0
  }

  const trimmedValue = value.trim()
  if (!trimmedValue) {
    return 0
  }

  const normalizedValue = trimmedValue.replace(/[$,\s]/g, "")
  const match = normalizedValue.match(/^(-?\d+(?:\.\d+)?)([kmb])?$/i)

  if (!match) {
    return 0
  }

  const [, amountText, suffix = ""] = match
  const amount = Number.parseFloat(amountText)
  if (!Number.isFinite(amount)) {
    return 0
  }

  const multiplier = suffix.toLowerCase() === "k"
    ? 1000
    : suffix.toLowerCase() === "m"
      ? 1000000
      : suffix.toLowerCase() === "b"
        ? 1000000000
        : 1

  return amount * multiplier
}

export function calculateFundMetrics(funds: Fund[]): FundMetrics {
  const totalFunds = funds.length
  const activeFunds = funds.filter((fund) => fund.status === "active").length
  const totalCommittedCapital = funds.reduce((sum, fund) => sum + parseFinancialAmount(fund.committedCapital), 0)
  const totalCalledCapital = funds.reduce((sum, fund) => sum + parseFinancialAmount(fund.calledCapital), 0)
  const totalDistributedCapital = funds.reduce((sum, fund) => sum + parseFinancialAmount(fund.distributedCapital), 0)
  const averageIRR = totalFunds > 0
    ? funds.reduce((sum, fund) => sum + fund.irr, 0) / totalFunds
    : 0

  return {
    totalFunds,
    activeFunds,
    totalCommittedCapital,
    totalCalledCapital,
    totalDistributedCapital,
    averageIRR,
  }
}

export function filterFunds(funds: Fund[], filters: FundFilters = {}): Fund[] {
  const searchTerm = filters.searchTerm?.trim().toLowerCase() ?? ""
  const selectedStatus = filters.status ?? "all"
  const selectedVintage = filters.vintage ?? "all"
  const selectedFundType = filters.fundType ?? "all"

  return funds.filter((fund) => {
    const matchesSearch = !searchTerm || (() => {
      const searchableValues = [fund.name, fund.id, fund.geography, fund.fundManager, fund.sector.join(" ")]

      return searchableValues.some((value) => {
        const normalizedValue = value.toLowerCase()
        if (!normalizedValue) {
          return false
        }

        if (searchTerm.includes(" ")) {
          return normalizedValue.includes(searchTerm)
        }

        const firstToken = normalizedValue.split(/\s+/)[0]
        return firstToken.startsWith(searchTerm) || normalizedValue.includes(searchTerm)
      })
    })()

    const matchesStatus = selectedStatus === "all" || fund.status === selectedStatus
    const matchesVintage = selectedVintage === "all" || fund.vintage === selectedVintage
    const matchesFundType = selectedFundType === "all" || fund.fundType === selectedFundType

    return matchesSearch && matchesStatus && matchesVintage && matchesFundType
  })
}

export function extractVentureDocuments(ventures: VentureDocumentSource[] = []): VentureDocument[] {
  return ventures.flatMap((venture) =>
    (venture.documents ?? []).map((doc) => ({
      id: doc.id ?? `${venture.name}-${doc.name}`,
      name: doc.name ?? "Untitled document",
      type: doc.type,
      uploadedAt: doc.uploadedAt,
      ventureName: venture.name,
    })),
  )
}

export function formatFinancialValue(value: string | number | null | undefined): string {
  const parsedValue = parseFinancialAmount(value)
  if (parsedValue === 0) {
    return "$0"
  }

  if (parsedValue >= 1000000000) {
    return `$${(parsedValue / 1000000000).toFixed(parsedValue >= 10000000000 ? 0 : 1)}B`
  }

  if (parsedValue >= 1000000) {
    return `$${(parsedValue / 1000000).toFixed(parsedValue >= 10000000 ? 0 : 1)}M`
  }

  if (parsedValue >= 1000) {
    return `$${(parsedValue / 1000).toFixed(0)}K`
  }

  return `$${parsedValue.toFixed(0)}`
}
