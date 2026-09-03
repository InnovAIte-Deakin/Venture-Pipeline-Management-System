import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
  filterVentures,
  getFundingAmount,
  getUniqueSectors,
  getVentureDetailsPath,
  requestVentures,
  summarizeVentures,
  type VentureRecord,
} from "../lib/ventures"

const ventures: VentureRecord[] = [
  {
    id: "venture-1",
    name: "Alpha Health",
    description: "Accessible care platform",
    sector: "HealthTech",
    location: "Melbourne",
    stage: "INTAKE",
    status: "ACTIVE",
    fundingRaised: 120000,
    teamSize: 5,
    foundingYear: 2021,
    gedsiScore: 82,
    createdBy: { name: "Priya Founder", email: "priya@example.com" },
  },
  {
    id: "venture-2",
    name: "Beta Farm",
    pitchSummary: "Climate smart agriculture",
    sector: "Agriculture",
    location: null,
    stage: "DUE_DILIGENCE",
    status: "INACTIVE",
    fundingRaised: null,
    fundingAmount: 50000,
    teamSize: "3",
    foundingYear: null,
    gedsiScore: 58,
    assignedTo: null,
  },
  {
    id: "venture-3",
    name: "Gamma Energy",
    sector: null,
    location: "Geelong",
    stage: "FUNDED",
    status: "ARCHIVED",
    fundingRaised: 250000,
    teamSize: null,
    foundedYear: 2019,
    gedsiScore: 104,
  },
]

describe("venture filtering", () => {
  it("searches name, description, sector, location and user fields", () => {
    assert.deepEqual(
      filterVentures(ventures, { search: "priya", status: "all", stage: "all", sector: "all" }).map((venture) => venture.id),
      ["venture-1"],
    )
    assert.deepEqual(
      filterVentures(ventures, { search: "climate", status: "all", stage: "all", sector: "all" }).map((venture) => venture.id),
      ["venture-2"],
    )
  })

  it("clears search by returning all ventures when search is empty", () => {
    assert.equal(filterVentures(ventures, { search: "", status: "all", stage: "all", sector: "all" }).length, 3)
  })

  it("filters by Prisma stage values", () => {
    assert.deepEqual(
      filterVentures(ventures, { search: "", status: "all", stage: "DUE_DILIGENCE", sector: "all" }).map((venture) => venture.id),
      ["venture-2"],
    )
  })

  it("filters by Prisma status values", () => {
    assert.deepEqual(
      filterVentures(ventures, { search: "", status: "ARCHIVED", stage: "all", sector: "all" }).map((venture) => venture.id),
      ["venture-3"],
    )
  })

  it("combines search, stage, status and sector filters", () => {
    assert.deepEqual(
      filterVentures(ventures, { search: "farm", status: "INACTIVE", stage: "DUE_DILIGENCE", sector: "Agriculture" }).map(
        (venture) => venture.id,
      ),
      ["venture-2"],
    )
  })

  it("handles null sector and user fields without failing", () => {
    assert.deepEqual(filterVentures(ventures, { search: "energy", status: "all", stage: "all", sector: "all" })[0].id, "venture-3")
  })

  it("returns an empty result when filters do not match", () => {
    assert.deepEqual(filterVentures(ventures, { search: "missing", status: "ACTIVE", stage: "FUNDED", sector: "HealthTech" }), [])
  })
})

describe("venture summary calculations", () => {
  it("uses backend fundingRaised and foundingYear fields while tolerating older aliases", () => {
    assert.equal(getFundingAmount(ventures[0]), 120000)
    assert.equal(getFundingAmount(ventures[1]), 50000)
  })

  it("calculates totals and clamps GEDSI scores", () => {
    assert.deepEqual(summarizeVentures(ventures), {
      totalVentures: 3,
      totalFunding: 420000,
      totalTeamMembers: 8,
      averageGedsiScore: 80,
    })
  })

  it("returns zero totals for empty data", () => {
    assert.deepEqual(summarizeVentures([]), {
      totalVentures: 0,
      totalFunding: 0,
      totalTeamMembers: 0,
      averageGedsiScore: 0,
    })
  })

  it("derives sector filter options from API data", () => {
    assert.deepEqual(getUniqueSectors(ventures), ["Agriculture", "HealthTech"])
  })
})

describe("venture API helper", () => {
  it("parses the backend wrapper response structure", async () => {
    const result = await requestVentures(async (url, init) => {
      assert.equal(url, "/api/ventures?limit=100")
      assert.equal(init?.credentials, "include")

      return Response.json({
        ventures: [
          {
            id: "venture-1",
            name: "Alpha Health",
            fundingRaised: 120000,
            foundingYear: 2021,
            stage: "INTAKE",
            status: "ACTIVE",
          },
        ],
        pagination: { page: 1, limit: 100, total: 1, pages: 1 },
        isMobile: false,
      })
    })

    assert.equal(result.ventures.length, 1)
    assert.equal(result.ventures[0].fundingRaised, 120000)
    assert.equal(result.ventures[0].foundingYear, 2021)
    assert.deepEqual(result.pagination, { page: 1, limit: 100, total: 1, pages: 1 })
    assert.equal(result.isMobile, false)
  })

  it("rejects API errors with useful response details", async () => {
    await assert.rejects(
      () => requestVentures(async () => Response.json({ error: "Unauthorized" }, { status: 401 })),
      /Unauthorized/,
    )
  })

  it("rejects invalid response shapes", async () => {
    await assert.rejects(() => requestVentures(async () => Response.json({ ventures: {} })), /invalid response/)
    await assert.rejects(() => requestVentures(async () => Response.json({ ventures: [null] })), /malformed venture records/)
  })
})

describe("venture navigation helpers", () => {
  it("builds the venture details path used by view actions", () => {
    assert.equal(getVentureDetailsPath("venture-1"), "/dashboard/ventures/venture-1")
  })
})
