"use client";

import type React from "react";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  File,
  FileText,
} from "lucide-react";

export function getFileIcon(type: string): React.ReactNode {
  const icons: Record<string, React.ReactNode> = {
    BUSINESS_PLAN: <FileText className="h-4 w-4" />,
    FINANCIAL_STATEMENTS: <FileText className="h-4 w-4" />,
    PITCH_DECK: <FileText className="h-4 w-4" />,
    LEGAL_DOCUMENTS: <FileText className="h-4 w-4" />,
    MARKET_RESEARCH: <FileText className="h-4 w-4" />,
    TEAM_PROFILE: <FileText className="h-4 w-4" />,
    OTHER: <File className="h-4 w-4" />,
  };

  return icons[type] || <File className="h-4 w-4" />;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    approved: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    review: "bg-blue-100 text-blue-800",
    rejected: "bg-red-100 text-red-800",
    needs_update: "bg-orange-100 text-orange-800",
  };

  return colors[status] || "bg-gray-100 text-gray-800";
}

export function getStatusIcon(status: string): React.ReactNode {
  const icons: Record<string, React.ReactNode> = {
    approved: <CheckCircle className="h-4 w-4" />,
    pending: <Clock className="h-4 w-4" />,
    review: <AlertTriangle className="h-4 w-4" />,
    rejected: <AlertTriangle className="h-4 w-4" />,
    needs_update: <AlertTriangle className="h-4 w-4" />,
  };

  return icons[status] || <Clock className="h-4 w-4" />;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
