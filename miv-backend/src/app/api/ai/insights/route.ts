import { NextResponse } from "next/server"

export async function GET() {
  try {
    const insights = {
      generatedAt: new Date().toLocaleString(),

      portfolioScore: 82,
      highRiskVentures: 3,
      fundingReady: 5,
      sustainabilityScore: 76,

      recommendations: [
        "Increase support for ventures with high traction but low runway.",
        "Review 3 ventures showing elevated operational risk.",
        "Prioritise 5 ventures ready for investor outreach.",
        "Improve ESG reporting consistency across the portfolio.",
      ],

      topOpportunities: [
        "FinTech expansion in regional markets",
        "HealthTech partnerships",
        "AI automation cost savings",
      ],

      priorityVentures: [
        {
          name: "GreenGrid Energy",
          priorityScore: 91,
          reason: "High growth potential but funding delay risk.",
          recommendation: "Prioritise investor outreach and runway planning.",
        },
        {
          name: "MediLink AI",
          priorityScore: 86,
          reason: "Strong impact value but needs compliance validation.",
          recommendation: "Focus on clinical validation and regulatory checks.",
        },
        {
          name: "AgriTrack",
          priorityScore: 78,
          reason: "Promising market fit but adoption evidence is still weak.",
          recommendation: "Run additional pilot tests with target users.",
        },
      ],

      backendSummary: {
        dataSource: "Mock AI insights API",
        purpose:
          "This API supports the AI Insights Dashboard by providing portfolio-level metrics, recommendations, and priority venture ranking.",
        nextStep:
          "Replace mock values with live venture data from the database and generate dynamic recommendations.",
      },
    }

    return NextResponse.json(insights)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate insights" },
      { status: 500 }
    )
  }
}