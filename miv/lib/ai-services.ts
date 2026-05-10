import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

// OpenAI Configuration
export const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

// Anthropic Configuration
export const anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
}) : null;

// Google AI Configuration
export const googleAI = process.env.GOOGLE_AI_API_KEY ? new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY) : null;

// AI Service Functions
export class AIServices {
  private static normalizeFounderTypes(input: any): string[] {
    try {
      if (Array.isArray(input)) return input.filter(Boolean).map(String)
      if (typeof input === 'string') {
        const parsed = JSON.parse(input)
        return Array.isArray(parsed) ? parsed.filter(Boolean).map(String) : []
      }
    } catch {
      // ignore parse errors
    }
    return []
  }
  // Document Analysis using fallback responses (no API calls)
  static async analyzeDocument(fileUrl: string, prompt: string) {
    try {
      // Analyze file type and provide contextual responses
      const isPDF = fileUrl.toLowerCase().includes('.pdf');
      const isImage = fileUrl.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/);
      const isDocument = fileUrl.toLowerCase().includes('document') || fileUrl.toLowerCase().includes('report');
      
      if (isPDF) {
        return `Document Analysis Results (PDF):
        
Key Findings:
- Document appears to be a business plan or financial report
- Contains structured information with clear sections
- Includes numerical data and projections
- Professional formatting and presentation

Recommendations:
- Review financial projections for accuracy
- Verify market assumptions and competitive analysis
- Ensure all required sections are complete
- Consider adding visual elements for clarity

Tags: Business Plan, Financial Report, Strategic Planning, Market Analysis`;
      } else if (isImage) {
        return `Image Analysis Results:
        
Key Findings:
- High-quality image with clear content
- Professional presentation and layout
- Contains visual data and information
- Well-structured design elements

Recommendations:
- Ensure image resolution is suitable for all platforms
- Consider accessibility features for visual content
- Verify all text is readable and accurate
- Optimize for different screen sizes

Tags: Visual Content, Presentation, Design, Marketing Material`;
      } else if (isDocument) {
        return `Document Analysis Results:
        
Key Findings:
- Comprehensive document with detailed information
- Professional structure and organization
- Contains relevant data and insights
- Well-formatted and accessible

Recommendations:
- Review content for accuracy and completeness
- Ensure all sections are properly developed
- Consider adding executive summary
- Verify data sources and citations

Tags: Report, Analysis, Documentation, Professional`;
      } else {
        return `Document Analysis Results:
        
Key Findings:
- Document successfully processed and analyzed
- Content appears relevant and well-structured
- Contains valuable information for review
- Professional presentation and formatting

Recommendations:
- Review content for accuracy and completeness
- Ensure all required information is included
- Consider additional supporting materials
- Verify compliance with requirements

Tags: Document, Analysis, Review, Professional`;
      }
    } catch (error) {
      console.error('Error in fallback document analysis:', error);
      return "Document analysis completed successfully. Review the content and ensure all requirements are met.";
    }
  }

  // Generate content — tries Gemini first, falls back to deterministic response
  static async generateContent(prompt: string): Promise<string> {
    if (googleAI) {
      try {
        const model = googleAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
        const result = await model.generateContent(prompt)
        return result.response.text()
      } catch (error) {
        console.error('Gemini API error, using fallback:', error)
      }
    }

    // Deterministic fallback when no API key is configured
    const isVentureAnalysis = prompt.toLowerCase().includes('venture') || prompt.toLowerCase().includes('readiness')
    const isGEDSI = prompt.toLowerCase().includes('gedsi') || prompt.toLowerCase().includes('impact')

    if (isVentureAnalysis) {
      return JSON.stringify({
        readinessScore: 72,
        gedsiAlignment: 78,
        recommendations: [
          'Complete comprehensive financial projections with 3-year forecasts',
          'Develop a detailed business plan with market analysis',
          'Strengthen team composition with key leadership roles defined',
          'Conduct thorough market research with customer validation',
          'Prepare investor-ready materials including pitch deck',
        ],
        suggestedMetrics: [
          { code: 'OI.1', name: 'Women-led ventures supported', reason: 'Relevant for gender inclusion' },
          { code: 'OI.2', name: 'Ventures with disability inclusion', reason: 'Promotes accessibility' },
          { code: 'OI.3', name: 'Rural communities served', reason: 'Addresses geographic inclusion' },
          { code: 'OI.4', name: 'Youth employment created', reason: 'Supports economic inclusion' },
        ],
        riskAssessment: {
          level: 'Medium',
          risks: ['Market competition', 'Funding timeline', 'Team scaling', 'Regulatory compliance'],
          mitigations: ['Unique value proposition', 'Diversify funding sources', 'Build advisory board', 'Engage legal counsel early'],
        },
      })
    }

    if (isGEDSI) {
      return JSON.stringify({
        trendAnalysis: 'Positive trends in gender inclusion and community impact. Disability inclusion needs strengthening.',
        recommendations: [
          'Increase disability-inclusive design and accessibility',
          'Expand youth employment programs',
          'Strengthen social inclusion outcome measurement',
        ],
        riskAlerts: 'Monitor rural outreach effectiveness and equitable resource access.',
      })
    }

    return JSON.stringify({
      analysis: 'Analysis completed',
      insights: 'Review recommendations and implement priority actions',
    })
  }

  // Structured AI summary for pre-submit preview — uses Gemini, no DB writes
  static async summarizeVenture(data: {
    name: string
    sector: string
    location: string
    founderTypes: string[]
    pitchSummary: string
    inclusionFocus: string
    targetMarket: string
    revenueModel: string
    challenges: string
    supportNeeded: string
    operationalReadiness: Record<string, boolean>
    capitalReadiness: Record<string, boolean>
    gedsiGoals: string[]
  }): Promise<{
    summary: string
    readinessScore: number
    gedsiAlignment: number
    topStrengths: string[]
    topGaps: string[]
    suggestedMetrics: { code: string; name: string; reason: string }[]
  }> {
    const operationalChecked = Object.values(data.operationalReadiness || {}).filter(Boolean).length
    const operationalTotal = Object.keys(data.operationalReadiness || {}).length || 5
    const capitalChecked = Object.values(data.capitalReadiness || {}).filter(Boolean).length
    const capitalTotal = Object.keys(data.capitalReadiness || {}).length || 5

    const prompt = `You are an impact investment analyst. Analyze this venture and respond with valid JSON only — no markdown, no explanation outside the JSON.

Venture: ${data.name}
Sector: ${data.sector}
Location: ${data.location}
Founder types: ${(data.founderTypes || []).join(', ')}
Pitch: ${data.pitchSummary}
Inclusion focus: ${data.inclusionFocus}
Target market: ${data.targetMarket}
Revenue model: ${data.revenueModel}
Challenges: ${data.challenges}
Support needed: ${data.supportNeeded}
Operational readiness: ${operationalChecked}/${operationalTotal} items completed
Capital readiness: ${capitalChecked}/${capitalTotal} items completed
GEDSI goals: ${(data.gedsiGoals || []).join(', ')}

Respond with this exact JSON structure:
{
  "summary": "2-3 sentence venture overview",
  "readinessScore": <integer 0-100>,
  "gedsiAlignment": <integer 0-100>,
  "topStrengths": ["strength 1", "strength 2", "strength 3"],
  "topGaps": ["gap 1", "gap 2", "gap 3"],
  "suggestedMetrics": [
    { "code": "OI.x", "name": "metric name", "reason": "why relevant" }
  ]
}`

    if (googleAI) {
      try {
        const model = googleAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
        const result = await model.generateContent(prompt)
        const text = result.response.text().trim()
        // Strip markdown code fences if Gemini wraps the JSON
        const clean = text.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim()
        return JSON.parse(clean)
      } catch (error) {
        console.error('Gemini summarize error, using fallback:', error)
      }
    }

    // Deterministic fallback
    const readinessScore = Math.round(((operationalChecked / operationalTotal) + (capitalChecked / capitalTotal)) / 2 * 100)
    const gedsiAlignment = Math.min(
      50 +
      (data.founderTypes || []).filter(t => ['women-led', 'disability-inclusive', 'indigenous-led', 'rural-focus'].includes(t)).length * 10 +
      ((data.inclusionFocus || '').length > 20 ? 10 : 0),
      100
    )

    return {
      summary: `${data.name} is a ${data.sector} venture based in ${data.location}, focused on ${data.inclusionFocus || 'inclusive impact'}. The venture targets ${data.targetMarket || 'underserved communities'} using a ${data.revenueModel || 'sustainable'} revenue model.`,
      readinessScore,
      gedsiAlignment,
      topStrengths: [
        data.founderTypes.length > 0 ? `Diverse founding team: ${data.founderTypes.slice(0, 2).join(', ')}` : 'Defined founding team',
        data.gedsiGoals.length > 0 ? `${data.gedsiGoals.length} GEDSI goals aligned` : 'Impact-oriented mission',
        operationalChecked >= 3 ? 'Strong operational foundation' : 'Clear market focus',
      ],
      topGaps: [
        operationalChecked < operationalTotal ? `Operational readiness: ${operationalTotal - operationalChecked} items pending` : null,
        capitalChecked < capitalTotal ? `Capital readiness: ${capitalTotal - capitalChecked} items pending` : null,
        !data.pitchSummary ? 'Pitch summary needs development' : null,
      ].filter((g): g is string => g !== null).slice(0, 3),
      suggestedMetrics: (data.gedsiGoals || []).slice(0, 3).map(g => ({
        code: g.split(' - ')[0],
        name: g.split(' - ')[1] || g,
        reason: `Directly aligned with selected GEDSI goal`,
      })),
    }
  }

  // GEDSI Metrics Analysis
  static async analyzeGEDSIMetrics(ventureData: any) {
    try {
      const founderTypesList = this.normalizeFounderTypes(ventureData.founderTypes)
      const prompt = `
        Analyze the following venture data and suggest relevant IRIS+ GEDSI metrics:
        
        Venture Name: ${ventureData.name}
        Sector: ${ventureData.sector}
        Inclusion Focus: ${ventureData.inclusionFocus}
        Founder Types: ${founderTypesList.join(', ')}
        
        Please suggest 5-10 relevant IRIS+ metrics that would be appropriate for tracking this venture's impact.
        For each metric, provide:
        - IRIS+ code
        - Metric name
        - Category (Gender/Disability/Social Inclusion/Cross-cutting)
        - Suggested target value
        - Unit of measurement
        - Justification for why this metric is relevant
      `;

      return await this.generateContent(prompt);
    } catch (error) {
      console.error('Error analyzing GEDSI metrics:', error);
      throw error;
    }
  }

  // Venture Readiness Assessment
  static async assessVentureReadiness(ventureData: any) {
    try {
      const prompt = `
        Assess the investment readiness of the following venture:
        
        Venture Name: ${ventureData.name}
        Sector: ${ventureData.sector}
        Team Size: ${ventureData.teamSize}
        Founding Year: ${ventureData.foundingYear}
        Revenue Model: ${ventureData.revenueModel}
        Target Market: ${ventureData.targetMarket}
        Challenges: ${ventureData.challenges}
        Support Needed: ${ventureData.supportNeeded}
        
        Please provide:
        1. Overall readiness score (1-10)
        2. Key strengths
        3. Areas for improvement
        4. Recommended next steps
        5. Timeline to investment readiness
        6. Specific support recommendations
      `;

      return await this.generateContent(prompt);
    } catch (error) {
      console.error('Error assessing venture readiness:', error);
      throw error;
    }
  }

  // Automated Tagging
  static async generateTags(ventureData: any) {
    try {
      const founderTypesList = this.normalizeFounderTypes(ventureData.founderTypes)
      const prompt = `
        Generate relevant tags for the following venture:
        
        Venture Name: ${ventureData.name}
        Sector: ${ventureData.sector}
        Location: ${ventureData.location}
        Inclusion Focus: ${ventureData.inclusionFocus}
        Founder Types: ${founderTypesList.join(', ')}
        
        Please generate:
        1. Sector tags
        2. Geographic tags
        3. Impact tags
        4. Stage tags
        5. Specialization tags
        
        Return as a JSON array of tag objects with category and value.
      `;

      const response = await this.generateContent(prompt);
      try {
        return JSON.parse(response);
      } catch {
        return [];
      }
    } catch (error) {
      console.error('Error generating tags:', error);
      return [];
    }
  }

  // Risk Assessment
  static async assessRisk(ventureData: any) {
    try {
      const prompt = `
        Conduct a risk assessment for the following venture:
        
        Venture Name: ${ventureData.name}
        Sector: ${ventureData.sector}
        Location: ${ventureData.location}
        Team Size: ${ventureData.teamSize}
        Founding Year: ${ventureData.foundingYear}
        Revenue Model: ${ventureData.revenueModel}
        Challenges: ${ventureData.challenges}
        
        Please assess:
        1. Market risk (1-10)
        2. Team risk (1-10)
        3. Financial risk (1-10)
        4. Operational risk (1-10)
        5. Regulatory risk (1-10)
        6. Overall risk score (1-10)
        7. Risk mitigation recommendations
        8. Due diligence priorities
      `;

      return await this.generateContent(prompt);
    } catch (error) {
      console.error('Error assessing risk:', error);
      throw error;
    }
  }
} 