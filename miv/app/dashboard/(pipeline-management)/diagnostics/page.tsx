import ReadinessTracker from "./components/readiness-tracker";

export default function DiagnosticsPage() {
	return (
		<main className="mx-auto w-full max-w-6xl space-y-6">
			<header className="space-y-2">
				<p className="text-sm font-medium text-primary">Admin review</p>

				<h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
					Diagnostics
				</h1>

				<p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
					Review the information required before a venture can progress
					to readiness assessment.
				</p>
			</header>

			<ReadinessTracker />
		</main>
	);
}
