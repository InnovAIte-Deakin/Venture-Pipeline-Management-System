import assert from "node:assert/strict"
import test from "node:test"
import { calculateCapitalProgress, calculateMetrics, calculatePipelineStages, calculateFundingTimeline } from "../../lib/capital-facilitation/calculations"
import { transformVentureToCapitalRequest } from "../../lib/capital-facilitation/transformations"
import type { CapitalRequest } from "../../types/capital-facilitation"

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

test("capital progress preserves stage and status rules", () => {
  assert.equal(calculateCapitalProgress("DUE_DILIGENCE", "Pending"), 60)
  assert.equal(calculateCapitalProgress("FUNDED", "Approved"), 100)
  assert.equal(calculateCapitalProgress("INTAKE", "Rejected"), 0)
})

test("capital metrics and pipeline totals are accurate for displayed data", () => {
  const requests = [request(), request({ id: "CAP-2", amount: 50000, status: "Pending", stage: "Due Diligence" })]
  assert.deepEqual(calculateMetrics(requests), { totalCapital: 150000, activeDeals: 2, successRate: 50, averageDealSize: 75000 })
  assert.equal(calculatePipelineStages(requests).find((stage) => stage.name === "Closed")?.capital, 100000)
})

test("funding timeline never exposes negative or invalid values", () => {
  const timeline = calculateFundingTimeline([request()])
  assert.equal(timeline.Closed, 14)
  assert.ok(Object.values(timeline).every((days) => Number.isFinite(days) && days >= 0))
})

test("venture transformation is deterministic and null-safe", () => {
  const transformed = transformVentureToCapitalRequest({ id: "venture-123456789", name: "HealthTech One", stage: "DUE_DILIGENCE", fundingRaised: null }, new Date("2026-01-01T00:00:00Z"))
  assert.equal(transformed.amount, 500000)
  assert.equal(transformed.status, "Pending")
  assert.equal(transformed.expectedDecision, "2026-01-15")
  assert.ok(!Object.values(transformed).some((value) => typeof value === "number" && Number.isNaN(value)))
})
