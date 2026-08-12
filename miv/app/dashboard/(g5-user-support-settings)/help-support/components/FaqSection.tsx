"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ChevronRight, ChevronDown } from "lucide-react"

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
    category: "Account",
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
    category: "Billing",
    question: "Is my data secure and compliant?",
    answer:
      "Yes, the platform follows enterprise-grade security standards and is compliant with GDPR, SOC 2, and other relevant regulations.",
  },
]

const categories = ["All", "Account", "Ventures", "Billing"]

export default function FaqSection() {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [openId, setOpenId] = useState<string | null>(null)

  const filteredItems = faqItems.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory
    const matchesSearch = item.question.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Help Centre</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search FAQs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

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