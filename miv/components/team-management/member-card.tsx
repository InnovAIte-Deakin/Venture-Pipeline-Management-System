import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import type { TeamMember } from '@/types/team-management'

interface MemberCardProps {
  member: TeamMember
  onClick: () => void
}

export function MemberCard({ member, onClick }: MemberCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            {member.image ? (
              <AvatarImage src={member.image} alt={member.name} />
            ) : (
              <AvatarFallback>{member.name?.split(' ').map((part) => part[0]).join('').toUpperCase()}</AvatarFallback>
            )}
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-base font-semibold text-slate-900 dark:text-white truncate">{member.name}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{member.role}</p>
            {member.organization ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{member.organization}</p>
            ) : null}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge className="rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {member._count.ledProjects} Leading
          </Badge>
          <Badge className="rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {member._count.projectMemberships} Projects
          </Badge>
          <Badge className="rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {member._count.assignedTasks} Tasks
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
