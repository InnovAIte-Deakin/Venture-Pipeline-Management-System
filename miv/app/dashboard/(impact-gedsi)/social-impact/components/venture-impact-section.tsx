import { MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCount } from "../lib/social-impact-formatters"
import { isComplete, parseFounderTypes } from "../lib/social-impact-calculations"
import type { SocialImpactVenture } from "../types/social-impact"

export function VentureImpactSection({ ventures }: { ventures: SocialImpactVenture[] }) {
  return <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">{ventures.map((venture) => {
    const metrics = Array.isArray(venture.gedsiMetrics) ? venture.gedsiMetrics : []
    return <Card key={venture.id} className="min-w-0 gap-4 py-5 transition-shadow hover:shadow-lg"><CardHeader className="min-w-0 px-5"><div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"><CardTitle className="wrap-break-word text-lg">{venture.name || "Unnamed venture"}</CardTitle>{venture.sector && <Badge variant="outline" className="w-fit max-w-full whitespace-normal">{venture.sector}</Badge>}</div><CardDescription className="flex min-w-0 items-start gap-1"><MapPin className="mt-0.5 h-3 w-3 shrink-0" /><span className="wrap-break-word">{venture.location || "Location not reported"}</span></CardDescription></CardHeader><CardContent className="space-y-3 px-5">{venture.inclusionFocus && <div className="rounded bg-purple-50 p-2"><p className="text-sm font-medium text-purple-800">Inclusion Focus</p><p className="wrap-break-word text-xs text-purple-700">{venture.inclusionFocus}</p></div>}<div className="grid grid-cols-1 gap-2 min-[360px]:grid-cols-3">{[[formatCount(venture.totalBeneficiaries ?? 0), "Beneficiaries"], [metrics.length, "GEDSI Metrics"], [metrics.filter(isComplete).length, "Completed"]].map(([value, label]) => <div key={label} className="min-w-0 rounded bg-slate-50 p-2 text-center"><p className="wrap-break-word text-sm font-semibold text-purple-700">{value}</p><p className="text-[11px] text-muted-foreground">{label}</p></div>)}</div>{parseFounderTypes(venture.founderTypes).length > 0 && <div className="flex flex-wrap gap-1">{parseFounderTypes(venture.founderTypes).map((type) => <Badge key={type} variant="secondary" className="max-w-full whitespace-normal text-xs">{formatLabel(type)}</Badge>)}</div>}<div className="flex flex-wrap justify-between gap-2 text-sm text-muted-foreground"><span>Team: {venture.teamSize ?? "N/A"}</span><span>Stage: {venture.stage || "N/A"}</span></div></CardContent></Card>
  })}</div>
}

function formatLabel(value: string) { return value.replaceAll("-", " ") }
