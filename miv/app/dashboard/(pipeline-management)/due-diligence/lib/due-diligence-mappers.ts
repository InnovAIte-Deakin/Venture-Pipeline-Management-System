import { calculateGEDSIScore } from "@/lib/gedsi-utils"
import {
  ASSIGNED_ANALYSTS,
  DD_ITEM_CATEGORIES,
  STANDARD_CHECKLIST_TEMPLATES
} from "../constants/due-diligence.constants"
import {
  calculateCategoryCompletion,
  calculateChecklistCompletion,
  calculateDueDate,
  calculateOverallProgress,
  getLastActivityTime
} from "./due-diligence-calculations"
import type {
  ChecklistItem,
  DueDiligenceItem,
  DueDiligencePriority,
  DueDiligenceStatus,
  DueDiligenceVenture,
  VentureDD
} from "../types/due-diligence.types"

export function getAssignedAnalyst(category: string): string {
  return ASSIGNED_ANALYSTS[category] || "Unassigned"
}

export function mapVenturesToDueDiligenceItems(ventures: DueDiligenceVenture[]): DueDiligenceItem[] {
  return ventures.flatMap((venture) =>
    DD_ITEM_CATEGORIES.map((category) => {
      const completion = calculateCategoryCompletion(venture, category)
      const status = completion === 100 ? "completed" :
                    completion > 70 ? "in_progress" :
                    completion > 0 ? "in_progress" : "not_started"

      const priority = venture.stage === "DUE_DILIGENCE" ? "high" :
                      venture.stage === "INVESTMENT_READY" ? "high" :
                      venture.stage === "SERIES_A" || venture.stage === "SERIES_B" ? "medium" : "low"

      const stage = category === "Financial" ? "Financial Review" :
                   category === "Legal" ? "Legal Review" :
                   category === "Technical" ? "Technical Assessment" :
                   "Market Analysis"

      return {
        id: `DD-${venture.id}-${category}`,
        company: venture.name,
        stage,
        category,
        assignedTo: venture.assignedTo?.name || venture.createdBy?.name || "Unassigned",
        dueDate: calculateDueDate(venture.stage, category),
        completion,
        priority: priority as DueDiligencePriority,
        status: status as DueDiligenceStatus,
        lastUpdated: getLastActivityTime(venture.updatedAt),
        documents: venture._count?.documents || 0,
        comments: venture._count?.activities || 0
      }
    })
  )
}

export function groupItemsByVenture(items: DueDiligenceItem[], ventures: DueDiligenceVenture[]): VentureDD[] {
  const ventureMap = new Map<string, VentureDD>()

  items.forEach((item) => {
    if (!ventureMap.has(item.company)) {
      const ventureData = ventures.find((venture) => venture.name === item.company)
      const gedsiScore = ventureData ? calculateGEDSIScore(ventureData) : 50

      if (process.env.NODE_ENV === "development") {
        console.log(`ðŸ“Š GEDSI Score for ${item.company}:`, gedsiScore, "from data:", {
          founderTypes: ventureData?.founderTypes,
          inclusionFocus: ventureData?.inclusionFocus,
          aiAnalysis: ventureData?.aiAnalysis ? "present" : "missing",
          gedsiMetricsSummary: ventureData?.gedsiMetricsSummary ? "present" : "missing"
        })
      }

      ventureMap.set(item.company, {
        ventureId: item.company.toLowerCase().replace(/\s+/g, "-"),
        ventureName: item.company,
        overallProgress: 0,
        overallStatus: "not_started",
        priority: "medium",
        leadAnalyst: item.assignedTo,
        dueDate: item.dueDate,
        lastActivity: item.lastUpdated,
        categories: {},
        totalDocuments: 0,
        totalComments: 0,
        riskLevel: "medium",
        gedsiScore
      })
    }

    const venture = ventureMap.get(item.company)!
    venture.categories[item.category] = item
    venture.totalDocuments += item.documents
    venture.totalComments += item.comments
  })

  ventureMap.forEach((venture) => {
    const categoryItems = Object.values(venture.categories)
    venture.overallProgress = calculateOverallProgress(categoryItems)

    const completedCount = categoryItems.filter((item) => item.status === "completed").length
    const inProgressCount = categoryItems.filter((item) => item.status === "in_progress").length
    const blockedCount = categoryItems.filter((item) => item.status === "blocked").length

    if (completedCount === categoryItems.length) {
      venture.overallStatus = "completed"
    } else if (blockedCount > 0) {
      venture.overallStatus = "blocked"
    } else if (inProgressCount > 0) {
      venture.overallStatus = "in_progress"
    } else {
      venture.overallStatus = "not_started"
    }

    const priorities = categoryItems.map((item) => item.priority)
    if (priorities.includes("high")) venture.priority = "high"
    else if (priorities.includes("medium")) venture.priority = "medium"
    else venture.priority = "low"

    const overdueCategoriesCount = categoryItems.filter((item) => new Date(item.dueDate) < new Date()).length
    if (overdueCategoriesCount > 1 || venture.overallProgress < 30) {
      venture.riskLevel = "high"
    } else if (overdueCategoriesCount > 0 || venture.overallProgress < 60) {
      venture.riskLevel = "medium"
    } else {
      venture.riskLevel = "low"
    }
  })

  return Array.from(ventureMap.values())
}

export function generateChecklistFromVentures(ventures: DueDiligenceVenture[]): ChecklistItem[] {
  if (ventures.length === 0) return []

  return ventures.flatMap((venture) =>
    STANDARD_CHECKLIST_TEMPLATES.map((template, index) => ({
      id: `CL-${venture.id}-${index + 1}`,
      title: `${template.title} - ${venture.name}`,
      description: template.description,
      category: template.category,
      completed: calculateChecklistCompletion(venture, template.category),
      assignedTo: getAssignedAnalyst(template.category),
      dueDate: new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      priority: template.priority
    }))
  )
}
