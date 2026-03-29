"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	CheckCircle,
	AlertTriangle,
	Clock,
	Target,
	FileText,
	Lightbulb,
} from "lucide-react";
import {
	ResponsiveContainer,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	AreaChart,
	Area,
	RadarChart,
	PolarGrid,
	PolarAngleAxis,
	PolarRadiusAxis,
	Radar, // Declare Radar here
} from "recharts";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ReadinessTracker from "@/components/readiness-tracker";

interface Recommendation {
	id: string;
	text: string;
	completed: boolean;
}

interface DiagnosticArea {
	name: string;
	score: number;
	status: string;
	recommendations: Recommendation[];
	notes?: string;
	color: string;
	bgColor: string;
}

interface Venture {
	id: string;
	name: string;
	sector: string;
	overallScore: number;
	status: string;
	completedAreas: number;
	totalAreas: number;
	lastUpdated: string;
	history: { date: string; score: number }[];
	detailedAreas: DiagnosticArea[];
}

const venturesInDiagnostics: Venture[] = [
	{
		id: "VEN-2024-001",
		name: "AgriTech Solutions",
		sector: "Agriculture",
		overallScore: 75,
		status: "In Progress",
		completedAreas: 4,
		totalAreas: 6,
		lastUpdated: "2 days ago",
		history: [
			{ date: "2023-10-01", score: 55 },
			{ date: "2023-11-01", score: 60 },
			{ date: "2023-12-01", score: 68 },
			{ date: "2024-01-01", score: 75 },
		],
		detailedAreas: [
			{
				name: "Business Model",
				score: 70,
				status: "Good",
				recommendations: [
					{
						id: "bm1",
						text: "Refine target market segments.",
						completed: false,
					},
					{
						id: "bm2",
						text: "Explore new distribution channels.",
						completed: true,
					},
				],
				notes: "Initial review indicates strong potential, but market penetration needs strategy.",
				color: "text-blue-600",
				bgColor: "bg-blue-50",
			},
			{
				name: "Market Analysis",
				score: 65,
				status: "Moderate",
				recommendations: [
					{
						id: "ma1",
						text: "Conduct detailed competitor analysis.",
						completed: false,
					},
					{
						id: "ma2",
						text: "Validate market size with primary research.",
						completed: false,
					},
				],
				notes: "Secondary data is promising, but primary validation is crucial.",
				color: "text-yellow-600",
				bgColor: "bg-yellow-50",
			},
			{
				name: "Financial Health",
				score: 80,
				status: "Strong",
				recommendations: [
					{
						id: "fh1",
						text: "Optimize cost structure for scalability.",
						completed: false,
					},
				],
				notes: "Healthy financials, but long-term sustainability needs attention.",
				color: "text-green-600",
				bgColor: "bg-green-50",
			},
			{
				name: "Team Capability",
				score: 90,
				status: "Excellent",
				recommendations: [
					{
						id: "tc1",
						text: "Develop a talent retention program.",
						completed: true,
					},
				],
				notes: "Exceptional team with strong leadership.",
				color: "text-green-600",
				bgColor: "bg-green-50",
			},
			{
				name: "Technology Readiness",
				score: 55,
				status: "Needs Improvement",
				recommendations: [
					{
						id: "tr1",
						text: "Invest in R&D for core technology.",
						completed: false,
					},
					{
						id: "tr2",
						text: "Develop a robust MVP.",
						completed: false,
					},
					{
						id: "tr3",
						text: "Seek external technical validation.",
						completed: false,
					},
				],
				notes: "Technology is nascent; significant development required.",
				color: "text-red-600",
				bgColor: "bg-red-50",
			},
			{
				name: "GEDSI Compliance",
				score: 78,
				status: "Good",
				recommendations: [
					{
						id: "gc1",
						text: "Enhance diversity metrics reporting.",
						completed: false,
					},
					{
						id: "gc2",
						text: "Implement inclusive hiring practices.",
						completed: false,
					},
				],
				notes: "Good foundation, but continuous improvement is needed.",
				color: "text-blue-600",
				bgColor: "bg-blue-50",
			},
		],
	},
	{
		id: "VEN-2024-002",
		name: "CleanEnergy Innovations",
		sector: "Clean Energy",
		overallScore: 82,
		status: "Completed",
		completedAreas: 6,
		totalAreas: 6,
		lastUpdated: "1 week ago",
		history: [
			{ date: "2023-10-01", score: 65 },
			{ date: "2023-11-01", score: 70 },
			{ date: "2023-12-01", score: 78 },
			{ date: "2024-01-01", score: 82 },
		],
		detailedAreas: [
			{
				name: "Business Model",
				score: 88,
				status: "Strong",
				recommendations: [
					{
						id: "bm1",
						text: "Expand into new geographical markets.",
						completed: true,
					},
				],
				notes: "Robust business model with clear path to profitability.",
				color: "text-green-600",
				bgColor: "bg-green-50",
			},
			{
				name: "Market Analysis",
				score: 85,
				status: "Strong",
				recommendations: [
					{
						id: "ma1",
						text: "Monitor emerging market trends.",
						completed: true,
					},
				],
				notes: "Comprehensive understanding of market dynamics.",
				color: "text-green-600",
				bgColor: "bg-green-50",
			},
			{
				name: "Financial Health",
				score: 80,
				status: "Strong",
				recommendations: [
					{
						id: "fh1",
						text: "Secure Series B funding.",
						completed: false,
					},
				],
				notes: "Excellent financial standing, ready for next funding round.",
				color: "text-green-600",
				bgColor: "bg-green-50",
			},
			{
				name: "Team Capability",
				score: 92,
				status: "Excellent",
				recommendations: [
					{
						id: "tc1",
						text: "Onboard new engineering talent.",
						completed: true,
					},
				],
				notes: "Highly skilled and experienced team.",
				color: "text-green-600",
				bgColor: "bg-green-50",
			},
			{
				name: "Technology Readiness",
				score: 78,
				status: "Good",
				recommendations: [
					{
						id: "tr1",
						text: "Optimize energy conversion efficiency.",
						completed: false,
					},
				],
				notes: "Mature technology with ongoing R&D.",
				color: "text-blue-600",
				bgColor: "bg-blue-50",
			},
			{
				name: "GEDSI Compliance",
				score: 85,
				status: "Strong",
				recommendations: [
					{
						id: "gc1",
						text: "Publish annual GEDSI report.",
						completed: false,
					},
				],
				notes: "Strong commitment to GEDSI principles.",
				color: "text-green-600",
				bgColor: "bg-green-50",
			},
		],
	},
	{
		id: "VEN-2024-003",
		name: "HealthTech Myanmar",
		sector: "Healthcare",
		overallScore: 68,
		status: "In Progress",
		completedAreas: 3,
		totalAreas: 6,
		lastUpdated: "3 days ago",
		history: [
			{ date: "2023-10-01", score: 40 },
			{ date: "2023-11-01", score: 48 },
			{ date: "2023-12-01", score: 55 },
			{ date: "2024-01-01", score: 68 },
		],
		detailedAreas: [
			{
				name: "Business Model",
				score: 60,
				status: "Moderate",
				recommendations: [
					{
						id: "bm1",
						text: "Define clear revenue streams.",
						completed: false,
					},
					{
						id: "bm2",
						text: "Identify key partnerships.",
						completed: false,
					},
				],
				notes: "Business model needs further refinement and validation.",
				color: "text-yellow-600",
				bgColor: "bg-yellow-50",
			},
			{
				name: "Market Analysis",
				score: 55,
				status: "Needs Improvement",
				recommendations: [
					{
						id: "ma1",
						text: "Conduct comprehensive market research.",
						completed: false,
					},
					{
						id: "ma2",
						text: "Analyze competitive landscape.",
						completed: false,
					},
				],
				notes: "Limited market understanding; more research required.",
				color: "text-red-600",
				bgColor: "bg-red-50",
			},
			{
				name: "Financial Health",
				score: 70,
				status: "Good",
				recommendations: [
					{
						id: "fh1",
						text: "Develop detailed financial projections.",
						completed: false,
					},
				],
				notes: "Basic financials are in place, but projections need work.",
				color: "text-blue-600",
				bgColor: "bg-blue-50",
			},
			{
				name: "Team Capability",
				score: 75,
				status: "Good",
				recommendations: [
					{
						id: "tc1",
						text: "Recruit medical advisory board members.",
						completed: false,
					},
				],
				notes: "Competent team, but needs specialized expertise.",
				color: "text-blue-600",
				bgColor: "bg-blue-50",
			},
			{
				name: "Technology Readiness",
				score: 65,
				status: "Moderate",
				recommendations: [
					{
						id: "tr1",
						text: "Refine product features based on user feedback.",
						completed: false,
					},
					{
						id: "tr2",
						text: "Ensure regulatory compliance for health tech.",
						completed: false,
					},
				],
				notes: "Technology is functional but requires further development for market fit.",
				color: "text-yellow-600",
				bgColor: "bg-yellow-50",
			},
			{
				name: "GEDSI Compliance",
				score: 60,
				status: "Moderate",
				recommendations: [
					{
						id: "gc1",
						text: "Establish GEDSI policy and guidelines.",
						completed: false,
					},
					{
						id: "gc2",
						text: "Conduct diversity training for staff.",
						completed: false,
					},
				],
				notes: "Early stages of GEDSI integration; more structured approach needed.",
				color: "text-yellow-600",
				bgColor: "bg-yellow-50",
			},
		],
	},
];

const industryAverageScores = {
	"Business Model": 75,
	"Market Analysis": 70,
	"Financial Health": 72,
	"Team Capability": 85,
	"Technology Readiness": 60,
	"GEDSI Compliance": 70,
};

const getScoreColor = (score: number) => {
	if (score >= 80) return "text-green-600";
	if (score >= 60) return "text-blue-600";
	if (score >= 40) return "text-yellow-600";
	return "text-red-600";
};

const getStatusIcon = (status: string) => {
	switch (status) {
		case "Completed":
			return <CheckCircle className="h-4 w-4 text-green-600" />;
		case "In Progress":
			return <Clock className="h-4 w-4 text-blue-600" />;
		default:
			return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
	}
};

export default function Page() {
	return (
		<main>
			<h1>Dashboard</h1>
			<ReadinessTracker />
		</main>
	);
}
