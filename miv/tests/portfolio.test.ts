import assert from "node:assert/strict"
import test from "node:test"
import { calculateGedsiScore, calculateImpactScore, stringList } from "../app/dashboard/(g1-portfolio-funding)/portfolio/lib/portfolioCalculations"
import { filterCompanies, isPortfolioVenture, mapVentureToPortfolioCompany, summarisePortfolio } from "../app/dashboard/(g1-portfolio-funding)/portfolio/lib/portfolioData"
import { portfolioCsv } from "../app/dashboard/(g1-portfolio-funding)/portfolio/lib/portfolioExport"
import type { VentureRecord } from "../app/dashboard/(g1-portfolio-funding)/portfolio/types"

const venture: VentureRecord = { id: "v1", name: "Inclusive, Inc.", stage: "FUNDED", founderTypes: '["women-led"]', gedsiGoals: '["goal-1"]', revenue: 100000, fundingRaised: 1000000, teamSize: 5, gedsiMetrics: [{ status: "VERIFIED", currentValue: 8, targetValue: 10 }], _count: { documents: 3, activities: 2, capitalActivities: 1 } }

test("parses string arrays without throwing on invalid API data", () => { assert.deepEqual(stringList('["women-led"]'), ["women-led"]); assert.deepEqual(stringList("invalid"), []) })
test("calculates bounded scores from venture data", () => { assert.equal(calculateGedsiScore(venture), 80); assert.equal(calculateImpactScore(venture), 72) })
test("filters portfolio stages and maps safe defaults", () => { assert.equal(isPortfolioVenture(venture, "portfolio"), true); assert.equal(isPortfolioVenture({ ...venture, stage: "INTAKE" }, "portfolio"), false); assert.equal(mapVentureToPortfolioCompany(venture).location, "Southeast Asia") })
test("filters companies and derives the dashboard summary", () => { const company = mapVentureToPortfolioCompany(venture); assert.equal(filterCompanies([company], "inclusive", "women-led").length, 1); assert.deepEqual(summarisePortfolio([company]), { totalCompanies: 1, avgGedsiScore: 80, totalGedsiMetrics: 1, totalActivities: 2 }) })
test("escapes commas and quotes in CSV exports", () => { const csv = portfolioCsv([mapVentureToPortfolioCompany(venture)]); assert.match(csv, /"Inclusive, Inc\."/); assert.match(csv, /"GEDSI Score"/) })
