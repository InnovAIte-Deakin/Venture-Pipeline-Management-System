import { Sparkles } from 'lucide-react'

interface SectionEmptyStateProps {
  title: string
  description: string
}

export function SectionEmptyState({ title, description }: SectionEmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center dark:border-slate-700">
      <Sparkles className="mx-auto h-8 w-8 text-slate-500" />
      <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>
    </div>
  )
}
