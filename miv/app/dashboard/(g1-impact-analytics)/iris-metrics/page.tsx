"use client"


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { useIrisMetrics } from "./hooks/use-iris-metrics"
import { QUICK_FILTERS, RESULT_LIMIT_OPTIONS } from "./lib/iris-metrics.constants"



export default function IRISMetricsPage() {
  const {
  query,
  setQuery,
  items,
  total,
  loading,
  limit,
  setLimit,
} = useIrisMetrics()


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>IRIS+ Metrics Catalog</CardTitle>
          <p className="text-sm text-muted-foreground">
            Browse and search through 756 standardized impact metrics from the IRIS+ system. 
            Use these metrics to track Gender Equality, Disability inclusion, and Social Inclusion (GEDSI) outcomes for your ventures.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Search by code, name, or description (e.g., PI4060, women, disability)"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div>
               <Select
  value={limit.toString()}
  onValueChange={(value) => {
    setLimit(parseInt(value))
  }}
>
  <SelectTrigger>
                    <SelectValue placeholder="Results per page" />
                  </SelectTrigger>
                  <SelectContent>
                   {RESULT_LIMIT_OPTIONS.map((option) => (
  <SelectItem key={option} value={option.toString()}>
    {option} results
  </SelectItem>
))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                {loading ? 'Searching…' : `Results: ${items.length}${total ? ` / ${total}` : ''}`}
              </div>
            </div>
            
            {/* Quick filter buttons */}
            <div className="flex flex-wrap gap-2">
              {QUICK_FILTERS.map((filter) => (
                <Button
                  key={filter.value}
                  variant="outline"
                  size="sm"
                 onClick={() => setQuery(filter.value)}
                >
                  {filter.label}
                </Button>
              ))}
              
              <Button 
                variant="outline" 
                size="sm"
               onClick={() => setQuery("")}
              >
                Clear
              </Button>
            </div>
          </div>

          {/* Mobile metric cards */}
<div className="space-y-3 md:hidden">
  {items.map((item) => (
    <div
      key={item.code}
      className="rounded-md border bg-background p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-medium text-muted-foreground">
            {item.code}
          </div>

          <div className="mt-1 font-medium leading-tight">
            {item.name}
          </div>
        </div>

        {item.gedsiSuggestion && (
          <Badge variant="outline" className="shrink-0">
            {item.gedsiSuggestion}
          </Badge>
        )}
      </div>

      {item.description && (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {item.description}
        </p>
      )}

      <div className="mt-4 border-t pt-3 text-xs text-muted-foreground">
        <span>Unit: </span>
        <span className="font-medium text-foreground">
          {item.unit || "-"}
        </span>
      </div>
    </div>
  ))}
</div>
        
          <div className="hidden md:block rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-32">Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="w-32">Suggested GEDSI</TableHead>
                  <TableHead className="w-40">Unit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.code}>
                    <TableCell className="font-medium">{item.code}</TableCell>
                    <TableCell>
                      <div className="font-medium">{item.name}</div>
                      {item.description && (
                        <div className="text-xs text-slate-500 line-clamp-2">{item.description}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.gedsiSuggestion && <Badge variant="outline">{item.gedsiSuggestion}</Badge>}
                    </TableCell>
                    <TableCell>{item.unit || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


