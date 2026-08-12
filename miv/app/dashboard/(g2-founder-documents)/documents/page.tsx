"use client"

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
  const [documents, setDocuments] = useState<Document[]>([])
  const [ventures, setVentures] = useState<{value: string, label: string}[]>([{value: "all", label: "All Ventures"}])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedVenture, setSelectedVenture] = useState("all")
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analytics, setAnalytics] = useState<any>(null)

  useEffect(() => {
    loadInitialData()
  }, [])
  
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchDocuments()
    }, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery, selectedType, selectedVenture])

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

  // Remove the mock document generation functions since we're using real data


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
              <Button onClick={loadInitialData}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
          <p className="text-gray-600">Upload, organize, and manage venture documents</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => document.getElementById('file-upload')?.click()} disabled={uploading}>
          <Plus className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload Documents'}
          </Button>
          {analytics && (
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              {analytics.summary.totalDocuments} Total Documents
        </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="pending">Pending Review</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Upload Area */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Documents</CardTitle>
              <CardDescription>
                Drag and drop files here or click to browse
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {uploading ? 'Uploading...' : 'Drop files here or click to upload'}
                </p>
                {selectedVenture === 'all' && (
                  <p className="text-sm text-orange-600 mb-2">
                    Please select a specific venture from the filters below before uploading
                  </p>
                )}
                {error && (
                  <p className="text-sm text-red-600 mb-2">
                    {error}
                  </p>
                )}
                <p className="text-gray-600 mb-4">
                  Support for PDF, Excel, PowerPoint, Word, and image files
                </p>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  id="file-upload"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  accept=".pdf,.xlsx,.xls,.pptx,.ppt,.doc,.docx,.jpg,.jpeg,.png,.gif"
                />
                <label htmlFor="file-upload">
                  <Button variant="outline" disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Choose Files'}
                  </Button>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search documents..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Document Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {documentTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedVenture} onValueChange={setSelectedVenture}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Venture" />
                  </SelectTrigger>
                  <SelectContent>
                    {ventures.map(venture => (
                      <SelectItem key={venture.value} value={venture.value}>
                        {venture.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Documents Table */}
          <Card>
            <CardHeader>
              <CardTitle>Documents ({filteredDocuments.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Venture</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((document) => (
                    <TableRow key={document.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                            {getFileIcon(document.type)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{document.name}</p>
                            {document.description && (
                              <p className="text-sm text-gray-500">{document.description}</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          <div>
                            <span className="text-sm font-medium">{document.venture.name}</span>
                            <p className="text-xs text-gray-500">{document.venture.sector}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {documentTypes.find(t => t.value === document.type)?.label || document.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {document.sizeFormatted}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(document.status)}
                          <Badge className={getStatusColor(document.status)}>
                            {document.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{document.uploadedBy}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{formatDate(document.uploadedAt)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => window.open(document.url, '_blank')}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              const link = window.document.createElement('a')
                              link.href = document.url
                              link.download = document.name
                              link.click()
                            }}>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteDocument(document.id)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Documents</CardTitle>
              <CardDescription>Documents uploaded in the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-blue-900">Recent Uploads</h3>
                      <p className="text-2xl font-bold text-blue-600">{analytics.summary.recentDocuments}</p>
                      <p className="text-sm text-blue-700">Last 30 days</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-green-900">Total Storage</h3>
                      <p className="text-2xl font-bold text-green-600">{analytics.summary.totalStorageFormatted}</p>
                      <p className="text-sm text-green-700">Across all documents</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-purple-900">Growth Rate</h3>
                      <p className="text-2xl font-bold text-purple-600">{analytics.summary.growthRate}%</p>
                      <p className="text-sm text-purple-700">vs previous period</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {documents.filter(doc => {
                      const daysSince = (Date.now() - new Date(doc.uploadedAt).getTime()) / (1000 * 60 * 60 * 24)
                      return daysSince <= 7
                    }).slice(0, 10).map((document) => (
                      <div key={document.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-white rounded flex items-center justify-center">
                            {getFileIcon(document.type)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{document.name}</p>
                            <p className="text-sm text-gray-500">{document.venture.name} • {formatDate(document.uploadedAt)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(document.status)}>{document.status}</Badge>
                          <span className="text-sm text-gray-500">{document.sizeFormatted}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">Loading recent documents...</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Review</CardTitle>
              <CardDescription>Documents awaiting approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents.filter(doc => doc.status === 'pending' || doc.status === 'review').map((document) => (
                  <div key={document.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                        {getFileIcon(document.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{document.name}</p>
                        <p className="text-sm text-gray-500">{document.venture.name}</p>
                        <p className="text-xs text-gray-400">{document.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <Badge className={getStatusColor(document.status)}>
                          {getStatusIcon(document.status)}
                          <span className="ml-1">{document.status}</span>
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(document.uploadedAt)}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => window.open(document.url, '_blank')}>
                            <Eye className="h-4 w-4 mr-2" />
                            Review
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Request Changes
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
                {documents.filter(doc => doc.status === 'pending' || doc.status === 'review').length === 0 && (
                  <p className="text-gray-500 text-center py-8">No documents pending review.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Approved Documents</CardTitle>
              <CardDescription>Documents that have been approved</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents.filter(doc => doc.status === 'approved').map((document) => (
                  <div key={document.id} className="flex items-center justify-between p-4 border border-green-200 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded flex items-center justify-center">
                        {getFileIcon(document.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{document.name}</p>
                        <p className="text-sm text-gray-600">{document.venture.name}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {document.tags.map((tag, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center text-green-600 mb-1">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span className="text-sm font-medium">Approved</span>
                        </div>
                        <p className="text-xs text-gray-500">{formatDate(document.uploadedAt)}</p>
                        <p className="text-xs text-gray-500">{document.sizeFormatted}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(document.url, '_blank')}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
                {documents.filter(doc => doc.status === 'approved').length === 0 && (
                  <p className="text-gray-500 text-center py-8">No approved documents yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 