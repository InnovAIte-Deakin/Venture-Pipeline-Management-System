import { Filter, RotateCcw, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FundFiltersProps {
  searchTerm: string
  selectedStatus: string
  selectedVintage: string
  selectedFundType: string
  vintages: string[]
  onSearchChange: (value: string) => void
  onStatusChange: (value: string) => void
  onVintageChange: (value: string) => void
  onFundTypeChange: (value: string) => void
  onReset: () => void
}

export function FundFilters({
  searchTerm,
  selectedStatus,
  selectedVintage,
  selectedFundType,
  vintages,
  onSearchChange,
  onStatusChange,
  onVintageChange,
  onFundTypeChange,
  onReset,
}: FundFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters & Search
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5 xl:items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search funds, geography, sectors..." value={searchTerm} onChange={(event) => onSearchChange(event.target.value)} className="pl-10" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Fund Type</label>
            <Select value={selectedFundType} onValueChange={onFundTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="All fund types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All fund types</SelectItem>
                <SelectItem value="venture">Venture Capital</SelectItem>
                <SelectItem value="growth">Growth Equity</SelectItem>
                <SelectItem value="impact">Impact Investing</SelectItem>
                <SelectItem value="buyout">Buyout</SelectItem>
                <SelectItem value="debt">Debt Funds</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select value={selectedStatus} onValueChange={onStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="fundraising">Fundraising</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="winding_down">Winding Down</SelectItem>
                <SelectItem value="liquidated">Liquidated</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Vintage</label>
            <Select value={selectedVintage} onValueChange={onVintageChange}>
              <SelectTrigger>
                <SelectValue placeholder="All vintages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All vintages</SelectItem>
                {vintages.map((vintage) => (
                  <SelectItem key={vintage} value={vintage}>
                    {vintage}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="button" variant="outline" onClick={onReset}><RotateCcw className="mr-2 h-4 w-4" />Reset filters</Button>
        </div>
      </CardContent>
    </Card>
  )
}
