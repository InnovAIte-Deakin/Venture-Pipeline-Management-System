import { describe, expect, it } from "vitest";

import { calculateReadinessProgress } from "@/components/diagnostics/readiness-utils";

describe("calculateReadinessProgress", () => {
	it("calculates partial completion correctly", () => {
		const result = calculateReadinessProgress([
			{
				id: "one",
				label: "First task",
				description: "Test task",
				complete: true,
			},
			{
				id: "two",
				label: "Second task",
				description: "Test task",
				complete: false,
			},
		]);

		expect(result.completedCount).toBe(1);
		expect(result.totalCount).toBe(2);
		expect(result.progress).toBe(50);
		expect(result.isReadyForReview).toBe(false);
	});

	it("marks the tracker ready when every item is complete", () => {
		const result = calculateReadinessProgress([
			{
				id: "one",
				label: "First task",
				description: "Test task",
				complete: true,
			},
			{
				id: "two",
				label: "Second task",
				description: "Test task",
				complete: true,
			},
		]);

		expect(result.progress).toBe(100);
		expect(result.isReadyForReview).toBe(true);
	});
});