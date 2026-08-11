"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  Award,
  Brain,
  Cpu,
  Droplets,
  Eye,
  Infinity,
  Layers,
  Leaf,
  Lightbulb,
  Plus,
  Recycle,
  RefreshCw,
  Satellite,
  Sparkles,
  Sun,
  Target,
  TreePine,
} from "lucide-react";

import {
  BiodiversityImpactChart,
  CarbonIntelligenceChart,
  DigitalTwinRadarChart,
  ResourceFlowChart,
} from "../charts/sustainability-charts";
import { generateNatureProjects } from "../../lib/sustainability-calculations";
import type { SustainabilityViewProps } from "../../types/sustainability.types";
import { MobileSustainabilityMetrics } from "./sustainability-metrics";

export function SustainabilityMobile(props: SustainabilityViewProps) {
  const {
    ventures,
    regenerativeData,
    digitalTwinData,
    timelineData,
    carbonCredits,
    isDigitalTwinActive,
    onToggleDigitalTwin,
    onSyncData,
  } = props;

  return (
    <div className="space-y-6">
      {/* Innovative Header with Digital Twin Toggle */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent sm:text-3xl">
            Regenerative Impact Dashboard
          </h1>
          <p className="text-muted-foreground">
            AI-powered sustainability tracking with digital twin modeling and
            circular economy metrics
          </p>
        </div>
        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3 lg:flex lg:w-auto">
          <Button
            className="w-full lg:w-auto"
            variant={isDigitalTwinActive ? "default" : "outline"}
            onClick={() => onToggleDigitalTwin()}
          >
            <Cpu className="mr-2 h-4 w-4" />
            {isDigitalTwinActive ? "Digital Twin: ON" : "Activate Digital Twin"}
          </Button>
          <Button
            className="w-full lg:w-auto"
            variant="outline"
            onClick={() => onSyncData()}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync Data
          </Button>
          <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 lg:w-auto">
            <Sparkles className="mr-2 h-4 w-4" />
            AI Insights
          </Button>
        </div>
      </div>

      {/* Regenerative Impact Metrics */}
      <MobileSustainabilityMetrics
        carbonOffset={regenerativeData.carbonOffset}
        circularityIndex={regenerativeData.circularityIndex}
        biodiversityScore={regenerativeData.biodiversityScore}
        carbonCredits={carbonCredits}
        regenerativeVentures={regenerativeData.regenerativeVentures}
        totalVentures={ventures.length}
      />

      {/* AI-Powered Sustainability Intelligence */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-green-600" />
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                AI Carbon Intelligence
              </span>
            </CardTitle>
            <CardDescription>
              Real-time carbon footprint analysis with predictive modeling
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/80 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Portfolio Carbon Intensity</p>
                    <p className="text-sm text-muted-foreground">
                      15% below sector average
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-600 text-white">Excellent</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/80 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Brain className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Predictive Net Zero Date</p>
                    <p className="text-sm text-muted-foreground">
                      Based on current trajectory
                    </p>
                  </div>
                </div>
                <Badge className="bg-blue-600 text-white">2027</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/80 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Target className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Carbon Credit Potential</p>
                    <p className="text-sm text-muted-foreground">
                      Next 12 months projection
                    </p>
                  </div>
                </div>
                <Badge className="bg-purple-600 text-white">
                  +{Math.floor(carbonCredits * 0.3)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-50 via-teal-50 to-green-50 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-cyan-600" />
              <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                Circular Economy Hub
              </span>
            </CardTitle>
            <CardDescription>
              Waste-to-value transformation and resource efficiency
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-white/80 rounded-lg">
                  <div className="text-2xl font-bold text-cyan-600">
                    {regenerativeData.circularityIndex}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Circularity Rate
                  </div>
                </div>
                <div className="text-center p-3 bg-white/80 rounded-lg">
                  <div className="text-2xl font-bold text-teal-600">
                    $
                    {ventures.length === 0
                      ? "0.0M"
                      : (
                          (ventures.reduce(
                            (sum, v) => sum + (v.fundingRaised || 0),
                            0,
                          ) *
                            0.15) /
                          1000000
                        ).toFixed(1) + "M"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Value Recovered
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Material Recovery</span>
                  <span className="font-medium">
                    {ventures.length === 0
                      ? "0%"
                      : Math.min(
                          95,
                          regenerativeData.circularityIndex * 0.8,
                        ).toFixed(0) + "%"}
                  </span>
                </div>
                <Progress
                  value={
                    ventures.length === 0
                      ? 0
                      : Math.min(95, regenerativeData.circularityIndex * 0.8)
                  }
                  className="h-1"
                />

                <div className="flex justify-between text-sm">
                  <span>Energy Recovery</span>
                  <span className="font-medium">
                    {ventures.length === 0
                      ? "0%"
                      : Math.min(
                          90,
                          regenerativeData.circularityIndex * 0.7,
                        ).toFixed(0) + "%"}
                  </span>
                </div>
                <Progress
                  value={
                    ventures.length === 0
                      ? 0
                      : Math.min(90, regenerativeData.circularityIndex * 0.7)
                  }
                  className="h-1"
                />

                <div className="flex justify-between text-sm">
                  <span>Water Recycling</span>
                  <span className="font-medium">
                    {ventures.length === 0
                      ? "0%"
                      : Math.min(
                          95,
                          regenerativeData.circularityIndex * 0.9,
                        ).toFixed(0) + "%"}
                  </span>
                </div>
                <Progress
                  value={
                    ventures.length === 0
                      ? 0
                      : Math.min(95, regenerativeData.circularityIndex * 0.9)
                  }
                  className="h-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Digital Twin & Regenerative Tabs */}
      <Tabs defaultValue="digital-twin" className="space-y-4">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1">
          <TabsTrigger
            className="min-h-10 w-full whitespace-normal text-center"
            value="digital-twin"
          >
            Digital Twin
          </TabsTrigger>
          <TabsTrigger
            className="min-h-10 w-full whitespace-normal text-center"
            value="circular-economy"
          >
            Circular Economy
          </TabsTrigger>
          <TabsTrigger
            className="min-h-10 w-full whitespace-normal text-center"
            value="nature-solutions"
          >
            Nature Solutions
          </TabsTrigger>
          <TabsTrigger
            className="min-h-10 w-full whitespace-normal text-center"
            value="carbon-intelligence"
          >
            Carbon AI
          </TabsTrigger>
          <TabsTrigger
            className="min-h-10 w-full whitespace-normal text-center"
            value="regenerative"
          >
            Regenerative Impact
          </TabsTrigger>
        </TabsList>

        <TabsContent value="digital-twin" className="space-y-4">
          {/* Digital Twin Visualization */}
          <Card className="bg-gradient-to-br from-slate-50 to-gray-100 border-0 shadow-xl">
            <CardHeader>
              <div className="flex flex-col gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="h-5 w-5 text-blue-600" />
                    Portfolio Digital Twin
                  </CardTitle>
                  <CardDescription>
                    Real-time environmental modeling of portfolio ventures
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2 self-start">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="whitespace-nowrap text-sm text-green-600">
                    Live Monitoring
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Digital Twin Radar Chart */}
                <DigitalTwinRadarChart data={digitalTwinData} />

                {/* Digital Twin Controls */}
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 border rounded-lg bg-white/50">
                    <div className="flex items-center space-x-2 mb-2">
                      <Satellite className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Satellite Monitoring</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Real-time environmental data from satellite imagery
                    </p>
                    <Button size="sm" className="mt-2 w-full" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      View Satellite Data
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg bg-white/50">
                    <div className="flex items-center space-x-2 mb-2">
                      <Brain className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">AI Predictions</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Machine learning environmental impact forecasting
                    </p>
                    <Button size="sm" className="mt-2 w-full" variant="outline">
                      <Lightbulb className="h-3 w-3 mr-1" />
                      View Predictions
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg bg-white/50">
                    <div className="flex items-center space-x-2 mb-2">
                      <Layers className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Impact Simulation</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Scenario modeling for sustainability interventions
                    </p>
                    <Button size="sm" className="mt-2 w-full" variant="outline">
                      <Activity className="h-3 w-3 mr-1" />
                      Run Simulation
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="circular-economy" className="space-y-4">
          {/* Circular Economy Dashboard */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Infinity className="h-5 w-5 text-blue-600" />
                  Waste-to-Value Streams
                </CardTitle>
                <CardDescription>
                  Tracking circular economy transformation across portfolio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ventures.map((venture) => {
                    const ventureMetrics = digitalTwinData.find(
                      (d) => d.name === venture.name,
                    );
                    const valueRecovered = Math.floor(
                      ((venture.fundingRaised || 100000) * 0.15) / 1000,
                    ); // 15% of funding as value recovered
                    const founderTypes = (() => {
                      try {
                        return JSON.parse(venture.founderTypes || "[]");
                      } catch {
                        return [];
                      }
                    })();
                    const isInclusive = founderTypes.some(
                      (type: string) =>
                        type.includes("disability") ||
                        type.includes("women") ||
                        type.includes("inclusive"),
                    );

                    return (
                      <div
                        key={venture.id}
                        className="p-3 border rounded-lg bg-white/70"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="font-medium">{venture.name}</span>
                            {venture.inclusionFocus && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {venture.inclusionFocus}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Badge variant="outline">{venture.sector}</Badge>
                            {isInclusive && (
                              <Badge
                                variant="secondary"
                                className="bg-purple-100 text-purple-800"
                              >
                                Inclusive
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="p-2 bg-blue-50 rounded">
                            <div className="text-sm font-semibold text-blue-600">
                              {ventureMetrics?.circularityScore || 65}%
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Circularity
                            </div>
                          </div>
                          <div className="p-2 bg-green-50 rounded">
                            <div className="text-sm font-semibold text-green-600">
                              ${valueRecovered}K
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Value Recovered
                            </div>
                          </div>
                          <div className="p-2 bg-purple-50 rounded">
                            <div className="text-sm font-semibold text-purple-600">
                              {ventureMetrics?.energyEfficiency || 70}%
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Efficiency
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          Team: {venture.teamSize || "N/A"} • Founded:{" "}
                          {venture.foundingYear || "N/A"} • Stage:{" "}
                          {venture.stage}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Recycle className="h-5 w-5 text-green-600" />
                  Resource Flow Analysis
                </CardTitle>
                <CardDescription>
                  Material and energy flow optimization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResourceFlowChart data={timelineData} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="nature-solutions" className="space-y-4">
          {/* Nature-Based Solutions */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TreePine className="h-5 w-5 text-green-600" />
                Nature-Based Solutions Portfolio
              </CardTitle>
              <CardDescription>
                Ecosystem restoration and biodiversity impact tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-medium">Active Nature Projects</h4>
                  <div className="space-y-3">
                    {ventures.length === 0 ? (
                      <div className="text-center py-8">
                        <TreePine className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">
                          No Nature Projects
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Add ventures with environmental focus to track
                          nature-based solutions.
                        </p>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Project
                        </Button>
                      </div>
                    ) : (
                      generateNatureProjects(ventures).map((project, index) => (
                        <div
                          key={index}
                          className={`p-3 border-l-4 ${project.borderColor} ${project.bgColor}`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className={`font-medium ${project.textColor}`}>
                                {project.name}
                              </p>
                              <p className={`text-sm ${project.descColor}`}>
                                {project.description}
                              </p>
                            </div>
                            <Badge
                              className={`${project.badgeColor} text-white`}
                            >
                              {project.status}
                            </Badge>
                          </div>
                          <p className={`text-xs ${project.metricColor} mt-1`}>
                            {project.metrics}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Biodiversity Impact</h4>
                  <BiodiversityImpactChart
                    ventures={ventures}
                    carbonOffset={regenerativeData.carbonOffset}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="carbon-intelligence" className="space-y-4">
          {/* AI Carbon Intelligence */}
          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-indigo-600" />
                Carbon Intelligence Center
              </CardTitle>
              <CardDescription>
                AI-powered carbon management and optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 bg-white/80 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {Math.floor(
                        ventures.reduce(
                          (sum, v) => sum + (v.teamSize || 5) * 2.5,
                          0,
                        ),
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      tCO2e Current
                    </div>
                    <div className="text-xs text-red-600">
                      Portfolio Footprint
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white/80 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {regenerativeData.carbonOffset}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      tCO2e Offset
                    </div>
                    <div className="text-xs text-green-600">
                      Nature-based Solutions
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white/80 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {carbonCredits}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Credits Earned
                    </div>
                    <div className="text-xs text-blue-600">
                      Verified & Projected
                    </div>
                  </div>
                </div>

                <CarbonIntelligenceChart data={timelineData} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regenerative" className="space-y-4">
          {/* Regenerative Impact */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-emerald-600" />
                  Regenerative Portfolio
                </CardTitle>
                <CardDescription>
                  Portfolio transformation toward regenerative practices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Regenerative Ventures
                    </span>
                    <span className="text-2xl font-semibold">
                      {regenerativeData.regenerativeVentures}/{ventures.length}
                    </span>
                  </div>
                  <Progress
                    value={
                      (regenerativeData.regenerativeVentures /
                        Math.max(ventures.length, 1)) *
                      100
                    }
                    className="h-2"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white/80 rounded">
                      <div className="text-lg font-semibold text-green-600">
                        {regenerativeData.natureBasedSolutions}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Nature-Based Solutions
                      </div>
                    </div>
                    <div className="text-center p-3 bg-white/80 rounded">
                      <div className="text-lg font-semibold text-blue-600">
                        {regenerativeData.biodiversityScore}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Biodiversity Index
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-600" />
                  Impact Achievements
                </CardTitle>
                <CardDescription>
                  Measurable environmental and social outcomes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/80 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <TreePine className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Carbon Sequestration</span>
                    </div>
                    <Badge className="bg-green-600 text-white">
                      {regenerativeData.carbonOffset} tCO2e
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/80 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Droplets className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Water Conservation</span>
                    </div>
                    <Badge className="bg-blue-600 text-white">
                      {(
                        ventures.reduce(
                          (sum, v) => sum + (v.teamSize || 5) * 150,
                          0,
                        ) / 1000
                      ).toFixed(1)}
                      M Liters
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/80 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Recycle className="h-5 w-5 text-purple-600" />
                      <span className="font-medium">Waste Diverted</span>
                    </div>
                    <Badge className="bg-purple-600 text-white">
                      {Math.floor(
                        ventures.reduce(
                          (sum, v) => sum + (v.teamSize || 5) * 5.2,
                          0,
                        ),
                      )}{" "}
                      Tons
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/80 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Sun className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium">Renewable Energy</span>
                    </div>
                    <Badge className="bg-yellow-600 text-white">
                      {Math.floor(
                        (regenerativeData.natureBasedSolutions /
                          Math.max(ventures.length, 1)) *
                          100,
                      )}
                      % Portfolio
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
