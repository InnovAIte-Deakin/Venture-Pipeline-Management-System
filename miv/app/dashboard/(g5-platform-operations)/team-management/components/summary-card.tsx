import { Card, CardContent } from '@/components/ui/card'

interface SummaryCardProps {
  label: string
  value: string | number
}

export function SummaryCard({ label, value }: SummaryCardProps) {
  return (
    <Card className="py-4 sm:py-6">
      <CardContent className="px-4 sm:px-6">
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{value}</p>
      </CardContent>
    </Card>
  )
}
