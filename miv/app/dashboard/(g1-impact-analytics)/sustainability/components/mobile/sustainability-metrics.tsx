import type { LucideIcon } from "lucide-react";
import { Award, Infinity, Satellite, TreePine, Waves } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SustainabilityMetricsProps {
  carbonOffset: number;
  circularityIndex: number;
  biodiversityScore: number;
  carbonCredits: number;
  regenerativeVentures: number;
  totalVentures: number;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  cardClassName: string;
  titleClassName: string;
  valueClassName: string;
  descriptionClassName: string;
  iconClassName: string;
}

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  cardClassName,
  titleClassName,
  valueClassName,
  descriptionClassName,
  iconClassName,
}: MetricCardProps) {
  return (
    <Card className={`border-l-4 ${cardClassName}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={`text-sm font-medium ${titleClassName}`}>
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${iconClassName}`} />
      </CardHeader>

      <CardContent>
        <div className={`text-2xl font-bold ${valueClassName}`}>{value}</div>
        <p className={`text-xs ${descriptionClassName}`}>{description}</p>
      </CardContent>
    </Card>
  );
}

export function MobileSustainabilityMetrics({
  carbonOffset,
  circularityIndex,
  biodiversityScore,
  carbonCredits,
  regenerativeVentures,
  totalVentures,
}: SustainabilityMetricsProps) {
  return (
    <section
      aria-label="Regenerative impact metrics"
      className="grid grid-cols-1 gap-4"
    >
      <MetricCard
        title="Carbon Offset"
        value={carbonOffset}
        description="tCO2e sequestered through portfolio"
        icon={TreePine}
        cardClassName="border-l-green-500 bg-gradient-to-br from-green-50 to-emerald-50"
        titleClassName="text-green-800"
        valueClassName="text-green-700"
        descriptionClassName="text-green-600"
        iconClassName="text-green-600"
      />

      <MetricCard
        title="Circularity Index"
        value={`${circularityIndex}%`}
        description="Waste-to-value conversion rate"
        icon={Infinity}
        cardClassName="border-l-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50"
        titleClassName="text-blue-800"
        valueClassName="text-blue-700"
        descriptionClassName="text-blue-600"
        iconClassName="text-blue-600"
      />

      <MetricCard
        title="Biodiversity Score"
        value={biodiversityScore}
        description="Nature-positive impact index"
        icon={Waves}
        cardClassName="border-l-purple-500 bg-gradient-to-br from-purple-50 to-violet-50"
        titleClassName="text-purple-800"
        valueClassName="text-purple-700"
        descriptionClassName="text-purple-600"
        iconClassName="text-purple-600"
      />

      <MetricCard
        title="Carbon Credits"
        value={carbonCredits}
        description="Verified carbon credits earned"
        icon={Award}
        cardClassName="border-l-orange-500 bg-gradient-to-br from-orange-50 to-amber-50"
        titleClassName="text-orange-800"
        valueClassName="text-orange-700"
        descriptionClassName="text-orange-600"
        iconClassName="text-orange-600"
      />

      <MetricCard
        title="Regenerative Ventures"
        value={`${regenerativeVentures}/${totalVentures}`}
        description="Portfolio transformation rate"
        icon={Satellite}
        cardClassName="border-l-teal-500 bg-gradient-to-br from-teal-50 to-cyan-50"
        titleClassName="text-teal-800"
        valueClassName="text-teal-700"
        descriptionClassName="text-teal-600"
        iconClassName="text-teal-600"
      />
    </section>
  );
}
