"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Venture } from "@/hooks/use-gedsi-data"

export function AddMetricForm({ onSubmit, ventures }: { onSubmit: (data: any) => void, ventures: Venture[] }) {
  const [formData, setFormData] = useState({
    ventureId: '',
    metricCode: '',
    metricName: '',
    category: '',
    targetValue: '',
    unit: '',
    notes: ''
  })
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [results, setResults] = useState<Array<{ code: string; name: string; unit?: string; description?: string; gedsiSuggestion?: string }>>([])

  useEffect(() => {
    const controller = new AbortController()
    async function search() {
      if (!query || query.length < 2) {
        setResults([])
        return
      }
      setSearching(true)
      try {
        const res = await fetch(`/api/iris/metrics?q=${encodeURIComponent(query)}&limit=15`, { signal: controller.signal })
        if (res.ok) {
          const json = await res.json()
          setResults(json.results || [])
        }
      } catch (e) {
        // ignore aborts
      } finally {
        setSearching(false)
      }
    }
    const t = setTimeout(search, 250)
    return () => { controller.abort(); clearTimeout(t) }
  }, [query])

  const applyMetric = (m: { code: string; name: string; unit?: string; gedsiSuggestion?: string }) => {
    setFormData(prev => ({
      ...prev,
      metricCode: m.code,
      metricName: m.name,
      unit: m.unit || prev.unit,
      category: (m.gedsiSuggestion as any) || prev.category
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      targetValue: parseFloat(formData.targetValue),
      currentValue: 0,
      status: 'Not Started'
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Venture</Label>
        <Select onValueChange={(value) => setFormData(prev => ({ ...prev, ventureId: value }))}>
          <SelectTrigger><SelectValue placeholder="Select venture" /></SelectTrigger>
          <SelectContent>
            {ventures.map(venture => (
              <SelectItem key={venture.id} value={venture.id}>{venture.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Metric (search IRIS+)</Label>
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by code or name" />
          {searching && <p className="text-xs text-gray-500">Searching...</p>}
          {results.length > 0 && (
            <div className="max-h-48 overflow-auto border rounded p-2 space-y-1 bg-white">
              {results.map((r) => (
                <button key={r.code} type="button" className="w-full text-left px-2 py-1 hover:bg-gray-50 rounded" onClick={() => applyMetric(r)}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium mr-2">{r.code}</span>
                    {r.gedsiSuggestion && <Badge variant="outline">{r.gedsiSuggestion}</Badge>}
                  </div>
                  <div className="text-sm text-gray-700">{r.name}</div>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Select onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
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
        <Input value={formData.metricName} onChange={(e) => setFormData(prev => ({ ...prev, metricName: e.target.value }))} placeholder="Metric name" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Target Value</Label>
          <Input type="number" value={formData.targetValue} onChange={(e) => setFormData(prev => ({ ...prev, targetValue: e.target.value }))} placeholder="100" />
        </div>
        <div className="space-y-2">
          <Label>Unit</Label>
          <Input value={formData.unit} onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))} placeholder="ventures" />
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="submit">Add Metric</Button>
      </div>
    </form>
  )
}