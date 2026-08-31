import { Award, Shield, UserCheck, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCount } from "../lib/social-impact-formatters"
import type { SocialImpactTotals } from "../types/social-impact"

export function ImpactHighlights({ totals }: { totals: SocialImpactTotals }) {
  const items = [["Gender Impact", totals.womenEmpowered, "Women empowered through programs", UserCheck], ["Disability Inclusion", totals.disabilityInclusive, "People with disabilities included", Shield], ["Youth Engagement", totals.youthEngaged, "Young people engaged", Zap]] as const
  return <Card className="border-0 bg-linear-to-br from-indigo-50 to-purple-50 shadow-lg"><CardHeader><CardTitle className="flex items-center gap-2"><Award className="h-5 w-5 text-indigo-600" />Key Social Impact Highlights</CardTitle><CardDescription>Calculated fields reported across the portfolio</CardDescription></CardHeader><CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{items.map(([title, value, copy, Icon]) => <div key={title} className="rounded-lg border bg-white/80 p-4"><div className="mb-2 flex items-center gap-2"><Icon className="h-5 w-5 text-purple-600" /><h3 className="font-medium">{title}</h3></div><p className="text-2xl font-bold text-purple-700">{formatCount(value)}</p><p className="text-sm text-muted-foreground">{copy}</p></div>)}</CardContent></Card>
}
