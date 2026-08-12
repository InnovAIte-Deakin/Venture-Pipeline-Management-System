"use client"
import DocumentsHeader from "./components/DocumentsHeader";
import DocumentsUpload from "./components/DocumentsUpload";
import DocumentsFilters from "./components/DocumentsFilters";
import DocumentsTable from "./components/DocumentsTable";
import DocumentsDesktopScreen from "./screens/DocumentsDesktopScreen";
import DocumentsMobileScreen from "./screens/DocumentsMobileScreen";
import { useDocuments } from "./hooks/useDocuments";
import { useMediaQuery } from "react-responsive";
import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  FileText,
  Upload,
  Download,
  Eye,
  Trash2,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Calendar,
  User,
  Building2,
  File,
  Image,
  FileVideo,
  FileAudio,
  Archive,
  CheckCircle,
  AlertTriangle,
  Clock
} from "lucide-react"

interface Document {
  id: string
  name: string
  type: string
  size?: number
  sizeFormatted: string
  ventureId: string
  venture: {
    id: string
    name: string
    sector: string
    stage: string
    createdBy?: {
      id: string
      name: string
      email: string
    } | null
    assignedTo?: {
      id: string
      name: string
      email: string
    } | null
  }
  uploadedBy: string
  uploadedAt: string
  status: string
  url: string
  mimeType?: string
  description?: string
  tags: string[]
}

const documentTypes = [
  { value: "BUSINESS_PLAN", label: "Business Plan" },
  { value: "FINANCIAL_STATEMENTS", label: "Financial Statements" },
  { value: "PITCH_DECK", label: "Pitch Deck" },
  { value: "LEGAL_DOCUMENTS", label: "Legal Documents" },
  { value: "MARKET_RESEARCH", label: "Market Research" },
  { value: "TEAM_PROFILE", label: "Team Profile" },
  { value: "OTHER", label: "Other" }
]

// Ventures will be loaded from API

export default function DocumentsPage() {
  const {
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
    dragActive,
    error,
    analytics,
    handleFileUpload,
    handleDeleteDocument,
    handleDrag,
    handleDrop,
  } = useDocuments();
  ;
  const isMobile = useMediaQuery({
    maxWidth: 767,
  });

 

  // Remove the mock document generation functions since we're using real data


 
      // Refresh documents list
    

  const getFileType = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase()
    if (ext === 'pdf') return 'BUSINESS_PLAN'
    if (ext === 'xlsx' || ext === 'xls') return 'FINANCIAL_STATEMENTS'
    if (ext === 'pptx' || ext === 'ppt') return 'PITCH_DECK'
    if (ext === 'doc' || ext === 'docx') return 'LEGAL_DOCUMENTS'
    return 'OTHER'
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      'BUSINESS_PLAN': <FileText className="h-4 w-4" />,
      'FINANCIAL_STATEMENTS': <FileText className="h-4 w-4" />,
      'PITCH_DECK': <FileText className="h-4 w-4" />,
      'LEGAL_DOCUMENTS': <FileText className="h-4 w-4" />,
      'MARKET_RESEARCH': <FileText className="h-4 w-4" />,
      'TEAM_PROFILE': <FileText className="h-4 w-4" />,
      'OTHER': <File className="h-4 w-4" />
    }
    return icons[type] || <File className="h-4 w-4" />
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'approved': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'review': 'bg-blue-100 text-blue-800',
      'rejected': 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      'approved': <CheckCircle className="h-4 w-4" />,
      'pending': <Clock className="h-4 w-4" />,
      'review': <AlertTriangle className="h-4 w-4" />,
      'rejected': <AlertTriangle className="h-4 w-4" />
    }
    return icons[status] || <Clock className="h-4 w-4" />
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Since filtering is now handled by the API, we don't need client-side filtering
  const filteredDocuments = documents

 

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading documents...</p>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
            <p className="text-gray-600">Upload, organize, and manage venture documents</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-4">Error: {error}</p>
              <Button onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return isMobile ? (
    <DocumentsMobileScreen
      uploading={uploading}
      dragActive={dragActive}
      selectedVenture={selectedVenture}
      error={error}
  
      handleDrag={handleDrag}
      handleDrop={handleDrop}
      handleFileUpload={handleFileUpload}
  
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
  
      selectedType={selectedType}
      setSelectedType={setSelectedType}
  
      setSelectedVenture={setSelectedVenture}
  
      documentTypes={documentTypes}
      ventures={ventures}
  
      filteredDocuments={filteredDocuments}
  
      getFileIcon={getFileIcon}
      getStatusIcon={getStatusIcon}
      getStatusColor={getStatusColor}
  
      formatDate={formatDate}
  
      handleDeleteDocument={handleDeleteDocument}
    />
  ) : (
    <DocumentsDesktopScreen
      uploading={uploading}
      analytics={analytics}
  
      dragActive={dragActive}
      selectedVenture={selectedVenture}
      error={error}
  
      handleDrag={handleDrag}
      handleDrop={handleDrop}
      handleFileUpload={handleFileUpload}
  
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
  
      selectedType={selectedType}
      setSelectedType={setSelectedType}
  
      setSelectedVenture={setSelectedVenture}
  
      documentTypes={documentTypes}
      ventures={ventures}
  
      filteredDocuments={filteredDocuments}
  
      getFileIcon={getFileIcon}
      getStatusIcon={getStatusIcon}
      getStatusColor={getStatusColor}
  
      formatDate={formatDate}
  
      handleDeleteDocument={handleDeleteDocument}
    />
  );}