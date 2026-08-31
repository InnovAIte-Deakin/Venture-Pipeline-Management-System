import {
  Building2,
  DollarSign,
  FileText,
  MessageSquare,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TabsContent } from "@/components/ui/tabs";
import { STATUS_CLASSES } from "../constants";
import { formatCurrency } from "../lib/capital-facilitation";
import type { CapitalRequest, DealPipelineStage } from "../types";

interface CapitalRequestsTabProps {
  capitalRequests: CapitalRequest[];
  dealPipelineStages: DealPipelineStage[];
  selectedRequest: CapitalRequest | null;
  onSelectRequest: (request: CapitalRequest) => void;
}

function EmptyState({
  icon: Icon,
  message,
}: {
  icon: typeof DollarSign;
  message: string;
}) {
  return (
    <div className="text-center py-8">
      <Icon className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}

function PipelineOverview({
  stages,
  empty,
}: {
  stages: DealPipelineStage[];
  empty: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pipeline Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-5 md:gap-4">
          {empty ? (
            <div className="col-span-full">
              <EmptyState
                icon={DollarSign}
                message="No capital requests found"
              />
            </div>
          ) : (
            stages.map((stage) => (
              <Card key={stage.name} className="p-4 text-center">
                <div className="text-2xl font-semibold">{stage.deals}</div>
                <p className="text-sm text-muted-foreground">{stage.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(stage.capital)}
                </p>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function RequestList({
  requests,
  selectedId,
  onSelect,
}: {
  requests: CapitalRequest[];
  selectedId?: string;
  onSelect: (request: CapitalRequest) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Capital Requests</CardTitle>
        <p className="text-sm text-muted-foreground">
          Current funding requests
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests.length === 0 ? (
            <EmptyState icon={Building2} message="No capital requests found" />
          ) : (
            requests.map((request) => (
              <button
                key={request.id}
                type="button"
                onClick={() => onSelect(request)}
                className={`w-full rounded-lg border p-4 text-left transition-colors ${selectedId === request.id ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20" : "hover:bg-gray-50 dark:hover:bg-gray-800"}`}
              >
                <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-sm font-semibold text-blue-700">
                      {request.venture.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="wrap-break-word font-medium">{request.venture}</h3>
                      <p className="wrap-break-word text-sm text-muted-foreground">
                        {request.investor}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={STATUS_CLASSES[request.status]}
                  >
                    {request.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 md:grid-cols-4 md:gap-4">
                  <div>
                    <p className="text-muted-foreground">Amount</p>
                    <p className="wrap-break-word font-medium">
                      {formatCurrency(request.amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Stage</p>
                    <p className="wrap-break-word font-medium">{request.stage}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Progress</p>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={request.progress}
                        className="h-2 flex-1"
                      />
                      <span className="text-xs">{request.progress}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Due Date</p>
                    <p className="wrap-break-word font-medium">{request.expectedDecision}</p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function RequestDetails({ request }: { request: CapitalRequest }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Details</CardTitle>
        <p className="text-sm text-muted-foreground">{request.venture}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {formatCurrency(request.amount)}
            </div>
            <p className="text-sm text-muted-foreground">Requested Amount</p>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Current Stage</span>
              <span className="font-medium">{request.stage}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span className="font-medium">{request.progress}%</span>
            </div>
            <Progress value={request.progress} className="h-2" />
          </div>
          <div className="space-y-2 border-t pt-4">
            <h4 className="mb-2 font-medium">Timeline</h4>
            <ol className="relative ml-2 border-l border-gray-200 dark:border-gray-700">
              {request.timeline.map((item) => (
                <li key={`${item.date}-${item.event}`} className="mb-4 ml-4">
                  <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-blue-500 dark:border-gray-800" />
                  <time className="mb-1 text-xs font-normal leading-none text-gray-400 dark:text-gray-500">
                    {item.date}
                  </time>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {item.event}
                  </h3>
                </li>
              ))}
            </ol>
          </div>
          <div className="space-y-2 border-t pt-4">
            <h4 className="mb-2 font-medium">Documents</h4>
            {request.documents.length ? (
              <div className="space-y-2">
                {request.documents.map((document) => (
                  <div
                    key={`${document.url}-${document.name}`}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span>{document.name}</span>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={document.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No documents attached.
              </p>
            )}
          </div>
          <div className="border-t pt-4">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button className="flex-1">
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
              <Button variant="outline" className="flex-1">
                <MessageSquare className="mr-2 h-4 w-4" />
                Add Note
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function CapitalRequestsTab({
  capitalRequests,
  dealPipelineStages,
  selectedRequest,
  onSelectRequest,
}: CapitalRequestsTabProps) {
  return (
    <TabsContent value="capital-requests" className="space-y-6">
      <PipelineOverview
        stages={dealPipelineStages}
        empty={capitalRequests.length === 0}
      />
      <RequestList
        requests={capitalRequests}
        selectedId={selectedRequest?.id}
        onSelect={onSelectRequest}
      />
      {selectedRequest && <RequestDetails request={selectedRequest} />}
    </TabsContent>
  );
}
