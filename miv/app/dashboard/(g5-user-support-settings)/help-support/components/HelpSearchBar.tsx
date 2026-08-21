import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function HelpSearchBar() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search help articles, tutorials, and FAQs..."
            className="pl-10"
          />
        </div>
      </CardContent>
    </Card>
  )
}