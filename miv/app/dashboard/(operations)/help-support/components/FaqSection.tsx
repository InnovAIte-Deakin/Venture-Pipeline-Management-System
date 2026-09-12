"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronDown } from "lucide-react"

interface FaqItem {
  id: string
  category: string
  question: string
  answer: string
}

const faqItems: FaqItem[] = [
  {
    id: "1",
    category: "Ventures",
    question: "How do I add a new venture to the platform?",
    answer:
      "Navigate to the Venture Intake section and fill out the comprehensive form. The platform will automatically analyze the venture and provide insights.",
  },
  {
    id: "2",
    category: "GEDSI",
    question: "What are GEDSI metrics and how are they calculated?",
    answer:
      "GEDSI (Gender, Equality, Disability, and Social Inclusion) metrics are automatically calculated based on venture data and IRIS+ standards.",
  },
  {
    id: "3",
    category: "Ventures",
    question: "How can I export reports and data?",
    answer:
      "Use the export functionality in any dashboard section to download reports in PDF, Excel, or CSV formats.",
  },
  {
    id: "4",
    category: "Security",
    question: "Is my data secure and compliant?",
    answer:
      "Yes, the platform follows enterprise-grade security standards and is compliant with GDPR, SOC 2, and other relevant regulations.",
  },
  {
    id: "5",
    category: "Workflows",
    question: "Why can't I move a venture to the next workflow stage?",
    answer:
      "Check that all required due diligence tasks are complete, assigned approvals are resolved, and the venture has no blocking validation errors.",
  },
  {
    id: "6",
    category: "Documents",
    question: "What should I do if a document upload fails?",
    answer:
      "Confirm the file type and size are supported, rename files with special characters, then retry. If the issue continues, contact support with the venture name and document type.",
  },
  {
    id: "7",
    category: "Reports",
    question: "Where can I download portfolio and impact reports?",
    answer:
      "Use Advanced Reports for portfolio exports and Impact Reports for GEDSI and IRIS reporting. Exports are available in the reporting sections after filters are applied.",
  },
  {
    id: "8",
    category: "Account",
    question: "How do I manage team permissions?",
    answer:
      "Go to Team Management to add members, update roles, and review access. Admin permissions are required for role and membership changes.",
  },
]

const categories = ["All", "Account", "Ventures", "Workflows", "Documents", "GEDSI", "Reports", "Security"]

interface FaqSectionProps {
  searchValue?: string
}

export default function FaqSection({ searchValue = "" }: FaqSectionProps) {
  const [activeCategory, setActiveCategory] = useState("All")
  const [openId, setOpenId] = useState<string | null>(null)
  const normalizedSearch = searchValue.trim().toLowerCase()

  const filteredItems = faqItems.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory
    const searchableText = `${item.category} ${item.question} ${item.answer}`.toLowerCase()
    const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch)
    return matchesCategory && matchesSearch
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Help Centre</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              size="sm"
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="divide-y">
          {filteredItems.length === 0 && (
            <p className="text-sm text-muted-foreground py-4">No matching questions found.</p>
          )}
          {filteredItems.map((item) => {
            const isOpen = openId === item.id
            return (
              <div key={item.id} className="py-3">
                <button
                  className="w-full flex items-center justify-between text-left"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  aria-expanded={isOpen}
                >
                  <span className="font-medium">{item.question}</span>
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="text-sm text-muted-foreground mt-2">{item.answer}</p>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
