/**
 * Centralized Calculation Service for GEDSI Metrics and Social Impact
 * This service ensures consistent calculations across the entire platform
 * and automatically updates calculated values when input data changes
 */

import { prisma } from '@/lib/prisma'
import { calculateGEDSIScore, calculateGEDSIComplianceRate } from '@/lib/gedsi-utils'

export interface VentureCalculationResult {
  gedsiScore: number
  socialImpactScore: number
  gedsiComplianceRate: number
  totalBeneficiaries: number
  jobsCreated: number
  womenEmpowered: number
  disabilityInclusive: number
  youthEngaged: number
  calculatedAt: Date
}

export interface SectorImpactMultipliers {
  beneficiariesPerFunding: number
  beneficiariesPerEmployee: number
  jobsMultiplier: number
  womenEmpowermentRate: number
  disabilityInclusionRate: number
  youthEngagementRate: number
}

// Sector-specific multipliers for social impact calculations
const SECTOR_MULTIPLIERS: Record<string, SectorImpactMultipliers> = {
  'HealthTech': {
    beneficiariesPerFunding: 0.02, // 1 beneficiary per $50 funding
    beneficiariesPerEmployee: 200,
    jobsMultiplier: 3.5,
    womenEmpowermentRate: 0.6,
    disabilityInclusionRate: 0.15,
    youthEngagementRate: 0.4
  },
  'FinTech': {
    beneficiariesPerFunding: 0.04, // 1 beneficiary per $25 funding
    beneficiariesPerEmployee: 300,
    jobsMultiplier: 4,
    womenEmpowermentRate: 0.7,
    disabilityInclusionRate: 0.1,
    youthEngagementRate: 0.5
  },
  'EdTech': {
    beneficiariesPerFunding: 0.01, // 1 beneficiary per $100 funding
    beneficiariesPerEmployee: 150,
    jobsMultiplier: 2.5,
    womenEmpowermentRate: 0.55,
    disabilityInclusionRate: 0.2,
    youthEngagementRate: 0.8
  },
  'Agriculture': {
    beneficiariesPerFunding: 0.005, // 1 beneficiary per $200 funding
    beneficiariesPerEmployee: 100,
    jobsMultiplier: 5,
    womenEmpowermentRate: 0.5,
    disabilityInclusionRate: 0.08,
    youthEngagementRate: 0.3
  },
  'CleanTech': {
    beneficiariesPerFunding: 0.008, // 1 beneficiary per $125 funding
    beneficiariesPerEmployee: 80,
    jobsMultiplier: 3,
    womenEmpowermentRate: 0.4,
    disabilityInclusionRate: 0.1,
    youthEngagementRate: 0.35
  },
  'Default': {
    beneficiariesPerFunding: 0.0067, // 1 beneficiary per $150 funding
    beneficiariesPerEmployee: 50,
    jobsMultiplier: 3,
    womenEmpowermentRate: 0.5,
    disabilityInclusionRate: 0.12,
    youthEngagementRate: 0.4
  }
}

export class CalculationService {
  /**
   * Calculate all metrics for a single venture
   */
  static async calculateVentureMetrics(ventureId: string): Promise<VentureCalculationResult> {
    const venture = await prisma.venture.findUnique({
      where: { id: ventureId },
      include: {
        gedsiMetrics: true
      }
    })

    if (!venture) {
      throw new Error(`Venture with ID ${ventureId} not found`)
    }

    return this.performCalculations(venture)
  }

  /**
   * Calculate metrics for all ventures (used for bulk updates)
   */
  static async calculateAllVentureMetrics(): Promise<Map<string, VentureCalculationResult>> {
    const ventures = await prisma.venture.findMany({
      include: {
        gedsiMetrics: true
      }
    })

    const results = new Map<string, VentureCalculationResult>()
    
    for (const venture of ventures) {
      try {
        const calculation = this.performCalculations(venture)
        results.set(venture.id, calculation)
      } catch (error) {
        console.error(`Error calculating metrics for venture ${venture.id}:`, error)
        // Continue with other ventures even if one fails
      }
    }

    return results
  }

  /**
   * Update calculated values in database for a single venture
   */
  static async updateVentureCalculations(ventureId: string): Promise<void> {
    try {
      const calculations = await this.calculateVentureMetrics(ventureId)
      
      await prisma.venture.update({
        where: { id: ventureId },
        data: {
          gedsiScore: calculations.gedsiScore,
          socialImpactScore: calculations.socialImpactScore,
          gedsiComplianceRate: calculations.gedsiComplianceRate,
          totalBeneficiaries: calculations.totalBeneficiaries,
          jobsCreated: calculations.jobsCreated,
          womenEmpowered: calculations.womenEmpowered,
          disabilityInclusive: calculations.disabilityInclusive,
          youthEngaged: calculations.youthEngaged,
          calculatedAt: calculations.calculatedAt
        }
      })

      console.log(`Updated calculations for venture ${ventureId}`)
    } catch (error) {
      console.error(`Failed to update calculations for venture ${ventureId}:`, error)
      throw error
    }
  }

  /**
   * Update calculated values for all ventures
   */
  static async updateAllVentureCalculations(): Promise<void> {
    const calculations = await this.calculateAllVentureMetrics()
    
    const updatePromises = Array.from(calculations.entries()).map(([ventureId, calc]) =>
      prisma.venture.update({
        where: { id: ventureId },
        data: {
          gedsiScore: calc.gedsiScore,
          socialImpactScore: calc.socialImpactScore,
          gedsiComplianceRate: calc.gedsiComplianceRate,
          totalBeneficiaries: calc.totalBeneficiaries,
          jobsCreated: calc.jobsCreated,
          womenEmpowered: calc.womenEmpowered,
          disabilityInclusive: calc.disabilityInclusive,
          youthEngaged: calc.youthEngaged,
          calculatedAt: calc.calculatedAt
        }
      }).catch(error => {
        console.error(`Failed to update calculations for venture ${ventureId}:`, error)
        return null
      })
    )

    const results = await Promise.all(updatePromises)
    const successful = results.filter(r => r !== null).length
    const failed = results.length - successful

    console.log(`Updated calculations: ${successful} successful, ${failed} failed`)
  }

  /**
   * Core calculation logic
   */
  private static performCalculations(venture: any): VentureCalculationResult {
    const now = new Date()
    
    // 1. Calculate GEDSI Score using existing utility
    const gedsiScore = calculateGEDSIScore(venture)
    
    // 2. Calculate GEDSI Compliance Rate
    const gedsiComplianceRate = calculateGEDSIComplianceRate(venture.gedsiMetrics || [])
    
    // 3. Calculate Social Impact Metrics
    const socialImpactMetrics = this.calculateSocialImpactMetrics(venture)
    
    // 4. Calculate overall Social Impact Score
    const socialImpactScore = this.calculateSocialImpactScore(venture, socialImpactMetrics)

    return {
      gedsiScore,
      socialImpactScore,
      gedsiComplianceRate,
      totalBeneficiaries: socialImpactMetrics.totalBeneficiaries,
      jobsCreated: socialImpactMetrics.jobsCreated,
      womenEmpowered: socialImpactMetrics.womenEmpowered,
      disabilityInclusive: socialImpactMetrics.disabilityInclusive,
      youthEngaged: socialImpactMetrics.youthEngaged,
      calculatedAt: now
    }
  }

  /**
   * Calculate social impact metrics based on venture characteristics
   */
  private static calculateSocialImpactMetrics(venture: any) {
    const funding = venture.fundingRaised || 100000 // Default to $100k
    const teamSize = venture.teamSize || 5 // Default to 5 people
    const sector = venture.sector || 'Default'
    
    // Get sector-specific multipliers
    const multipliers = SECTOR_MULTIPLIERS[sector] || SECTOR_MULTIPLIERS['Default']
    
    // Calculate base beneficiaries
    const beneficiariesFromFunding = Math.floor(funding * multipliers.beneficiariesPerFunding)
    const beneficiariesFromTeam = teamSize * multipliers.beneficiariesPerEmployee
    const totalBeneficiaries = beneficiariesFromFunding + beneficiariesFromTeam
    
    // Calculate jobs created (includes direct employment + indirect job creation)
    const jobsCreated = Math.floor(teamSize * multipliers.jobsMultiplier + funding / 50000)
    
    // Calculate demographic-specific impact
    const womenEmpowered = Math.floor(totalBeneficiaries * multipliers.womenEmpowermentRate)
    const disabilityInclusive = Math.floor(totalBeneficiaries * multipliers.disabilityInclusionRate)
    const youthEngaged = Math.floor(totalBeneficiaries * multipliers.youthEngagementRate)

    // Apply founder type bonuses
    try {
      const founderTypes = Array.isArray(venture.founderTypes) 
        ? venture.founderTypes 
        : JSON.parse(venture.founderTypes || '[]')
      
      let bonusMultiplier = 1.0
      if (founderTypes.includes('women-led')) bonusMultiplier += 0.3
      if (founderTypes.includes('disability-inclusive')) bonusMultiplier += 0.2
      if (founderTypes.includes('youth-led')) bonusMultiplier += 0.15
      if (founderTypes.includes('rural-focus')) bonusMultiplier += 0.1
      
      return {
        totalBeneficiaries: Math.floor(totalBeneficiaries * bonusMultiplier),
        jobsCreated: Math.floor(jobsCreated * bonusMultiplier),
        womenEmpowered: Math.floor(womenEmpowered * bonusMultiplier),
        disabilityInclusive: Math.floor(disabilityInclusive * bonusMultiplier),
        youthEngaged: Math.floor(youthEngaged * bonusMultiplier)
      }
    } catch (error) {
      console.error('Error parsing founder types:', error)
      return {
        totalBeneficiaries,
        jobsCreated,
        womenEmpowered,
        disabilityInclusive,
        youthEngaged
      }
    }
  }

  /**
   * Calculate overall social impact score (0-100)
   */
  private static calculateSocialImpactScore(venture: any, socialMetrics: any): number {
    let score = 50 // Base score
    
    const funding = venture.fundingRaised || 100000
    const teamSize = venture.teamSize || 5
    
    // Score based on beneficiaries per dollar (efficiency)
    const beneficiariesPerDollar = socialMetrics.totalBeneficiaries / funding
    if (beneficiariesPerDollar > 0.02) score += 15 // Very efficient
    else if (beneficiariesPerDollar > 0.01) score += 10 // Efficient
    else if (beneficiariesPerDollar > 0.005) score += 5 // Moderate
    
    // Score based on job creation efficiency
    const jobsPerEmployee = socialMetrics.jobsCreated / teamSize
    if (jobsPerEmployee > 4) score += 10
    else if (jobsPerEmployee > 3) score += 5
    
    // Bonus for demographic inclusion
    if (socialMetrics.womenEmpowered > socialMetrics.totalBeneficiaries * 0.5) score += 10
    if (socialMetrics.disabilityInclusive > socialMetrics.totalBeneficiaries * 0.1) score += 5
    if (socialMetrics.youthEngaged > socialMetrics.totalBeneficiaries * 0.3) score += 5
    
    // Sector-specific bonuses
    const impactSectors = ['HealthTech', 'EdTech', 'Agriculture', 'CleanTech']
    if (impactSectors.includes(venture.sector)) score += 5
    
    // GEDSI alignment bonus
    const gedsiScore = calculateGEDSIScore(venture)
    if (gedsiScore > 70) score += 10
    else if (gedsiScore > 50) score += 5
    
    return Math.min(Math.round(score), 100) // Cap at 100
  }

  /**
   * Get aggregated portfolio metrics
   */
  static async getPortfolioMetrics(): Promise<{
    totalVentures: number
    totalBeneficiaries: number
    totalJobsCreated: number
    totalWomenEmpowered: number
    totalDisabilityInclusive: number
    totalYouthEngaged: number
    averageGEDSIScore: number
    averageSocialImpactScore: number
    averageComplianceRate: number
  }> {
    const ventures = await prisma.venture.findMany({
      select: {
        gedsiScore: true,
        socialImpactScore: true,
        gedsiComplianceRate: true,
        totalBeneficiaries: true,
        jobsCreated: true,
        womenEmpowered: true,
        disabilityInclusive: true,
        youthEngaged: true
      }
    })

    const totalVentures = ventures.length
    
    if (totalVentures === 0) {
      return {
        totalVentures: 0,
        totalBeneficiaries: 0,
        totalJobsCreated: 0,
        totalWomenEmpowered: 0,
        totalDisabilityInclusive: 0,
        totalYouthEngaged: 0,
        averageGEDSIScore: 0,
        averageSocialImpactScore: 0,
        averageComplianceRate: 0
      }
    }

    const totals = ventures.reduce((acc, venture) => ({
      totalBeneficiaries: acc.totalBeneficiaries + (venture.totalBeneficiaries || 0),
      totalJobsCreated: acc.totalJobsCreated + (venture.jobsCreated || 0),
      totalWomenEmpowered: acc.totalWomenEmpowered + (venture.womenEmpowered || 0),
      totalDisabilityInclusive: acc.totalDisabilityInclusive + (venture.disabilityInclusive || 0),
      totalYouthEngaged: acc.totalYouthEngaged + (venture.youthEngaged || 0),
      gedsiScoreSum: acc.gedsiScoreSum + (venture.gedsiScore || 0),
      socialImpactScoreSum: acc.socialImpactScoreSum + (venture.socialImpactScore || 0),
      complianceRateSum: acc.complianceRateSum + (venture.gedsiComplianceRate || 0)
    }), {
      totalBeneficiaries: 0,
      totalJobsCreated: 0,
      totalWomenEmpowered: 0,
      totalDisabilityInclusive: 0,
      totalYouthEngaged: 0,
      gedsiScoreSum: 0,
      socialImpactScoreSum: 0,
      complianceRateSum: 0
    })

    return {
      totalVentures,
      totalBeneficiaries: totals.totalBeneficiaries,
      totalJobsCreated: totals.totalJobsCreated,
      totalWomenEmpowered: totals.totalWomenEmpowered,
      totalDisabilityInclusive: totals.totalDisabilityInclusive,
      totalYouthEngaged: totals.totalYouthEngaged,
      averageGEDSIScore: Math.round(totals.gedsiScoreSum / totalVentures),
      averageSocialImpactScore: Math.round(totals.socialImpactScoreSum / totalVentures),
      averageComplianceRate: Math.round(totals.complianceRateSum / totalVentures)
    }
  }
}

/**
 * Trigger recalculation when venture data changes
 */
export async function triggerVentureRecalculation(ventureId: string): Promise<void> {
  try {
    await CalculationService.updateVentureCalculations(ventureId)
  } catch (error) {
    console.error('Failed to trigger venture recalculation:', error)
    // Don't throw - this is a background process
  }
}

/**
 * Scheduled function to recalculate all venture metrics
 * Should be called periodically (e.g., daily) to ensure data freshness
 */
export async function scheduledRecalculationJob(): Promise<void> {
  console.log('Starting scheduled recalculation job...')
  try {
    await CalculationService.updateAllVentureCalculations()
    console.log('Scheduled recalculation job completed successfully')
  } catch (error) {
    console.error('Scheduled recalculation job failed:', error)
  }
}
