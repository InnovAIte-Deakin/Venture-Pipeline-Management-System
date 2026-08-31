export interface DocumentRecord {
  id: string;
  name: string;
  type: string;
  size?: number | null;
  sizeFormatted: string;
  ventureId: string;
  venture: {
    id: string;
    name: string;
    sector: string;
    stage: string;
    createdBy?: {
      id: string;
      name: string | null;
      email: string;
    } | null;
    assignedTo?: {
      id: string;
      name: string | null;
      email: string;
    } | null;
  };
  uploadedBy: string;
  uploadedAt: string;
  status: string;
  url: string;
  mimeType?: string | null;
  description?: string;
  tags: string[];
}

export interface DocumentTypeOption {
  value: string;
  label: string;
}

export interface VentureOption {
  value: string;
  label: string;
}

export interface DocumentsAnalytics {
  summary: {
    totalDocuments: number;
    recentDocuments?: number;
    totalStorageFormatted?: string;
    growthRate?: number;
  };
}
