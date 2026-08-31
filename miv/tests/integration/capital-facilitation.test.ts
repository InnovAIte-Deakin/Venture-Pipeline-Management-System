import assert from "node:assert/strict"
import test from "node:test"
import {
  calculateFundingTimeline,
  createDealPipelineStages,
  generateInvestorPartners,
  getCapitalStatus,
  transformVentures,
} from "../../app/dashboard/(capital-management)/capital-facilitation/lib/capital-facilitation"
import type { CapitalRequest, VentureApiItem } from "../../app/dashboard/(capital-management)/capital-facilitation/types"

const request = (overrides: Partial<CapitalRequest> = {}): CapitalRequest => ({
  id: "CAP-1",
  venture: "HealthTech One",
  amount: 100000,
  status: "Approved",
  stage: "Closed",
  progress: 100,
  submittedDate: "2026-01-01",
  expectedDecision: "2026-01-15",
  investor: "Impact Capital Partners",
  timeline: [],
  documents: [],
  ...overrides,
})

test("capital status preserves stage rules", () => {
  assert.equal(getCapitalStatus("DUE_DILIGENCE"), "Pending")
  assert.equal(getCapitalStatus("FUNDED"), "Approved")
  assert.equal(getCapitalStatus("INTAKE"), "Under Review")
})

test("pipeline totals are accurate for displayed data", () => {
  const requests = [request(), request({ id: "CAP-2", amount: 50000, status: "Pending", stage: "Due Diligence" })]
  assert.equal(createDealPipelineStages(requests).find((stage) => stage.name === "Closed")?.capital, 100000)
  assert.equal(createDealPipelineStages(requests).find((stage) => stage.name === "Due Diligence")?.capital, 50000)
})

test("funding timeline never exposes negative or invalid values", () => {
  const timeline = calculateFundingTimeline([request()])
  assert.equal(timeline.Closed, 14)
  assert.ok(Object.values(timeline).every((days) => Number.isFinite(days) && days >= 0))
})

test("venture transformation is deterministic and null-safe", () => {
  const venture: VentureApiItem = {
    id: "venture-123456789",
    name: "HealthTech One",
    stage: "DUE_DILIGENCE",
    fundingRaised: null,
    createdAt: "2026-01-01T00:00:00Z",
    capitalActivities: [{}],
  }
  const transformed = transformVentures([venture])[0]
  assert.ok(transformed.amount >= 500000)
  assert.equal(transformed.status, "Pending")
  assert.equal(transformed.expectedDecision, "2026-01-15")
  assert.ok(!Object.values(transformed).some((value) => typeof value === "number" && Number.isNaN(value)))
})

test("investor generation summarizes active requests", () => {
  const investors = generateInvestorPartners([
    request({ investor: "Impact Capital Partners", amount: 100000 }),
    request({ id: "CAP-2", investor: "Impact Capital Partners", amount: 50000 }),
  ])
  assert.equal(investors[0]?.name, "Impact Capital Partners")
  assert.equal(investors[0]?.totalInvested, 150000)
  assert.equal(investors[0]?.activeDeals, 2)
})
