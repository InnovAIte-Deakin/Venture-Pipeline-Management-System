// Shared GEDSI calculation utilities

export function calculateGEDSIScore(venture: any): number {
  // First try to get GEDSI score from AI analysis
  try {
    const aiData = typeof venture.aiAnalysis === 'string' 
      ? JSON.parse(venture.aiAnalysis) 
      : venture.aiAnalysis;
    
    if (aiData && aiData.gedsiScore && !isNaN(aiData.gedsiScore)) {
      return aiData.gedsiScore;
    }
  } catch (error) {
    console.error('Error parsing AI analysis for GEDSI score:', error);
  }

  // Fallback to calculating from gedsiMetricsSummary
  try {
    const gedsiSummary = typeof venture.gedsiMetricsSummary === 'string' 
      ? JSON.parse(venture.gedsiMetricsSummary) 
      : venture.gedsiMetricsSummary;

    if (gedsiSummary) {
      const scores = [
        gedsiSummary.womenLeadership,
        gedsiSummary.disabilityInclusion,
        gedsiSummary.accessibilityScore,
        gedsiSummary.diversityScore
      ].filter(score => score != null && score >= 0 && !isNaN(score));
      
      if (scores.length > 0) {
        return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
      }
    }
  } catch (error) {
    console.error('Error parsing GEDSI metrics summary:', error);
  }

  // Fallback to calculating from individual GEDSI metrics
  if (venture.gedsiMetrics && Array.isArray(venture.gedsiMetrics)) {
    const validMetrics = venture.gedsiMetrics.filter((metric: any) => 
      metric.currentValue !== null && 
      metric.targetValue !== null && 
      metric.targetValue > 0 &&
      !isNaN(metric.currentValue) &&
      !isNaN(metric.targetValue)
    );

    if (validMetrics.length > 0) {
      const totalScore = validMetrics.reduce((sum: number, metric: any) => {
        const score = Math.min((metric.currentValue / metric.targetValue) * 100, 100);
        return sum + score;
      }, 0);
      
      return Math.round(totalScore / validMetrics.length);
    }
  }

  // Final fallback - return 0
  return 0;
}

export function calculateImpactScore(venture: any): number {
  try {
    const aiData = typeof venture.aiAnalysis === 'string' 
      ? JSON.parse(venture.aiAnalysis) 
      : venture.aiAnalysis;
    
    if (aiData && aiData.impactScore && !isNaN(aiData.impactScore)) {
      return aiData.impactScore;
    }
  } catch (error) {
    console.error('Error parsing AI analysis for impact score:', error);
  }

  // Fallback calculation
  let score = 70;
  
  try {
    const goals = JSON.parse(venture.gedsiGoals || '[]');
    score += goals.length * 3;
  } catch (e) {
    score += 10;
  }
  
  if (venture.gedsiMetrics?.length > 0) score += venture.gedsiMetrics.length * 2;
  if (venture.inclusionFocus) score += 5;
  
  return Math.min(score, 100);
}

export function calculateReadinessScore(venture: any): number {
  try {
    const aiData = typeof venture.aiAnalysis === 'string' 
      ? JSON.parse(venture.aiAnalysis) 
      : venture.aiAnalysis;
    
    if (aiData && aiData.readinessScore && !isNaN(aiData.readinessScore)) {
      return aiData.readinessScore;
    }
  } catch (error) {
    console.error('Error parsing AI analysis for readiness score:', error);
  }

  // Fallback calculation
  let score = 60;
  
  if (venture.operationalReadiness) {
    const readyItems = Object.values(venture.operationalReadiness).filter(Boolean).length;
    score += readyItems * 5;
  }
  
  if (venture.capitalReadiness) {
    const readyItems = Object.values(venture.capitalReadiness).filter(Boolean).length;
    score += readyItems * 3;
  }
  
  return Math.min(score, 100);
}

export function getGEDSIScoreInterpretation(score: number): { color: string; label: string } {
  if (score >= 80) {
    return { color: 'green', label: 'Excellent' };
  } else if (score >= 70) {
    return { color: 'blue', label: 'Good' };
  } else if (score >= 60) {
    return { color: 'yellow', label: 'Fair' };
  } else if (score >= 40) {
    return { color: 'yellow', label: 'Needs Improvement' };
  } else {
    return { color: 'red', label: 'Poor' };
  }
}

export function calculateGEDSIComplianceRate(gedsiMetrics: any[]): number {
  if (!gedsiMetrics || gedsiMetrics.length === 0) {
    return 0;
  }

  const compliantMetrics = gedsiMetrics.filter(metric => {
    if (metric.currentValue === null || metric.targetValue === null || metric.targetValue === 0) {
      return false;
    }
    
    // Consider a metric compliant if current value is at least 80% of target
    const complianceRate = (metric.currentValue / metric.targetValue) * 100;
    return complianceRate >= 80;
  });

  return Math.round((compliantMetrics.length / gedsiMetrics.length) * 100);
}