import {
	CheckCircle2,
	CircleDashed,
	ClipboardCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import type { ReadinessItem } from "./types";

type ReadinessChecklistItemProps = {
	item: ReadinessItem;
	onCheckedChange: (checked: boolean) => void;
};

export function ReadinessChecklistItem({
	item,
	onCheckedChange,
}: ReadinessChecklistItemProps) {
	return (
		<li className="flex gap-3 border-b border-slate-200 bg-white p-4 last:border-b-0 sm:items-center sm:px-6 sm:py-5">
			<ClipboardCheck
				className="mt-1 size-4 shrink-0 text-[#087f7a] sm:mt-0"
				aria-hidden="true"
			/>

			<label htmlFor={item.id} className="min-w-0 flex-1 cursor-pointer">
				<span
					className={`block text-sm font-medium ${
						item.complete
							? "text-[#087f7a] line-through"
							: "text-slate-800"
					}`}
				>
					{item.label}
				</span>

				<span className="mt-1 block text-sm leading-5 text-slate-500">
					{item.description}
				</span>
			</label>

			<div className="ml-auto flex shrink-0 items-center gap-2 pt-0.5 sm:pt-0">
				<span className="hidden sm:inline">
					{item.complete ? (
						<Badge className="gap-1 bg-teal-50 text-[#087f7a] hover:bg-teal-50">
							<CheckCircle2 className="size-3.5" aria-hidden="true" />
							Done
						</Badge>
					) : (
						<Badge
							variant="outline"
							className="gap-1 border-slate-300 text-slate-500"
						>
							<CircleDashed className="size-3.5" aria-hidden="true" />
							To do
						</Badge>
					)}
				</span>

				<Checkbox
					id={item.id}
					checked={item.complete}
					onCheckedChange={(checked) => onCheckedChange(checked === true)}
					aria-label={`Mark ${item.label} as ${
						item.complete ? "incomplete" : "complete"
					}`}
					className="border-[#087f7a] data-[state=checked]:border-[#087f7a] data-[state=checked]:bg-[#087f7a]"
				/>
			</div>
		</li>
	);
}