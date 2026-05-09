"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  TrendingUp,
  Upload,
  DollarSign,
  MessageSquare,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  TrendingDown,
  Bell,
  FileText,
  Rocket,
  Shield,
} from "lucide-react";

export default function ImpactDashboard() {
  const [notifications] = useState([
    {
      icon: "💰",
      text: "A new funding opportunity is now available for your startup. Please review the details and submit your application before the deadline.",
      type: "info",
    },
    {
      icon: "🎉",
      text: "Congratulations! Your funding application has been approved. Please review the agreement and confirm the next steps to receive your funds.",
      type: "success",
    },
    {
      icon: "💰",
      text: "A new funding opportunity is now available for your startup. Please review the details and submit your application before the deadline.",
      type: "info",
    },
    {
      icon: "📄",
      text: "One or more required documents are missing from your submission. Please upload your pitch deck or business plan to continue.",
      type: "warning",
    },
    {
      icon: "⚠️",
      text: "Your startup profile is still incomplete and completing all sections will improve your approval chances.",
      type: "warning",
    },
  ]);

  const quickActions = [
    { label: "Complete my profile", icon: User, href: "/user-dashboard/profile" },
    { label: "Track my progress", icon: TrendingUp, href: "/user-dashboard/diagnostics" },
    { label: "Upload Document", icon: Upload, href: "/user-dashboard/documents" },
    { label: "Apply for Funding", icon: DollarSign, href: "/user-dashboard/funding" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Section - Quick Suggestions & Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Suggestions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-teal-600" />
              Quick Suggestions
            </h2>
            <div className="space-y-3">
              {quickActions.map((action, idx) => (
                <Link
                  key={idx}
                  href={action.href}
                  className="w-full px-4 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-lg font-medium transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-sm"
                >
                  <action.icon className="w-4 h-4" />
                  {action.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-teal-600" />
              Notifications
            </h2>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {notifications.map((notif, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm text-gray-700 flex items-start gap-2"
                >
                  <span className="text-base flex-shrink-0">{notif.icon}</span>
                  <span className="leading-relaxed">{notif.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Venture Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Rocket className="w-5 h-5 text-teal-600" />
            Quick Venture Summary
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Venture Card */}
            <div className="border-2 border-teal-500 rounded-xl p-6 bg-gradient-to-br from-teal-50 to-white">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    MOOMIN Cafe
                  </h3>
                  <p className="text-sm text-gray-500">
                    Application Number: 1122A
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progress Overall</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-green-500"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Readiness Score</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-400 to-pink-500"
                      style={{ width: "70%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Funding Progress</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-cyan-500"
                      style={{ width: "40%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Capital Raised</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-500"
                      style={{ width: "25%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Add New Venture Cards */}
            <button className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-teal-500 hover:bg-teal-50 transition-all group">
              <div className="h-full flex flex-col items-center justify-center text-gray-400 group-hover:text-teal-600 transition-colors">
                <Plus className="w-16 h-16 mb-3" />
                <span className="font-medium">Add New Venture</span>
              </div>
            </button>

            <button className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-teal-500 hover:bg-teal-50 transition-all group">
              <div className="h-full flex flex-col items-center justify-center text-gray-400 group-hover:text-teal-600 transition-colors">
                <Plus className="w-16 h-16 mb-3" />
                <span className="font-medium">Add New Venture</span>
              </div>
            </button>
          </div>
        </div>

        {/* Performance Analytics */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-teal-600" />
              Performance Analytics
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Monitor key performance indicators and platform growth
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-teal-50 to-green-50 rounded-xl p-6 border border-teal-100">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-teal-600" />
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  +2.1%
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Venture Conversion Rate
              </p>
              <p className="text-4xl font-bold text-gray-800">15.2%</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                  -5
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Average Time to Funding
              </p>
              <p className="text-4xl font-bold text-gray-800">42 days</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Conversion Funnel */}
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Venture Conversion Funnel
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Conversion rates across different pipeline stages
              </p>

              <div className="space-y-3">
                {[
                  { label: "Intake", value: 95, color: "bg-red-400" },
                  { label: "Diagnostics", value: 75, color: "bg-orange-400" },
                  { label: "Readiness", value: 55, color: "bg-amber-400" },
                  {
                    label: "Capital Facilitation",
                    value: 20,
                    color: "bg-rose-400",
                  },
                  { label: "Funded", value: 10, color: "bg-red-500" },
                ].map((stage, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{stage.label}</span>
                      <span className="font-semibold text-gray-800">
                        {stage.value}%
                      </span>
                    </div>
                    <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                      <div
                        className={`h-full ${stage.color} transition-all duration-500`}
                        style={{ width: `${stage.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Distribution */}
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Time to Funding Distribution
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                How long ventures typically take to secure funding
              </p>

              <div className="h-64 flex items-end justify-between gap-2">
                {[
                  { label: "0-30 days", value: 5 },
                  { label: "31-45 days", value: 8 },
                  { label: "46-60 days", value: 12 },
                  { label: "61-75 days", value: 7 },
                  { label: "90+ days", value: 3 },
                ].map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-red-400 to-red-500 rounded-t-lg transition-all hover:from-red-500 hover:to-red-600"
                      style={{ height: `${(item.value / 12) * 100}%` }}
                    ></div>
                    <p className="text-xs text-gray-600 mt-2 text-center transform -rotate-45 origin-top-left whitespace-nowrap">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
