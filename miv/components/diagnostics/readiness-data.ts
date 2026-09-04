import type { ReadinessItem } from "./types";

export const initialReadinessItems: ReadinessItem[] = [
	{
		id: "nda",
		label: "NDA signed",
		description: "Confidentiality agreement is on file.",
		complete: true,
	},
	{
		id: "financials",
		label: "Financial statements uploaded",
		description:
			"Most recent financial statements are available for review.",
		complete: true,
	},
	{
		id: "pitch-deck",
		label: "Pitch deck ready",
		description: "A current investor presentation has been provided.",
		complete: false,
	},
	{
		id: "market-validation",
		label: "Market validation documented",
		description: "Customer evidence and market research have been recorded.",
		complete: false,
	},
	{
		id: "team-profile",
		label: "Team profile complete",
		description: "Founder and key-team details are up to date.",
		complete: false,
	},
];