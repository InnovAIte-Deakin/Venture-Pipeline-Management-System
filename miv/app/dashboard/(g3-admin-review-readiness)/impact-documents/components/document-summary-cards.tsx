import { CheckCircle, Clock, FileText, XCircle } from "lucide-react"
import type { ImpactDocumentStats } from "@/lib/impact-documents"

interface DocumentSummaryCardsProps {
  stats: ImpactDocumentStats
}

export function DocumentSummaryCards({ stats }: DocumentSummaryCardsProps) {
  const cards = [
    { label: "Total Documents", value: stats.total, icon: FileText, color: "text-blue-500" },
    { label: "Pending Review", value: stats.pending, icon: Clock, color: "text-yellow-500" },
    { label: "Approved", value: stats.approved, icon: CheckCircle, color: "text-green-500" },
    { label: "Rejected", value: stats.rejected, icon: XCircle, color: "text-red-500" },
  ]

  return (
    <section className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-2 lg:grid-cols-4" aria-label="Document statistics">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div key={card.label} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex min-w-0 items-center">
              <Icon className={`mr-3 h-8 w-8 shrink-0 ${card.color}`} aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="break-words text-sm text-gray-600">{card.label}</p>
              </div>
            </div>
          </div>
        )
      })}
    </section>
  )
}
