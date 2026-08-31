"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Search, Calendar, AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { OperationTask } from "../types/fund-management"

interface OperationsSectionProps {
  operationTasks: OperationTask[]
  loading?: boolean
}

export function OperationsSection({ operationTasks, loading = false }: Readonly<OperationsSectionProps>) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPriority, setSelectedPriority] = useState("all")
  const [viewType, setViewType] = useState<"board" | "list">("board")
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set())

  const filteredTasks = operationTasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = selectedPriority === "all" || task.priority === selectedPriority
    return matchesSearch && matchesPriority
  })

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-800"
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800"
      case "LOW":
        return "bg-green-100 text-green-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const getPriorityIcon = (priority?: string) => {
    switch (priority) {
      case "HIGH":
        return <AlertCircle className="h-4 w-4" />
      case "MEDIUM":
        return <Clock className="h-4 w-4" />
      case "LOW":
        return <CheckCircle2 className="h-4 w-4" />
      default:
        return null
    }
  }

  const toggleTaskCompletion = (taskId: string) => {
    const newCompleted = new Set(completedTasks)
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId)
    } else {
      newCompleted.add(taskId)
    }
    setCompletedTasks(newCompleted)
  }

  // Group tasks by status for board view
  const tasksByStatus = {
    todo: filteredTasks.filter((t) => !completedTasks.has(t.id)),
    done: filteredTasks.filter((t) => completedTasks.has(t.id)),
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={selectedPriority} onValueChange={setSelectedPriority}>
          <SelectTrigger>
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="LOW">Low</SelectItem>
          </SelectContent>
        </Select>

        <div />

        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* View Toggle */}
      <div className="hidden sm:flex gap-2">
        <Button
          variant={viewType === "board" ? "default" : "outline"}
          onClick={() => setViewType("board")}
        >
          Board View
        </Button>
        <Button
          variant={viewType === "list" ? "default" : "outline"}
          onClick={() => setViewType("list")}
        >
          List View
        </Button>
      </div>

      {/* Board View (Kanban) */}
      {viewType === "board" && (
        <div className="hidden sm:grid grid-cols-2 gap-4">
          {/* To Do Column */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">To Do</CardTitle>
              <CardDescription>{tasksByStatus.todo.length} tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 max-h-96 overflow-y-auto">
              {tasksByStatus.todo.map((task) => (
                <Card key={task.id} className="p-3 cursor-pointer hover:bg-slate-50">
                  <div className="flex gap-2">
                    <Checkbox
                      checked={completedTasks.has(task.id)}
                      onCheckedChange={() => toggleTaskCompletion(task.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-2">{task.title}</p>
                      <div className="flex gap-1 flex-wrap mt-2">
                        {task.priority && (
                          <Badge className={`${getPriorityColor(task.priority)} text-xs`}>
                            {task.priority}
                          </Badge>
                        )}
                        {task.dueDate && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {task.dueDate}
                          </div>
                        )}
                      </div>
                      {task.assignee && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {task.assignee.name}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Done Column */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Done</CardTitle>
              <CardDescription>{tasksByStatus.done.length} tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 max-h-96 overflow-y-auto">
              {tasksByStatus.done.map((task) => (
                <Card key={task.id} className="p-3 cursor-pointer hover:bg-slate-50 opacity-75">
                  <div className="flex gap-2">
                    <Checkbox
                      checked={completedTasks.has(task.id)}
                      onCheckedChange={() => toggleTaskCompletion(task.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-2 line-through text-muted-foreground">
                        {task.title}
                      </p>
                      <div className="flex gap-1 flex-wrap mt-2">
                        {task.priority && (
                          <Badge className={`${getPriorityColor(task.priority)} text-xs`}>
                            {task.priority}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* List View */}
      {viewType === "list" && (
        <Card className="hidden sm:block">
          <CardHeader>
            <CardTitle>Operations Tasks</CardTitle>
            <CardDescription>{filteredTasks.length} tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-slate-50 transition"
                >
                  <Checkbox
                    checked={completedTasks.has(task.id)}
                    onCheckedChange={() => toggleTaskCompletion(task.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-medium ${
                        completedTasks.has(task.id)
                          ? "line-through text-muted-foreground"
                          : ""
                      }`}
                    >
                      {task.title}
                    </p>
                    <div className="flex gap-2 flex-wrap mt-1">
                      {task.priority && (
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      )}
                      {task.dueDate && (
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="h-3 w-3 mr-1" />
                          {task.dueDate}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {task.assignee && (
                    <div className="text-right">
                      <p className="text-sm font-medium">{task.assignee.name}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mobile View */}
      <div className="sm:hidden space-y-2">
        {filteredTasks.map((task) => (
          <Card key={task.id}>
            <CardContent className="pt-4">
              <div className="flex gap-3">
                <Checkbox
                  checked={completedTasks.has(task.id)}
                  onCheckedChange={() => toggleTaskCompletion(task.id)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm ${completedTasks.has(task.id) ? 'line-through text-muted-foreground' : ''}`}>
                    {task.title}
                  </p>
                  <div className="flex gap-1 flex-wrap mt-2">
                    {task.priority && (
                      <Badge className={`${getPriorityColor(task.priority)} text-xs`}>
                        {task.priority}
                      </Badge>
                    )}
                    {task.dueDate && (
                      <Badge variant="outline" className="text-xs">
                        {task.dueDate}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredTasks.length === 0 && !loading && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No operations tasks found matching your filters.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
