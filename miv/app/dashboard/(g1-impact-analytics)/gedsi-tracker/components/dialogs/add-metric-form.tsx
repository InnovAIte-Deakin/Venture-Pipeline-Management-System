"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { GEDSIMetric, Venture } from "../../types/gedsi-tracker.types"

interface IrisMetricSearchResult {
  code: string
  name: string
  unit?: string
  description?: string
  gedsiSuggestion?: string
}

export function AddMetricForm({
  onSubmit,
  ventures,
}: {
  onSubmit: (data: Partial<GEDSIMetric>) => void
  ventures: Venture[]
}) {
  const [formData, setFormData] = useState({
    ventureId: "",
    metricCode: "",
    metricName: "",
    category: "",
    targetValue: "",
    unit: "",
    notes: "",
  })
  const [query, setQuery] = useState("")
  const [searching, setSearching] = useState(false)
  const [results, setResults] = useState<IrisMetricSearchResult[]>([])

  useEffect(() => {
    const controller = new AbortController()

    async function search() {
      if (!query || query.length < 2) {
        setResults([])
        return
      }

      setSearching(true)
      try {
        const res = await fetch(`/api/iris/metrics?q=${encodeURIComponent(query)}&limit=15`, {
          signal: controller.signal,
        })
        if (res.ok) {
          const json = await res.json()
          setResults(json.results || [])
        }
      } catch {
        // Ignore aborts while users type.
      } finally {
        setSearching(false)
      }
    }

    const timeout = setTimeout(search, 250)
    return () => {
      controller.abort()
      clearTimeout(timeout)
    }
  }, [query])

  const applyMetric = (metric: IrisMetricSearchResult) => {
    setFormData((prev) => ({
      ...prev,
      metricCode: metric.code,
      metricName: metric.name,
      unit: metric.unit || prev.unit,
      category: metric.gedsiSuggestion || prev.category,
    }))
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    onSubmit({
      ...formData,
      targetValue: Number.parseFloat(formData.targetValue),
      currentValue: 0,
      status: "Not Started",
    } as Partial<GEDSIMetric>)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Venture</Label>
        <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, ventureId: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select venture" />
          </SelectTrigger>
          <SelectContent>
            {ventures.map((venture) => (
              <SelectItem key={venture.id} value={venture.id}>
                {venture.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Metric (search IRIS+)</Label>
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by code or name (e.g., PI4060 or Women)"
          />
          {searching && <p className="text-xs text-gray-500">Searching...</p>}
          {results.length > 0 && (
            <div className="max-h-48 overflow-auto rounded border bg-white p-2 space-y-1">
              {results.map((result) => (
                <button
                  key={result.code}
                  type="button"
                  className="w-full rounded px-2 py-1 text-left hover:bg-gray-50"
                  onClick={() => applyMetric(result)}
                >
                  <div className="flex items-center justify-between">
                    <span className="mr-2 font-medium">{result.code}</span>
                    {result.gedsiSuggestion && <Badge variant="outline">{result.gedsiSuggestion}</Badge>}
                  </div>
                  <div className="text-sm text-gray-700">{result.name}</div>
                  {result.unit && <div className="text-xs text-gray-500">Unit: {result.unit}</div>}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Gender">Gender</SelectItem>
              <SelectItem value="Disability">Disability</SelectItem>
              <SelectItem value="Social Inclusion">Social Inclusion</SelectItem>
              <SelectItem value="Cross-cutting">Cross-cutting</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Metric Name</Label>
        <Input
          value={formData.metricName}
          onChange={(event) => setFormData((prev) => ({ ...prev, metricName: event.target.value }))}
          placeholder="e.g., Number of women-led ventures supported"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Target Value</Label>
          <Input
            type="number"
            value={formData.targetValue}
            onChange={(event) => setFormData((prev) => ({ ...prev, targetValue: event.target.value }))}
            placeholder="100"
          />
        </div>
        <div className="space-y-2">
          <Label>Unit</Label>
          <Input
            value={formData.unit}
            onChange={(event) => setFormData((prev) => ({ ...prev, unit: event.target.value }))}
            placeholder="e.g., ventures, people, %"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Notes</Label>
        <Input
          value={formData.notes}
          onChange={(event) => setFormData((prev) => ({ ...prev, notes: event.target.value }))}
          placeholder="Additional notes or context"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="bg-black text-white hover:bg-neutral-800">
          Add Metric
        </Button>
      </div>
    </form>
  )
}
