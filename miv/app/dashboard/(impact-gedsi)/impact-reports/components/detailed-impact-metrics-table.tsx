import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export interface DetailedImpactMetric {
  metric: string
  Q1: string | number
  Q2: string | number
  Q3: string | number
  Q4: string | number
}

interface DetailedImpactMetricsTableProps {
  metrics: DetailedImpactMetric[]
}

export function DetailedImpactMetricsTable({
  metrics,
}: DetailedImpactMetricsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Impact Metrics</CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Quarterly breakdown of key performance indicators
        </p>
      </CardHeader>

      <CardContent>
        {/* Desktop and tablet table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                <th className="px-4 py-3">Metric</th>
                <th className="px-4 py-3">Q1</th>
                <th className="px-4 py-3">Q2</th>
                <th className="px-4 py-3">Q3</th>
                <th className="px-4 py-3">Q4</th>
              </tr>
            </thead>

            <tbody>
              {metrics.map((row) => (
                <tr
                  key={row.metric}
                  className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                    {row.metric}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {row.Q1}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {row.Q2}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {row.Q3}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {row.Q4}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile card layout */}
        <div className="space-y-3 md:hidden">
          {metrics.map((row) => (
            <div
              key={row.metric}
              className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
            >
              <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                {row.metric}
              </h3>

              <div className="grid grid-cols-4 gap-2 text-center">
                {(["Q1", "Q2", "Q3", "Q4"] as const).map((quarter) => (
                  <div
                    key={quarter}
                    className="rounded-md bg-gray-50 px-2 py-3 dark:bg-gray-800"
                  >
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {quarter}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                      {row[quarter]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}