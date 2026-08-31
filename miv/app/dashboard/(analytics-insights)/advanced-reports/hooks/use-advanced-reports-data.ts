"use client"

import { useCallback, useEffect, useState } from "react"
import type {
  AdvancedReportsRequestState,
  AnalyticsApiResponse,
  Dashboard,
  GedsiMetricApiResponseItem,
  GedsiMetricsApiResponse,
  Report,
  UseAdvancedReportsDataResult,
  UserApiResponseItem,
  UsersApiResponse,
  VentureApiResponseItem,
  VenturesApiResponse,
  WorkflowPageAssumedShape,
  WorkflowsApiResponse,
} from "../types/advanced-reports.types"
import { buildFallbackReport, buildSeedDashboards, buildSeedReports } from "../lib/report-calculations"

/**
 * Owns the 5 API calls the original `fetchData` issued together, plus the
 * derived `reports`/`dashboards` seeding. This is the only place that knows
 * about (and preserves) two confirmed, pre-existing data-contract bugs:
 *
 * 1. `/api/analytics` has no top-level `analytics` field — the fetch result
 *    is decoded and immediately discarded, exactly as before.
 * 2. `/api/workflows`'s array lives under `results`, not `workflows` — so
 *    `workflows` is always `[]` here, exactly as before.
 *
 * It also preserves a third, previously-undocumented bug: report #1/#2/#5's
 * display copy reads the PRE-fetch `ventures`/`gedsiMetrics`/`users` state
 * (not the freshly-parsed arrays), made explicit via `buildSeedReports`'s
 * `stale*` parameters. See README "Known Remaining Issues".
 *
 * Do not silently fix any of the three — call them out separately for a
 * product/eng decision.
 */
export function useAdvancedReportsData(): UseAdvancedReportsDataResult {
  const [reports, setReports] = useState<Report[]>([])
  const [dashboards, setDashboards] = useState<Dashboard[]>([])
  const [ventures, setVentures] = useState<VentureApiResponseItem[]>([])
  const [gedsiMetrics, setGedsiMetrics] = useState<GedsiMetricApiResponseItem[]>([])
  const [users, setUsers] = useState<UserApiResponseItem[]>([])
  const [requestState, setRequestState] = useState<AdvancedReportsRequestState>({
    isLoading: true,
    hasFatalError: false,
  })

  const fetchData = useCallback(async () => {
    try {
      setRequestState({ isLoading: true, hasFatalError: false })

      const [venturesRes, gedsiRes, usersRes, analyticsRes, workflowsRes] = await Promise.all([
        fetch("/api/ventures?limit=100"),
        fetch("/api/gedsi-metrics?limit=200"),
        fetch("/api/users?limit=50"),
        fetch("/api/analytics"),
        fetch("/api/workflows?limit=50"),
      ])

      const venturesData: VenturesApiResponse = venturesRes.ok
        ? await venturesRes.json()
        : { ventures: [], pagination: { page: 1, limit: 100, total: 0, pages: 0 }, isMobile: false }
      const gedsiData: GedsiMetricsApiResponse = gedsiRes.ok
        ? await gedsiRes.json()
        : { metrics: [], pagination: { page: 1, limit: 200, total: 0, pages: 0 } }
      const usersData: UsersApiResponse = usersRes.ok
        ? await usersRes.json()
        : { users: [], pagination: { page: 1, limit: 50, total: 0, pages: 0 } }
      const analyticsData: AnalyticsApiResponse | { analytics?: unknown[] } = analyticsRes.ok
        ? await analyticsRes.json()
        : { analytics: [] }
      const workflowsData: WorkflowsApiResponse | { workflows?: WorkflowPageAssumedShape[] } = workflowsRes.ok
        ? await workflowsRes.json()
        : { workflows: [] }

      const venturesArray = venturesData.ventures || []
      const gedsiMetricsArray = gedsiData.metrics || []
      const usersArray = usersData.users || []
      // Preserved bug: no `.analytics` field exists on the real response — always [], never read again.
      const analytics = (analyticsData as { analytics?: unknown[] }).analytics || []
      void analytics
      // Preserved bug: the real array is under `.results`, not `.workflows` — always [].
      const workflows = (workflowsData as { workflows?: WorkflowPageAssumedShape[] }).workflows || []

      // Preserved bug: reads pre-update `ventures`/`gedsiMetrics`/`users`
      // state (see `SeedReportsInput` doc comment), not the arrays parsed above.
      const generatedReports = buildSeedReports({
        staleVentures: ventures,
        staleGedsiMetrics: gedsiMetrics,
        staleUsers: users,
        ventures: venturesArray,
        gedsiMetrics: gedsiMetricsArray,
        workflows,
      })
      const generatedDashboards = buildSeedDashboards(venturesArray, gedsiMetricsArray)

      setVentures(venturesArray)
      setGedsiMetrics(gedsiMetricsArray)
      setUsers(usersArray)
      setReports(generatedReports)
      setDashboards(generatedDashboards)

      console.log(`✅ Successfully generated ${generatedReports.length} reports from database data`)
      setRequestState({ isLoading: false, hasFatalError: false })
    } catch (error) {
      console.error("❌ Error fetching data for reports:", error)
      setReports([buildFallbackReport()])
      setDashboards([])
      setRequestState({ isLoading: false, hasFatalError: true })
    }
  }, [ventures, gedsiMetrics, users])

  useEffect(() => {
    fetchData()
    // Mount-only fetch, matching the original `useEffect(() => { fetchData() }, [])`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    reports,
    setReports,
    dashboards,
    setDashboards,
    ventures,
    gedsiMetrics,
    users,
    requestState,
    refetch: () => {
      void fetchData()
    },
  }
}
