import type { UserDocumentsController } from "../../hooks/use-user-documents"
import { DocumentsNotice } from "../shared/documents-notice"
import { DesktopDocumentList } from "./desktop-document-list"
import { DesktopUploadPanel } from "./desktop-upload-panel"

export function UserDocumentsDesktop({ controller }: { controller: UserDocumentsController }) {
  return (
    <main className="min-h-screen bg-background px-4 py-8" aria-labelledby="documents-desktop-title">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <h1 id="documents-desktop-title" className="mb-2 text-3xl font-bold text-foreground">
            Document Upload
          </h1>
          <p className="text-muted-foreground">Upload and manage your venture documents securely</p>
        </header>

        {controller.notice && (
          <div className="mb-6">
            <DocumentsNotice notice={controller.notice} onDismiss={controller.dismissNotice} />
          </div>
        )}

        <DesktopUploadPanel controller={controller} />
        <DesktopDocumentList controller={controller} />
      </div>
    </main>
  )
}
