import test from "node:test"
import assert from "node:assert/strict"
import { calculateFundMetrics, extractVentureDocuments, filterFunds, parseFinancialAmount } from "./calculations"
import type { Fund } from "../types/fund-management"

const sampleFunds: Fund[] = [
  {
    id: "FUND-001",
    name: "MIV Asia Pacific Fund I",
    vintage: "2020",
    size: "$50M",
    committedCapital: "$50M",
    calledCapital: "$35M",
    distributedCapital: "$12M",
    netAssetValue: "$45M",
    irr: 18.5,
    tvpi: 1.29,
    dpi: 0.24,
    moic: 1.29,
    status: "active",
    lps: 25,
    investments: 15,
    lastUpdate: "2 hours ago",
    fundManager: "Sarah Johnson",
    fundType: "venture",
    geography: "Asia Pacific",
    sector: ["Technology"],
    investmentPeriod: "2020-2025",
    fundTerm: "10 years",
    managementFee: 2,
    carriedInterest: 20,
    hurdle: 8,
    catchUp: 100,
    benchmark: "MSCI AC Asia Pacific",
    aum: "$45M",
    dryPowder: "$15M",
    leverage: 0,
    esg: true,
    regulatoryStatus: "SEC Registered",
    fundAdmin: "SS&C Technologies",
    auditor: "KPMG",
    legalCounsel: "Latham & Watkins",
    primeBroker: "Goldman Sachs",
  },
  {
    id: "FUND-002",
    name: "MIV Growth Fund II",
    vintage: "2022",
    size: "$75M",
    committedCapital: "$75M",
    calledCapital: "$25M",
    distributedCapital: "$5M",
    netAssetValue: "$28M",
    irr: 12.3,
    tvpi: 1.12,
    dpi: 0.07,
    moic: 1.12,
    status: "winding_down",
    lps: 35,
    investments: 8,
    lastUpdate: "1 day ago",
    fundManager: "Mike Chen",
    fundType: "growth",
    geography: "Southeast Asia",
    sector: ["CleanTech"],
    investmentPeriod: "2022-2027",
    fundTerm: "12 years",
    managementFee: 2.5,
    carriedInterest: 20,
    hurdle: 8,
    catchUp: 100,
    benchmark: "FTSE Developed Asia Pacific",
    aum: "$28M",
    dryPowder: "$50M",
    leverage: 0,
    esg: true,
    regulatoryStatus: "AIFMD Compliant",
    fundAdmin: "Northern Trust",
    auditor: "EY",
    legalCounsel: "Simpson Thacher",
    primeBroker: "Morgan Stanley",
  },
]

test("parseFinancialAmount handles shorthand and plain numbers", () => {
  assert.equal(parseFinancialAmount("$50M"), 50_000_000)
  assert.equal(parseFinancialAmount("$1.5B"), 1_500_000_000)
  assert.equal(parseFinancialAmount("$500K"), 500_000)
  assert.equal(parseFinancialAmount("$250,000"), 250_000)
  assert.equal(parseFinancialAmount("1000"), 1000)
  assert.equal(parseFinancialAmount("invalid"), 0)
  assert.equal(parseFinancialAmount(null), 0)
  assert.equal(parseFinancialAmount(undefined), 0)
})

test("calculateFundMetrics handles empty and populated fund lists", () => {
  assert.deepEqual(calculateFundMetrics([]), {
    totalFunds: 0,
    activeFunds: 0,
    totalCommittedCapital: 0,
    totalCalledCapital: 0,
    totalDistributedCapital: 0,
    averageIRR: 0,
  })

  assert.deepEqual(calculateFundMetrics(sampleFunds), {
    totalFunds: 2,
    activeFunds: 1,
    totalCommittedCapital: 125_000_000,
    totalCalledCapital: 60_000_000,
    totalDistributedCapital: 17_000_000,
    averageIRR: 15.4,
  })
})

test("filterFunds narrows by search, status, vintage and fund type", () => {
  const filteredBySearch = filterFunds(sampleFunds, { searchTerm: "pacific" })
  assert.equal(filteredBySearch.length, 1)
  assert.equal(filteredBySearch[0].id, "FUND-001")

  const filteredByStatus = filterFunds(sampleFunds, { status: "active" })
  assert.equal(filteredByStatus.length, 1)

  const filteredByVintage = filterFunds(sampleFunds, { vintage: "2022" })
  assert.equal(filteredByVintage.length, 1)

  const filteredByFundType = filterFunds(sampleFunds, { fundType: "growth" })
  assert.equal(filteredByFundType.length, 1)
})

test("extractVentureDocuments adds venture names to docs", () => {
  const documents = extractVentureDocuments([
    {
      name: "Alpha Ventures",
      documents: [{ id: "doc-1", name: "Pitch Deck", uploadedAt: "2024-01-01" }],
    },
  ])

  assert.equal(documents[0].ventureName, "Alpha Ventures")
  assert.equal(documents[0].name, "Pitch Deck")
})
