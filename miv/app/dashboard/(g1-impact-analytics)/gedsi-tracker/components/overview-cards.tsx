import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GEDSIMetric } from "../hooks/use-gedsi-data" // Updated relative path

export function OverviewCards({ metrics }: { metrics: GEDSIMetric[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>GEDSI Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg border-l-4 border-l-pink-500">
            <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
              {Math.round(metrics.filter(m => m.category === 'Gender').length > 0 ? 
                (metrics.filter(m => m.category === 'Gender' && m.status === 'Verified').length / 
                 metrics.filter(m => m.category === 'Gender').length) * 100 : 0)}%
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Gender Equality</div>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-l-purple-500">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {Math.round(metrics.filter(m => m.category === 'Disability').length > 0 ? 
                (metrics.filter(m => m.category === 'Disability' && m.status === 'Verified').length / 
                 metrics.filter(m => m.category === 'Disability').length) * 100 : 0)}%
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Disability Inclusion</div>
          </div>
          <div className="text-center p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border-l-4 border-l-cyan-500">
            <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
              {Math.round(metrics.filter(m => m.category === 'Social Inclusion').length > 0 ? 
                (metrics.filter(m => m.category === 'Social Inclusion' && m.status === 'Verified').length / 
                 metrics.filter(m => m.category === 'Social Inclusion').length) * 100 : 0)}%
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Social Inclusion</div>
          </div>
          <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-l-4 border-l-orange-500">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {Math.round(metrics.filter(m => m.category === 'Cross-cutting').length > 0 ? 
                (metrics.filter(m => m.category === 'Cross-cutting' && m.status === 'Verified').length / 
                 metrics.filter(m => m.category === 'Cross-cutting').length) * 100 : 0)}%
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Cross-cutting</div>
          </div>
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-l-blue-500">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {Math.round(metrics.length > 0 ? 
                (metrics.filter(m => m.status === 'Verified').length / metrics.length) * 100 : 0)}%
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Overall Progress</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}