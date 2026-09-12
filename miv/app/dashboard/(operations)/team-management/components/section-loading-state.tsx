import { Loader2 } from 'lucide-react'

interface SectionLoadingStateProps {
  message?: string
}

export function SectionLoadingState({ message = 'Loading…' }: SectionLoadingStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center dark:border-slate-700">
      <Loader2 className="mx-auto h-8 w-8 animate-spin text-slate-500" />
      <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{message}</p>
    </div>
  )
}
