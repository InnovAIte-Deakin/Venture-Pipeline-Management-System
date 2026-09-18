import { ClipboardCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type ReadinessSummaryProps = {
	completedCount: number;
	totalCount: number;
	progress: number;
};

export function ReadinessSummary({
	completedCount,
	totalCount,
	progress,
}: ReadinessSummaryProps) {
	return (
		<CardHeader className="gap-4 border-b border-slate-200 bg-white p-4 sm:p-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div className="flex gap-3">
					<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#087f7a] text-white">
						<ClipboardCheck className="size-5" aria-hidden="true" />
					</div>

					<div className="space-y-1">
						<CardTitle className="text-xl text-slate-900">
							Readiness tracker
						</CardTitle>
						<p className="text-sm text-slate-600">
							Complete each item to prepare this venture for review.
						</p>
					</div>
				</div>

				<Badge
					variant="outline"
					className={`w-fit border ${
						progress === 100
							? "border-[#087f7a] bg-teal-50 text-[#087f7a]"
							: "border-slate-300 bg-slate-50 text-slate-600"
					}`}
				>
					{progress === 100 ? "Ready for review" : "In progress"}
				</Badge>
			</div>

			<div
				className="rounded-lg border border-slate-200 bg-slate-50 p-3 sm:p-4"
				aria-live="polite"
			>
				<div className="flex items-baseline justify-between gap-4 text-sm">
					<span className="font-medium text-slate-800">
						{completedCount} of {totalCount} items complete
					</span>
					<span className="font-semibold text-[#087f7a]">{progress}%</span>
				</div>

				<Progress
					value={progress}
					aria-label={`${progress}% readiness complete`}
					className="mt-2 h-1.5 bg-teal-100 [&>div]:bg-[#087f7a]"
				/>
			</div>
		</CardHeader>
	);
}