"use client";

import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";

import { initialReadinessItems } from "./readiness-data";
import { ReadinessChecklist } from "./readiness-checklist";
import { ReadinessSummary } from "./readiness-summary";
import type { ReadinessItem } from "./types";
import { calculateReadinessProgress } from "./readiness-utils";

type ReadinessTrackerProps = {
	initialItems?: ReadinessItem[];
};

export default function ReadinessTracker({
	initialItems = initialReadinessItems,
}: ReadinessTrackerProps) {
	const [items, setItems] = useState(initialItems);

	const { completedCount, totalCount, progress } =
		calculateReadinessProgress(items);

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
				totalCount={totalCount}
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