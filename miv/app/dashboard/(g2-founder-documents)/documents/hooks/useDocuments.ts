'use client';

import { useState, useEffect } from "react";

export function useDocuments() {

  const [documents, setDocuments] = useState<any[]>([]);
  const [ventures, setVentures] = useState([
    { value: "all", label: "All Ventures" }
  ]);

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedVenture, setSelectedVenture] = useState("all");
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState(null);

useEffect(() => {
    loadInitialData()
  }, [])
  
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchDocuments()
    }, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery, selectedType, selectedVenture]);
  

  const loadInitialData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Load ventures and documents in parallel
      const [venturesResponse, documentsResponse, analyticsResponse] = await Promise.all([
        fetch('/api/ventures?limit=100'),
        fetchDocuments(),
        fetch('/api/documents/analytics?period=30')
      ])
      
      // Load ventures for dropdown
      if (venturesResponse.ok) {
        const venturesData = await venturesResponse.json()
        const ventureOptions = [
          { value: "all", label: "All Ventures" },
          ...venturesData.ventures.map((v: any) => ({
            value: v.id,
            label: v.name
          }))
        ]
        setVentures(ventureOptions)
      }
      
      // Load analytics
      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json()
        setAnalytics(analyticsData)
      }
      
    } catch (error) {
      console.error('Error loading initial data:', error)
      setError(error instanceof Error ? error.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  

  const fetchDocuments = async () => {
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (selectedType !== 'all') params.append('type', selectedType)
      if (selectedVenture !== 'all') params.append('ventureId', selectedVenture)
      params.append('limit', '50')
      params.append('sortBy', 'uploadedAt')
      params.append('sortOrder', 'desc')
      
      const response = await fetch(`/api/documents?${params}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch documents: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      setDocuments(data.documents || [])
      
      console.log(`✅ Successfully loaded ${data.documents?.length || 0} documents`)
      return data
    } catch (error) {
      console.error('❌ Error fetching documents:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch documents')
      setDocuments([])
      return { documents: [] }
    }
  }

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    
    if (selectedVenture === 'all') {
      setError('Please select a specific venture before uploading documents')
      return
    }

    setUploading(true)
    setError(null)
    
    try {
      const formData = new FormData()
      
      // Add files to form data
      Array.from(files).forEach(file => {
        formData.append('files', file)
      })
      
      formData.append('ventureId', selectedVenture)
      formData.append('type', selectedType !== 'all' ? selectedType : 'OTHER')
      
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }
      
      const result = await response.json()
      
      // Refresh documents list
      await fetchDocuments()
      
      console.log(`✅ Successfully uploaded ${result.success?.length || 0} documents`)
      
      if (result.errors?.length > 0) {
        setError(`Some files failed to upload: ${result.errors.map((e: any) => e.error).join(', ')}`)
      }
      
    } catch (error) {
      console.error('Error uploading files:', error)
      setError(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      return
    }
    
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Delete failed')
      }
      
      // Refresh documents list
      await fetchDocuments()
      
      console.log('✅ Document deleted successfully')
    } catch (error) {
      console.error('Error deleting document:', error)
      setError(error instanceof Error ? error.message : 'Delete failed')
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files)
    }
  }
  

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

  handleFileUpload,
  handleDeleteDocument,
  handleDrag,
  handleDrop,
  }};