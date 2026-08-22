import { Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PageHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold break-words">Capital Facilitation</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage funding requests and investor relationships
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
        <Button variant="outline" size="sm" className="w-full sm:w-auto">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          New Request
        </Button>
      </div>
    </div>
  );
}
