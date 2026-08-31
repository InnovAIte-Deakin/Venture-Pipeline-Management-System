import { ReadinessChecklistItem } from "./readiness-checklist-item";
import type { ReadinessItem } from "./types";

type ReadinessChecklistProps = {
	items: ReadinessItem[];
	onItemCheckedChange: (itemId: string, checked: boolean) => void;
};

export function ReadinessChecklist({
	items,
	onItemCheckedChange,
}: ReadinessChecklistProps) {
	return (
		<ul
	className="overflow-hidden rounded-lg border border-slate-200"
	aria-label="Readiness checklist"
>
			{items.map((item) => (
				<ReadinessChecklistItem
					key={item.id}
					item={item}
					onCheckedChange={(checked) =>
						onItemCheckedChange(item.id, checked)
					}
				/>
			))}
		</ul>
	);
}