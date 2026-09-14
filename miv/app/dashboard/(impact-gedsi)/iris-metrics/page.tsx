"use client"
import { useIrisMetrics } from "./hooks/use-iris-metrics
import { QUICK_FILTERS, RESULT_LIMIT_OPTIONS } from "./lib/iris-metrics.constants"
import { formatMetricUnit } from "./lib/iris-metrics.formatters"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"

export default function IRISMetricsPage() {
const {
  query,
  setQuery,
  items,
  total,
  loading,
  limit,
  setLimit,
  page,
  setPage,
  totalPages,
  error,
  retry,
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
                <Select value={limit.toString()} onValueChange={(value) => setLimit(parseInt(value))}>
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
            <div className="flex items-center justify-between gap-3">
  <Button
    variant="outline"
    size="sm"
    onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
    disabled={page <= 1 || loading}
  >
    Previous
  </Button>

  <span className="text-sm text-muted-foreground">
    Page {page} of {totalPages}
  </span>

  <Button
    variant="outline"
    size="sm"
    onClick={() =>
      setPage((currentPage) => Math.min(totalPages, currentPage + 1))
    }
    disabled={page >= totalPages || loading}
  >
    Next
  </Button>
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

        <div className="hidden md:block rounded-md border overflow-x-auto">
            <Table className="min-w-[760px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-32">Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="w-32">Suggested GEDSI</TableHead>
                  <TableHead className="w-40">Unit</TableHead>
                </TableRow>
              </TableHeader>
             <TableBody>
  {loading ? (
    <TableRow>
      <TableCell
        colSpan={4}
        className="py-10 text-center text-sm text-muted-foreground"
      >
        <div className="flex items-center justify-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Loading IRIS metrics...
        </div>
      </TableCell>
    </TableRow>
  ) : error ? (
  <TableRow>
    <TableCell
      colSpan={4}
      className="py-10 text-center text-sm text-red-600"
    >
      <div className="flex flex-col items-center justify-center gap-3">
        <span>{error}</span>
        <Button
          variant="outline"
          size="sm"
         onClick={retry}
        >
          Try Again
        </Button>
      </div>
    </TableCell>
  </TableRow>
) : items.length === 0 ? (
    <TableRow>
      <TableCell
        colSpan={4}
        className="py-8 text-center text-sm text-muted-foreground"
      >
        No IRIS metrics found for “{query}”.
      </TableCell>
    </TableRow>
  ) : (
    items.map((item) => (
      <TableRow key={item.code}>
        <TableCell className="font-medium">{item.code}</TableCell>
        <TableCell>
          <div className="font-medium">{item.name}</div>
          {item.description && (
            <div className="text-xs text-slate-500 line-clamp-2">
              {item.description}
            </div>
          )}
        </TableCell>
        <TableCell>
          {item.gedsiSuggestion && (
            <Badge variant="outline">{item.gedsiSuggestion}</Badge>
          )}
        </TableCell>
        <TableCell>{formatMetricUnit(item.unit)}</TableCell>
      </TableRow>
    ))
  )}
</TableBody>
            </Table>
          </div>
          {/* Mobile results */}
<div className="md:hidden space-y-3">
  {loading ? (
    <div className="py-10 text-center text-sm text-muted-foreground">
      <div className="flex items-center justify-center gap-2">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        Loading IRIS metrics...
      </div>
    </div>
  ) : error ? (
    <div className="rounded-lg border p-6 text-center">
      <p className="text-sm text-red-600">{error}</p>
      <Button
        variant="outline"
        size="sm"
        className="mt-3"
        onClick={retry}
      >
        Try Again
      </Button>
    </div>
  ) : items.length === 0 ? (
    <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
      No IRIS metrics found for “{query}”.
    </div>
  ) : (
    items.map((item) => (
      <div
        key={item.code}
        className="rounded-xl border bg-background p-4 shadow-sm"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              {item.code}
            </p>
            <h3 className="mt-1 font-semibold leading-tight">
              {item.name}
            </h3>
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

        <div className="mt-4 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
          <span>Unit</span>
          <span className="font-medium text-foreground">
            {formatMetricUnit(item.unit)}
          </span>
        </div>
      </div>
    ))
  )}
</div>
        </CardContent>
      </Card>
    </div>
  )
}


