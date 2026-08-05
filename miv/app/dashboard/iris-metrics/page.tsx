"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"

type CatalogItem = {
  code: string
  name: string
  description?: string
  unit?: string
  gedsiSuggestion?: string
}

export default function IRISMetricsPage() {
  const [query, setQuery] = useState("")
  const [items, setItems] = useState<CatalogItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [limit, setLimit] = useState(50)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const controller = new AbortController()
    async function search() {
      setLoading(true)
      try {
       const url = query.trim().length > 0
          ? `/api/iris/metrics?q=${encodeURIComponent(query)}&limit=${limit}&page=${page}`
          : `/api/iris/metrics?limit=${limit}&page=${page}`
        const res = await fetch(url, { signal: controller.signal })
        if (res.ok) {
          const json = await res.json()
          setItems(json.results || [])
          setTotal(json.total || (json.results?.length ?? 0))
          setTotalPages(json.totalPages || 1)
        }
      } catch {}
      finally {
        setLoading(false)
      }
    }
    const t = setTimeout(search, 250)
    return () => { controller.abort(); clearTimeout(t) }
  }, [query, limit, page])
  useEffect(() => {
  setPage(1)
}, [query, limit])

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
                    <SelectItem value="20">20 results</SelectItem>
                    <SelectItem value="50">50 results</SelectItem>
                    <SelectItem value="100">100 results</SelectItem>
                    <SelectItem value="200">200 results</SelectItem>
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
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setQuery("women")}
              >
                Women/Gender
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setQuery("disability")}
              >
                Disability
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setQuery("marginalized")}
              >
                Marginalized Groups
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setQuery("youth")}
              >
                Youth
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setQuery("")}
              >
                Clear
              </Button>
            </div>
          </div>

          <div className="rounded-md border overflow-hidden">
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
              {items.length === 0 && !loading ? (
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
                    <TableCell>{item.unit || "-"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


