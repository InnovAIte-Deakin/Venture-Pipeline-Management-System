import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Edit, Eye, MessageSquare, MoreHorizontal, Plus, Shield } from "lucide-react"
import { getPriorityBadge, getStatusBadge, getStatusIcon } from "../../lib/due-diligence-formatters"
import type { DueDiligenceItem } from "../../types/due-diligence.types"
import { MobileItemCard } from "../mobile/mobile-item-card"
import { DueDiligencePagination } from "./due-diligence-pagination"

interface DueDiligenceItemsTableProps {
  selectedVentureForDetails: string | null
  filteredItems: DueDiligenceItem[]
  paginatedItems: DueDiligenceItem[]
  selectedItems: string[]
  setSelectedItems: (items: string[] | ((previous: string[]) => string[])) => void
  searchTerm: string
  selectedCategory: string
  selectedStage: string
  currentPage: number
  totalPages: number
  startIndex: number
  endIndex: number
  onPageChange: (page: number) => void
  onViewItem: (item: DueDiligenceItem) => void
  onEditItem: (item: DueDiligenceItem) => void
  onCommentItem: (item: DueDiligenceItem) => void
  onMoreActions: (item: DueDiligenceItem) => void
  onClearEmptyFilters: () => void
  onStartDueDiligence: () => void
}

export function DueDiligenceItemsTable({
  selectedVentureForDetails,
  filteredItems,
  paginatedItems,
  selectedItems,
  setSelectedItems,
  searchTerm,
  selectedCategory,
  selectedStage,
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  onPageChange,
  onViewItem,
  onEditItem,
  onCommentItem,
  onMoreActions,
  onClearEmptyFilters,
  onStartDueDiligence
}: DueDiligenceItemsTableProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-0">
          <div>
            <CardTitle>
              {selectedVentureForDetails
                ? `${selectedVentureForDetails} Due Diligence Items (${filteredItems.length} total)`
                : `Due Diligence Items (${filteredItems.length} total)`
              }
            </CardTitle>
            <CardDescription>
              {selectedVentureForDetails
                ? `Detailed view of all due diligence categories for ${selectedVentureForDetails}`
                : "Track progress of due diligence activities"
              }
            </CardDescription>
          </div>
          {selectedItems.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {selectedItems.length} selected
              </span>
              <Button variant="outline" size="sm" onClick={() => {
                alert(`Bulk update ${selectedItems.length} items (Demo)`)
              }}>
                Bulk Update
              </Button>
              <Button variant="outline" size="sm" onClick={() => {
                alert(`Export ${selectedItems.length} items (Demo)`)
              }}>
                Export Selected
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSelectedItems([])}>
                Clear Selection
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Due Diligence Items Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedCategory !== "all" || selectedStage !== "all"
                ? "No items match your current filters"
                : "No ventures found in database"}
            </p>
            <div className="flex flex-col justify-center gap-2 sm:flex-row">
              <Button variant="outline" onClick={onClearEmptyFilters}>
                Clear Filters
              </Button>
              <Button onClick={onStartDueDiligence}>
                <Plus className="h-4 w-4 mr-2" />
                Start Due Diligence
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="hidden rounded-md border md:block">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12.5">
                      <Checkbox
                        checked={selectedItems.length === paginatedItems.length && paginatedItems.length > 0}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedItems(paginatedItems.map((item) => item.id))
                          } else {
                            setSelectedItems([])
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead className="w-50">Company</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead className="w-35">Progress</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="w-30">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedItems.map((item) => {
                    const isOverdue = new Date(item.dueDate) < new Date()
                    const daysUntilDue = Math.ceil((new Date(item.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

                    return (
                      <TableRow
                        key={item.id}
                        className={`hover:bg-muted/50 transition-colors ${
                          isOverdue ? "bg-red-50 dark:bg-red-950/30" :
                          daysUntilDue <= 3 ? "bg-yellow-50 dark:bg-yellow-950/30" : ""
                        }`}
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedItems([...selectedItems, item.id])
                              } else {
                                setSelectedItems(selectedItems.filter((id) => id !== item.id))
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium flex items-center gap-2">
                              {item.company}
                              {isOverdue && <Badge variant="destructive" className="text-xs">Overdue</Badge>}
                              {!isOverdue && daysUntilDue <= 3 && daysUntilDue > 0 && (
                                <Badge variant="outline" className="text-xs text-yellow-600">Due Soon</Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">{item.id}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">{item.stage}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              item.category === "Financial" ? "bg-green-500" :
                              item.category === "Legal" ? "bg-blue-500" :
                              item.category === "Technical" ? "bg-purple-500" :
                              "bg-orange-500"
                            }`} />
                            <span className="text-sm">{item.category}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-medium text-blue-600 dark:text-blue-300">
                              {item.assignedTo.split(" ").map((name) => name[0]).join("")}
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-medium truncate">{item.assignedTo}</div>
                              <div className="text-xs text-muted-foreground">{item.lastUpdated}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Progress
                                value={item.completion}
                                className={`w-20 h-2 ${
                                  item.completion >= 80 ? "[&>div]:bg-green-600" :
                                  item.completion >= 50 ? "[&>div]:bg-yellow-500" :
                                  "[&>div]:bg-red-500"
                                }`}
                              />
                              <span className="text-sm font-medium min-w-8.75">{item.completion}%</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getPriorityBadge(item.priority)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(item.status)}
                            {getStatusBadge(item.status)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className={`text-sm ${isOverdue ? "text-red-600 font-medium" : ""}`}>
                                {item.dueDate}
                              </span>
                            </div>
                            {daysUntilDue > 0 && (
                              <div className="text-xs text-muted-foreground">
                                {daysUntilDue} days left
                              </div>
                            )}
                            {daysUntilDue < 0 && (
                              <div className="text-xs text-red-600">
                                {Math.abs(daysUntilDue)} days overdue
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" aria-label={`View ${item.company} ${item.category}`} onClick={() => onViewItem(item)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" aria-label={`Edit ${item.company} ${item.category}`} onClick={() => onEditItem(item)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" aria-label={`Comment on ${item.company} ${item.category}`} onClick={() => onCommentItem(item)}>
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" aria-label={`More actions for ${item.company} ${item.category}`} onClick={() => onMoreActions(item)}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="grid gap-3 md:hidden">
              {paginatedItems.map((item) => (
                <MobileItemCard
                  key={item.id}
                  item={item}
                  selected={selectedItems.includes(item.id)}
                  onSelectionChange={(checked) => {
                    if (checked) {
                      setSelectedItems([...selectedItems, item.id])
                    } else {
                      setSelectedItems(selectedItems.filter((id) => id !== item.id))
                    }
                  }}
                  onView={onViewItem}
                  onEdit={onEditItem}
                  onComment={onCommentItem}
                  onMore={onMoreActions}
                />
              ))}
            </div>

            <DueDiligencePagination
              currentPage={currentPage}
              totalPages={totalPages}
              startIndex={startIndex}
              endIndex={endIndex}
              totalItems={filteredItems.length}
              onPageChange={onPageChange}
            />
          </>
        )}
      </CardContent>
    </Card>
  )
}
