import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { ANALYTICS_SECTORS } from "../constants";
import { formatCurrency } from "../lib/capital-facilitation";
import type { CapitalRequest, InvestorPartner } from "../types";

interface AnalyticsTabProps {
  capitalRequests: CapitalRequest[];
  fundingTimeline: Record<string, number>;
  investorPartners: InvestorPartner[];
}

function AnalyticsCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function AnalyticsTab({
  capitalRequests,
  fundingTimeline,
  investorPartners,
}: AnalyticsTabProps) {
  return (
    <TabsContent value="analytics" className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <AnalyticsCard
          title="Funding Timeline"
          description="Average days to close"
        >
          <div className="space-y-3">
            {Object.keys(fundingTimeline).length ? (
              Object.entries(fundingTimeline).map(([stage, days]) => (
                <div key={stage} className="flex items-center justify-between gap-3">
                  <span className="wrap-break-word text-sm">{stage.replace("_", " ")}</span>
                  <span className="text-sm font-medium">{days} days</span>
                </div>
              ))
            ) : (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No funding timeline data available
              </p>
            )}
          </div>
        </AnalyticsCard>
        <AnalyticsCard title="Top Investors" description="By total investment">
          <div className="space-y-3">
            {investorPartners.length ? (
              investorPartners.slice(0, 4).map((investor, index) => (
                <div
                  key={investor.name}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium">
                      {index + 1}
                    </div>
                    <span className="wrap-break-word text-sm">{investor.name}</span>
                  </div>
                  <span className="shrink-0 text-sm font-medium">
                    {formatCurrency(investor.totalInvested)}
                  </span>
                </div>
              ))
            ) : (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No investor data available
              </p>
            )}
          </div>
        </AnalyticsCard>
        <AnalyticsCard
          title="Sector Distribution"
          description="Funding by sector"
        >
          <div className="space-y-3">
            {ANALYTICS_SECTORS.map((sector) => {
              const matches = capitalRequests.filter((request) =>
                request.venture
                  .toLowerCase()
                  .includes(sector.toLowerCase().replace("tech", "")),
              );
              const percentage = capitalRequests.length
                ? (matches.length / capitalRequests.length) * 100
                : 0;
              return (
                <div key={sector} className="flex items-center justify-between gap-3">
                  <span className="wrap-break-word text-sm">{sector}</span>
                  <span className="text-sm font-medium">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              );
            })}
          </div>
        </AnalyticsCard>
        <AnalyticsCard
          title="Deal Status"
          description="Current pipeline status"
        >
          <div className="space-y-3">
            {(["Approved", "Under Review", "Pending"] as const).map(
              (status) => (
                <div key={status} className="flex items-center justify-between gap-3">
                  <span className="wrap-break-word text-sm">{status}</span>
                  <span className="text-sm font-medium">
                    {
                      capitalRequests.filter(
                        (request) => request.status === status,
                      ).length
                    }
                  </span>
                </div>
              ),
            )}
          </div>
        </AnalyticsCard>
      </div>
    </TabsContent>
  );
}
