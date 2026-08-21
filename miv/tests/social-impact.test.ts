import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { aggregateSocialImpact } from "../app/dashboard/(g1-impact-analytics)/social-impact/social-impact/lib/social-impact-calculations"
import { filterVentures } from "../app/dashboard/(g1-impact-analytics)/social-impact/social-impact/lib/social-impact-filters"
import { requestSocialImpactData } from "../app/dashboard/(g1-impact-analytics)/social-impact/hooks/use-social-impact-data"
import type { SocialImpactVenture } from "../app/dashboard/(g1-impact-analytics)/social-impact/types/social-impact"

const ventures: SocialImpactVenture[] = [
  { id: "1", name: "Alpha Health", sector: "HealthTech", location: "Melbourne, AU", stage: "SEED", status: "ACTIVE", teamSize: 5, inclusionFocus: "Women", founderTypes: "[]", totalBeneficiaries: 100, jobsCreated: 10, womenEmpowered: 60, disabilityInclusive: null, youthEngaged: 20 },
  { id: "2", name: "Beta Farm", sector: "Agriculture", location: null, stage: "GROWTH", status: "INACTIVE", teamSize: null, inclusionFocus: null, founderTypes: "malformed", totalBeneficiaries: 50, jobsCreated: 5, womenEmpowered: 20, disabilityInclusive: 4, youthEngaged: 10 },
]

describe("social impact calculations", () => {
  it("aggregates authoritative fields and safely handles null locations", () => assert.deepEqual(aggregateSocialImpact(ventures), { totalBeneficiaries: 150, jobsCreated: 15, locationsRepresented: 1, womenEmpowered: 80, disabilityInclusive: 4, youthEngaged: 30 }))
  it("returns zero totals for empty data", () => assert.deepEqual(aggregateSocialImpact([]), { totalBeneficiaries: 0, jobsCreated: 0, locationsRepresented: 0, womenEmpowered: 0, disabilityInclusive: 0, youthEngaged: 0 }))
})

describe("social impact filters", () => {
  it("searches across name, sector, and inclusion focus", () => assert.deepEqual(filterVentures(ventures, { search: "women", category: "all", status: "all" }).map((item) => item.id), ["1"]))
  it("combines category and status filters", () => assert.deepEqual(filterVentures(ventures, { search: "", category: "Agriculture", status: "INACTIVE" }).map((item) => item.id), ["2"]))
  it("returns an empty result when filters do not match", () => assert.deepEqual(filterVentures(ventures, { search: "missing", category: "all", status: "all" }), []))
})

describe("social impact request", () => {
  it("throws on an API error so callers can show retry UI", async () => assert.rejects(() => requestSocialImpactData(undefined, async () => new Response("failed", { status: 503 })), /503/))
  it("can be called again successfully after a failed request", async () => { let calls = 0; const request = async () => { calls += 1; return calls === 1 ? new Response("failed", { status: 500 }) : Response.json({ ventures }) }; await assert.rejects(() => requestSocialImpactData(undefined, request)); assert.equal((await requestSocialImpactData(undefined, request)).length, 2) })
  it("rejects a malformed ventures shape", async () => assert.rejects(() => requestSocialImpactData(undefined, async () => Response.json({ ventures: {} })), /invalid response/))
})
