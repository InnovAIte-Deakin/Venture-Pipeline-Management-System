"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface HelpSearchBarProps {
  value: string
  onChange: (value: string) => void
}

export default function HelpSearchBar({ value, onChange }: HelpSearchBarProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            aria-label="Search help content"
            placeholder="Search FAQs and tutorials..."
            className="pl-10"
            value={value}
            onChange={(event) => onChange(event.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  )
}
