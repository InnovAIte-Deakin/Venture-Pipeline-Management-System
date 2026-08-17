export const calculateImpactScore = (venture: any) => {
  try {
    let score = 40 // Base score

    // Financial impact indicators (from real database fields)
    const revenue = parseFloat(venture.revenue) || 0
    const fundingRaised = parseFloat(venture.fundingRaised) || 0
    const teamSize = parseInt(venture.teamSize) || 0

    // Debug logging
    console.log(`💰 Impact calculation for ${venture.name}:`, {
      revenue: venture.revenue,
      fundingRaised: venture.fundingRaised,
      teamSize: venture.teamSize,
      parsedRevenue: revenue,
      parsedFunding: fundingRaised,
      parsedTeamSize: teamSize,
      baseScore: score
    })

    // Ensure all calculations are safe
    if (revenue > 0 && !isNaN(revenue)) {
      const revenuePoints = Math.min(revenue / 100000, 20)
      if (!isNaN(revenuePoints)) {
        score += revenuePoints
        console.log(`  Revenue points: ${revenuePoints} (${revenue} / 100000)`)
      }
    }

    if (fundingRaised > 0 && !isNaN(fundingRaised)) {
      const fundingPoints = Math.min(fundingRaised / 1000000, 15)
      if (!isNaN(fundingPoints)) {
        score += fundingPoints
        console.log(`  Funding points: ${fundingPoints} (${fundingRaised} / 1000000)`)
      }
    }

    if (teamSize > 1 && !isNaN(teamSize)) {
      const teamPoints = Math.min(teamSize, 10)
      if (!isNaN(teamPoints)) {
        score += teamPoints
        console.log(`  Team points: ${teamPoints}`)
      }
    }

    // GEDSI goals impact (from database JSON field)
    try {
      const goals = venture.gedsiGoals ? (Array.isArray(venture.gedsiGoals) ? venture.gedsiGoals : JSON.parse(venture.gedsiGoals)) : []
      const gedsiPoints = Math.min(goals.length * 3, 15)
      if (!isNaN(gedsiPoints)) {
        score += gedsiPoints
        console.log(`  GEDSI goals points: ${gedsiPoints}`)
      }
    } catch (e) {
      console.warn('Error parsing GEDSI goals:', e)
    }

    // Founder diversity impact (from database field)
    try {
      const founderTypes = Array.isArray(venture.founderTypes) ? venture.founderTypes : JSON.parse(venture.founderTypes || '[]')
      let founderPoints = 0
      if (founderTypes.includes('women-led')) founderPoints += 8
      if (founderTypes.includes('disability-inclusive')) founderPoints += 8
      if (founderTypes.includes('rural-focus')) founderPoints += 5
      if (founderTypes.includes('indigenous-led')) founderPoints += 6
      if (founderTypes.includes('youth-led')) founderPoints += 4

      if (!isNaN(founderPoints) && founderPoints > 0) {
        score += founderPoints
        console.log(`  Founder diversity points: ${founderPoints}`)
      }
    } catch (e) {
      console.warn('Error parsing founder types:', e)
    }

    // GEDSI metrics completion (from actual metrics)
    if (venture.gedsiMetrics?.length > 0) {
      const verifiedMetrics = venture.gedsiMetrics.filter((m: any) => m.status === 'VERIFIED' || m.status === 'COMPLETED')
      const metricsPoints = Math.min(verifiedMetrics.length * 2, 10)
      if (!isNaN(metricsPoints)) {
        score += metricsPoints
        console.log(`  GEDSI metrics points: ${metricsPoints}`)
      }
    }

    // Stage-based impact multiplier
    const stageMultipliers: { [key: string]: number } = {
      'FUNDED': 1.2,
      'SERIES_A': 1.3,
      'SERIES_B': 1.4,
      'SERIES_C': 1.5,
      'EXITED': 1.6
    }

    const multiplier = stageMultipliers[venture.stage] || 1.0
    if (!isNaN(multiplier) && !isNaN(score)) {
      score = score * multiplier
    }

    const finalScore = Math.min(Math.round(score), 100)
    console.log(`  Final impact score for ${venture.name}: ${finalScore} (before multiplier: ${score / multiplier}, multiplier: ${multiplier})`)

    // Safety check for NaN
    if (isNaN(finalScore)) {
      console.error(`❌ NaN detected in impact score for ${venture.name}, returning 40`)
      return 40
    }

    return finalScore
  } catch (error) {
    console.error(`❌ Error calculating impact score for ${venture.name}:`, error)
    return 40 // Safe fallback
  }
}

export const calculateReadinessScore = (venture: any) => {
  let score = 30 // Base score

  // Operational readiness (from database JSON field)
  try {
    const operationalReadiness = venture.operationalReadiness || {}
    const operationalChecks = Object.values(operationalReadiness).filter(Boolean).length
    const totalOperationalChecks = Object.keys(operationalReadiness).length || 10 // Assume 10 if empty
    if (totalOperationalChecks > 0) {
      score += (operationalChecks / totalOperationalChecks) * 35 // Up to 35 points
    }
  } catch (e) {
    console.warn('Error parsing operational readiness:', e)
  }

  // Capital readiness (from database JSON field)
  try {
    const capitalReadiness = venture.capitalReadiness || {}
    const capitalChecks = Object.values(capitalReadiness).filter(Boolean).length
    const totalCapitalChecks = Object.keys(capitalReadiness).length || 10 // Assume 10 if empty
    if (totalCapitalChecks > 0) {
      score += (capitalChecks / totalCapitalChecks) * 35 // Up to 35 points
    }
  } catch (e) {
    console.warn('Error parsing capital readiness:', e)
  }

  // Additional readiness indicators from real data
  const revenue = parseFloat(venture.revenue) || 0
  const teamSize = parseInt(venture.teamSize) || 0

  if (revenue > 0) score += 5 // Has revenue
  if (teamSize >= 3) score += 5 // Adequate team size
  if (venture.website) score += 3 // Has online presence
  if (venture.pitchSummary && venture.pitchSummary.length > 100) score += 2 // Good pitch summary

  // Document completeness
  const docCount = venture._count?.documents || 0
  if (docCount >= 5) score += 5 // Well documented
  else if (docCount >= 3) score += 3
  else if (docCount >= 1) score += 1

  return Math.min(Math.round(score), 100)
}

export const generateAIInsights = (venture: any, gedsiScore: number, impactScore: number) => {
  const alerts: string[] = []
  let priority: "urgent" | "high" | "medium" | "low" = "medium"
  let nextAction = "Continue monitoring performance"
  let daysUntilAction = 30

  // Try to use real AI analysis data first
  try {
    const aiAnalysis = venture.aiAnalysis ? (typeof venture.aiAnalysis === 'string' ? JSON.parse(venture.aiAnalysis) : venture.aiAnalysis) : null

    if (aiAnalysis) {
      // Use AI-generated insights if available
      if (aiAnalysis.riskAssessment) {
        if (aiAnalysis.riskAssessment.includes('high risk') || aiAnalysis.riskAssessment.includes('urgent')) {
          priority = "urgent"
          daysUntilAction = 3
        } else if (aiAnalysis.riskAssessment.includes('medium risk')) {
          priority = "high"
          daysUntilAction = 7
        }
      }

      if (aiAnalysis.recommendations && Array.isArray(aiAnalysis.recommendations)) {
        nextAction = aiAnalysis.recommendations[0] || nextAction
      }

      if (aiAnalysis.alerts && Array.isArray(aiAnalysis.alerts)) {
        alerts.push(...aiAnalysis.alerts)
      }
    }
  } catch (e) {
    console.warn('Error parsing AI analysis:', e)
  }

  // Fallback to calculated insights if no AI data
  if (alerts.length === 0) {
    // Determine priority based on scores
    if (gedsiScore < 60) {
      priority = "urgent"
      nextAction = "Improve GEDSI metrics and inclusion practices"
      daysUntilAction = 7
      alerts.push("GEDSI score below acceptable threshold")
    } else if (gedsiScore < 75) {
      priority = "high"
      nextAction = "Review and enhance GEDSI integration"
      daysUntilAction = 14
      alerts.push("GEDSI score needs improvement")
    } else if (impactScore > 85) {
      priority = "high"
      nextAction = "Consider additional investment or expansion support"
      daysUntilAction = 14
      alerts.push("High impact performance - scaling opportunity")
    }

    // Add venture-specific insights based on real data
    if (venture.gedsiMetrics?.length === 0) {
      alerts.push("No GEDSI metrics recorded")
      if (priority === "medium") priority = "high"
    }

    if (venture._count?.capitalActivities === 0) {
      alerts.push("No capital activities recorded")
    }

    if (venture._count?.documents < 3) {
      alerts.push("Insufficient documentation")
    }

    // Financial health alerts
    const revenue = parseFloat(venture.revenue) || 0
    if (revenue === 0) {
      alerts.push("No revenue recorded")
    }

    const teamSize = parseInt(venture.teamSize) || 0
    if (teamSize > 0 && teamSize < 3) {
      alerts.push("Small team size may limit scalability")
    }

    // Readiness alerts
    const hasOperationalReadiness = venture.operationalReadiness && Object.keys(venture.operationalReadiness).length > 0
    const hasCapitalReadiness = venture.capitalReadiness && Object.keys(venture.capitalReadiness).length > 0

    if (!hasOperationalReadiness && !hasCapitalReadiness) {
      alerts.push("Readiness assessment incomplete")
      if (priority === "medium") priority = "high"
    }
  }

  // Determine risk level based on multiple factors
  let riskLevel: "low" | "medium" | "high" = "medium"
  if (gedsiScore > 80 && impactScore > 70 && venture._count?.documents >= 3) {
    riskLevel = "low"
  } else if (gedsiScore < 60 || impactScore < 40 || venture._count?.documents < 2) {
    riskLevel = "high"
  }

  return {
    riskLevel,
    priority,
    nextAction,
    daysUntilAction,
    alerts: alerts.slice(0, 3) // Limit to 3 most important alerts
  }
}
