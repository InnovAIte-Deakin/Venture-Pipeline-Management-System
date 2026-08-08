"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Briefcase, CalendarDays, MessageSquare, Users } from 'lucide-react'
import { AnnouncementsSection } from '@/app/dashboard/(g5-platform-operations)/team-management/components/announcements-section'
import { EventsSection } from '@/app/dashboard/(g5-platform-operations)/team-management/components/events-section'
import { MembersSection } from '@/app/dashboard/(g5-platform-operations)/team-management/components/members-section'
import { ProjectsSection } from '@/app/dashboard/(g5-platform-operations)/team-management/components/projects-section'
import { TeamManagementHeader } from '@/app/dashboard/(g5-platform-operations)/team-management/components/team-management-header'

export default function TeamManagementPage() {
  return (
    <div className="min-h-screen bg-slate-50/80 p-4 sm:p-6 lg:p-8 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <TeamManagementHeader />

        <Tabs defaultValue="members" className="w-full">
          <TabsList className="mb-8 grid h-auto w-full grid-cols-2 gap-2 bg-transparent p-0 sm:mb-6 sm:grid-cols-4">
            <TabsTrigger value="members" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 data-[state=active]:border-teal-500 data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
              <Users className="mr-2 h-4 w-4" />
              Members
            </TabsTrigger>
            <TabsTrigger value="projects" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 data-[state=active]:border-teal-500 data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
              <Briefcase className="mr-2 h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="communication" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 data-[state=active]:border-teal-500 data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
              <MessageSquare className="mr-2 h-4 w-4" />
              Communication
            </TabsTrigger>
            <TabsTrigger value="calendar" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 data-[state=active]:border-teal-500 data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
              <CalendarDays className="mr-2 h-4 w-4" />
              Calendar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="mt-2 sm:mt-0">
            <MembersSection />
          </TabsContent>

          <TabsContent value="projects" className="mt-2 sm:mt-0">
            <ProjectsSection />
          </TabsContent>

          <TabsContent value="communication" className="mt-2 sm:mt-0">
            <AnnouncementsSection />
          </TabsContent>

          <TabsContent value="calendar" className="mt-2 sm:mt-0">
            <EventsSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
