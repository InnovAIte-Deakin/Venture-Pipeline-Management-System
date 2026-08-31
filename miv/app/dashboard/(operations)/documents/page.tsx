"use client";

import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { documentTypes } from "./constants";
import { useDocuments } from "./hooks/useDocuments";
import { useViewport } from "./hooks/use-viewport";
import {
  formatDate,
  getFileIcon,
  getStatusColor,
  getStatusIcon,
} from "./lib/document-utils";
import DocumentsDesktopScreen from "./screens/DocumentsDesktopScreen";
import DocumentsMobileScreen from "./screens/DocumentsMobileScreen";

export default function DocumentsPage() {
  const { isMobile, isReady } = useViewport();
  const documentsState = useDocuments();
  const filteredDocuments = documentsState.documents;

  if (documentsState.loading || !isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
          <p className="text-gray-600">Loading documents...</p>
        </div>
      </div>
    );
  }

  if (documentsState.error && documentsState.documents.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Document Management
          </h1>
          <p className="text-gray-600">
            Upload, organize, and manage venture documents
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-red-500" />
              <p className="mb-4 text-red-600">
                Error: {documentsState.error}
              </p>
              <Button onClick={documentsState.loadInitialData}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const screenProps = {
    uploading: documentsState.uploading,
    analytics: documentsState.analytics,
    dragActive: documentsState.dragActive,
    selectedVenture: documentsState.selectedVenture,
    error: documentsState.error,
    handleDrag: documentsState.handleDrag,
    handleDrop: documentsState.handleDrop,
    handleFileUpload: documentsState.handleFileUpload,
    searchQuery: documentsState.searchQuery,
    setSearchQuery: documentsState.setSearchQuery,
    selectedType: documentsState.selectedType,
    setSelectedType: documentsState.setSelectedType,
    setSelectedVenture: documentsState.setSelectedVenture,
    documentTypes,
    ventures: documentsState.ventures,
    filteredDocuments,
    getFileIcon,
    getStatusIcon,
    getStatusColor,
    formatDate,
    handleDeleteDocument: documentsState.handleDeleteDocument,
  };

  return isMobile ? (
    <DocumentsMobileScreen {...screenProps} />
  ) : (
    <DocumentsDesktopScreen {...screenProps} />
  );
}
