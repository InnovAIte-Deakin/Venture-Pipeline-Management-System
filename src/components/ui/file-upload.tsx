"use client"

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Upload, 
  File, 
  X, 
  CheckCircle,
  FileText,
  FileSpreadsheet,
  FileImage,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url?: string
  uploadProgress: number
  status: 'uploading' | 'success' | 'error'
  error?: string
}

interface FileUploadProps {
  onFilesUploaded?: (files: UploadedFile[]) => void
  onFileRemoved?: (fileId: string) => void
  acceptedFileTypes?: string[]
  maxFileSize?: number // in MB
  maxFiles?: number
  existingFiles?: UploadedFile[]
  label?: string
  description?: string
  className?: string
  disabled?: boolean
}

const getFileIcon = (fileType: string) => {
  if (fileType.includes('image')) return <FileImage className="h-4 w-4" />
  if (fileType.includes('spreadsheet') || fileType.includes('excel')) return <FileSpreadsheet className="h-4 w-4" />
  if (fileType.includes('pdf') || fileType.includes('document')) return <FileText className="h-4 w-4" />
  return <File className="h-4 w-4" />
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function FileUpload({
  onFilesUploaded,
  onFileRemoved,
  acceptedFileTypes = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.jpg', '.jpeg', '.png'],
  maxFileSize = 10, // 10MB default
  maxFiles = 5,
  existingFiles = [],
  label = "Upload Files",
  description = "Drag and drop files here, or click to select files",
  className,
  disabled = false
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>(existingFiles)
  const [isDragOver, setIsDragOver] = useState(false)

  // Simulate file upload - replace with actual upload logic
  const uploadFile = async (file: File): Promise<UploadedFile> => {
    const uploadedFile: UploadedFile = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadProgress: 0,
      status: 'uploading'
    }

    // Simulate upload progress
    return new Promise((resolve) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 30
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
          uploadedFile.uploadProgress = 100
          uploadedFile.status = 'success'
          uploadedFile.url = `https://example.com/files/${uploadedFile.id}`
          resolve(uploadedFile)
        } else {
          uploadedFile.uploadProgress = progress
        }
      }, 200)
    })
  }

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
    if (disabled) return

    // Handle rejected files
    if (rejectedFiles.length > 0) {
      console.error('Some files were rejected:', rejectedFiles)
    }

    // Check if adding files would exceed maxFiles limit
    if (files.length + acceptedFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`)
      return
    }

    // Process accepted files
    const newFiles: UploadedFile[] = []
    
    for (const file of acceptedFiles) {
      try {
        const uploadedFile = await uploadFile(file)
        newFiles.push(uploadedFile)
      } catch (error) {
        const errorFile: UploadedFile = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          uploadProgress: 0,
          status: 'error',
          error: 'Upload failed'
        }
        newFiles.push(errorFile)
      }
    }

    const updatedFiles = [...files, ...newFiles]
    setFiles(updatedFiles)
    onFilesUploaded?.(updatedFiles)
  }, [files, maxFiles, onFilesUploaded, disabled])

  const removeFile = (fileId: string) => {
    const updatedFiles = files.filter(f => f.id !== fileId)
    setFiles(updatedFiles)
    onFileRemoved?.(fileId)
    onFilesUploaded?.(updatedFiles)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => {
      acc[`*/${type.replace('.', '')}`] = [type]
      return acc
    }, {} as any),
    maxSize: maxFileSize * 1024 * 1024,
    disabled,
    onDragEnter: () => setIsDragOver(true),
    onDragLeave: () => setIsDragOver(false),
    onDropAccepted: () => setIsDragOver(false),
    onDropRejected: () => setIsDragOver(false)
  })

  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <label className="text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </label>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {description}
        </p>
      </div>

      {/* Drop Zone */}
      <Card
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed transition-all duration-200 cursor-pointer",
          isDragActive || isDragOver 
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20" 
            : "border-gray-300 hover:border-gray-400",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <div className="p-8 text-center">
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <div className={cn(
              "p-3 rounded-full",
              isDragActive || isDragOver 
                ? "bg-blue-100 dark:bg-blue-900/30" 
                : "bg-gray-100 dark:bg-gray-800"
            )}>
              <Upload className={cn(
                "h-6 w-6",
                isDragActive || isDragOver 
                  ? "text-blue-600 dark:text-blue-400" 
                  : "text-gray-400"
              )} />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {isDragActive ? 'Drop files here' : 'Drag and drop files here'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                or click to select files
              </p>
            </div>

            <div className="flex flex-wrap gap-1 justify-center">
              {acceptedFileTypes.slice(0, 8).map((type) => (
                <Badge key={type} variant="secondary" className="text-xs">
                  {type}
                </Badge>
              ))}
              {acceptedFileTypes.length > 8 && (
                <Badge variant="secondary" className="text-xs">
                  +{acceptedFileTypes.length - 8} more
                </Badge>
              )}
            </div>

            <p className="text-xs text-gray-400">
              Max {maxFiles} files, up to {maxFileSize}MB each
            </p>
          </div>
        </div>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            Uploaded Files ({files.length}/{maxFiles})
          </h4>
          
          <div className="space-y-2">
            {files.map((file) => (
              <Card key={file.id} className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {file.status === 'uploading' ? (
                      <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                    ) : file.status === 'success' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : file.status === 'error' ? (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      getFileIcon(file.type)
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {file.name}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={
                            file.status === 'success' ? 'default' :
                            file.status === 'error' ? 'destructive' : 'secondary'
                          }
                          className="text-xs"
                        >
                          {file.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900"
                          onClick={() => removeFile(file.id)}
                          disabled={disabled}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)}
                      {file.error && (
                        <span className="text-red-500 ml-2">• {file.error}</span>
                      )}
                    </p>
                    
                    {file.status === 'uploading' && (
                      <Progress value={file.uploadProgress} className="mt-2 h-1" />
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
