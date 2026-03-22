'use client';

import { useState } from 'react';

export default function DiagnosticsDetailPage() {
  const ventureData = {
    name: 'Moomin Cafe',
    initials: 'MC',
    sector: 'Hospitality',
    applicationNumber: '1122A',
    owner: 'Jaanika R',
    country: 'Cambodia',
    contact: '+61 411223322',
    dateLodged: '01/02/2003',
    status: 'In Progress',
    progress: 55,
    overallScore: 60.5,
    readinessScore: 68,
    lastUpdated: '18 Jan 2003, 3:09pm AEDT'
  };

  const assessmentAreas = [
    { name: 'Investment Readiness', score: 68, color: 'bg-teal-600' },
    { name: 'Team & Governance', score: 75, color: 'bg-teal-500' },
    { name: 'Market & Attraction', score: 54, color: 'bg-teal-400' },
    { name: 'Product & Technology', score: 81, color: 'bg-teal-500' },
    { name: 'Financial & Risk', score: 49, color: 'bg-teal-400' }
  ];

  const summary = `This diagnostic assessment indicates that the venture is technically sound and supported by a capable team, reflected in high Product & Technology and Team & Governance scores. Market validation and financial risk exposure present notable concerns, suggesting that further evidence and mitigation are required before progressing to advanced funding stages.`;

  // Calculate donut chart for overall score
  const overallPercentage = ventureData.overallScore;
  const overallCircumference = 2 * Math.PI * 80;
  const overallOffset = overallCircumference - (overallPercentage / 100) * overallCircumference;

  // Calculate small donut for readiness
  const readinessPercentage = ventureData.readinessScore;
  const readinessCircumference = 2 * Math.PI * 40;
  const readinessOffset = readinessCircumference - (readinessPercentage / 100) * readinessCircumference;

  return (
    <div>
      <div className="mx-auto px-6">
        {/* Venture Info Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="w-28 h-28 bg-teal-400 rounded-2xl flex items-center justify-center text-white font-bold text-4xl flex-shrink-0">
                {ventureData.initials}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-1">{ventureData.name}</h2>
                <p className="text-lg text-gray-600 mb-4">Sector: {ventureData.sector}</p>
                
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Application Number: </span>
                    <span className="font-semibold text-gray-900">{ventureData.applicationNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Application Owner: </span>
                    <span className="font-semibold text-gray-900">{ventureData.owner}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Country: </span>
                    <span className="font-semibold text-gray-900">{ventureData.country}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Contact: </span>
                    <span className="font-semibold text-gray-900">{ventureData.contact}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Date Lodged: </span>
                    <span className="font-semibold text-gray-900">{ventureData.dateLodged}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="inline-block px-6 py-2 bg-teal-600 text-white font-semibold rounded-lg text-lg mb-2">
                  {ventureData.status}
                </div>
                <div className="text-sm text-gray-600">{ventureData.progress}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column - Diagnostics */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="inline-block bg-teal-600 text-white font-bold text-2xl px-8 py-3 rounded-xl mb-6">
                Diagnostics
              </div>

              {/* Summary */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Summary</h3>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">{summary}</p>
                <p className="text-xs text-gray-500 italic">Analysed by Chatgpt Engine</p>
              </div>

              {/* Charts */}
              <div className="flex items-center justify-around">
                {/* Overall Score - Large Donut */}
                <div className="text-center">
                  <div className="relative inline-block">
                    <svg width="200" height="200" className="transform -rotate-90">
                      <circle
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="20"
                      />
                      <circle
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke="#0d9488"
                        strokeWidth="20"
                        strokeDasharray={overallCircumference}
                        strokeDashoffset={overallOffset}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold text-purple-600">{ventureData.overallScore}%</span>
                      <span className="text-sm text-gray-600 font-semibold">Overall Score</span>
                    </div>
                  </div>
                </div>

                {/* Readiness - Small Donut */}
                <div className="text-center">
                  <div className="relative inline-block">
                    <svg width="120" height="120" className="transform -rotate-90">
                      <circle
                        cx="60"
                        cy="60"
                        r="40"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="16"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="40"
                        fill="none"
                        stroke="#0d9488"
                        strokeWidth="16"
                        strokeDasharray={readinessCircumference}
                        strokeDashoffset={readinessOffset}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-purple-600">{ventureData.readinessScore}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 font-semibold mt-2">Readiness</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Assessment Areas */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="space-y-4 mb-8">
                {assessmentAreas.map((area, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">{area.name}</span>
                      <span className="text-sm font-bold text-gray-900">{area.score}%</span>
                    </div>
                    <div className="h-10 bg-gray-200 rounded-lg overflow-hidden flex">
                      <div 
                        className={`${area.color} flex items-center justify-start px-4 text-white font-semibold text-sm transition-all`}
                        style={{ width: `${area.score}%` }}
                      >
                        {area.name}
                      </div>
                      <div className="flex-1 flex items-center justify-end px-4 text-gray-600 font-semibold text-sm">
                        {area.score}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-right text-sm text-gray-400">
                Last Updated {ventureData.lastUpdated}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-20"></div>
    </div>
  );
}