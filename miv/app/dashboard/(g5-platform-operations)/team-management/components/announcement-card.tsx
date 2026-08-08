import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Announcement } from '@/app/dashboard/(g5-platform-operations)/team-management/types/team-management'
import { formatDate } from '@/app/dashboard/(g5-platform-operations)/team-management/lib/team-utils'

interface AnnouncementCardProps {
  announcement: Announcement
  onClick: () => void
}

export function AnnouncementCard({ announcement, onClick }: AnnouncementCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      <CardContent className="space-y-4 p-5">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <p className="text-base font-semibold text-slate-900 dark:text-white truncate">{announcement.title}</p>
            <Badge className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {announcement.priority.toLowerCase()}
            </Badge>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3">{announcement.content}</p>
          <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>By {announcement.author.name}</span>
            <span>•</span>
            <span>{formatDate(announcement.createdAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
