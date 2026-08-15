// "use client"

// import { useState } from "react"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Switch } from "@/components/ui/switch"
// import {
//   Copy,
//   Edit,
//   Eye,
//   Share2,
//   Star,
//   Trash2,
//   LayoutDashboard,
//   Zap,
//   X,
//   Check,
//   Link as LinkIcon,
// } from "lucide-react"

// export interface Dashboard {
//   id: string
//   name: string
//   description: string
//   category: string
//   widgets: number
//   lastModified: string
//   isPublic: boolean
//   isFavorite: boolean
//   createdBy: string
// }

// interface DashboardCardProps {
//   dashboard: Dashboard
//   handleToggleFavorite: (dashboardId: string) => void
//   handleDuplicateDashboard: (dashboard: Dashboard) => void
//   handleDeleteDashboard: (dashboardId: string) => void
//   handleEditDashboard: (dashboard: Dashboard) => void
// }

// export default function DashboardCard({
//   dashboard,
//   handleToggleFavorite,
//   handleDuplicateDashboard,
//   handleDeleteDashboard,
//   handleEditDashboard,
// }: DashboardCardProps) {
//   const [viewOpen, setViewOpen] = useState(false)
//   const [shareOpen, setShareOpen] = useState(false)
//   const [copied, setCopied] = useState(false)

//   const handleManageWidgets = (d: Dashboard) => {
//     setViewOpen(false)
//     alert("Widget management coming soon!")
//   }

//   const shareUrl =
//     typeof window !== "undefined"
//       ? `${window.location.origin}/dashboard/custom-dashboards/${dashboard.id}`
//       : `/dashboard/custom-dashboards/${dashboard.id}`

//   const handleCopyLink = async () => {
//     try {
//       await navigator.clipboard.writeText(shareUrl)
//       setCopied(true)
//       setTimeout(() => setCopied(false), 2000)
//     } catch {
//       // Clipboard API can fail (permissions, insecure context) — fail silently or add a toast here
//     }
//   }

//   return (
//     <>
//       <Card className="relative group hover:shadow-lg transition-shadow">
//         <CardHeader className="pb-3">
//           <div className="flex items-start justify-between">
//             <div className="flex-1">
//               <div className="flex items-center gap-2 mb-2">
//                 <CardTitle className="text-lg">{dashboard.name}</CardTitle>
//                 {dashboard.isFavorite && (
//                   <Star className="h-4 w-4 text-yellow-500 fill-current" />
//                 )}
//                 {dashboard.isPublic && (
//                   <Badge variant="outline" className="text-xs">Public</Badge>
//                 )}
//               </div>
//               <CardDescription className="text-sm">
//                 {dashboard.description}
//               </CardDescription>
//             </div>
//             <div className="opacity-0 group-hover:opacity-100 transition-opacity">
//               <div className="flex items-center gap-1">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={(e) => {
//                     e.stopPropagation()
//                     handleToggleFavorite(dashboard.id)
//                   }}
//                 >
//                   <Star className={`h-4 w-4 ${dashboard.isFavorite ? 'text-yellow-500 fill-current' : ''}`} />
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={(e) => {
//                     e.stopPropagation()
//                     handleDuplicateDashboard(dashboard)
//                   }}
//                 >
//                   <Copy className="h-4 w-4" />
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={(e) => {
//                     e.stopPropagation()
//                     handleDeleteDashboard(dashboard.id)
//                   }}
//                 >
//                   <Trash2 className="h-4 w-4 text-red-500" />
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent className="pt-0">
//           <div className="space-y-3">
//             <div className="flex items-center justify-between text-sm">
//               <span className="text-muted-foreground">Widgets</span>
//               <span className="font-medium">{dashboard.widgets}</span>
//             </div>
//             <div className="flex items-center justify-between text-sm">
//               <span className="text-muted-foreground">Category</span>
//               <Badge variant="secondary" className="text-xs">{dashboard.category}</Badge>
//             </div>
//             <div className="flex items-center justify-between text-sm">
//               <span className="text-muted-foreground">Last modified</span>
//               <span className="text-muted-foreground">{dashboard.lastModified}</span>
//             </div>
//             <div className="flex items-center justify-between text-sm">
//               <span className="text-muted-foreground">Created by</span>
//               <span className="text-muted-foreground">{dashboard.createdBy}</span>
//             </div>

//             <div className="flex items-center gap-2 pt-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="flex-1"
//                 onClick={() => setViewOpen(true)}
//               >
//                 <Eye className="mr-2 h-4 w-4" />
//                 View
//               </Button>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="flex-1"
//                 onClick={() => handleEditDashboard(dashboard)}
//               >
//                 <Edit className="mr-2 h-4 w-4" />
//                 Edit
//               </Button>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setShareOpen(true)}
//               >
//                 <Share2 className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* View Dashboard dialog */}
//       <Dialog open={viewOpen} onOpenChange={setViewOpen}>
//         <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2 text-lg">
//               <Eye className="h-5 w-5" />
//               View Dashboard
//             </DialogTitle>
//             <DialogDescription>Dashboard details and configuration</DialogDescription>
//           </DialogHeader>

//           <div className="space-y-5 py-2">
//             <div className="space-y-1.5">
//               <label className="text-sm font-medium">Dashboard Name</label>
//               <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm">
//                 {dashboard.name}
//               </div>
//             </div>

//             <div className="space-y-1.5">
//               <label className="text-sm font-medium">Description</label>
//               <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
//                 {dashboard.description?.trim() ? dashboard.description : "No description provided"}
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-1.5">
//                 <label className="text-sm font-medium">Category</label>
//                 <div>
//                   <Badge variant="secondary" className="font-normal">
//                     {dashboard.category}
//                   </Badge>
//                 </div>
//               </div>
//               <div className="space-y-1.5">
//                 <label className="text-sm font-medium">Visibility</label>
//                 <div className="flex items-center gap-2">
//                   <Switch checked={dashboard.isPublic} disabled />
//                   <span className="text-sm">{dashboard.isPublic ? "Public" : "Private"}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="rounded-lg border bg-muted/40 p-4 space-y-2">
//               <div className="flex items-center gap-2 font-medium text-sm">
//                 <LayoutDashboard className="h-4 w-4 text-blue-600" />
//                 Dashboard Info
//               </div>
//               <div className="text-sm text-muted-foreground space-y-1">
//                 <p>Widgets: {dashboard.widgets}</p>
//                 <p>Last modified: {dashboard.lastModified}</p>
//                 <p>Created by: {dashboard.createdBy}</p>
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center justify-between border-t pt-4">
//             <Button variant="outline" size="sm" onClick={() => handleManageWidgets(dashboard)}>
//               <Zap className="h-4 w-4 mr-1.5" />
//               Manage Widgets
//             </Button>
//             <Button size="sm" onClick={() => setViewOpen(false)}>
//               <X className="h-4 w-4 mr-1.5" />
//               Close
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Share Dashboard dialog */}
// {/* Share Dashboard dialog */}
// <Dialog open={shareOpen} onOpenChange={setShareOpen}>
//   <DialogContent className="w-[calc(100vw-2rem)] overflow-hidden sm:max-w-md">
//     {/* Status colour */}
//     <div
//       className={`-mx-6 -mt-6 mb-2 h-1.5 ${
//         dashboard.isPublic ? "bg-green-500" : "bg-amber-500"
//       }`}
//     />

//     <DialogHeader>
//       <div className="flex min-w-0 items-center gap-4">
//         <div
//           className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
//             dashboard.isPublic ? "bg-green-100" : "bg-amber-100"
//           }`}
//         >
//           <Share2
//             className={`h-6 w-6 ${
//               dashboard.isPublic ? "text-green-600" : "text-amber-600"
//             }`}
//           />
//         </div>

//         <div className="min-w-0 text-left">
//           <DialogTitle className="text-lg leading-tight">
//             Share Dashboard
//           </DialogTitle>

//           <DialogDescription className="mt-0.5 truncate">
//             {dashboard.name}
//           </DialogDescription>
//         </div>
//       </div>
//     </DialogHeader>

//     <div className="min-w-0 space-y-4 py-2">
//       {/* Visibility */}
//       <div className="flex min-w-0 items-start gap-2">
//         <span
//           className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
//             dashboard.isPublic
//               ? "bg-green-100 text-green-700"
//               : "bg-amber-100 text-amber-700"
//           }`}
//         >
//           <span
//             className={`h-1.5 w-1.5 rounded-full ${
//               dashboard.isPublic ? "bg-green-500" : "bg-amber-500"
//             }`}
//           />

//           {dashboard.isPublic ? "Public" : "Private"}
//         </span>

//         <span className="min-w-0 pt-0.5 text-sm leading-5 text-muted-foreground">
//           {dashboard.isPublic
//             ? "Anyone with the link can view this dashboard"
//             : "Only people with access can view this via the link"}
//         </span>
//       </div>

//       {/* Shareable URL */}
//       <div className="min-w-0 space-y-2">
//         <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
//           Shareable Link
//         </p>

//         <div className="flex min-w-0 items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2">
//           <LinkIcon className="h-4 w-4 shrink-0 text-muted-foreground" />

//           <span
//             className="block min-w-0 flex-1 truncate font-mono text-xs text-foreground"
//             title={shareUrl}
//           >
//             {shareUrl}
//           </span>
//         </div>

//         <Button
//           type="button"
//           size="sm"
//           onClick={handleCopyLink}
//           className={`w-full ${
//             copied ? "bg-green-600 hover:bg-green-600" : ""
//           }`}
//         >
//           {copied ? (
//             <>
//               <Check className="mr-1.5 h-4 w-4" />
//               Copied to clipboard
//             </>
//           ) : (
//             <>
//               <Copy className="mr-1.5 h-4 w-4" />
//               Copy link
//             </>
//           )}
//         </Button>
//       </div>
//     </div>

//     {/* Footer */}
//     <div className="flex justify-end border-t pt-4">
//       <Button
//         type="button"
//         variant="outline"
//         size="sm"
//         onClick={() => setShareOpen(false)}
//       >
//         <X className="mr-1.5 h-4 w-4" />
//         Close
//       </Button>
//     </div>
//   </DialogContent>
// </Dialog>
//     </>
//   )
// }
"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Copy,
  Edit,
  Eye,
  Share2,
  Star,
  Trash2,
  LayoutDashboard,
  Zap,
  X,
  Check,
  Link as LinkIcon,
} from "lucide-react"
import ManageWidgetsDialog from "./custom-dashboards/manage-widgets-dialog"
import type { Widget } from "./custom-dashboards/widget-types"

export interface Dashboard {
  id: string
  name: string
  description: string
  category: string
  widgets: number
  lastModified: string
  isPublic: boolean
  isFavorite: boolean
  createdBy: string
}

interface DashboardCardProps {
  dashboard: Dashboard
  handleToggleFavorite: (dashboardId: string) => void
  handleDuplicateDashboard: (dashboard: Dashboard) => void
  handleDeleteDashboard: (dashboardId: string) => void
  handleEditDashboard: (dashboard: Dashboard) => void
}

export default function DashboardCard({
  dashboard,
  handleToggleFavorite,
  handleDuplicateDashboard,
  handleDeleteDashboard,
  handleEditDashboard,
}: DashboardCardProps) {
  const [viewOpen, setViewOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [widgetsOpen, setWidgetsOpen] = useState(false)
  const [widgets, setWidgets] = useState<Widget[]>([]) // TODO: load from API, keyed by dashboard.id

  const handleManageWidgets = (d: Dashboard) => {
    setViewOpen(false)
    setWidgetsOpen(true)
  }

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/dashboard/custom-dashboards/${dashboard.id}`
      : `/dashboard/custom-dashboards/${dashboard.id}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API can fail (permissions, insecure context) — fail silently or add a toast here
    }
  }

  return (
    <>
      <Card className="relative group hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-lg">{dashboard.name}</CardTitle>
                {dashboard.isFavorite && (
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                )}
                {dashboard.isPublic && (
                  <Badge variant="outline" className="text-xs">Public</Badge>
                )}
              </div>
              <CardDescription className="text-sm">
                {dashboard.description}
              </CardDescription>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleToggleFavorite(dashboard.id)
                  }}
                >
                  <Star className={`h-4 w-4 ${dashboard.isFavorite ? 'text-yellow-500 fill-current' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDuplicateDashboard(dashboard)
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteDashboard(dashboard.id)
                  }}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Widgets</span>
              <span className="font-medium">{dashboard.widgets}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Category</span>
              <Badge variant="secondary" className="text-xs">{dashboard.category}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Last modified</span>
              <span className="text-muted-foreground">{dashboard.lastModified}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Created by</span>
              <span className="text-muted-foreground">{dashboard.createdBy}</span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setViewOpen(true)}
              >
                <Eye className="mr-2 h-4 w-4" />
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => handleEditDashboard(dashboard)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShareOpen(true)}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Dashboard dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Eye className="h-5 w-5" />
              View Dashboard
            </DialogTitle>
            <DialogDescription>Dashboard details and configuration</DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Dashboard Name</label>
              <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm">
                {dashboard.name}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Description</label>
              <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                {dashboard.description?.trim() ? dashboard.description : "No description provided"}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Category</label>
                <div>
                  <Badge variant="secondary" className="font-normal">
                    {dashboard.category}
                  </Badge>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Visibility</label>
                <div className="flex items-center gap-2">
                  <Switch checked={dashboard.isPublic} disabled />
                  <span className="text-sm">{dashboard.isPublic ? "Public" : "Private"}</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-muted/40 p-4 space-y-2">
              <div className="flex items-center gap-2 font-medium text-sm">
                <LayoutDashboard className="h-4 w-4 text-blue-600" />
                Dashboard Info
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Widgets: {dashboard.widgets}</p>
                <p>Last modified: {dashboard.lastModified}</p>
                <p>Created by: {dashboard.createdBy}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t pt-4">
            <Button variant="outline" size="sm" onClick={() => handleManageWidgets(dashboard)}>
              <Zap className="h-4 w-4 mr-1.5" />
              Manage Widgets
            </Button>
            <Button size="sm" onClick={() => setViewOpen(false)}>
              <X className="h-4 w-4 mr-1.5" />
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Dashboard dialog */}
      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] overflow-hidden sm:max-w-md">
          <div
            className={`-mx-6 -mt-6 mb-2 h-1.5 ${
              dashboard.isPublic ? "bg-green-500" : "bg-amber-500"
            }`}
          />

          <DialogHeader>
            <div className="flex min-w-0 items-center gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                  dashboard.isPublic ? "bg-green-100" : "bg-amber-100"
                }`}
              >
                <Share2
                  className={`h-6 w-6 ${
                    dashboard.isPublic ? "text-green-600" : "text-amber-600"
                  }`}
                />
              </div>

              <div className="min-w-0 text-left">
                <DialogTitle className="text-lg leading-tight">
                  Share Dashboard
                </DialogTitle>

                <DialogDescription className="mt-0.5 truncate">
                  {dashboard.name}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="min-w-0 space-y-4 py-2">
            <div className="flex min-w-0 items-start gap-2">
              <span
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                  dashboard.isPublic
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    dashboard.isPublic ? "bg-green-500" : "bg-amber-500"
                  }`}
                />

                {dashboard.isPublic ? "Public" : "Private"}
              </span>

              <span className="min-w-0 pt-0.5 text-sm leading-5 text-muted-foreground">
                {dashboard.isPublic
                  ? "Anyone with the link can view this dashboard"
                  : "Only people with access can view this via the link"}
              </span>
            </div>

            <div className="min-w-0 space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Shareable Link
              </p>

              <div className="flex min-w-0 items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2">
                <LinkIcon className="h-4 w-4 shrink-0 text-muted-foreground" />

                <span
                  className="block min-w-0 flex-1 truncate font-mono text-xs text-foreground"
                  title={shareUrl}
                >
                  {shareUrl}
                </span>
              </div>

              <Button
                type="button"
                size="sm"
                onClick={handleCopyLink}
                className={`w-full ${
                  copied ? "bg-green-600 hover:bg-green-600" : ""
                }`}
              >
                {copied ? (
                  <>
                    <Check className="mr-1.5 h-4 w-4" />
                    Copied to clipboard
                  </>
                ) : (
                  <>
                    <Copy className="mr-1.5 h-4 w-4" />
                    Copy link
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="flex justify-end border-t pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShareOpen(false)}
            >
              <X className="mr-1.5 h-4 w-4" />
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manage Widgets dialog */}
      <ManageWidgetsDialog
        dashboard={dashboard}
        open={widgetsOpen}
        onOpenChange={setWidgetsOpen}
        widgets={widgets}
        onWidgetsChange={setWidgets}
      />
    </>
  )
}