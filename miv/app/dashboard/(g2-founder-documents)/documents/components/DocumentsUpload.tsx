"use client";

import type React from "react";
import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DocumentsUploadProps {
  uploading: boolean;
  dragActive: boolean;
  selectedVenture: string;
  error: string | null;
  handleDrag: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  handleFileUpload: (files: FileList | null) => void;
}

export default function DocumentsUpload({
  uploading,
  dragActive,
  selectedVenture,
  error,
  handleDrag,
  handleDrop,
  handleFileUpload,
}: DocumentsUploadProps) {
  return (
    <Card className="rounded-lg border border-slate-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Upload Documents</CardTitle>
        <CardDescription className="text-sm text-slate-500">
          Upload venture documents for review and approval.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div
          className={`rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors ${
            dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-slate-300 hover:border-emerald-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <Upload className="h-8 w-8 text-emerald-600" />
          </div>

          <p className="text-base font-semibold leading-6 text-slate-800">
            {uploading ? "Uploading..." : "Drop files here or click to upload"}
          </p>

          {selectedVenture === "all" && (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
              <p className="text-xs text-amber-700">
                Please select a specific venture from the filters before uploading.
              </p>
            </div>
          )}

          {error && <p className="mb-2 text-sm text-red-600">{error}</p>}

          <p className="mb-4 text-xs text-slate-500">
            Supports PDF, Word, Excel, PowerPoint and image files
          </p>

          <input
            type="file"
            multiple
            className="hidden"
            id="file-upload"
            onChange={(event) => handleFileUpload(event.target.files)}
            accept=".pdf,.xlsx,.xls,.pptx,.ppt,.doc,.docx,.jpg,.jpeg,.png,.gif"
          />

          <Button
            className="h-11 bg-emerald-600 px-6 text-white hover:bg-emerald-700"
            disabled={uploading}
            onClick={() =>
              (document.getElementById("file-upload") as HTMLInputElement)?.click()
            }
          >
            {uploading ? "Uploading..." : "Choose Files"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
