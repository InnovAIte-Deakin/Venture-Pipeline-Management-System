"use client";

import type React from "react";
import { useCallback, useEffect, useState } from "react";

import type {
  DocumentRecord,
  DocumentsAnalytics,
  VentureOption,
} from "../types/types";

import { documentTypes } from "../types/constants";

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const units = ["Bytes", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${parseFloat(
    (bytes / Math.pow(1024, index)).toFixed(1),
  )} ${units[index]}`;
}

export function useDocuments() {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [ventures, setVentures] = useState<VentureOption[]>([
    { value: "all", label: "All Ventures" },
  ]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedVenture, setSelectedVenture] = useState("all");
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<DocumentsAnalytics | null>(null);

  const fetchDocuments = useCallback(async () => {
    try {
      setError(null);

      const response = await fetch("/backend/api/documents", {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch documents");
      }

      const allDocuments = (data.documents || []).map(
        (doc: any): DocumentRecord => {
          const venture =
            typeof doc.venture === "object" ? doc.venture : null;

          const ventureId = String(
            venture?.id || doc.venture || "",
          );

          return {
            id: String(doc.id),
            name: doc.filename,
            type: doc.documentType,
            size: doc.filesize,
            sizeFormatted: formatFileSize(doc.filesize || 0),
            ventureId,
            venture: {
              id: ventureId,
              name: venture?.name || "No venture",
              sector: venture?.sector || "",
              stage: venture?.stage || "",
            },
            uploadedBy:
              typeof doc.uploadedBy === "object"
                ? `${doc.uploadedBy?.firstName || ""} ${
                    doc.uploadedBy?.lastName || ""
                  }`.trim() ||
                  doc.uploadedBy?.email ||
                  "Unknown"
                : "Unknown",
            uploadedAt: doc.createdAt,
            status: doc.status,
            url:
              doc.url && doc.url.startsWith("/api/")
                ? `/backend${doc.url}`
                : doc.url || "",
            mimeType: doc.mimeType,
            description: doc.notes,
            tags: [],
          };
        },
      );

      const normaliseType = (value: string) =>
        value.toLowerCase().replace(/[^a-z0-9]/g, "");

      const filteredDocuments = allDocuments.filter(
        (document: DocumentRecord) => {
          const search = searchQuery.toLowerCase();

          const matchesSearch =
            !search ||
            document.name.toLowerCase().includes(search) ||
            document.venture.name.toLowerCase().includes(search) ||
            document.uploadedBy.toLowerCase().includes(search);

          const matchesType =
            selectedType === "all" ||
            normaliseType(document.type) === normaliseType(selectedType);

          const matchesVenture =
            selectedVenture === "all" ||
            document.ventureId === selectedVenture;

          return matchesSearch && matchesType && matchesVenture;
        },
      );

      const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
      const recentDocuments = allDocuments.filter(
        (document: DocumentRecord) =>
          new Date(document.uploadedAt).getTime() >= thirtyDaysAgo,
      ).length;

      setDocuments(filteredDocuments);
      setAnalytics({
        summary: {
          totalDocuments: allDocuments.length,
          recentDocuments,
        },
      });

      return { ...data, documents: filteredDocuments };
    } catch (error) {
      console.error("Error fetching documents:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch documents",
      );
      setDocuments([]);
      return { documents: [] };
    }
  }, [searchQuery, selectedType, selectedVenture]);

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [venturesResponse] = await Promise.all([
        fetch("/backend/api/ventures?limit=100", {
          credentials: "include",
        }),
        fetchDocuments(),
      ]);

      if (venturesResponse.ok) {
        const venturesData = await venturesResponse.json();

        setVentures([
          { value: "all", label: "All Ventures" },
          ...(venturesData.ventures || venturesData.docs || []).map(
            (venture: { id: string; name: string }) => ({
              value: String(venture.id),
              label: venture.name,
            }),
          ),
        ]);
      }
    } catch (error) {
      console.error("Error loading initial data:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load data",
      );
    } finally {
      setLoading(false);
    }
  }, [fetchDocuments]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    const debounceTimer = window.setTimeout(() => {
      fetchDocuments();
    }, 300);

    return () => window.clearTimeout(debounceTimer);
  }, [fetchDocuments]);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    if (selectedVenture === "all") {
      setError("Please select a specific venture before uploading documents");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const uploadErrors: string[] = [];

      for (const file of Array.from(files)) {
        const formData = new FormData();

        const documentType =
          documentTypes.find(
            (option) => option.value === selectedType,
          )?.label || "Other";

        formData.append("file", file);
        formData.append("ventureId", selectedVenture);
        formData.append("documentType", documentType);

        const response = await fetch("/backend/api/documents", {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          uploadErrors.push(
            result.message ||
              result.error ||
              `Failed to upload ${file.name}`,
          );
        }
      }

      await fetchDocuments();

      if (uploadErrors.length > 0) {
        setError(
          `Some files failed to upload: ${uploadErrors.join(", ")}`,
        );
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      setError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm("Are you sure you want to delete this document? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(
        `/backend/api/documents?id=${encodeURIComponent(documentId)}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || result.error || "Delete failed",
        );
      }

      await fetchDocuments();
    } catch (error) {
      console.error("Error deleting document:", error);
      setError(error instanceof Error ? error.message : "Delete failed");
    }
  };

  const handleDrag = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(event.type === "dragenter" || event.type === "dragover");
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);

    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      handleFileUpload(event.dataTransfer.files);
    }
  };

  return {
    documents,
    ventures,
    loading,
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    selectedVenture,
    setSelectedVenture,
    uploading,
    setUploading,
    dragActive,
    setDragActive,
    error,
    setError,
    analytics,
    loadInitialData,
    handleFileUpload,
    handleDeleteDocument,
    handleDrag,
    handleDrop,
  };
}
