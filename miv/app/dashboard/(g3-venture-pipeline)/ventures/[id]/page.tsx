"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { calculateGEDSIScore } from "@/lib/gedsi-utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Building2,
  Users,
  Target,
  DollarSign,
  Calendar,
  MapPin,
  Globe,
  Phone,
  Mail,
  FileText,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowLeft,
  Edit,
  Download,
  Share2,
  MoreHorizontal,
  UserCheck,
  Award,
  Lightbulb,
  Heart
} from "lucide-react"
import Link from "next/link"

interface Venture {
  id: string
  name: string
  description: string
  sector: string
  location: string
  stage: string
  status: string
  fundingRaised: number
  revenue: number
  lastValuation: number
  teamSize: number
  foundingYear: number
  website: string
  contactEmail: string
  contactPhone: string
  gedsiMetricsSummary: {
    womenLeadership: number
    womenEmployees: number
    disabilityInclusion: number
    underservedCommunities: number
    genderPayGap: number
    accessibilityScore: number
  }
  gedsiMetrics: Array<{
    id: string
    metricCode: string
    metricName: string
    category: string
    targetValue: number
    currentValue: number
    unit: string
    status: string
    verificationDate: string
    notes: string
  }>
  activities: Array<{
    id: string
    type: string
    description: string
    date: string
    userId: string
    user: {
      name: string
      email: string
    }
  }>
  documents: Array<{
    id: string
    name: string
    type: string
    url: string
    uploadedAt: string
    size: string
  }>
  createdBy: {
    name: string
    email: string
  }
  assignedTo: {
    name: string
    email: string
  } | null
  createdAt: string
  updatedAt: string
  intakeDate?: string
  screeningDate?: string
  dueDiligenceStart?: string
  dueDiligenceEnd?: string
  investmentReadyAt?: string
  fundedAt?: string
  nextReviewAt?: string
  capitalActivities?: Array<{ id: string; type: string; amount: number; currency: string; status: string; date?: string; investorName?: string }>
  financials?: Record<string, any>
  aiAnalysis?: Record<string, any>
}

export default function VentureDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [venture, setVenture] = useState<Venture | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVentureData = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/ventures/${params.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch venture data')
      }
      const data = await response.json()

      // Normalize API response to match the Venture interface and guard against nulls
      const normalized: Venture = {
        id: data.id,
        name: data.name ?? 'Unnamed Venture',
        description: data.description ?? '',
        sector: data.sector ?? 'UNKNOWN',
        location: data.location ?? 'Unknown',
        stage: data.stage ?? 'INTAKE',
        status: data.status ?? 'ACTIVE',
        fundingRaised: Number(data.fundingRaised ?? 0),
        revenue: Number(data.revenue ?? 0),
        lastValuation: Number(data.lastValuation ?? 0),
        teamSize: Number(data.teamSize ?? 0),
        foundingYear: Number(data.foundingYear ?? data.foundedYear ?? new Date().getFullYear()),
        website: data.website ?? '',
        contactEmail: data.contactEmail ?? '',
        contactPhone: data.contactPhone ?? '',
        gedsiMetricsSummary: data.gedsiMetricsSummary ?? {
          womenLeadership: 0,
          womenEmployees: 0,
          disabilityInclusion: 0,
          underservedCommunities: 0,
          genderPayGap: 0,
          accessibilityScore: 0,
        },
        gedsiMetrics: Array.isArray(data.gedsiMetrics)
          ? data.gedsiMetrics.map((m: any) => ({
              id: m.id,
              metricCode: m.metricCode ?? '',
              metricName: m.metricName ?? '',
              category: m.category ?? 'GENDER',
              targetValue: Number(m.targetValue ?? 0),
              currentValue: Number(m.currentValue ?? 0),
              unit: m.unit ?? '',
              status: m.status ?? 'NOT_STARTED',
              verificationDate: m.verificationDate ?? new Date().toISOString(),
              notes: m.notes ?? '',
            }))
          : [],
        activities: Array.isArray(data.activities)
          ? data.activities.map((a: any) => ({
              id: a.id,
              type: a.type ?? 'MILESTONE',
              description: a.description ?? '',
              date: a.date ?? a.createdAt ?? new Date().toISOString(),
              userId: a.userId ?? '',
              user: {
                name: a.user?.name ?? 'System',
                email: a.user?.email ?? 'system@local',
              },
            }))
          : [],
        documents: Array.isArray(data.documents)
          ? data.documents.map((d: any) => ({
              id: d.id,
              name: d.name ?? 'Document',
              type: d.type ?? 'FILE',
              url: d.url ?? '#',
              uploadedAt: d.uploadedAt ?? new Date().toISOString(),
              size: d.size ?? '0 KB',
            }))
          : [],
        createdBy: {
          name: data.createdBy?.name ?? 'Unknown',
          email: data.createdBy?.email ?? '',
        },
        assignedTo: data.assignedTo
          ? {
              name: data.assignedTo?.name ?? 'Unknown',
              email: data.assignedTo?.email ?? '',
            }
          : null,
        createdAt: data.createdAt ?? new Date().toISOString(),
        updatedAt: data.updatedAt ?? new Date().toISOString(),
        intakeDate: data.intakeDate ?? null,
        screeningDate: data.screeningDate ?? null,
        dueDiligenceStart: data.dueDiligenceStart ?? null,
        dueDiligenceEnd: data.dueDiligenceEnd ?? null,
        investmentReadyAt: data.investmentReadyAt ?? null,
        fundedAt: data.fundedAt ?? null,
        nextReviewAt: data.nextReviewAt ?? null,
        capitalActivities: Array.isArray(data.capitalActivities) ? data.capitalActivities : [],
        financials: data.financials ?? undefined,
        aiAnalysis: data.aiAnalysis ?? undefined,
      }

      setVenture(normalized)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    if (params.id) {
      fetchVentureData()
    }
  }, [params.id, fetchVentureData])

  const getStageColor = (stage: string) => {
    const colors: { [key: string]: string } = {
      'IDEA': 'bg-blue-100 text-blue-800',
      'VALIDATION': 'bg-yellow-100 text-yellow-800',
      'EARLY_GROWTH': 'bg-green-100 text-green-800',
      'SCALE_UP': 'bg-purple-100 text-purple-800',
      'MATURE': 'bg-gray-100 text-gray-800'
    }
    return colors[stage] || 'bg-gray-100 text-gray-800'
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'ACTIVE': 'bg-green-100 text-green-800',
      'INACTIVE': 'bg-gray-100 text-gray-800',
      'SUSPENDED': 'bg-red-100 text-red-800',
      'ARCHIVED': 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getGEDSICategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'GENDER': 'bg-pink-100 text-pink-800',
      'EQUITY': 'bg-blue-100 text-blue-800',
      'DISABILITY': 'bg-purple-100 text-purple-800',
      'SOCIAL_INCLUSION': 'bg-green-100 text-green-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const getActivityIcon = (type: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      'ASSESSMENT': <Target className="h-4 w-4" />,
      'FUNDING': <DollarSign className="h-4 w-4" />,
      'MENTORSHIP': <Users className="h-4 w-4" />,
      'DOCUMENT': <FileText className="h-4 w-4" />,
      'MILESTONE': <Award className="h-4 w-4" />
    }
    return icons[type] || <Activity className="h-4 w-4" />
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Use shared GEDSI calculation function
  const getVentureGEDSIScore = (venture: Venture) => {
    return calculateGEDSIScore(venture);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading venture details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Venture</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  if (!venture) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Venture Not Found</h2>
          <p className="text-gray-600 mb-4">The venture you're looking for doesn't exist.</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{venture.name}</h1>
            <p className="text-gray-600">{venture.sector} • {venture.location}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Status and Stage */}
      <div className="flex items-center space-x-4">
        <Badge className={getStatusColor(venture.status)}>
          {venture.status}
        </Badge>
        <Badge className={getStageColor(venture.stage)}>
          {venture.stage.replace('_', ' ')}
        </Badge>
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="text-sm text-gray-600">Active in pipeline</span>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="gedsi">GEDSI Metrics</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Key Metrics */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm text-gray-600">Funding Raised</p>
                        <p className="text-lg font-semibold">{formatCurrency(venture.fundingRaised)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-600">Team Size</p>
                        <p className="text-lg font-semibold">{venture.teamSize}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="text-sm text-gray-600">GEDSI Score</p>
                        <p className="text-lg font-semibold">{getVentureGEDSIScore(venture)}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-orange-500" />
                      <div>
                        <p className="text-sm text-gray-600">Founded</p>
                        <p className="text-lg font-semibold">{venture.foundingYear}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{venture.description}</p>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{venture.contactEmail}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{venture.contactPhone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <a href={venture.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                        {venture.website}
                      </a>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{venture.location}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Capital Activities */}
              <Card>
                <CardHeader>
                  <CardTitle>Capital Activities</CardTitle>
                  <CardDescription>Financing events and status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(venture.capitalActivities || []).map((c) => (
                      <div key={c.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <DollarSign className="h-4 w-4 text-emerald-600" />
                          <div>
                            <p className="text-sm font-medium">{c.type} • {c.status}</p>
                            <p className="text-xs text-gray-600">{c.investorName || 'Investor'} {c.date ? `• ${formatDate(c.date)}` : ''}</p>
                          </div>
                        </div>
                        <div className="text-sm font-semibold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: c.currency || 'USD', maximumFractionDigits: 0 }).format(c.amount || 0)}</div>
                      </div>
                    ))}
                    {(!venture.capitalActivities || venture.capitalActivities.length === 0) && (
                      <p className="text-sm text-gray-500">No capital activities yet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* AI Insights */}
              <Card>
                <CardHeader>
                  <CardTitle>AI Insights</CardTitle>
                  <CardDescription>Automated analysis highlights</CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    try {
                      const aiData = typeof venture.aiAnalysis === 'string' 
                        ? JSON.parse(venture.aiAnalysis) 
                        : venture.aiAnalysis;
                      
                      if (!aiData) {
                        return <p className="text-sm text-gray-500">No AI analysis available.</p>;
                      }

                      return (
                        <div className="space-y-4">
                          {/* Key Scores */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                              <div className="text-lg font-bold text-blue-600">{getVentureGEDSIScore(venture) || 'N/A'}%</div>
                              <div className="text-xs text-blue-800">GEDSI Score</div>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                              <div className="text-lg font-bold text-green-600">{aiData.impactScore || 'N/A'}%</div>
                              <div className="text-xs text-green-800">Impact Score</div>
                            </div>
                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                              <div className="text-lg font-bold text-purple-600">{aiData.readinessScore || 'N/A'}%</div>
                              <div className="text-xs text-purple-800">Readiness</div>
                            </div>
                            <div className="text-center p-3 bg-orange-50 rounded-lg">
                              <div className={`text-lg font-bold ${
                                aiData.riskLevel === 'low' ? 'text-green-600' :
                                aiData.riskLevel === 'medium' ? 'text-orange-600' : 'text-red-600'
                              }`}>
                                {(aiData.riskLevel || 'Unknown').toUpperCase()}
                              </div>
                              <div className="text-xs text-gray-600">Risk Level</div>
                            </div>
                          </div>

                          {/* AI Recommendation */}
                          {aiData.recommendation && (
                            <div className="p-4 bg-blue-50 rounded-lg">
                              <h4 className="font-semibold text-blue-900 mb-2">AI Recommendation</h4>
                              <p className="text-sm text-blue-800">{aiData.recommendation}</p>
                            </div>
                          )}

                          {/* Key Strengths */}
                          {aiData.keyStrengths && Array.isArray(aiData.keyStrengths) && (
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Key Strengths</h4>
                              <ul className="space-y-1">
                                {aiData.keyStrengths.slice(0, 3).map((strength: string, index: number) => (
                                  <li key={index} className="text-sm text-gray-700 flex items-start">
                                    <span className="text-green-500 mr-2">•</span>
                                    {strength}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Areas for Improvement */}
                          {aiData.areasForImprovement && Array.isArray(aiData.areasForImprovement) && (
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Areas for Improvement</h4>
                              <ul className="space-y-1">
                                {aiData.areasForImprovement.slice(0, 3).map((area: string, index: number) => (
                                  <li key={index} className="text-sm text-gray-700 flex items-start">
                                    <span className="text-orange-500 mr-2">•</span>
                                    {area}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      );
                    } catch (error) {
                      console.error('Error parsing AI analysis:', error);
                      return <p className="text-sm text-red-500">Error loading AI analysis data.</p>;
                    }
                  })()}
                </CardContent>
              </Card>
            </div>

            {/* GEDSI Progress */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>GEDSI Progress</CardTitle>
                  <CardDescription>Overall compliance score</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Overall Score</span>
                        <span className="text-sm text-gray-600">{getVentureGEDSIScore(venture)}%</span>
                      </div>
                      <Progress value={getVentureGEDSIScore(venture)} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      {venture.gedsiMetrics.slice(0, 3).map((metric) => (
                        <div key={metric.id} className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">{metric.metricName}</span>
                          <span className="text-xs font-medium">{metric.currentValue}/{metric.targetValue}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {venture.activities.slice(0, 3).map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                          <p className="text-xs text-gray-500">{formatDate(activity.date)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Financial Snapshot */}
              <Card>
                <CardHeader>
                  <CardTitle>Financial Snapshot</CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    try {
                      const financialData = typeof venture.financials === 'string' 
                        ? JSON.parse(venture.financials) 
                        : venture.financials;
                      
                      if (!financialData) {
                        return <p className="text-sm text-gray-500">No financial data available.</p>;
                      }

                      const formatFinancialValue = (key: string, value: any) => {
                        if (key.toLowerCase().includes('revenue') || key.toLowerCase().includes('mrr')) {
                          return `$${Number(value).toLocaleString()}`;
                        }
                        if (key.toLowerCase().includes('margin') || key.toLowerCase().includes('rate')) {
                          return `${value}%`;
                        }
                        if (key.toLowerCase().includes('runway')) {
                          return `${value} months`;
                        }
                        return String(value);
                      };

                      const formatLabel = (key: string) => {
                        return key
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, str => str.toUpperCase())
                          .trim();
                      };

                      return (
                        <div className="space-y-3">
                          {Object.entries(financialData).map(([k, v]) => (
                            <div key={k} className="flex justify-between items-center">
                              <span className="text-gray-600 text-sm">{formatLabel(k)}</span>
                              <span className="font-medium text-sm">{formatFinancialValue(k, v)}</span>
                            </div>
                          ))}
                        </div>
                      );
                    } catch (error) {
                      console.error('Error parsing financial data:', error);
                      return <p className="text-sm text-red-500">Error loading financial data.</p>;
                    }
                  })()}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="gedsi" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>GEDSI Metrics</CardTitle>
              <CardDescription>Detailed metrics and compliance tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {venture.gedsiMetrics.map((metric) => (
                  <div key={metric.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{metric.metricName}</h3>
                        <p className="text-sm text-gray-600">{metric.metricCode}</p>
                      </div>
                      <Badge className={getGEDSICategoryColor(metric.category)}>
                        {metric.category.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm font-medium">
                          {metric.currentValue} / {metric.targetValue} {metric.unit}
                        </span>
                      </div>
                      <Progress 
                        value={(metric.currentValue / metric.targetValue) * 100} 
                        className="h-2" 
                      />
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Status: {metric.status}</span>
                        <span>Verified: {formatDate(metric.verificationDate)}</span>
                      </div>
                      {metric.notes && (
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          {metric.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
              <CardDescription>All activities and interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {venture.activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                        <span className="text-xs text-gray-500">{formatDate(activity.date)}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        by {activity.user.name} • {activity.type.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>All venture-related documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {venture.documents.map((document) => (
                  <div key={document.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{document.name}</p>
                        <p className="text-xs text-gray-500">
                          {document.type} • {document.size} • {formatDate(document.uploadedAt)}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Created By</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>{venture.createdBy.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">{venture.createdBy.name}</p>
                    <p className="text-sm text-gray-600">{venture.createdBy.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Assigned To</CardTitle>
              </CardHeader>
              <CardContent>
                {venture.assignedTo ? (
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>{venture.assignedTo.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">{venture.assignedTo.name}</p>
                      <p className="text-sm text-gray-600">{venture.assignedTo.email}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">Not assigned</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Assign User
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Venture Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Created:</span>
                  <p className="font-medium">{formatDate(venture.createdAt)}</p>
                </div>
                <div>
                  <span className="text-gray-600">Last Updated:</span>
                  <p className="font-medium">{formatDate(venture.updatedAt)}</p>
                </div>
                {venture.intakeDate && (
                  <div>
                    <span className="text-gray-600">Intake Date:</span>
                    <p className="font-medium">{formatDate(venture.intakeDate)}</p>
                  </div>
                )}
                {venture.screeningDate && (
                  <div>
                    <span className="text-gray-600">Screening Date:</span>
                    <p className="font-medium">{formatDate(venture.screeningDate)}</p>
                  </div>
                )}
                {venture.dueDiligenceStart && (
                  <div>
                    <span className="text-gray-600">Due Diligence Start:</span>
                    <p className="font-medium">{formatDate(venture.dueDiligenceStart)}</p>
                  </div>
                )}
                {venture.dueDiligenceEnd && (
                  <div>
                    <span className="text-gray-600">Due Diligence End:</span>
                    <p className="font-medium">{formatDate(venture.dueDiligenceEnd)}</p>
                  </div>
                )}
                {venture.investmentReadyAt && (
                  <div>
                    <span className="text-gray-600">Investment Ready:</span>
                    <p className="font-medium">{formatDate(venture.investmentReadyAt)}</p>
                  </div>
                )}
                {venture.fundedAt && (
                  <div>
                    <span className="text-gray-600">Funded At:</span>
                    <p className="font-medium">{formatDate(venture.fundedAt)}</p>
                  </div>
                )}
                {venture.nextReviewAt && (
                  <div>
                    <span className="text-gray-600">Next Review:</span>
                    <p className="font-medium">{formatDate(venture.nextReviewAt)}</p>
                  </div>
                )}
                <div>
                  <span className="text-gray-600">Funding Stage:</span>
                  <p className="font-medium">{venture.stage}</p>
                </div>
                <div>
                  <span className="text-gray-600">Team Size:</span>
                  <p className="font-medium">{venture.teamSize} people</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 