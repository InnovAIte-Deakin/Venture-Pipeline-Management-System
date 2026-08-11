"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DigitalTwinData {
  name: string;
  carbonFootprint: number;
  energyEfficiency: number;
  circularityScore: number;
}

interface TimelineData {
  month: string;
  circularityIndex: number;
  carbonOffset: number;
}

interface VentureData {
  sector: string;
  inclusionFocus: string | null;
}

interface DigitalTwinRadarChartProps {
  data: DigitalTwinData[];
}

interface TimelineChartProps {
  data: TimelineData[];
}

interface BiodiversityImpactChartProps {
  ventures: VentureData[];
  carbonOffset: number;
}

export function DigitalTwinRadarChart({ data }: DigitalTwinRadarChartProps) {
  return (
    <div className="h-[280px] w-full sm:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="name" />
          <PolarRadiusAxis angle={90} domain={[0, 100]} />
          <Radar
            name="Carbon Footprint"
            dataKey="carbonFootprint"
            stroke="#ef4444"
            fill="#ef4444"
            fillOpacity={0.3}
          />
          <Radar
            name="Energy Efficiency"
            dataKey="energyEfficiency"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.3}
          />
          <Radar
            name="Circularity"
            dataKey="circularityScore"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.3}
          />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ResourceFlowChart({ data }: TimelineChartProps) {
  return (
    <div className="h-[260px] w-full sm:h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: -20, right: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="circularityIndex"
            stroke="#06b6d4"
            fill="#06b6d4"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BiodiversityImpactChart({
  ventures,
  carbonOffset,
}: BiodiversityImpactChartProps) {
  const data = [
    {
      category: "Species Protected",
      value:
        ventures.filter(
          (venture) =>
            venture.sector === "Environmental" ||
            venture.sector === "Agriculture",
        ).length * 5,
    },
    {
      category: "Habitats Restored",
      value: ventures.filter(
        (venture) =>
          venture.sector === "CleanTech" || venture.sector === "Environmental",
      ).length,
    },
    {
      category: "Ecosystems Enhanced",
      value: ventures.filter((venture) =>
        venture.inclusionFocus?.includes("environmental"),
      ).length,
    },
    { category: "Carbon Sequestered", value: carbonOffset },
  ];

  return (
    <div className="h-[330px] w-full sm:h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 20, left: -20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="category"
            angle={-55}
            textAnchor="end"
            height={120}
            interval={0}
            tick={{ fontSize: 11 }}
          />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CarbonIntelligenceChart({ data }: TimelineChartProps) {
  return (
    <div className="h-[260px] w-full sm:h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: -20, right: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="carbonOffset"
            stroke="#10b981"
            strokeWidth={3}
            name="Carbon Offset"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
