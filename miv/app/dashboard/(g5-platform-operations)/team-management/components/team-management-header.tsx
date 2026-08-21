import { Badge } from '@/components/ui/badge'

interface TeamManagementHeaderProps {
  title?: string
  description?: string
}

export function TeamManagementHeader({
  title = 'Team Management',
  description = 'Manage your team members, projects, events, and announcements in one place.',
}: TeamManagementHeaderProps) {
  return (
    <div className="space-y-3 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-950/60">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
        </div>
        <Badge className="self-start rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-200">Operations workspace</Badge>
      </div>
    </div>
  )
}
