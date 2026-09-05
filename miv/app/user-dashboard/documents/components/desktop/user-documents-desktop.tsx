import { CheckCircle2, Clock3, FileText, RefreshCw, TriangleAlert } from "lucide-react"
import type { UserDocumentsController } from "../../hooks/use-user-documents"
import { DocumentsNotice } from "../shared/documents-notice"
import { DesktopDocumentList } from "./desktop-document-list"
import { DesktopUploadPanel } from "./desktop-upload-panel"

export function UserDocumentsDesktop({ controller }: { controller: UserDocumentsController }) {
  const stats = [
    { label: "Total documents", value: controller.stats.total, icon: FileText, color: "text-[#138075]" },
    { label: "Pending review", value: controller.stats.pending, icon: Clock3, color: "text-amber-600" },
    { label: "Approved", value: controller.stats.approved, icon: CheckCircle2, color: "text-emerald-600" },
    { label: "Action required", value: controller.stats.actionRequired, icon: TriangleAlert, color: "text-[#F4A261]" },
  ]

  return (
    <main className="mx-auto max-w-7xl pb-16 pt-2" aria-labelledby="documents-desktop-title">
      <header className="mb-6 flex items-end justify-between gap-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#138075]">Venture workspace</p>
          <h1 id="documents-desktop-title" className="mt-2 text-3xl font-bold text-slate-950">Documents</h1>
          <p className="mt-2 text-slate-600">Upload, review and manage your venture files in one place.</p>
        </div>
        <button
          type="button"
          onClick={() => void controller.refresh()}
          disabled={controller.refreshing || controller.loading}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-[#138075]/40 hover:text-[#138075] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${controller.refreshing ? "animate-spin" : ""}`} aria-hidden="true" />
          Refresh
        </button>
      </header>

      {controller.notice && (
        <div className="mb-5">
          <DocumentsNotice notice={controller.notice} onDismiss={controller.dismissNotice} />
        </div>
      )}

      <section className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4" aria-label="Document summary">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">{label}</p>
              <Icon className={`h-5 w-5 ${color}`} aria-hidden="true" />
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-950">{value}</p>
          </div>
        ))}
      </section>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]">
        <DesktopUploadPanel controller={controller} />
        <DesktopDocumentList controller={controller} />
      </div>
    </main>
  )
}
