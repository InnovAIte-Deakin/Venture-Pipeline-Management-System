import { Search } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface SettingsSearchCardProps {
  searchQuery: string
  onSearchQueryChange: (query: string) => void
}

export function SettingsSearchCard({ searchQuery, onSearchQueryChange }: SettingsSearchCardProps) {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search settings..."
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            className="pl-10"
          />
        </div>
      </CardContent>
    </Card>
  )
}
