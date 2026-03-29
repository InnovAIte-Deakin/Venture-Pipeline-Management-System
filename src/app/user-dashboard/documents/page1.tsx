'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface Document {
  _id: string;
  fileName: string;
  fileType: string;
  documentType: string;
  uploadDate: string;
  uploadedBy: string;
  version: number;
  status: 'pending' | 'approved' | 'needs_revision';
  fileUrl: string;
  fileSize: number;
}

const DOCUMENT_TYPES = [
  'Pitch Deck',
  'Financial Statements',
  'Legal Documents',
  'GEDSI Reports',
  'Impact Reports',
  'Other'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function DocumentUploadPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedType, setSelectedType] = useState('');
  const [uploading, setUploading] = useState(false);
  const [localOnly, setLocalOnly] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);



  const LOCAL_DOCS_KEY = 'localDocuments'

  const loadLocalDocuments = (): Document[] => {
    try {
      const raw = localStorage.getItem(LOCAL_DOCS_KEY)
      if (!raw) return []
      return JSON.parse(raw) as Document[]
    } catch (e) {
      console.error('Failed to parse local documents', e)
      return []
    }
  }

  const saveLocalDocuments = (docs: Document[]) => {
    try {
      localStorage.setItem(LOCAL_DOCS_KEY, JSON.stringify(docs))
    } catch (e) {
      console.error('Failed to save local documents', e)
    }
  }

  const fetchDocuments = useCallback(async () => {
    try {
      const res = await fetch('/api/documents', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      let remoteDocs: Document[] = []
      if (res.ok) {
        const data = await res.json();
        remoteDocs = data.documents || []
      }

      const localDocs = loadLocalDocuments()
      // Merge local docs first so they appear at top
      setDocuments([...localDocs, ...remoteDocs])
    } catch (err) {
      console.error('Failed to fetch documents:', err);
      // still load local docs if remote fails
      setDocuments(loadLocalDocuments())
    }
  }, [])
  

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    setError('');
    setSuccess('');

    if (!selectedType) {
      setError('Please select a document type first');
      return;
    }

    const file = files[0];

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError('File size exceeds 10MB limit');
      return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
    
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Please upload PDF, Word, Excel, or PowerPoint files');
      return;
    }

    if (localOnly) {
      await uploadFileLocal(file)
    } else {
      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', selectedType);

    try {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200 || xhr.status === 201) {
          const response = JSON.parse(xhr.responseText);
          setSuccess('Document uploaded successfully!');
          setDocuments([response.document, ...documents]);
          setSelectedType('');
          setUploadProgress(0);
          if (fileInputRef.current) fileInputRef.current.value = '';
        } else {
          setError('Upload failed. Please try again.');
        }
        setUploading(false);
      });

      xhr.addEventListener('error', () => {
        setError('Upload failed. Please check your connection.');
        setUploading(false);
      });

      xhr.open('POST', '/api/documents/upload');
      xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token')}`);
      xhr.send(formData);

    } catch (err) {
      setError('An error occurred during upload');
      setUploading(false);
    }
  };

  // Local-only upload: store file as data URL and persist metadata in localStorage
  const uploadFileLocal = async (file: File) => {
    setUploading(true)
    setUploadProgress(0)
    setError('')
    setSuccess('')

    try {
      const reader = new FileReader()
      const dataUrl: string = await new Promise((resolve, reject) => {
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.onload = () => resolve(String(reader.result))
        reader.readAsDataURL(file)
      })

      const doc: Document = {
        _id: `local-${Date.now()}`,
        fileName: file.name,
        fileType: file.type || 'application/octet-stream',
        documentType: selectedType,
        uploadDate: new Date().toISOString(),
        uploadedBy: 'local',
        version: 1,
        status: 'pending',
        fileUrl: dataUrl,
        fileSize: file.size,
      }

      const existingLocal = loadLocalDocuments()
      const newLocal = [doc, ...existingLocal]
      saveLocalDocuments(newLocal)

      // Merge into current documents shown
      setDocuments(prev => [doc, ...prev])
      setSuccess('Document uploaded locally')
      setUploadProgress(100)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err) {
      console.error('Local upload failed', err)
      setError('Local upload failed')
    } finally {
      setUploading(false)
      setTimeout(() => setUploadProgress(0), 500)
    }
  }

  const handleDelete = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    // If this is a locally-stored document (id prefixed with 'local-'), remove from localStorage
    if (documentId.startsWith('local-')) {
      try {
        const local = loadLocalDocuments()
        const updatedLocal = local.filter(d => d._id !== documentId)
        saveLocalDocuments(updatedLocal)
        setDocuments(prev => prev.filter(doc => doc._id !== documentId))
        setSuccess('Document deleted successfully')
      } catch (e) {
        console.error('Failed to delete local document', e)
        setError('Failed to delete document')
      }
      return
    }

    try {
      const res = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (res.ok) {
        setDocuments(prev => prev.filter(doc => doc._id !== documentId));
        setSuccess('Document deleted successfully');
      } else {
        setError('Failed to delete document');
      }
    } catch (err) {
      setError('An error occurred while deleting');
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
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending Review' },
      approved: { color: 'bg-green-100 text-green-800', text: 'Approved' },
      needs_revision: { color: 'bg-red-100 text-red-800', text: 'Needs Revision' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

    // Fetch documents on component mount and load local docs
    // load documents on mount
    useEffect(() => {
      fetchDocuments();
    }, [fetchDocuments])
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Upload</h1>
          <p className="text-gray-600">Upload and manage your venture documents securely</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
            <p className="text-red-800">{error}</p>
            <button onClick={() => setError('')} className="ml-auto">
              <X className="w-5 h-5 text-red-600" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
            <p className="text-green-800">{success}</p>
            <button onClick={() => setSuccess('')} className="ml-auto">
              <X className="w-5 h-5 text-green-600" />
            </button>
          </div>
        )}

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Upload New Document</h2>
          
          {/* Document Type Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Type *
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={uploading}
            >
              <option value="">Select document type...</option>
              {DOCUMENT_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {/* <div className="mt-2 flex items-center gap-2">
              <input
                id="localOnly"
                type="checkbox"
                checked={localOnly}
                onChange={(e) => setLocalOnly(e.target.checked)}
                disabled={uploading}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="localOnly" className="text-sm text-gray-600">
                Save locally only (no upload to server)
              </label>
            </div> */}
          </div>

          {/* Drag and Drop Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
            } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleChange}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
              disabled={uploading || !selectedType}
            />
            
            {uploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                <p className="text-gray-700 font-medium mb-2">Uploading...</p>
                <div className="w-64 bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">{uploadProgress}%</p>
              </div>
            ) : (
              <>
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-700 font-medium mb-2">
                  Drag and drop your file here, or
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={!selectedType}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Browse Files
                </button>
                <p className="text-sm text-gray-500 mt-3">
                  Supported: PDF, Word, Excel, PowerPoint (Max 10MB)
                </p>
              </>
            )}
          </div>
        </div>

        {/* Documents List */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Your Documents</h2>
          
          {documents.length === 0 ? (
            <div className="text-center py-12">
              <File className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No documents uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc._id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <File className="w-10 h-10 text-blue-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{doc.fileName}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-600">
                          <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">
                            {doc.documentType}
                          </span>
                          <span>•</span>
                          <span>{formatFileSize(doc.fileSize)}</span>
                          <span>•</span>
                          <span>v{doc.version}</span>
                          <span>•</span>
                          <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                        </div>
                        <div className="mt-2">
                          {getStatusBadge(doc.status)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <a
                        href={doc.fileUrl}
                        download
                        className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                      >
                        Download
                      </a>
                      <button
                        onClick={() => handleDelete(doc._id)}
                        className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}