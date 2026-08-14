import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function FundManagementLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Capital Facilitation</h1>
          <p className="text-muted-foreground">Loading fund data...</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="animate-pulse">
              <div className="h-4 w-3/4 rounded bg-gray-200" />
              <div className="h-8 w-1/2 rounded bg-gray-200" />
            </CardHeader>
            <CardContent>
              <div className="h-4 w-full rounded bg-gray-100" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
