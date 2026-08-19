"use client";

import type React from "react";
import { useCallback, useEffect, useState } from "react";

import type {
  DocumentRecord,
  DocumentsAnalytics,
  VentureOption,
} from "../types";

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
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (selectedType !== "all") params.append("type", selectedType);
      if (selectedVenture !== "all") {
        params.append("ventureId", selectedVenture);
      }
      params.append("limit", "50");
      params.append("sortBy", "uploadedAt");
      params.append("sortOrder", "desc");

      const response = await fetch(`/api/documents?${params}`);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch documents: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();
      setDocuments(data.documents || []);
      return data;
    } catch (error) {
      console.error("Error fetching documents:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch documents");
      setDocuments([]);
      return { documents: [] };
    }
  }, [searchQuery, selectedType, selectedVenture]);

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [venturesResponse, , analyticsResponse] = await Promise.all([
        fetch("/api/ventures?limit=100"),
        fetchDocuments(),
        fetch("/api/documents/analytics?period=30"),
      ]);

      if (venturesResponse.ok) {
        const venturesData = await venturesResponse.json();
        setVentures([
          { value: "all", label: "All Ventures" },
          ...venturesData.ventures.map((venture: { id: string; name: string }) => ({
            value: venture.id,
            label: venture.name,
          })),
        ]);
      }

      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        setAnalytics(analyticsData);
      }
    } catch (error) {
      console.error("Error loading initial data:", error);
      setError(error instanceof Error ? error.message : "Failed to load data");
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
      const formData = new FormData();

      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });

      formData.append("ventureId", selectedVenture);
      formData.append("type", selectedType !== "all" ? selectedType : "OTHER");

      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const result = await response.json();
      await fetchDocuments();

      if (result.errors?.length > 0) {
        setError(
          `Some files failed to upload: ${result.errors
            .map((uploadError: { error: string }) => uploadError.error)
            .join(", ")}`,
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
      const response = await fetch(`/api/documents/${documentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Delete failed");
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
