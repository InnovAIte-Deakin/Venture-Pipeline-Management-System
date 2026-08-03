"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Edit, Eye, Share2, Star, Trash2 } from "lucide-react"

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
      return (
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
                            onClick={() => alert(`Opening dashboard: ${dashboard.name}`)}
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
                            onClick={() => alert(`Sharing options for: ${dashboard.name}`)}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
  )
}