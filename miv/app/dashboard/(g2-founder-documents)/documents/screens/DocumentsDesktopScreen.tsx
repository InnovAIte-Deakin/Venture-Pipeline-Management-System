'use client';

import DocumentsHeader from "../components/DocumentsHeader";
import DocumentsUpload from "../components/DocumentsUpload";
import DocumentsFilters from "../components/DocumentsFilters";
import DocumentsTable from "../components/DocumentsTable";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";


interface DocumentsDesktopScreenProps {
  uploading: boolean;
  analytics: any;

  dragActive: boolean;
  selectedVenture: string;
  error: string | null;
  handleDrag: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleFileUpload: (files: FileList | null) => void;

  searchQuery: string;
  setSearchQuery: (value: string) => void;

  selectedType: string;
  setSelectedType: (value: string) => void;

  setSelectedVenture: (value: string) => void;

  documentTypes: any[];
  ventures: any[];

  filteredDocuments: any[];

  getFileIcon: (type: string) => React.ReactNode;
  getStatusIcon: (status: string) => React.ReactNode;
  getStatusColor: (status: string) => string;
  formatDate: (date: string) => string;

  handleDeleteDocument: (id: string) => void;
}
export default function DocumentsDesktopScreen({
    uploading,
    analytics,
  
    dragActive,
    selectedVenture,
    error,
    handleDrag,
    handleDrop,
    handleFileUpload,
  
    searchQuery,
    setSearchQuery,
  
    selectedType,
    setSelectedType,
  
    setSelectedVenture,
  
    documentTypes,
    ventures,
  
    filteredDocuments,
  
    getFileIcon,
    getStatusIcon,
    getStatusColor,
    formatDate,
  
    handleDeleteDocument,
  }: DocumentsDesktopScreenProps) {
    return (
      <div className="space-y-6">
    
        <DocumentsHeader
          uploading={uploading}
          analytics={analytics}
        />
    
        <Tabs defaultValue="all" className="space-y-6">
    
          <TabsList className="grid w-full grid-cols-4">
    
            <TabsTrigger value="all">
              All Documents
            </TabsTrigger>
    
            <TabsTrigger value="recent">
              Recent
            </TabsTrigger>
    
            <TabsTrigger value="pending">
              Pending Review
            </TabsTrigger>
    
            <TabsTrigger value="approved">
              Approved
            </TabsTrigger>
    
          </TabsList>
    
          <TabsContent value="all" className="space-y-6">
    
            <DocumentsUpload
              uploading={uploading}
              dragActive={dragActive}
              selectedVenture={selectedVenture}
              error={error}
              handleDrag={handleDrag}
              handleDrop={handleDrop}
              handleFileUpload={handleFileUpload}
            />
    
            <DocumentsFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              selectedVenture={selectedVenture}
              setSelectedVenture={setSelectedVenture}
              documentTypes={documentTypes}
              ventures={ventures}
            />
    
            <DocumentsTable
              filteredDocuments={filteredDocuments}
              documentTypes={documentTypes}
              getFileIcon={getFileIcon}
              getStatusIcon={getStatusIcon}
              getStatusColor={getStatusColor}
              formatDate={formatDate}
              handleDeleteDocument={handleDeleteDocument}
            />
    
          </TabsContent>
    
          <TabsContent value="recent">
            <DocumentsTable
              filteredDocuments={filteredDocuments}
              documentTypes={documentTypes}
              getFileIcon={getFileIcon}
              getStatusIcon={getStatusIcon}
              getStatusColor={getStatusColor}
              formatDate={formatDate}
              handleDeleteDocument={handleDeleteDocument}
            />
          </TabsContent>
    
          <TabsContent value="pending">
            <DocumentsTable
              filteredDocuments={filteredDocuments.filter(
                d => d.status === "pending"
              )}
              documentTypes={documentTypes}
              getFileIcon={getFileIcon}
              getStatusIcon={getStatusIcon}
              getStatusColor={getStatusColor}
              formatDate={formatDate}
              handleDeleteDocument={handleDeleteDocument}
            />
          </TabsContent>
    
          <TabsContent value="approved">
            <DocumentsTable
              filteredDocuments={filteredDocuments.filter(
                d => d.status === "approved"
              )}
              documentTypes={documentTypes}
              getFileIcon={getFileIcon}
              getStatusIcon={getStatusIcon}
              getStatusColor={getStatusColor}
              formatDate={formatDate}
              handleDeleteDocument={handleDeleteDocument}
            />
          </TabsContent>
    
        </Tabs>
    
      </div>
    );}