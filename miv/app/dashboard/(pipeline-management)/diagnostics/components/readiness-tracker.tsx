"use client";

import { useMemo, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";

import { initialReadinessItems } from "./readiness-data";
import { ReadinessChecklist } from "./readiness-checklist";
import { ReadinessSummary } from "./readiness-summary";

export default function ReadinessTracker() {
	const [items, setItems] = useState(initialReadinessItems);

	const completedCount = useMemo(
		() => items.filter((item) => item.complete).length,
		[items],
	);

	const progress = Math.round((completedCount / items.length) * 100);

	function handleItemCheckedChange(itemId: string, checked: boolean) {
		setItems((currentItems) =>
			currentItems.map((item) =>
				item.id === itemId ? { ...item, complete: checked } : item,
			),
		);
	}

	return (
		<Card className="overflow-hidden border-slate-200 bg-[#f6f8f8] shadow-sm">
			<ReadinessSummary
				completedCount={completedCount}
				totalCount={items.length}
				progress={progress}
			/>

			<CardContent className="p-0">
				<ReadinessChecklist
					items={items}
					onItemCheckedChange={handleItemCheckedChange}
				/>
			</CardContent>
		</Card>
	);
}