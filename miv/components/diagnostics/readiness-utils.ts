import type { ReadinessItem } from "./types";

export function calculateReadinessProgress(items: ReadinessItem[]) {
	const completedCount = items.filter((item) => item.complete).length;
	const totalCount = items.length;
	const progress =
		totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

	return {
		completedCount,
		totalCount,
		progress,
		isReadyForReview: totalCount > 0 && completedCount === totalCount,
	};
}