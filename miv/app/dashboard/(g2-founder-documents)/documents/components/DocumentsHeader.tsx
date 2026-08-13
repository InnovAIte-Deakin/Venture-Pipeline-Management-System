'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText } from "lucide-react";

interface DocumentsHeaderProps {
  uploading: boolean;
  analytics: any;
}

export default function DocumentsHeader({
  uploading,
  analytics,
}: DocumentsHeaderProps) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

      {/* Left Side */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          Document Management
        </h1>

        <p className="mt-2 text-slate-500 text-base">
          Upload, organize and manage venture documents.
        </p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">

        <Button
          onClick={() =>
            (document.getElementById("file-upload") as HTMLInputElement)?.click()
          }
          disabled={uploading}
          className="rounded-xl bg-slate-900 hover:bg-slate-800 px-5"
        >
          <Upload className="mr-2 h-4 w-4" />
          {uploading ? "Uploading..." : "Upload Documents"}
        </Button>

        {analytics && (
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Total Documents
              </p>

              <p className="text-lg font-semibold text-slate-900">
                {analytics.summary.totalDocuments}
              </p>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}