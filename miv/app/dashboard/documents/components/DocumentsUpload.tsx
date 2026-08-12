'use client';
import React from "react";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { Upload } from "lucide-react";

interface DocumentsUploadProps {
  uploading: boolean;
  dragActive: boolean;
  selectedVenture: string;
  error: string | null;
  handleDrag: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
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
    <>
      <Card className="rounded-2xl border border-slate-200 shadow-sm">
      <CardHeader className="pb-3">
      <CardTitle className="text-lg font-semibold">
    Upload Documents
</CardTitle>
<CardDescription className="text-sm text-slate-500">
    Upload venture documents for review and approval.
</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-2xl py-8 px-6 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-slate-300 hover:border-emerald-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
  <Upload className="h-8 w-8 text-emerald-600" />
</div>
                <p className="text-base
font-semibold
leading-6 font-semibold text-slate-800">
                  {uploading ? 'Uploading...' : 'Drop files here or click to upload'}
                </p>
                {selectedVenture === 'all' && (
                  <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 mt-4">
                  <p className="text-xs text-amber-700">
                    Please select a specific venture from the filters below before uploading.
                  </p>
                </div>
                )}
                {error && (
                  <p className="text-sm text-red-600 mb-2">
                    {error}
                  </p>
                )}
                <p className="text-xs text-slate-500 mb-4">
                Supports PDF, Word, Excel, PowerPoint and image files
                </p>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  id="file-upload"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  accept=".pdf,.xlsx,.xls,.pptx,.ppt,.doc,.docx,.jpg,.jpeg,.png,.gif"
                />
               <Button
               className="h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-6"
  
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
    </>
  );
}