import { FileText, Mail, Search, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import { formatCurrency } from "../lib/capital-facilitation";
import type { InvestorPartner } from "../types";

export function InvestorNetworkTab({
  investors,
}: {
  investors: InvestorPartner[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredInvestors = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return investors.filter((investor) =>
      [investor.name, investor.focus, investor.contactPerson].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [investors, searchQuery]);

  return (
    <TabsContent value="investor-network" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Investor Partners</CardTitle>
          <p className="text-sm text-muted-foreground">
            Our network of investment partners
          </p>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search investors..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredInvestors.length ? (
              filteredInvestors.map((investor) => (
                <Card
                  key={investor.name}
                  className="transition-shadow hover:shadow-sm"
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-sm font-semibold text-blue-700">
                        {investor.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="wrap-break-word font-medium">{investor.name}</h3>
                        <p className="wrap-break-word text-sm text-muted-foreground">
                          {investor.focus}
                        </p>
                        <div className="mt-3 space-y-2 text-sm">
                          <div className="flex items-start justify-between gap-3">
                            <span className="text-muted-foreground">
                              Total Invested
                            </span>
                            <span className="wrap-break-word text-right font-medium">
                              {formatCurrency(investor.totalInvested)}
                            </span>
                          </div>
                          <div className="flex items-start justify-between gap-3">
                            <span className="text-muted-foreground">
                              Active Deals
                            </span>
                            <span className="font-medium">
                              {investor.activeDeals}
                            </span>
                          </div>
                          <div className="flex items-start justify-between gap-3">
                            <span className="text-muted-foreground">
                              Ticket Size
                            </span>
                            <span className="wrap-break-word text-right font-medium">
                              {investor.avgTicketSize}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 border-t pt-3">
                          <div className="flex flex-col gap-2 sm:flex-row">
                            <Button size="sm" className="flex-1">
                              <Mail className="mr-1 h-4 w-4" />
                              Contact
                            </Button>
                            <Button size="sm" variant="outline">
                              <FileText className="mr-1 h-4 w-4" />
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-8 text-center">
                <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">No investors found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
