import { PORTFOLIO_STAGES } from "../constants"
import type { PortfolioCompany, PortfolioSummary, VentureRecord } from "../types"
import { calculateGedsiScore, calculateImpactScore, calculateReadinessScore, generateAIInsights, stringList } from "./portfolioCalculations"

export const isPortfolioVenture = (venture: VentureRecord, filter: string) => filter === "all" || PORTFOLIO_STAGES.includes(venture.stage ?? "")
export const mapVentureToPortfolioCompany = (venture: VentureRecord): PortfolioCompany => {
  const gedsiScore = calculateGedsiScore(venture); const impactScore = calculateImpactScore(venture)
  return { id: venture.id, name: venture.name, sector: venture.sector || "Technology", stage: venture.stage || "Seed", location: venture.location || "Southeast Asia", status: venture.status || "ACTIVE", founderTypes: JSON.stringify(stringList(venture.founderTypes)), gedsiGoals: JSON.stringify(stringList(venture.gedsiGoals)), inclusionFocus: venture.inclusionFocus || "Impact-focused venture", createdAt: venture.createdAt || "", updatedAt: venture.updatedAt || "", gedsiMetrics: venture.gedsiMetrics ?? [], capitalActivities: venture.capitalActivities ?? [], _count: { documents: venture._count?.documents ?? 0, activities: venture._count?.activities ?? 0, capitalActivities: venture._count?.capitalActivities ?? 0 }, gedsiScore, impactScore, readinessScore: calculateReadinessScore(venture), aiInsights: generateAIInsights(venture, gedsiScore, impactScore) }
}
export const filterCompanies = (companies: PortfolioCompany[], searchTerm: string, founderType: string) => {
  const term = searchTerm.trim().toLowerCase()
  return companies.filter((company) => (!term || [company.name, company.inclusionFocus, company.location].some((value) => value.toLowerCase().includes(term))) && (founderType === "all" || stringList(company.founderTypes).includes(founderType)))
}
export const summarisePortfolio = (companies: PortfolioCompany[]): PortfolioSummary => ({ totalCompanies: companies.length, avgGedsiScore: companies.length ? companies.reduce((sum, company) => sum + company.gedsiScore, 0) / companies.length : 0, totalGedsiMetrics: companies.reduce((sum, company) => sum + company.gedsiMetrics.length, 0), totalActivities: companies.reduce((sum, company) => sum + company._count.activities, 0) })
