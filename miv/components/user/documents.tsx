'use client';

import { useState } from 'react';
import {
  Building2, Mail, Phone, MapPin, Calendar, TrendingUp, Heart,
  Users, Target, MessageSquare, FileText, Shield, Award,
  CheckCircle, AlertCircle, Upload, Eye, Ear, Activity,
  Brain, Sparkles, Loader2
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function VentureDocumentsUpload() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [aiPreview, setAiPreview] = useState<{
    summary: string;
    readinessScore: number;
    gedsiAlignment: number;
    topStrengths: string[];
    topGaps: string[];
    suggestedMetrics: { code: string; name: string; reason: string }[];
  } | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    sector: '',
    location: '',
    contactEmail: '',
    contactPhone: '',
    founderTypes: [] as string[],
    teamSize: '',
    foundingYear: '',
    pitchSummary: '',
    inclusionFocus: '',
    targetMarket: '',
    revenueModel: '',
    challenges: '',
    supportNeeded: '',
    timeline: '',
    operationalReadiness: {
      businessPlan: false,
      financialProjections: false,
      legalStructure: false,
      teamComposition: false,
      marketResearch: false,
    },
    capitalReadiness: {
      pitchDeck: false,
      financialStatements: false,
      investorMaterials: false,
      dueDiligence: false,
      fundingHistory: false,
    },
    washingtonShortSet: {
      seeing: '',
      hearing: '',
      walking: '',
      cognition: '',
      selfCare: '',
      communication: '',
    },
    disabilityInclusion: {
      disabilityLedLeadership: false,
      inclusiveHiringPractices: false,
      accessibleProductsOrServices: false,
      notes: '',
    },
    gedsiGoals: [] as string[],
  });

  const sectors = [
    'CleanTech', 'Agriculture', 'FinTech', 'Healthcare', 'Education',
    'E-commerce', 'Manufacturing', 'Services', 'Technology', 'Other'
  ];

  const founderTypes = [
    'women-led', 'youth-led', 'disability-inclusive', 'rural-focus',
    'indigenous-led', 'refugee-led', 'veteran-led', 'other'
  ];

  const teamSizes = ['1-2', '3-5', '6-10', '11-20', '21-50', '50+'];

  const revenueModels = [
    'B2B Sales', 'B2C Sales', 'Subscription', 'Marketplace',
    'Licensing', 'Franchising', 'Advertising', 'Other'
  ];

  const gedsiGoals = [
    'OI.1 - Women-led ventures supported',
    'OI.2 - Ventures with disability inclusion',
    'OI.3 - Rural communities served',
    'OI.4 - Youth employment created',
    'OI.5 - Indigenous communities supported',
    'OI.6 - Financial inclusion achieved',
    'OI.7 - Education access improved',
    'OI.8 - Healthcare access enhanced'
  ];

  const handleSubmit = async () => {
    setSubmitError(null);
    setSubmitSuccess(false);

    // Required field validation
    const errors: string[] = [];
    if (!formData.name.trim()) errors.push('Venture name is required');
    if (!formData.sector) errors.push('Industry sector is required');
    if (!formData.location.trim()) errors.push('Location is required');
    if (!formData.contactEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) errors.push('A valid contact email is required');
    if (formData.founderTypes.length === 0) errors.push('Select at least one founder type');
    if (!formData.teamSize) errors.push('Team size is required');
    if (!formData.foundingYear.trim()) errors.push('Founding year is required');
    if (!formData.pitchSummary.trim()) errors.push('Pitch summary is required');
    if (!formData.inclusionFocus.trim()) errors.push('Inclusion focus is required');
    if (!formData.targetMarket.trim()) errors.push('Target market is required');
    if (!formData.revenueModel) errors.push('Revenue model is required');
    if (!formData.challenges.trim()) errors.push('Key challenges are required');
    if (!formData.supportNeeded.trim()) errors.push('Support needed is required');
    if (!formData.timeline.trim()) errors.push('Timeline is required');
    if (formData.gedsiGoals.length === 0) errors.push('Select at least one GEDSI goal');

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors([]);

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/ventures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.message || `Submission failed (${response.status})`);
      }

      const result = await response.json();

      const aiResponse = await fetch('/api/ai/analyze-venture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ventureId: result.id }),
      });

      if (!aiResponse.ok) {
        setSubmitSuccess(true);
        setSubmitError('Venture submitted, but AI analysis could not be started. You can retry from your dashboard.');
      } else {
        setSubmitSuccess(true);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAiPreview = async () => {
    setIsLoadingPreview(true);
    setPreviewError(null);
    setAiPreview(null);
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          sector: formData.sector,
          location: formData.location,
          founderTypes: formData.founderTypes,
          pitchSummary: formData.pitchSummary,
          inclusionFocus: formData.inclusionFocus,
          targetMarket: formData.targetMarket,
          revenueModel: formData.revenueModel,
          challenges: formData.challenges,
          supportNeeded: formData.supportNeeded,
          operationalReadiness: formData.operationalReadiness,
          capitalReadiness: formData.capitalReadiness,
          gedsiGoals: formData.gedsiGoals,
        }),
      });
      if (!res.ok) throw new Error('Failed to generate AI summary');
      setAiPreview(await res.json());
    } catch (err) {
      setPreviewError(err instanceof Error ? err.message : 'Preview unavailable. Please try again.');
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const toggleArrayValue = (field: 'founderTypes' | 'gedsiGoals', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Venture Intake Form</h1>
          <p className="text-gray-600">Complete all sections to submit your venture for assessment</p>
        </div>

        <div className="space-y-8">
          {/* Section 1: Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
              <Building2 className="w-6 h-6 text-teal-600" />
              <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Venture Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., EcoFarm Solutions"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry Sector *
                </label>
                <select
                  value={formData.sector}
                  onChange={(e) => setFormData({...formData, sector: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">Choose your industry</option>
                  {sectors.map(sector => (
                    <option key={sector} value={sector}>{sector}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="Ho Chi Minh City, Vietnam"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email *
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                  placeholder="founder@yourventure.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                  placeholder="+84 901 234 567"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Team & Foundation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
              <Users className="w-6 h-6 text-teal-600" />
              <h2 className="text-xl font-bold text-gray-900">Team & Foundation</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Founder Types * (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {founderTypes.map(type => (
                    <label key={type} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.founderTypes.includes(type)}
                        onChange={() => toggleArrayValue('founderTypes', type)}
                        className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                      />
                      <span className="text-sm capitalize">{type.replace('-', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Size *
                  </label>
                  <select
                    value={formData.teamSize}
                    onChange={(e) => setFormData({...formData, teamSize: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">How many team members?</option>
                    {teamSizes.map(size => (
                      <option key={size} value={size}>{size} people</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Founding Year *
                  </label>
                  <input
                    type="text"
                    value={formData.foundingYear}
                    onChange={(e) => setFormData({...formData, foundingYear: e.target.value})}
                    placeholder="2021"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pitch Summary *
                </label>
                <textarea
                  value={formData.pitchSummary}
                  onChange={(e) => setFormData({...formData, pitchSummary: e.target.value})}
                  placeholder="Tell us about your venture's mission and value proposition..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Inclusion Focus *
                </label>
                <textarea
                  value={formData.inclusionFocus}
                  onChange={(e) => setFormData({...formData, inclusionFocus: e.target.value})}
                  placeholder="How does your venture promote inclusion and address social challenges?"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Market & Business */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
              <Target className="w-6 h-6 text-teal-600" />
              <h2 className="text-xl font-bold text-gray-900">Market & Business</h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Market *
                  </label>
                  <input
                    type="text"
                    value={formData.targetMarket}
                    onChange={(e) => setFormData({...formData, targetMarket: e.target.value})}
                    placeholder="Rural farmers in Vietnam"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Revenue Model *
                  </label>
                  <select
                    value={formData.revenueModel}
                    onChange={(e) => setFormData({...formData, revenueModel: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">How do you make money?</option>
                    {revenueModels.map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Challenges *
                </label>
                <textarea
                  value={formData.challenges}
                  onChange={(e) => setFormData({...formData, challenges: e.target.value})}
                  placeholder="Market access, funding constraints, regulatory barriers, technology challenges..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Support Needed *
                </label>
                <textarea
                  value={formData.supportNeeded}
                  onChange={(e) => setFormData({...formData, supportNeeded: e.target.value})}
                  placeholder="Funding, mentorship, market access, technical assistance, network connections..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeline to Investment Readiness *
                </label>
                <input
                  type="text"
                  value={formData.timeline}
                  onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                  placeholder="6-12 months to Series A"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Readiness Assessment */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
              <CheckCircle className="w-6 h-6 text-teal-600" />
              <h2 className="text-xl font-bold text-gray-900">Readiness Assessment</h2>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Operational Readiness</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'businessPlan', label: 'Business Plan' },
                    { key: 'financialProjections', label: 'Financial Projections' },
                    { key: 'legalStructure', label: 'Legal Structure' },
                    { key: 'teamComposition', label: 'Team Composition' },
                    { key: 'marketResearch', label: 'Market Research' },
                  ].map(item => (
                    <label key={item.key} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.operationalReadiness[item.key as keyof typeof formData.operationalReadiness]}
                        onChange={(e) => setFormData({
                          ...formData,
                          operationalReadiness: {
                            ...formData.operationalReadiness,
                            [item.key]: e.target.checked
                          }
                        })}
                        className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                      />
                      <span className="text-sm font-medium">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Capital Readiness</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'pitchDeck', label: 'Pitch Deck' },
                    { key: 'financialStatements', label: 'Financial Statements' },
                    { key: 'investorMaterials', label: 'Investor Materials' },
                    { key: 'dueDiligence', label: 'Due Diligence Ready' },
                    { key: 'fundingHistory', label: 'Funding History' },
                  ].map(item => (
                    <label key={item.key} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.capitalReadiness[item.key as keyof typeof formData.capitalReadiness]}
                        onChange={(e) => setFormData({
                          ...formData,
                          capitalReadiness: {
                            ...formData.capitalReadiness,
                            [item.key]: e.target.checked
                          }
                        })}
                        className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                      />
                      <span className="text-sm font-medium">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Washington Short Set & Disability Inclusion */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
              <Activity className="w-6 h-6 text-teal-600" />
              <h2 className="text-xl font-bold text-gray-900">Accessibility & Disability Inclusion</h2>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Washington Group Short Set</h3>
                <p className="text-sm text-gray-600 mb-4">Identify functional difficulties to better design inclusive support</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'seeing', label: 'Seeing', icon: Eye },
                    { key: 'hearing', label: 'Hearing', icon: Ear },
                    { key: 'walking', label: 'Walking/Mobility', icon: Activity },
                    { key: 'cognition', label: 'Remembering/Concentrating', icon: Brain },
                    { key: 'selfCare', label: 'Self-care', icon: Heart },
                    { key: 'communication', label: 'Communication', icon: MessageSquare },
                  ].map(item => (
                    <div key={item.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <item.icon className="w-4 h-4 inline mr-1" />
                        {item.label}
                      </label>
                      <select
                        value={formData.washingtonShortSet[item.key as keyof typeof formData.washingtonShortSet]}
                        onChange={(e) => setFormData({
                          ...formData,
                          washingtonShortSet: {
                            ...formData.washingtonShortSet,
                            [item.key]: e.target.value
                          }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      >
                        <option value="">Select level</option>
                        <option value="no_difficulty">No difficulty</option>
                        <option value="some_difficulty">Some difficulty</option>
                        <option value="a_lot_of_difficulty">A lot of difficulty</option>
                        <option value="cannot_do_at_all">Cannot do at all</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Disability Inclusion Attributes</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {[
                    { key: 'disabilityLedLeadership', label: 'Disability-led leadership' },
                    { key: 'inclusiveHiringPractices', label: 'Inclusive hiring practices' },
                    { key: 'accessibleProductsOrServices', label: 'Accessible products/services' },
                  ].map(item => (
                    <label key={item.key} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.disabilityInclusion[item.key as keyof typeof formData.disabilityInclusion] as boolean}
                        onChange={(e) => setFormData({
                          ...formData,
                          disabilityInclusion: {
                            ...formData.disabilityInclusion,
                            [item.key]: e.target.checked
                          }
                        })}
                        className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                      />
                      <span className="text-sm font-medium">{item.label}</span>
                    </label>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={formData.disabilityInclusion.notes}
                    onChange={(e) => setFormData({
                      ...formData,
                      disabilityInclusion: {
                        ...formData.disabilityInclusion,
                        notes: e.target.value
                      }
                    })}
                    placeholder="Any relevant context about accessibility or inclusion practices..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 6: GEDSI Goals */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
              <Target className="w-6 h-6 text-teal-600" />
              <h2 className="text-xl font-bold text-gray-900">GEDSI Goals</h2>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Select all GEDSI goals that align with your venture's impact objectives (Select at least one) *
              </p>
              <div className="grid grid-cols-1 gap-3">
                {gedsiGoals.map(goal => (
                  <label key={goal} className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.gedsiGoals.includes(goal)}
                      onChange={() => toggleArrayValue('gedsiGoals', goal)}
                      className="w-4 h-4 mt-0.5 text-teal-600 rounded focus:ring-teal-500"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900">{goal}</span>
                      <div className="mt-1">
                        <span className="text-xs px-2 py-1 bg-teal-100 text-teal-700 rounded">IRIS+ Metric</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* AI Summary & Analyze Panel */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-full">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-blue-900">AI Summary & Analysis</h3>
                  <p className="text-xs text-blue-600">Powered by Google Gemini</p>
                </div>
              </div>
              <button
                onClick={handleAiPreview}
                disabled={isLoadingPreview || !formData.name || !formData.sector}
                className="px-4 py-2 bg-white border border-blue-300 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-50 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingPreview ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />Analysing...</>
                ) : (
                  <><Sparkles className="w-4 h-4" />Preview AI Analysis</>
                )}
              </button>
            </div>

            {!aiPreview && !isLoadingPreview && !previewError && (
              <p className="text-sm text-blue-700">
                Fill in the form above then click <strong>Preview AI Analysis</strong> to get an instant Gemini-powered assessment before submitting.
              </p>
            )}

            {previewError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{previewError}</AlertDescription>
              </Alert>
            )}

            {aiPreview && (
              <div className="space-y-4 pt-3 border-t border-blue-200">
                <p className="text-sm text-blue-800 italic">{aiPreview.summary}</p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">Readiness Score</p>
                    <p className="text-2xl font-bold text-green-600">{aiPreview.readinessScore}%</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">GEDSI Alignment</p>
                    <p className="text-2xl font-bold text-blue-600">{aiPreview.gedsiAlignment}%</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">Strengths</p>
                    {aiPreview.topStrengths.map((s, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 shrink-0" />
                        <p className="text-xs text-gray-700">{s}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Gaps to Address</p>
                    {aiPreview.topGaps.map((g, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <AlertCircle className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
                        <p className="text-xs text-gray-700">{g}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {aiPreview.suggestedMetrics.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide">Suggested IRIS+ Metrics</p>
                    <div className="flex flex-wrap gap-2">
                      {aiPreview.suggestedMetrics.map((m, i) => (
                        <span key={i} className="px-2 py-1 text-xs border border-purple-300 text-purple-700 rounded-full bg-white">
                          {m.code}: {m.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Submit Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
            {validationErrors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <p className="font-medium mb-1">Please fix the following before submitting:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    {validationErrors.map((err, i) => (
                      <li key={i} className="text-sm">{err}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {submitError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}

            {submitSuccess && !submitError && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Your venture has been submitted and is being analyzed. You'll receive results in your dashboard shortly.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Ready to Submit?</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Your venture will be saved and a full AI analysis will run automatically
                </p>
              </div>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || submitSuccess}
                className="px-8 py-4 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin" />Submitting...</>
                ) : (
                  <><Sparkles className="w-5 h-5" />Submit & Analyze</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}