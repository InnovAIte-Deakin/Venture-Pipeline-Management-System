"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Eye } from "lucide-react";

interface MobileDocumentCardProps {
  title: string;
  date: string;
  status: string;
  statusColor: string;
  onReview?: () => void;
}

export default function MobileDocumentCard({
  title,
  date,
  status,
  statusColor,
  onReview,
}: MobileDocumentCardProps) {
  return (
    <Card className="rounded-3xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">

          {/* File Icon */}
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>

          {/* Document Details */}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-900">
              {title}
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              {date}
            </p>

            <span
              className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusColor}`}
            >
              {status}
            </span>
          </div>

        </div>

        {/* Bottom Action */}
        <div className="mt-5 flex justify-end border-t border-slate-100 pt-4">
          <Button
            size="sm"
            variant="outline"
            className="rounded-xl"
            onClick={onReview}
          >
            <Eye className="mr-2 h-4 w-4" />
            Review
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}