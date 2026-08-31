import { Briefcase, Globe, UserCheck, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCount } from "../lib/social-impact-formatters"
import type { SocialImpactTotals } from "../types/social-impact"

export function ImpactStatCards({ totals }: { totals: SocialImpactTotals }) {
  const cards = [
    ["Total Beneficiaries", totals.totalBeneficiaries, "People directly impacted by portfolio", Users, "purple"],
    ["Jobs Created", totals.jobsCreated, "Quality employment opportunities", Briefcase, "green"],
    ["Locations Represented", totals.locationsRepresented, "Unique reported primary locations", Globe, "blue"],
    ["Women Empowered", totals.womenEmpowered, "Through leadership and programs", UserCheck, "orange"],
  ] as const
  const styles = { purple: "border-l-purple-500 from-purple-50 to-pink-50 text-purple-700", green: "border-l-green-500 from-green-50 to-emerald-50 text-green-700", blue: "border-l-blue-500 from-blue-50 to-cyan-50 text-blue-700", orange: "border-l-orange-500 from-orange-50 to-amber-50 text-orange-700" }
  return <section aria-label="Portfolio impact summary" className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
    {cards.map(([title, value, description, Icon, color]) => <Card key={title} className={`gap-3 border-l-4 bg-linear-to-br py-5 ${styles[color]}`}>
      <CardHeader className="flex-row items-center justify-between px-5 pb-0"><CardTitle className="text-sm">{title}</CardTitle><Icon className="h-4 w-4" aria-hidden="true" /></CardHeader>
      <CardContent className="px-5"><p className="text-2xl font-bold">{formatCount(value)}</p><p className="text-xs opacity-90">{description}</p></CardContent>
    </Card>)}
  </section>
}
