import type {
  DueDiligenceFilters,
  DueDiligenceItem,
  PaginatedDueDiligenceItems
} from "../types/due-diligence.types"

export function filterSortPaginateItems(
  dueDiligenceItems: DueDiligenceItem[],
  filters: DueDiligenceFilters
): PaginatedDueDiligenceItems {
  const {
    searchTerm,
    selectedCategory,
    selectedStage,
    selectedStatus,
    selectedPriority,
    dateRange,
    sortBy,
    sortOrder,
    currentPage,
    itemsPerPage
  } = filters

  const filteredItems = dueDiligenceItems.filter((item) => {
    const matchesSearch = item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    const matchesStage = selectedStage === "all" || item.stage === selectedStage
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus
    const matchesPriority = selectedPriority === "all" || item.priority === selectedPriority

    let matchesDateRange = true
    if (dateRange.from || dateRange.to) {
      const itemDate = new Date(item.dueDate)
      if (dateRange.from && itemDate < new Date(dateRange.from)) matchesDateRange = false
      if (dateRange.to && itemDate > new Date(dateRange.to)) matchesDateRange = false
    }

    return matchesSearch && matchesCategory && matchesStage && matchesStatus && matchesPriority && matchesDateRange
  }).sort((a, b) => {
    let aValue: number | string
    let bValue: number | string

    switch (sortBy) {
      case "completion":
        aValue = a.completion
        bValue = b.completion
        break
      case "company":
        aValue = a.company.toLowerCase()
        bValue = b.company.toLowerCase()
        break
      case "priority": {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        aValue = priorityOrder[a.priority] || 0
        bValue = priorityOrder[b.priority] || 0
        break
      }
      case "lastUpdated":
        aValue = new Date(a.lastUpdated || 0).getTime()
        bValue = new Date(b.lastUpdated || 0).getTime()
        break
      case "dueDate":
      default:
        aValue = new Date(a.dueDate).getTime()
        bValue = new Date(b.dueDate).getTime()
    }

    if (sortOrder === "desc") {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
    }
    return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
  })

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedItems = filteredItems.slice(startIndex, endIndex)

  return {
    filteredItems,
    paginatedItems,
    totalPages,
    startIndex,
    endIndex
  }
}
