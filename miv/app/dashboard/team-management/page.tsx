"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Briefcase,
  MessageSquare,
  CalendarDays,
  Plus,
  Search,
  Mail,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  MapPin,
  FileText,
  Lightbulb,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// --- Database Types ---
interface TeamMember {
  id: string
  name: string
  role: string
  email: string
  organization?: string
  image?: string
  emailVerified?: Date | null
  createdAt: Date
  updatedAt: Date
  ledProjects: { id: string; name: string; status: string }[]
  projectMemberships: { id: string; name: string; status: string }[]
  assignedTasks: { id: string; name: string; status: string; dueDate?: Date | null }[]
  _count: {
    ledProjects: number
    projectMemberships: number
    assignedTasks: number
  }
}

interface Project {
  id: string
  name: string
  description?: string
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "ON_HOLD" | "CANCELLED"
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  progress: number
  dueDate?: Date | null
  startDate?: Date | null
  completedAt?: Date | null
  lead: {
    id: string
    name: string
    email: string
    role: string
    image?: string
  }
  members: {
    id: string
    name: string
    email: string
    role: string
    image?: string
  }[]
  tasks?: {
    id: string
    name: string
    status: string
    priority: string
    dueDate?: Date | null
    assignedTo?: { id: string; name: string } | null
  }[]
  venture?: {
    id: string
    name: string
    sector: string
  } | null
  _count: {
    tasks: number
    members: number
  }
}

interface Announcement {
  id: string
  title: string
  content: string
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  isActive: boolean
  expiresAt?: Date | null
  createdAt: Date
  updatedAt: Date
  author: {
    id: string
    name: string
    email: string
    role: string
    image?: string
  }
}

interface TeamEvent {
  id: string
  title: string
  description?: string
  date: Date
  time?: string
  location?: string
  isAllDay: boolean
  isRecurring: boolean
  recurrence?: any
  createdAt: Date
  updatedAt: Date
  organizer: {
    id: string
    name: string
    email: string
    role: string
    image?: string
  }
  attendees: {
    id: string
    name: string
    email: string
    role: string
    image?: string
  }[]
  _count: {
    attendees: number
  }
}

// API Functions
const fetchTeamMembers = async (search = '', role = '') => {
  const params = new URLSearchParams()
  if (search) params.append('search', search)
  if (role) params.append('role', role)
  params.append('limit', '50')
  
  const response = await fetch(`/api/team/members?${params}`)
  if (!response.ok) throw new Error('Failed to fetch team members')
  const data = await response.json()
  return data.members
}

const fetchProjects = async (search = '', status = '', leadId = '') => {
  const params = new URLSearchParams()
  if (search) params.append('search', search)
  if (status) params.append('status', status)
  if (leadId) params.append('leadId', leadId)
  params.append('limit', '50')
  
  const response = await fetch(`/api/team/projects?${params}`)
  if (!response.ok) throw new Error('Failed to fetch projects')
  const data = await response.json()
  return data.projects
}

const fetchAnnouncements = async (search = '', priority = '') => {
  const params = new URLSearchParams()
  if (search) params.append('search', search)
  if (priority) params.append('priority', priority)
  params.append('limit', '50')
  params.append('isActive', 'true')
  
  const response = await fetch(`/api/team/announcements?${params}`)
  if (!response.ok) throw new Error('Failed to fetch announcements')
  const data = await response.json()
  return data.announcements
}

const fetchEvents = async (search = '') => {
  const params = new URLSearchParams()
  if (search) params.append('search', search)
  params.append('limit', '50')
  // Get events from today onwards
  params.append('startDate', new Date().toISOString().split('T')[0])
  
  const response = await fetch(`/api/team/events?${params}`)
  if (!response.ok) throw new Error('Failed to fetch events')
  const data = await response.json()
  return data.events
}

// Helper functions for styling
const getStatusColor = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-800 border-green-200"
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "NOT_STARTED":
      return "bg-gray-100 text-gray-800 border-gray-200"
    case "ON_HOLD":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "CANCELLED":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return <CheckCircle className="h-4 w-4" />
    case "IN_PROGRESS":
      return <Clock className="h-4 w-4" />
    case "NOT_STARTED":
      return <AlertCircle className="h-4 w-4" />
    case "ON_HOLD":
      return <AlertCircle className="h-4 w-4" />
    case "CANCELLED":
      return <AlertCircle className="h-4 w-4" />
    default:
      return <FileText className="h-4 w-4" />
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "Completed"
    case "IN_PROGRESS":
      return "In Progress"
    case "NOT_STARTED":
      return "Not Started"
    case "ON_HOLD":
      return "On Hold"
    case "CANCELLED":
      return "Cancelled"
    default:
      return status
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "URGENT":
      return "bg-red-100 text-red-800 border-red-200"
    case "HIGH":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "MEDIUM":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "LOW":
      return "bg-gray-100 text-gray-800 border-gray-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const formatDate = (date: Date | string | null | undefined) => {
  if (!date) return 'No date set'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const formatDateTime = (date: Date | string | null | undefined, time?: string) => {
  if (!date) return 'No date set'
  const d = typeof date === 'string' ? new Date(date) : date
  const dateStr = d.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
  return time ? `${dateStr} at ${time}` : dateStr
}

export default function TeamManagement() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [events, setEvents] = useState<TeamEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [memberSearchQuery, setMemberSearchQuery] = useState("")
  const [projectSearchQuery, setProjectSearchQuery] = useState("")
  
  // Load data on component mount
  useEffect(() => {
    loadAllData()
  }, [])
  
  const loadAllData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [membersData, projectsData, announcementsData, eventsData] = await Promise.all([
        fetchTeamMembers(),
        fetchProjects(),
        fetchAnnouncements(),
        fetchEvents()
      ])
      
      setTeamMembers(membersData)
      setProjects(projectsData)
      setAnnouncements(announcementsData)
      setEvents(eventsData)
    } catch (err) {
      console.error('Error loading team data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load team data')
    } finally {
      setLoading(false)
    }
  }
  
  // Refresh data when search queries change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (memberSearchQuery !== '') {
        fetchTeamMembers(memberSearchQuery).then(setTeamMembers).catch(console.error)
      }
    }, 300)
    return () => clearTimeout(debounceTimer)
  }, [memberSearchQuery])
  
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (projectSearchQuery !== '') {
        fetchProjects(projectSearchQuery).then(setProjects).catch(console.error)
      }
    }, 300)
    return () => clearTimeout(debounceTimer)
  }, [projectSearchQuery])

  // Dialog states for adding new items
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false)
  const [newMember, setNewMember] = useState({
    name: "",
    role: "USER" as const,
    email: "",
    organization: "",
    image: "",
  })

  const [isAddProjectDialogOpen, setIsAddProjectDialogOpen] = useState(false)
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    status: "NOT_STARTED" as const,
    priority: "MEDIUM" as const,
    dueDate: "",
    leadId: "",
    memberIds: [] as string[],
  })

  const [isPostAnnouncementDialogOpen, setIsPostAnnouncementDialogOpen] = useState(false)
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    priority: "MEDIUM" as const,
    authorId: "",
  })

  const [isScheduleEventDialogOpen, setIsScheduleEventDialogOpen] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    organizerId: "",
    attendeeIds: [] as string[],
  })

  // Handlers for adding new items
  const handleAddMember = async () => {
    if (newMember.name && newMember.role && newMember.email) {
      try {
        const response = await fetch('/api/team/members', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newMember),
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to create member')
        }
        
        const createdMember = await response.json()
        setTeamMembers((prev) => [createdMember, ...prev])
        
        // Send welcome email to the new team member
//         try {
//           const emailResponse = await fetch('/api/send-email', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//               to: newMember.email,
//               toName: newMember.name,
//               subject: 'Welcome to the MIV Platform Team!',
//               html: `
//                 <h1>Welcome to the MIV Platform Team!</h1>
//                 <p>Dear ${newMember.name},</p>
//                 <p>We're excited to welcome you to our team at the MIV Platform. You've been added as a <strong>${newMember.role}</strong>.</p>
//                 ${newMember.organization ? `<p>Organization: ${newMember.organization}</p>` : ''}
//                 <p>You can now access the platform and collaborate with your team members on various projects and initiatives.</p>
//                 <p>If you have any questions or need assistance getting started, please don't hesitate to reach out to your team lead.</p>
//                 <p>Best regards,<br>The MIV Platform Team</p>
//               `,
//               text: `Welcome to the MIV Platform Team!

// Dear ${newMember.name},

// We're excited to welcome you to our team at the MIV Platform. You've been added as a ${newMember.role}.
// ${newMember.organization ? `Organization: ${newMember.organization}` : ''}

// You can now access the platform and collaborate with your team members on various projects and initiatives.

// If you have any questions or need assistance getting started, please don't hesitate to reach out to your team lead.

// Best regards,
// The MIV Platform Team`
//             }),
//           })
          
//           if (emailResponse.ok) {
//             console.log('Welcome email sent successfully to:', newMember.email)
//           } else {
//             console.warn('Failed to send welcome email, but member was created successfully')
//           }
//         } catch (emailError) {
//           console.error('Error sending welcome email:', emailError)
//           // Don't fail the entire operation if email sending fails
//         }
        
        setNewMember({ name: "", role: "USER", email: "", organization: "", image: "" })
        setIsAddMemberDialogOpen(false)
      } catch (error) {
        console.error('Error creating member:', error)
        setError(error instanceof Error ? error.message : 'Failed to create member')
      }
    }
  }

  const handleAddProject = async () => {
    if (newProject.name && newProject.leadId) {
      try {
        const response = await fetch('/api/team/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProject),
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to create project')
        }
        
        const createdProject = await response.json()
        setProjects((prev) => [createdProject, ...prev])
        setNewProject({ name: "", description: "", status: "NOT_STARTED", priority: "MEDIUM", dueDate: "", leadId: "", memberIds: [] })
        setIsAddProjectDialogOpen(false)
      } catch (error) {
        console.error('Error creating project:', error)
        setError(error instanceof Error ? error.message : 'Failed to create project')
      }
    }
  }

  const handlePostAnnouncement = async () => {
    if (newAnnouncement.title && newAnnouncement.content && newAnnouncement.authorId) {
      try {
        const response = await fetch('/api/team/announcements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newAnnouncement),
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to create announcement')
        }
        
        const createdAnnouncement = await response.json()
        setAnnouncements((prev) => [createdAnnouncement, ...prev])
        setNewAnnouncement({ title: "", content: "", priority: "MEDIUM", authorId: "" })
        setIsPostAnnouncementDialogOpen(false)
      } catch (error) {
        console.error('Error creating announcement:', error)
        setError(error instanceof Error ? error.message : 'Failed to create announcement')
      }
    }
  }

  const handleScheduleEvent = async () => {
    if (newEvent.title && newEvent.date && newEvent.organizerId) {
      try {
        const response = await fetch('/api/team/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEvent),
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to create event')
        }
        
        const createdEvent = await response.json()
        setEvents((prev) => [createdEvent, ...prev])
        setNewEvent({ title: "", description: "", date: "", time: "", location: "", organizerId: "", attendeeIds: [] })
        setIsScheduleEventDialogOpen(false)
      } catch (error) {
        console.error('Error creating event:', error)
        setError(error instanceof Error ? error.message : 'Failed to create event')
      }
    }
  }

  // Filtered data for display
  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name?.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
      member.role?.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
      member.organization?.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
      member.email?.toLowerCase().includes(memberSearchQuery.toLowerCase()),
  )

  const filteredProjects = projects.filter(
    (project) =>
      project.name?.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
      project.lead?.name?.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
      project.status?.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(projectSearchQuery.toLowerCase()),
  )

  const getMemberNameById = (id: string) => teamMembers.find((m) => m.id === id)?.name || "Unknown"
  
  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading team data...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
              <p className="mt-4 text-red-600 dark:text-red-400">Error: {error}</p>
              <button 
                onClick={loadAllData}
                className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Team Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your team, projects, communications, and events</p>
          </div>
          <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-teal-600 hover:bg-teal-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Team Member</DialogTitle>
                <DialogDescription>Fill in the details for the new team member.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="memberName">Name</Label>
                  <Input
                    id="memberName"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="memberRole">Role</Label>
                  <Select
                    value={newMember.role}
                    onValueChange={(value) => setNewMember({ ...newMember, role: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">User</SelectItem>
                      <SelectItem value="ANALYST">Analyst</SelectItem>
                      <SelectItem value="MANAGER">Manager</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="VENTURE_MANAGER">Venture Manager</SelectItem>
                      <SelectItem value="GEDSI_ANALYST">GEDSI Analyst</SelectItem>
                      <SelectItem value="CAPITAL_FACILITATOR">Capital Facilitator</SelectItem>
                      <SelectItem value="EXTERNAL_STAKEHOLDER">External Stakeholder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="memberEmail">Email</Label>
                  <Input
                    id="memberEmail"
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="memberOrganization">Organization</Label>
                  <Input
                    id="memberOrganization"
                    value={newMember.organization}
                    onChange={(e) => setNewMember({ ...newMember, organization: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="memberImage">Profile Image URL (Optional)</Label>
                  <Input
                    id="memberImage"
                    value={newMember.image}
                    onChange={(e) => setNewMember({ ...newMember, image: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddMemberDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddMember}>Add Member</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="members" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-gray-800">
            <TabsTrigger value="members">
              <Users className="h-4 w-4 mr-2" />
              Members
            </TabsTrigger>
            <TabsTrigger value="projects">
              <Briefcase className="h-4 w-4 mr-2" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="communication">
              <MessageSquare className="h-4 w-4 mr-2" />
              Communication
            </TabsTrigger>
            <TabsTrigger value="calendar">
              <CalendarDays className="h-4 w-4 mr-2" />
              Calendar
            </TabsTrigger>
          </TabsList>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Member Directory</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">Browse and manage your team members</p>
                <div className="relative group mt-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                  <Input
                    placeholder="Search members by name, role, or skill..."
                    value={memberSearchQuery}
                    onChange={(e) => setMemberSearchQuery(e.target.value)}
                    className="pl-10 w-full bg-gray-50 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-teal-500 transition-all duration-200"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map((member) => (
                      <Dialog key={member.id}>
                        <DialogTrigger asChild>
                          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardContent className="p-6 flex flex-col items-center text-center">
                              <Avatar className="h-20 w-20 mb-4">
                                <AvatarImage src={member.image || "/placeholder.svg"} alt={member.name || 'User'} />
                                <AvatarFallback className="bg-teal-100 text-teal-700 text-2xl font-bold">
                                  {(member.name || 'U')
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{member.role}</p>
                              <p className="text-xs text-gray-500 mb-2">{member.organization}</p>
                              <div className="flex flex-wrap justify-center gap-2">
                                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                  {member._count.ledProjects} Projects Led
                                </Badge>
                                <Badge variant="secondary" className="bg-green-100 text-green-700">
                                  {member._count.assignedTasks} Tasks
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle className="flex items-center space-x-2">
                              <User className="h-5 w-5" />
                              <span>{member.name}&apos;s Profile</span>
                            </DialogTitle>
                            <DialogDescription>{member.role}</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="flex items-center space-x-4">
                              <Avatar className="h-24 w-24">
                                <AvatarImage src={member.image || "/placeholder.svg"} alt={member.name || 'User'} />
                                <AvatarFallback className="bg-teal-100 text-teal-700 text-3xl font-bold">
                                  {(member.name || 'U')
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="text-xl font-semibold">{member.name}</h4>
                                <p className="text-gray-600">{member.role}</p>
                                {member.organization && <p className="text-sm text-gray-500">{member.organization}</p>}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h5 className="font-medium flex items-center space-x-2">
                                <Mail className="h-4 w-4" />
                                <span>Contact Information</span>
                              </h5>
                              <p className="text-sm text-gray-700">Email: {member.email}</p>
                              <p className="text-sm text-gray-700">Member since: {formatDate(member.createdAt)}</p>
                              {member.emailVerified && <p className="text-sm text-green-600">✓ Email verified</p>}
                            </div>
                            <div className="space-y-2">
                              <h5 className="font-medium flex items-center space-x-2">
                                <Award className="h-4 w-4" />
                                <span>Activity Summary</span>
                              </h5>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="font-medium text-blue-600">{member._count?.ledProjects}</p>
                                  <p className="text-gray-600">Projects Led</p>
                                </div>
                                <div>
                                  <p className="font-medium text-green-600">{member._count.projectMemberships}</p>
                                  <p className="text-gray-600">Project Memberships</p>
                                </div>
                                <div>
                                  <p className="font-medium text-orange-600">{member._count.assignedTasks}</p>
                                  <p className="text-gray-600">Active Tasks</p>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h5 className="font-medium flex items-center space-x-2">
                                <Briefcase className="h-4 w-4" />
                                <span>Recent Projects</span>
                              </h5>
                              <div className="space-y-2">
                                {member.ledProjects.length > 0 && (
                                  <div>
                                    <p className="text-sm font-medium text-blue-600">Leading:</p>
                                    {member.ledProjects.slice(0, 3).map((project) => (
                                      <div key={project.id} className="text-sm text-gray-700 ml-2">
                                        • {project.name} ({getStatusLabel(project.status)})
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {member.projectMemberships.length > 0 && (
                                  <div>
                                    <p className="text-sm font-medium text-green-600">Member of:</p>
                                    {member.projectMemberships.slice(0, 3).map((project) => (
                                      <div key={project.id} className="text-sm text-gray-700 ml-2">
                                        • {project.name} ({getStatusLabel(project.status)})
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {member.ledProjects.length === 0 && member.projectMemberships.length === 0 && (
                                  <p className="text-sm text-gray-500">No active projects.</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ))
                  ) : (
                    <p className="text-gray-500 col-span-full text-center">No members found matching your search.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Project Management</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Track ongoing projects, deadlines, and tasks
                    </p>
                  </div>
                  <Dialog open={isAddProjectDialogOpen} onOpenChange={setIsAddProjectDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-teal-600 hover:bg-teal-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Project
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Add New Project</DialogTitle>
                        <DialogDescription>Enter the details for the new project.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="projectName">Project Name</Label>
                          <Input
                            id="projectName"
                            value={newProject.name}
                            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="projectDescription">Description</Label>
                          <Textarea
                            id="projectDescription"
                            value={newProject.description}
                            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="projectStatus">Status</Label>
                            <Select
                              value={newProject.status}
                              onValueChange={(value) =>
                                setNewProject({ ...newProject, status: value as any })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="NOT_STARTED">Not Started</SelectItem>
                                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                <SelectItem value="COMPLETED">Completed</SelectItem>
                                <SelectItem value="ON_HOLD">On Hold</SelectItem>
                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="projectPriority">Priority</Label>
                            <Select
                              value={newProject.priority}
                              onValueChange={(value) =>
                                setNewProject({ ...newProject, priority: value as any })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="LOW">Low</SelectItem>
                                <SelectItem value="MEDIUM">Medium</SelectItem>
                                <SelectItem value="HIGH">High</SelectItem>
                                <SelectItem value="URGENT">Urgent</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="projectDueDate">Due Date</Label>
                          <Input
                            id="projectDueDate"
                            type="date"
                            value={newProject.dueDate}
                            onChange={(e) => setNewProject({ ...newProject, dueDate: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="projectLead">Project Lead</Label>
                          <Select
                            value={newProject.leadId}
                            onValueChange={(value) => setNewProject({ ...newProject, leadId: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select lead" />
                            </SelectTrigger>
                            <SelectContent>
                              {teamMembers.map((member) => (
                                <SelectItem key={member.id} value={member.id}>
                                  {member.name} ({member.role})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="projectMembers">Team Members (Optional)</Label>
                          <div className="text-sm text-gray-600 mb-2">
                            Selected: {newProject.memberIds.length === 0 ? 'None' : 
                              newProject.memberIds.map(id => teamMembers.find(m => m.id === id)?.name).join(', ')}
                          </div>
                          <div className="max-h-32 overflow-y-auto border rounded p-2 space-y-1">
                            {teamMembers.map((member) => (
                              <label key={member.id} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={newProject.memberIds.includes(member.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setNewProject({ 
                                        ...newProject, 
                                        memberIds: [...newProject.memberIds, member.id] 
                                      })
                                    } else {
                                      setNewProject({ 
                                        ...newProject, 
                                        memberIds: newProject.memberIds.filter(id => id !== member.id) 
                                      })
                                    }
                                  }}
                                  className="rounded"
                                />
                                <span className="text-sm">{member.name} ({member.role})</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddProjectDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddProject}>Add Project</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="relative group mt-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                  <Input
                    placeholder="Search projects by name, lead, or status..."
                    value={projectSearchQuery}
                    onChange={(e) => setProjectSearchQuery(e.target.value)}
                    className="pl-10 w-full bg-gray-50 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-teal-500 transition-all duration-200"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                      <Dialog key={project.id}>
                        <DialogTrigger asChild>
                          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardContent className="p-6 space-y-4">
                              <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{project.name}</h3>
                                <div className="flex gap-2">
                                  <Badge
                                    variant="outline"
                                    className={`${getPriorityColor(project.priority)} font-medium`}
                                  >
                                    {project.priority}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className={`${getStatusColor(project.status)} font-medium flex items-center space-x-1`}
                                  >
                                    {getStatusIcon(project.status)}
                                    <span>{getStatusLabel(project.status)}</span>
                                  </Badge>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Progress</span>
                                  <span className="font-medium">{project.progress}%</span>
                                </div>
                                <Progress value={project.progress} className="h-2" />
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <p className="text-gray-500">Due Date</p>
                                  <p className="font-medium">{formatDate(project.dueDate)}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Lead</p>
                                  <p className="font-medium">{project.lead.name}</p>
                                </div>
                              </div>
                              {project.description && (
                                <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
                              )}
                              <div className="flex items-center gap-2 mt-2">
                                <Users className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-600">
                                  Team: {project.members.map(m => m.name).join(", ") || 'No members assigned'}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <span>{project._count.tasks} tasks</span>
                                <span>{project._count.members} members</span>
                                {project.venture && <span>Linked to {project.venture.name}</span>}
                              </div>
                            </CardContent>
                          </Card>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle className="flex items-center space-x-2">
                              <Briefcase className="h-5 w-5" />
                              <span>{project.name} Details</span>
                            </DialogTitle>
                            <DialogDescription>Project overview and task assignments.</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                              <h4 className="font-medium">Status & Progress</h4>
                              <div className="flex items-center justify-between text-sm">
                                <span>Status:</span>
                                <Badge variant="outline" className={`${getStatusColor(project.status)}`}>
                                  {project.status}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span>Progress:</span>
                                <span>{project.progress}%</span>
                              </div>
                              <Progress value={project.progress} className="h-2" />
                            </div>
                            <div className="space-y-2">
                              <h4 className="font-medium">Key Information</h4>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-500">Due Date:</p>
                                  <p className="font-medium">{formatDate(project.dueDate)}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Start Date:</p>
                                  <p className="font-medium">{formatDate(project.startDate)}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Project Lead:</p>
                                  <p className="font-medium">{project.lead.name}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Priority:</p>
                                  <Badge variant="outline" className={getPriorityColor(project.priority)}>
                                    {project.priority}
                                  </Badge>
                                </div>
                              </div>
                              {project.description && (
                                <div>
                                  <p className="text-gray-500">Description:</p>
                                  <p className="text-sm text-gray-700">{project.description}</p>
                                </div>
                              )}
                              {project.completedAt && (
                                <div>
                                  <p className="text-gray-500">Completed:</p>
                                  <p className="font-medium text-green-600">{formatDate(project.completedAt)}</p>
                                </div>
                              )}
                            </div>
                            <div className="space-y-2">
                              <h4 className="font-medium">Team Members</h4>
                              <div className="flex flex-wrap gap-2">
                                {project.members.map((member) => (
                                  <Badge key={member.id} variant="secondary" className="flex items-center gap-1">
                                    <Avatar className="h-4 w-4">
                                      <AvatarImage src={member.image || "/placeholder.svg"} />
                                      <AvatarFallback className="text-xs">
                                        {(member.name || 'U')
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                    {member.name} ({member.role})
                                  </Badge>
                                ))}
                                {project.members.length === 0 && (
                                  <p className="text-sm text-gray-500">No team members assigned.</p>
                                )}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h4 className="font-medium">Recent Tasks</h4>
                              <div className="space-y-2">
                                {project.tasks && project.tasks.length > 0 ? (
                                  project.tasks.slice(0, 5).map((task) => (
                                    <div key={task.id} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                                      <div>
                                        <span className={task.status === 'COMPLETED' ? "line-through text-gray-500" : ""}>
                                          {task.name}
                                        </span>
                                        {task.assignedTo && (
                                          <p className="text-xs text-gray-500">Assigned to: {task.assignedTo.name}</p>
                                        )}
                                        {task.dueDate && (
                                          <p className="text-xs text-gray-500">Due: {formatDate(task.dueDate)}</p>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                          {task.priority}
                                        </Badge>
                                        {task.status === 'COMPLETED' ? (
                                          <CheckCircle className="h-4 w-4 text-green-500" />
                                        ) : (
                                          <Clock className="h-4 w-4 text-gray-400" />
                                        )}
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-sm text-gray-500">No tasks defined for this project.</p>
                                )}
                                {project._count.tasks > 5 && (
                                  <p className="text-xs text-gray-500">And {project._count.tasks - 5} more tasks...</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ))
                  ) : (
                    <p className="text-gray-500 col-span-full text-center">No projects found matching your search.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Communication Tab */}
          <TabsContent value="communication" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Team Communication</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Announcements and important updates</p>
                  </div>
                  <Dialog open={isPostAnnouncementDialogOpen} onOpenChange={setIsPostAnnouncementDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-teal-600 hover:bg-teal-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Post Announcement
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Post New Announcement</DialogTitle>
                        <DialogDescription>Share important news with the team.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="announcementTitle">Title</Label>
                          <Input
                            id="announcementTitle"
                            value={newAnnouncement.title}
                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="announcementContent">Content</Label>
                          <Textarea
                            id="announcementContent"
                            value={newAnnouncement.content}
                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                            rows={5}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="announcementPriority">Priority</Label>
                            <Select
                              value={newAnnouncement.priority}
                              onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, priority: value as any })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="LOW">Low</SelectItem>
                                <SelectItem value="MEDIUM">Medium</SelectItem>
                                <SelectItem value="HIGH">High</SelectItem>
                                <SelectItem value="URGENT">Urgent</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="announcementAuthor">Author</Label>
                            <Select
                              value={newAnnouncement.authorId}
                              onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, authorId: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select author" />
                              </SelectTrigger>
                              <SelectContent>
                                {teamMembers.filter(m => ['ADMIN', 'MANAGER'].includes(m.role)).map((member) => (
                                  <SelectItem key={member.id} value={member.id}>
                                    {member.name} ({member.role})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsPostAnnouncementDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handlePostAnnouncement}>Post Announcement</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {announcements.length > 0 ? (
                    announcements.map((announcement) => (
                      <Card
                        key={announcement.id}
                        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <CardContent className="p-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{announcement.title}</h3>
                            <Badge variant="outline" className={getPriorityColor(announcement.priority)}>
                              {announcement.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{announcement.content}</p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-gray-500">
                              Posted by {announcement.author.name} on {formatDate(announcement.createdAt)}
                            </p>
                            {announcement.expiresAt && (
                              <p className="text-xs text-orange-500">
                                Expires: {formatDate(announcement.expiresAt)}
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center">No announcements yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Team Calendar</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Schedule meetings and events</p>
                  </div>
                  <Dialog open={isScheduleEventDialogOpen} onOpenChange={setIsScheduleEventDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-teal-600 hover:bg-teal-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Schedule Event
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Schedule New Event</DialogTitle>
                        <DialogDescription>Add a new meeting or event to the team calendar.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="eventTitle">Event Title</Label>
                          <Input
                            id="eventTitle"
                            value={newEvent.title}
                            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="eventDescription">Description</Label>
                          <Textarea
                            id="eventDescription"
                            value={newEvent.description}
                            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="eventDate">Date</Label>
                            <Input
                              id="eventDate"
                              type="date"
                              value={newEvent.date}
                              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="eventTime">Time (Optional)</Label>
                            <Input
                              id="eventTime"
                              type="time"
                              value={newEvent.time}
                              onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="eventLocation">Location</Label>
                          <Input
                            id="eventLocation"
                            value={newEvent.location}
                            onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="eventOrganizer">Organizer</Label>
                          <Select
                            value={newEvent.organizerId}
                            onValueChange={(value) => setNewEvent({ ...newEvent, organizerId: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select organizer" />
                            </SelectTrigger>
                            <SelectContent>
                              {teamMembers.map((member) => (
                                <SelectItem key={member.id} value={member.id}>
                                  {member.name} ({member.role})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="eventAttendees">Attendees</Label>
                          <div className="text-sm text-gray-600 mb-2">
                            Selected: {newEvent.attendeeIds.length === 0 ? 'None' : 
                              newEvent.attendeeIds.map(id => teamMembers.find(m => m.id === id)?.name).join(', ')}
                          </div>
                          <div className="max-h-32 overflow-y-auto border rounded p-2 space-y-1">
                            {teamMembers.map((member) => (
                              <label key={member.id} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={newEvent.attendeeIds.includes(member.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setNewEvent({ 
                                        ...newEvent, 
                                        attendeeIds: [...newEvent.attendeeIds, member.id] 
                                      })
                                    } else {
                                      setNewEvent({ 
                                        ...newEvent, 
                                        attendeeIds: newEvent.attendeeIds.filter(id => id !== member.id) 
                                      })
                                    }
                                  }}
                                  className="rounded"
                                />
                                <span className="text-sm">{member.name} ({member.role})</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsScheduleEventDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleScheduleEvent}>Schedule Event</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Upcoming Events</h3>
                  <div className="space-y-3">
                    {events.length > 0 ? (
                      events
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .map((event) => (
                          <Card
                            key={event.id}
                            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            <CardContent className="p-0">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-gray-900 dark:text-white">{event.title}</h4>
                                {event.isAllDay && (
                                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                    All Day
                                  </Badge>
                                )}
                              </div>
                              {event.description && (
                                <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                              )}
                              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {formatDateTime(event.date, event.time)}
                                </span>
                              </p>
                              {event.location && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{event.location}</span>
                                </p>
                              )}
                              <div className="flex items-center justify-between mt-2">
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {event._count.attendees} attendees
                                </p>
                                <p className="text-xs text-gray-500">
                                  Organized by {event.organizer.name}
                                </p>
                              </div>
                              {event.isRecurring && (
                                <p className="text-xs text-blue-500 mt-1">
                                  🔄 Recurring event
                                </p>
                              )}
                            </CardContent>
                          </Card>
                        ))
                    ) : (
                      <p className="text-gray-500 text-center">No upcoming events.</p>
                    )}
                  </div>
                  {/* Simple Calendar Grid Placeholder */}
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Monthly View (Placeholder)</h3>
                    <div className="grid grid-cols-7 gap-1 text-center text-sm">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div key={day} className="font-medium text-gray-700 dark:text-gray-300">
                          {day}
                        </div>
                      ))}
                      {Array.from({ length: 30 }).map((_, i) => (
                        <div
                          key={i}
                          className={`p-2 rounded-md ${
                            i + 1 === new Date().getDate()
                              ? "bg-teal-100 text-teal-800 font-bold"
                              : "bg-gray-50 dark:bg-gray-700"
                          }`}
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
