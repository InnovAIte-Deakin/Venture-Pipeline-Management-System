import { Download, Edit, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { fundingProgress } from "@/lib/investment-rounds/calculations"
import type { InvestmentRound } from "@/lib/investment-rounds/types"
import { gedsiScoreClass, RiskIcon, StatusBadge } from "./round-presentation"

export function InvestmentRoundsTable({ rounds, onView }: { rounds: InvestmentRound[]; onView: (round: InvestmentRound) => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Investment Rounds ({rounds.length})</CardTitle>
        <CardDescription>Track investment rounds with GEDSI impact metrics and AI insights</CardDescription>
      </CardHeader>
      <CardContent>
        {rounds.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">No investment rounds match the current filters.</div>
        ) : (
          <>
            {/* Desktop/table view */}
            <div className="hidden sm:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Round</TableHead>
                    <TableHead>GEDSI Score</TableHead>
                    <TableHead>Target/Raised</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead className="hidden sm:table-cell">Founder Type</TableHead>
                    <TableHead className="hidden sm:table-cell">Risk Level</TableHead>
                    <TableHead className="hidden sm:table-cell">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rounds.map((round) => {
                    const progress = fundingProgress(round)
                    return (
                      <TableRow key={round.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{round.company}</div>
                            <div className="text-sm text-muted-foreground">{round.location}</div>
                            <div className="text-sm text-muted-foreground">{round.sector} • {round.stage}</div>
                          </div>
                        </TableCell>
                        <TableCell><Badge variant="outline">{round.roundType}</Badge></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`text-lg font-bold ${gedsiScoreClass(round.gedsiScore)}`}>{round.gedsiScore}</div>
                            <div className="text-xs text-muted-foreground"><div>I: {round.impactScore}</div><div>S: {round.sustainabilityScore}</div></div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div><div className="font-medium">{round.targetAmount}</div><div className="text-sm text-muted-foreground">{round.raisedAmount} raised</div></div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={progress} className="h-2 w-12 sm:w-16" />
                            <span className="text-sm">{progress.toFixed(0)}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {round.founderType.slice(0, 2).map((type) => <Badge key={type} variant="outline" className="text-xs">{type.replace("-", " ")}</Badge>)}
                            {round.founderType.length > 2 && <Badge variant="outline" className="text-xs">+{round.founderType.length - 2}</Badge>}
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell"><div className="flex items-center gap-2"><RiskIcon level={round.aiInsights.riskLevel} /><span className="text-sm capitalize">{round.aiInsights.riskLevel}</span></div></TableCell>
                        <TableCell className="hidden sm:table-cell"><StatusBadge status={round.status} /></TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm" aria-label={`View ${round.company}`} onClick={() => onView(round)}><Eye className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm" aria-label={`Edit ${round.company}`}><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm" aria-label={`Download ${round.company}`}><Download className="h-4 w-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Mobile card view */}
            <div className="space-y-3 sm:hidden">
              {rounds.map((round) => {
                const progress = fundingProgress(round)
                return (
                  <Card key={`mobile-${round.id}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{round.company}</div>
                          <div className="text-sm text-muted-foreground">{round.sector} • {round.roundType}</div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${gedsiScoreClass(round.gedsiScore)}`}>{round.gedsiScore}</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-2 text-sm text-muted-foreground">{round.location} • {round.stage}</div>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-medium">{round.targetAmount}</div>
                          <div className="text-xs text-muted-foreground">{round.raisedAmount} raised</div>
                        </div>
                        <div className="text-right text-sm">{progress.toFixed(0)}%</div>
                      </div>
                      <div className="mb-3"><Progress value={progress} className="h-2 w-full" /></div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" aria-label={`View ${round.company}`} onClick={() => onView(round)}><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" aria-label={`Edit ${round.company}`}><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" aria-label={`Download ${round.company}`}><Download className="h-4 w-4" /></Button>
                        </div>
                        <div className="text-xs text-muted-foreground">{round.participants?.length ?? 0} participants</div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
