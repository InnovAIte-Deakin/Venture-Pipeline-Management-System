// Frontend demonstration data.
// Replace with live API data when backend integration is available.

export interface DemoMember {
  id: string
  name: string
  role: string
  project: string
  responsibilities: string
  status: 'Active' | 'Away' | 'Completed'
  lastActivity: string
}

export const memberSummary = {
  totalMembers: 8,
  activeMembers: 7,
  teamLeads: 2,
  activeProjects: 4,
}

export const demoMembers: DemoMember[] = [
  {
    id: 'srikar-boske',
    name: 'Srikar Boske',
    role: 'Frontend Developer / Team Lead',
    project: 'Capital Facilitation',
    responsibilities: 'Frontend architecture and UI',
    status: 'Active',
    lastActivity: 'Today',
  },
  {
    id: 'akhilesh',
    name: 'Akhilesh',
    role: 'Frontend Developer',
    project: 'User Access & Security',
    responsibilities: 'Protected routes and API integration',
    status: 'Active',
    lastActivity: 'Today',
  },
  {
    id: 'durga',
    name: 'Durga',
    role: 'Frontend Developer',
    project: 'Authentication',
    responsibilities: 'Password recovery flow',
    status: 'Active',
    lastActivity: 'Yesterday',
  },
  {
    id: 'zoey',
    name: 'Zoey',
    role: 'UI/UX',
    project: 'Platform UI',
    responsibilities: 'Responsive design and accessibility',
    status: 'Active',
    lastActivity: 'Yesterday',
  },
  {
    id: 'jordan-lee',
    name: 'Jordan Lee',
    role: 'Team Lead',
    project: 'Team Management',
    responsibilities: 'Sprint planning and delivery oversight',
    status: 'Active',
    lastActivity: 'Today',
  },
  {
    id: 'morgan-taylor',
    name: 'Morgan Taylor',
    role: 'QA Contributor',
    project: 'Analytics & Insights',
    responsibilities: 'Manual testing and QA reporting',
    status: 'Away',
    lastActivity: '3 days ago',
  },
]

export interface DemoProject {
  id: string
  name: string
  owner: string
  progress: number
  priority: 'High' | 'Medium' | 'Low'
  status: 'In Progress' | 'In Review' | 'Testing' | 'Completed'
  lastUpdated: string
}

export const demoProjects: DemoProject[] = [
  {
    id: 'capital-facilitation',
    name: 'Capital Facilitation',
    owner: 'Frontend Team',
    progress: 80,
    priority: 'High',
    status: 'In Progress',
    lastUpdated: 'Today',
  },
  {
    id: 'user-access-security',
    name: 'User Access & Security',
    owner: 'Akhilesh',
    progress: 90,
    priority: 'High',
    status: 'In Review',
    lastUpdated: 'Yesterday',
  },
  {
    id: 'team-management',
    name: 'Team Management',
    owner: 'Jordan Lee',
    progress: 75,
    priority: 'Medium',
    status: 'In Progress',
    lastUpdated: 'Today',
  },
  {
    id: 'analytics-insights',
    name: 'Analytics & Insights',
    owner: 'Morgan Taylor',
    progress: 60,
    priority: 'Medium',
    status: 'In Progress',
    lastUpdated: '2 days ago',
  },
  {
    id: 'mobile-responsiveness',
    name: 'Mobile Responsiveness',
    owner: 'Zoey',
    progress: 85,
    priority: 'Low',
    status: 'Testing',
    lastUpdated: 'Yesterday',
  },
]

export interface DemoCommunicationUpdate {
  id: string
  title: string
  message: string
  meta: string
}

export const demoCommunicationUpdates: DemoCommunicationUpdate[] = [
  {
    id: 'capital-ui-updated',
    title: 'Capital Facilitation UI Updated',
    message: 'Frontend components and responsive layouts have been updated for review.',
    meta: 'Today • Frontend Team',
  },
  {
    id: 'auth-flow-review',
    title: 'Authentication Flow Review',
    message: 'Login, registration and password recovery interfaces have been reviewed.',
    meta: 'Yesterday • User Access Team',
  },
  {
    id: 'weekly-team-meeting',
    title: 'Weekly Team Meeting',
    message: 'Implementation progress and upcoming priorities were discussed.',
    meta: '2 days ago • Team Lead',
  },
  {
    id: 'pr-ready-for-review',
    title: 'Pull Request Ready for Review',
    message: 'Latest frontend implementation has been pushed and is ready for team review.',
    meta: '3 days ago • Development Team',
  },
]

export interface DemoAnnouncement {
  id: string
  title: string
  message: string
  author: string
  date: string
  status: 'Active' | 'Pending' | 'Scheduled'
}

export const demoAnnouncements: DemoAnnouncement[] = [
  {
    id: 'week6-review',
    title: 'Week 6 implementation review',
    message: 'All teams to present current implementation progress in the Week 6 review session.',
    author: 'Team Lead',
    date: 'Today',
    status: 'Active',
  },
  {
    id: 'frontend-pr-pending',
    title: 'Frontend PR review pending',
    message: 'Capital Facilitation frontend PR is awaiting review from the development team.',
    author: 'Development Team',
    date: 'Yesterday',
    status: 'Pending',
  },
  {
    id: 'mobile-testing-scheduled',
    title: 'Mobile testing scheduled',
    message: 'Mobile responsiveness testing has been scheduled for later this week.',
    author: 'QA Team',
    date: '2 days ago',
    status: 'Scheduled',
  },
  {
    id: 'presentation-prep',
    title: 'Next team presentation preparation',
    message: 'Preparation materials for the upcoming project demonstration are due this week.',
    author: 'Team Lead',
    date: '3 days ago',
    status: 'Pending',
  },
]

export type CalendarEventType = 'Meeting' | 'Review' | 'Milestone' | 'Presentation' | 'Code Review'

export interface DemoCalendarEvent {
  id: string
  title: string
  type: CalendarEventType
  time: string
}

export const demoCalendarEvents: DemoCalendarEvent[] = [
  {
    id: 'weekly-team-meeting',
    title: 'Weekly Team Meeting',
    type: 'Meeting',
    time: 'Sunday • 10:00 AM',
  },
  {
    id: 'capital-facilitation-review',
    title: 'Capital Facilitation Review',
    type: 'Review',
    time: 'Wednesday • 3:00 PM',
  },
  {
    id: 'frontend-pr-review',
    title: 'Frontend PR Review',
    type: 'Code Review',
    time: 'Thursday • 2:00 PM',
  },
  {
    id: 'sprint-implementation-deadline',
    title: 'Sprint Implementation Deadline',
    type: 'Milestone',
    time: 'Friday • 5:00 PM',
  },
  {
    id: 'project-demonstration',
    title: 'Project Demonstration',
    type: 'Presentation',
    time: 'Next Week',
  },
]

export const calendarWeekSummary = {
  meetings: 2,
  reviews: 2,
  milestones: 1,
  presentations: 1,
}
