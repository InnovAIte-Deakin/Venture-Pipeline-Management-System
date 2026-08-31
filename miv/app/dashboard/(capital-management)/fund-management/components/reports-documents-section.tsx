"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Download, Eye, Trash2, Upload, FileText, Calendar } from "lucide-react"

interface ReportsDocumentsProps {
  reports: Array<{ id: string; name: string; type?: string; generatedAt?: string }>
  documents: Array<{ id: string; name: string; type?: string; uploadedAt?: string; ventureName?: string }>
  loading?: boolean
}

export function ReportsDocumentsSection({
  reports,
  documents,
  loading = false,
}: Readonly<ReportsDocumentsProps>) {
  const [searchReports, setSearchReports] = useState("")
  const [searchDocuments, setSearchDocuments] = useState("")
  const [activeTab, setActiveTab] = useState("reports")

  const filteredReports = reports.filter((report) =>
    report.name.toLowerCase().includes(searchReports.toLowerCase())
  )

  const filteredDocuments = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchDocuments.toLowerCase()) ||
    (doc.ventureName?.toLowerCase().includes(searchDocuments.toLowerCase()) ?? false)
  )

  const getTypeColor = (type?: string) => {
    if (!type) return "bg-slate-100 text-slate-800"
    switch (type.toLowerCase()) {
      case "performance":
        return "bg-blue-100 text-blue-800"
      case "compliance":
        return "bg-purple-100 text-purple-800"
      case "k-1":
      case "k1":
        return "bg-green-100 text-green-800"
      case "audit":
        return "bg-orange-100 text-orange-800"
      case "lp-agreement":
      case "agreement":
        return "bg-indigo-100 text-indigo-800"
      case "fund-oa":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="reports">Reports</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
      </TabsList>

      {/* Reports Tab */}
      <TabsContent value="reports" className="space-y-4">
        {/* Search and Actions */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              className="pl-9"
              value={searchReports}
              onChange={(e) => setSearchReports(e.target.value)}
            />
          </div>
          <div />
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>

        {/* Reports Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {filteredReports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <CardTitle className="text-base">{report.name}</CardTitle>
                    </div>
                    {report.type && (
                      <Badge className={`${getTypeColor(report.type)} text-xs mt-2`}>
                        {report.type}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {report.generatedAt && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {formatDate(report.generatedAt)}
                  </div>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mobile View */}
        {filteredReports.length === 0 && !loading && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                No reports found matching your search.
              </p>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      {/* Documents Tab */}
      <TabsContent value="documents" className="space-y-4">
        {/* Search and Actions */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              className="pl-9"
              value={searchDocuments}
              onChange={(e) => setSearchDocuments(e.target.value)}
            />
          </div>
          <div />
          <Button className="w-full sm:w-auto">
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>

        {/* Documents List */}
        <div className="hidden sm:block">
          <Card>
            <CardHeader>
              <CardTitle>Fund Documents</CardTitle>
              <CardDescription>{filteredDocuments.length} documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText className="h-5 w-5 text-slate-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{doc.name}</p>
                        <div className="flex gap-2 flex-wrap mt-1">
                          {doc.type && (
                            <Badge
                              className={`${getTypeColor(doc.type)} text-xs`}
                              variant="default"
                            >
                              {doc.type}
                            </Badge>
                          )}
                          {doc.ventureName && (
                            <span className="text-xs text-muted-foreground">
                              {doc.ventureName}
                            </span>
                          )}
                          {doc.uploadedAt && (
                            <span className="text-xs text-muted-foreground">
                              {formatDate(doc.uploadedAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Documents View */}
        <div className="sm:hidden space-y-2">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="pt-4">
                <div className="flex gap-3">
                  <FileText className="h-5 w-5 text-slate-400 shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{doc.name}</p>
                    <div className="flex gap-2 flex-wrap mt-1">
                      {doc.type && (
                        <Badge className={`${getTypeColor(doc.type)} text-xs`}>
                          {doc.type}
                        </Badge>
                      )}
                    </div>
                    {doc.uploadedAt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(doc.uploadedAt)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Trash2 className="h-3 w-3 mr-1 text-red-500" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredDocuments.length === 0 && !loading && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                No documents found matching your search.
              </p>
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  )
}
