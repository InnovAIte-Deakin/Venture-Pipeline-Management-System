"use client";

import DocumentsUpload from "../components/DocumentsUpload";
import DocumentsFilters from "../components/DocumentsFilters";
import MobileDocumentCard from "../components/MobileDocumentCard";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface DocumentsMobileScreenProps {
  uploading: boolean;
  dragActive: boolean;
  selectedVenture: string;
  error: string | null;

  handleDrag: any;
  handleDrop: any;
  handleFileUpload: any;

  searchQuery: string;
  setSearchQuery: any;

  selectedType: string;
  setSelectedType: any;

  setSelectedVenture: any;

  documentTypes: any[];
  ventures: any[];

  filteredDocuments: any[];

  getFileIcon: any;
  getStatusIcon: any;
  getStatusColor: any;

  formatDate: any;

  handleDeleteDocument: any;
}

export default function DocumentsMobileScreen(
  props: DocumentsMobileScreenProps
) {
  return (
    <div className="min-h-screen bg-slate-50">

      <div className="px-6 py-8 space-y-8">

        {/* Page Header */}
        <div className="pt-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Documents for Review
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Review submitted venture documents before making a decision.
          </p>
        </div>
        <div>
  <h2 className="text-lg font-semibold text-slate-900">
    Upload Documents
  </h2>

  <p className="text-sm text-slate-500 mt-1">
    Upload venture files for review and approval.
  </p>
</div>

        {/* Upload */}
        <DocumentsUpload
          uploading={props.uploading}
          dragActive={props.dragActive}
          selectedVenture={props.selectedVenture}
          error={props.error}
          handleDrag={props.handleDrag}
          handleDrop={props.handleDrop}
          handleFileUpload={props.handleFileUpload}
        />
        <div>
  <h2 className="text-lg font-semibold text-slate-900">
    Search & Filters
  </h2>

  <p className="text-sm text-slate-500 mt-1">
    Find documents by name, type or venture.
  </p>
</div>

        {/* Filters */}
        <DocumentsFilters
          searchQuery={props.searchQuery}
          setSearchQuery={props.setSearchQuery}
          selectedType={props.selectedType}
          setSelectedType={props.setSelectedType}
          selectedVenture={props.selectedVenture}
          setSelectedVenture={props.setSelectedVenture}
          documentTypes={props.documentTypes}
          ventures={props.ventures}
        />
        <div className="flex items-center justify-between">

<h2 className="text-lg font-semibold text-slate-900">
  Documents
</h2>

<span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
  {props.filteredDocuments.length}
</span>

</div>

        {/* Documents */}
        {props.filteredDocuments.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-8 text-center">

<div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>

            <h2 className="mt-2 text-xl font-semibold">
              No Documents Yet
            </h2>

            <p className="mt-3 leading-6 text-sm text-slate-500">
              Upload your first venture document above to begin reviewing
              submissions.
            </p>
            <Button className="mt-6 rounded-xl bg-green-600 hover:bg-green-700">
    Choose Files
</Button>

          </div>
        ) : (
          <div className="space-y-4">
            {props.filteredDocuments.map((document) => (
              <MobileDocumentCard
                key={document.id}
                title={document.name}
                date={props.formatDate(document.uploadedAt)}
                status={document.status}
                statusColor={props.getStatusColor(document.status)}
              />
            ))}
          </div>
        )}

      </div>

    </div>
  );
}