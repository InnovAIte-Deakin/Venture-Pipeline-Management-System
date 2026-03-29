"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function TestEnvironmentPage() {
  const [output, setOutput] = useState<string>("")
  const [loading, setLoading] = useState<string | null>(null)

  const run = async (label: string, fn: () => Promise<Response>) => {
    setLoading(label)
    setOutput("")
    try {
      const res = await fn()
      const text = await res.text()
      setOutput(`${label} → ${res.status}\n\n${text}`)
    } catch (e: any) {
      setOutput(`${label} → error\n\n${e?.message || e}`)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Test Environment</h1>
          <p className="text-gray-600">Run seeded tests and diagnostics</p>
        </div>
        <Badge variant="secondary">Dev only</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Data Seeding</CardTitle>
            <CardDescription>Populate database with sample data</CardDescription>
          </CardHeader>
          <CardContent className="space-x-2">
            <Button onClick={() => run('Seed comprehensive data', () => fetch('/api/seed-comprehensive-data', { method: 'POST' }))} disabled={loading!==null}>
              Seed Comprehensive
            </Button>
            <Button onClick={() => run('Seed GEDSI metrics', () => fetch('/api/seed-gedsi-metrics', { method: 'POST' }))} disabled={loading!==null} variant="outline">
              Seed GEDSI
            </Button>
            <Button onClick={() => run('Seed workflows', () => fetch('/api/seed-workflows', { method: 'POST' }))} disabled={loading!==null} variant="outline">
              Seed Workflows
            </Button>
            <Button onClick={() => run('Seed Sarah analytics', () => fetch('/api/seed-sarah-analytics', { method: 'POST' }))} disabled={loading!==null} variant="outline">
              Seed Sarah Analytics
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integration Tests</CardTitle>
            <CardDescription>Run sprint test suite</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => run('Sprint 2 test', () => fetch('/api/test-sprint2', { method: 'POST' }))} disabled={loading!==null}>
              Run Sprint 2 Test
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Data Suite</CardTitle>
            <CardDescription>Run the full test-data page flows</CardDescription>
          </CardHeader>
          <CardContent className="space-x-2">
            <Button onClick={() => (window.location.href = '/test-data')}>
              Open Test Data Page
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Output</CardTitle>
          <CardDescription>Responses will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="text-xs whitespace-pre-wrap bg-gray-50 p-3 rounded border min-h-[160px]">{output || '—'}</pre>
        </CardContent>
      </Card>
    </div>
  )
}


