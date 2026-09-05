"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { CapitalFacilitationSummaryCard } from "../types"

interface CapitalSummaryCardsProps {
  cards: CapitalFacilitationSummaryCard[]
}

export function CapitalSummaryCards({ cards }: CapitalSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className="mt-1 text-2xl font-semibold break-words">{card.value}</p>
            <p className="mt-1 text-xs text-muted-foreground break-words">{card.supportingText}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
