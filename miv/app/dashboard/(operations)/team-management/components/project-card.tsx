import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Briefcase } from 'lucide-react'
import type { Project } from '@/app/dashboard/(operations)/team-management/types/team-management'
import { projectStatusClassName, projectStatusLabel, priorityClassName } from '@/app/dashboard/(operations)/team-management/lib/team-utils'

interface ProjectCardProps {
  project: Project
  onClick: () => void
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-base font-semibold text-slate-900 dark:text-white truncate">{project.name}</p>
            {project.venture ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">{project.venture.name}</p>
            ) : null}
          </div>
          <Briefcase className="h-5 w-5 text-slate-400" />
        </div>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-400 line-clamp-3">{project.description ?? 'No project description.'}</p>
        <div className="flex flex-wrap gap-2">
          <Badge className={projectStatusClassName(project.status)}>{projectStatusLabel(project.status)}</Badge>
          <Badge className={priorityClassName(project.priority)}>{project.priority.toLowerCase()}</Badge>
          <Badge className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {project._count.members} members
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
