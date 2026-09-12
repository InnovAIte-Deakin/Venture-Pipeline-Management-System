"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TabsSectionProps {
  activeTab: string
  onTabChange: (value: string) => void
}

export function TabsSection({ activeTab, onTabChange }: Readonly<TabsSectionProps>) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-4">
      <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 xl:grid-cols-9">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="capital-calls">Capital Calls</TabsTrigger>
        <TabsTrigger value="distributions">Distributions</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="lp-portal">LP Portal</TabsTrigger>
        <TabsTrigger value="operations">Operations</TabsTrigger>
        <TabsTrigger value="compliance">Compliance</TabsTrigger>
        <TabsTrigger value="reporting">Reporting</TabsTrigger>
        <TabsTrigger value="transactions">Transactions</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
