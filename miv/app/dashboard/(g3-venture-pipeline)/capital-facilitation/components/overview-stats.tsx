import { Activity, BarChart3, DollarSign, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "../lib/capital-facilitation";
import type { CapitalRequest } from "../types";

interface OverviewStatsProps {
  capitalRequests: CapitalRequest[];
}

export function OverviewStats({ capitalRequests }: OverviewStatsProps) {
  const totalCapital = capitalRequests.reduce(
    (total, request) => total + request.amount,
    0,
  );
  const approved = capitalRequests.filter(
    (request) => request.status === "Approved",
  ).length;
  const stats = [
    {
      label: "Total Capital",
      value: formatCurrency(totalCapital),
      icon: DollarSign,
      className: "bg-green-100 text-green-600",
    },
    {
      label: "Active Deals",
      value: capitalRequests.filter((request) => request.status !== "Rejected")
        .length,
      icon: Activity,
      className: "bg-blue-100 text-blue-600",
    },
    {
      label: "Success Rate",
      value: `${capitalRequests.length ? Math.round((approved / capitalRequests.length) * 100) : 0}%`,
      icon: Target,
      className: "bg-purple-100 text-purple-600",
    },
    {
      label: "Avg Deal Size",
      value: capitalRequests.length
        ? formatCurrency(totalCapital / capitalRequests.length)
        : "$0",
      icon: BarChart3,
      className: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-4">
      {stats.map(({ label, value, icon: Icon, className }) => (
        <Card key={label}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${className}`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="break-words text-lg font-semibold">{value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
