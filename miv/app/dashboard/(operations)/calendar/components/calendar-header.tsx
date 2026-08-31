import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CalendarHeader() {
  return <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Calendar & Events</h1><p className="text-sm text-muted-foreground sm:text-base">Manage team schedules, meetings, and important events</p></div>
    <Button asChild className="w-full sm:w-auto"><Link href="/dashboard/team-management"><Plus className="mr-2 h-4 w-4" />New Event</Link></Button>
  </header>
}
