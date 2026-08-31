export interface Venture {
  id: string;
  name: string;
  sector: string;
  location: string;
  stage: string;
  status: string;
  fundingRaised: number | null;
  lastValuation: number | null;
  revenue: number | null;
  teamSize: number | null;
  totalBeneficiaries?: number | null;
  foundingYear: number | null;
  inclusionFocus: string | null;
  founderTypes: string;
  gedsiMetrics: GEDSIMetric[];
  createdAt: string;
  updatedAt: string;
  _count: {
    documents: number;
    activities: number;
    capitalActivities: number;
  };
}

export interface GEDSIMetric {
  id: string;
  ventureId: string;
  metricCode: string;
  metricName: string;
  category: "GENDER" | "DISABILITY" | "SOCIAL_INCLUSION" | "CROSS_CUTTING";
  currentValue: number;
  targetValue: number;
  unit: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "VERIFIED" | "COMPLETED";
  verificationDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RegenerativeData {
  carbonOffset: number;
  biodiversityScore: number;
  circularityIndex: number;
  natureBasedSolutions: number;
  regenerativeVentures: number;
}

export interface DigitalTwinDatum {
  name: string;
  sector: string;
  carbonFootprint: number;
  energyEfficiency: number;
  waterUsage: number;
  wasteReduction: number;
  biodiversityImpact: number;
  circularityScore: number;
}

export interface TimelineDatum {
  month: string;
  carbonOffset: number;
  circularityIndex: number;
  biodiversityScore: number;
}

export interface SustainabilityViewProps {
  ventures: Venture[];
  regenerativeData: RegenerativeData;
  digitalTwinData: DigitalTwinDatum[];
  timelineData: TimelineDatum[];
  carbonCredits: number;
  isDigitalTwinActive: boolean;
  onToggleDigitalTwin: () => void;
  onSyncData: () => void;
}
