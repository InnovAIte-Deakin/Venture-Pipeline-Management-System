'use client';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Building2,
  Calendar,
  Download,
  Eye,
  MoreHorizontal,
  Trash2,
  User,
  FileText,
} from "lucide-react";

import { TableCell } from "@/components/ui/table";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DocumentsTableProps {
  filteredDocuments: any[];
  documentTypes: any[];
  getFileIcon: (type: string) => React.ReactNode;
  getStatusIcon: (status: string) => React.ReactNode;
  getStatusColor: (status: string) => string;
  formatDate: (date: string) => string;
  handleDeleteDocument: (id: string) => void;
}

export default function DocumentsTable({
  filteredDocuments,
  documentTypes,
  getFileIcon,
  getStatusIcon,
  getStatusColor,
  formatDate,
  handleDeleteDocument,
}: DocumentsTableProps) {

  // Empty State
  if (filteredDocuments.length === 0) {
    return (
      <Card className="rounded-2xl border border-slate-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle>Documents</CardTitle>
        </CardHeader>

        <CardContent className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <FileText className="h-8 w-8 text-blue-600" />
          </div>

          <h3 className="text-lg font-semibold text-slate-800">
            No documents uploaded
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Upload your first venture document above to begin reviewing submissions.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border border-slate-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle>
          Documents ({filteredDocuments.length})
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="overflow-x-auto">
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
                <TableHead className="text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredDocuments.map((document) => (
                <TableRow key={document.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-gray-100">
                        {getFileIcon(document.type)}
                      </div>

                      <div>
                        <p className="font-medium text-gray-900">
                          {document.name}
                        </p>

                        {document.description && (
                          <p className="text-sm text-gray-500">
                            {document.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-gray-400" />

                      <div>
                        <span className="text-sm font-medium">
                          {document.venture.name}
                        </span>

                        <p className="text-xs text-gray-500">
                          {document.venture.sector}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline">
                      {documentTypes.find(
                        (t) => t.value === document.type
                      )?.label || document.type}
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
                      <span className="text-sm">
                        {document.uploadedBy}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">
                        {formatDate(document.uploadedAt)}
                      </span>
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
                        <DropdownMenuItem
                          onClick={() =>
                            window.open(document.url, "_blank")
                          }
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => {
                            const link = window.document.createElement("a");
                            link.href = document.url;
                            link.download = document.name;
                            link.click();
                          }}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() =>
                            handleDeleteDocument(document.id)
                          }
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}