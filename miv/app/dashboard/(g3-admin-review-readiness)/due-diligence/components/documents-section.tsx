import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, FileText, Upload } from "lucide-react"

export function DocumentsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Management</CardTitle>
        <CardDescription>
          Upload and manage due diligence documents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload Documents
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download All
            </Button>
          </div>
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No documents uploaded yet</p>
            <p className="text-sm">Upload documents to start the due diligence process</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
