'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Upload, 
  File, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Eye,
  CheckCircle, 
  AlertCircle, 
  Clock, 
  XCircle,
  User,
  Building2,
  Calendar,
  FileText,
  Loader2,
  RefreshCw
} from 'lucide-react';

interface Document {
  id: string;
  filename: string;
  documentType: string;
  status: 'pending_review' | 'approved' | 'rejected' | 'needs_revision';
  version: number;
  filesize: number;
  mimeType: string;
  url: string;
  notes?: string;
  uploadedBy: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  venture?: {
    id: string;
    name: string;
  };
  reviewedBy?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

const DOCUMENT_TYPES = [
  'All Types',
  'Pitch Deck',
  'Financial Statements', 
  'Legal Documents',
  'GEDSI Reports',
  'Impact Reports',
  'Other'
];

const STATUS_OPTIONS = [
  'All Status',
  'pending_review',
  'approved', 
  'rejected',
  'needs_revision'
];

export default function ImpactDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const res = await fetch('/backend/api/documents', {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.documents) {
          setDocuments(data.documents);
          setFilteredDocuments(data.documents);
          
          // Calculate stats
          const stats = data.documents.reduce((acc: any, doc: Document) => {
            acc.total++;
            if (doc.status === 'pending_review') acc.pending++;
            else if (doc.status === 'approved') acc.approved++;
            else if (doc.status === 'rejected') acc.rejected++;
            return acc;
          }, { total: 0, pending: 0, approved: 0, rejected: 0 });
          
          setStats(stats);
        }
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Failed to fetch documents');
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err);
      setError('Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter documents based on search and filters
  useEffect(() => {
    let filtered = documents;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(doc => 
        doc.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.uploadedBy.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.uploadedBy.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.uploadedBy.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.venture?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Document type filter
    if (selectedType !== 'All Types') {
      filtered = filtered.filter(doc => doc.documentType === selectedType);
    }

    // Status filter
    if (selectedStatus !== 'All Status') {
      filtered = filtered.filter(doc => doc.status === selectedStatus);
    }

    setFilteredDocuments(filtered);
  }, [documents, searchQuery, selectedType, selectedStatus]);

  const handleStatusUpdate = async (documentId: string, newStatus: string, notes?: string) => {
    try {
      const res = await fetch(`/backend/api/documents/${documentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus, notes }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess('Document status updated successfully');
        fetchDocuments(); // Refresh the list
      } else {
        setError(data.message || 'Failed to update document status');
      }
    } catch (err) {
      console.error('Status update error:', err);
      setError('An error occurred while updating status');
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch(`/backend/api/documents?id=${documentId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess('Document deleted successfully');
        fetchDocuments(); // Refresh the list
      } else {
        setError(data.message || 'Failed to delete document');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError('An error occurred while deleting');
    }
  };

  const handleDownload = async (documentId: string, filename: string) => {
    try {
      const res = await fetch(`/backend/api/documents/${documentId}?download=true`, {
        credentials: 'include',
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        setError('Failed to download document');
      }
    } catch (err) {
      console.error('Download error:', err);
      setError('An error occurred while downloading');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending_review: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending Review', icon: Clock },
      approved: { color: 'bg-green-100 text-green-800', text: 'Approved', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', text: 'Rejected', icon: XCircle },
      needs_revision: { color: 'bg-orange-100 text-orange-800', text: 'Needs Revision', icon: AlertCircle }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending_review;
    const IconComponent = config.icon;
    
    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.text}
      </div>
    );
  };

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Impact Documents Management</h1>
              <p className="text-gray-600">Review and manage documents uploaded by venture founders</p>
            </div>
            <button
              onClick={fetchDocuments}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Documents</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                <p className="text-sm text-gray-600">Pending Review</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
                <p className="text-sm text-gray-600">Approved</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <XCircle className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                <p className="text-sm text-gray-600">Rejected</p>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
            <p className="text-red-800">{error}</p>
            <button onClick={() => setError('')} className="ml-auto">
              <XCircle className="w-5 h-5 text-red-600" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
            <p className="text-green-800">{success}</p>
            <button onClick={() => setSuccess('')} className="ml-auto">
              <XCircle className="w-5 h-5 text-green-600" />
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by filename, user, or venture..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="md:w-48">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {DOCUMENT_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="md:w-48">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {STATUS_OPTIONS.map(status => (
                  <option key={status} value={status}>
                    {status === 'All Status' ? status : status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Documents List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Documents ({filteredDocuments.length})
            </h2>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Loading documents...</p>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <File className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No documents found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Document
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uploaded By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Venture
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Upload Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <File className="w-10 h-10 text-blue-500 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {doc.filename}
                            </div>
                            <div className="text-xs text-gray-500">
                              {doc.documentType} • {formatFileSize(doc.filesize)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="w-5 h-5 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {doc.uploadedBy.firstName} {doc.uploadedBy.lastName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {doc.uploadedBy.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {doc.venture ? (
                          <div className="flex items-center">
                            <Building2 className="w-5 h-5 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{doc.venture.name}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500">No venture</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(doc.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {new Date(doc.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleDownload(doc.id, doc.filename)}
                            className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors text-xs"
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </button>
                          
                          {doc.status === 'pending_review' && (
                            <div className="flex space-x-1">
                              <button
                                onClick={() => handleStatusUpdate(doc.id, 'approved')}
                                className="inline-flex items-center px-2 py-1 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors text-xs"
                              >
                                <CheckCircle className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(doc.id, 'rejected')}
                                className="inline-flex items-center px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors text-xs"
                              >
                                <XCircle className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(doc.id, 'needs_revision')}
                                className="inline-flex items-center px-2 py-1 bg-orange-50 text-orange-600 rounded hover:bg-orange-100 transition-colors text-xs"
                              >
                                <AlertCircle className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                          
                          <button
                            onClick={() => handleDelete(doc.id)}
                            className="inline-flex items-center px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors text-xs"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
