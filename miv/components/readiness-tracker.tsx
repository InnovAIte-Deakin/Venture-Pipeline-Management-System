"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, CircleDashed, ClipboardCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";

type ReadinessItem = {
	id: string;
	label: string;
	description: string;
	complete: boolean;
};

const initialItems: ReadinessItem[] = [
	{ id: "nda", label: "NDA signed", description: "Confidentiality agreement is on file.", complete: true },
	{ id: "financials", label: "Financial statements uploaded", description: "Most recent financial statements are available for review.", complete: true },
	{ id: "pitch-deck", label: "Pitch deck ready", description: "A current investor presentation has been provided.", complete: false },
	{ id: "market-validation", label: "Market validation documented", description: "Customer evidence and market research have been recorded.", complete: false },
	{ id: "team-profile", label: "Team profile complete", description: "Founder and key-team details are up to date.", complete: false },
];

export default function ReadinessTracker() {
	const [items, setItems] = useState(initialItems);
	const completedCount = useMemo(() => items.filter((item) => item.complete).length, [items]);
	const progress = Math.round((completedCount / items.length) * 100);

	function toggleItem(itemId: string, checked: boolean) {
		setItems((currentItems) =>
			currentItems.map((item) => item.id === itemId ? { ...item, complete: checked } : item),
		);
	}

	return (
		<Card className="overflow-hidden border-border/80 shadow-sm">
			<CardHeader className="gap-5 border-b bg-muted/30 p-5 sm:p-6">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
					<div className="flex gap-3">
						<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
							<ClipboardCheck className="size-5" aria-hidden="true" />
						</div>
						<div className="space-y-1">
							<CardTitle className="text-xl">Readiness tracker</CardTitle>
							<p className="text-sm text-muted-foreground">Complete each item to prepare this venture for review.</p>
						</div>
					</div>
					<Badge variant={progress === 100 ? "default" : "secondary"} className="w-fit whitespace-nowrap">
						{progress === 100 ? "Ready for review" : "In progress"}
					</Badge>
				</div>
				<div className="space-y-2" aria-live="polite">
					<div className="flex items-baseline justify-between gap-4 text-sm">
						<span className="font-medium">{completedCount} of {items.length} items complete</span>
						<span className="text-muted-foreground">{progress}%</span>
					</div>
					<Progress value={progress} aria-label={`${progress}% readiness complete`} />
				</div>
			</CardHeader>
			<CardContent className="p-0">
				<ul className="divide-y" aria-label="Readiness checklist">
					{items.map((item) => (
						<li key={item.id} className="flex gap-3 p-4 sm:items-center sm:px-6 sm:py-5">
							<Checkbox
								id={item.id}
								checked={item.complete}
								onCheckedChange={(checked) => toggleItem(item.id, checked === true)}
								aria-label={`Mark ${item.label} as ${item.complete ? "incomplete" : "complete"}`}
								className="mt-1 sm:mt-0"
							/>
							<label htmlFor={item.id} className="min-w-0 flex-1 cursor-pointer">
								<span className={`block text-sm font-medium ${item.complete ? "text-muted-foreground line-through" : "text-foreground"}`}>{item.label}</span>
								<span className="mt-1 block text-sm leading-5 text-muted-foreground">{item.description}</span>
							</label>
							<div className="ml-auto shrink-0 pt-0.5 sm:pt-0">
								{item.complete ? (
									<Badge className="gap-1 bg-emerald-600 text-white hover:bg-emerald-600"><CheckCircle2 className="size-3.5" aria-hidden="true" /> Done</Badge>
								) : (
									<Badge variant="outline" className="gap-1 text-muted-foreground"><CircleDashed className="size-3.5" aria-hidden="true" /> To do</Badge>
								)}
							</div>
						</li>
					))}
				</ul>
			</CardContent>
		</Card>
	);
}
