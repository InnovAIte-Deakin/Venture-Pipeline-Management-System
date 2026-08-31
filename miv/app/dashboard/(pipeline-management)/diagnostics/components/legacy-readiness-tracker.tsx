import React from "react";

export default function ReadinessTracker() {
	return (
		<div className="p-6 bg-white rounded-lg shadow-md">
			{/* Header */}
			<h1 className="text-2xl font-semibold mb-4">Readiness Tracker</h1>
			<p className="text-sm text-slate-500 mb-6">
				2 of 10 tasks completed
			</p>

			{/* Checklist Items */}
			<ul className="space-y-2">
				<li className="flex items-center justify-between">
					<span>NDA Signed</span>
					<span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-200 text-emerald-800">
						Done
					</span>
				</li>
				<li className="flex items-center justify-between">
					<span>Financial Statements Uploaded</span>
					<span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
						In Progress
					</span>
				</li>
				<li className="flex items-center justify-between">
					<span>Pitch Deck Ready</span>
					<span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-200 text-slate-700">
						Not Started
					</span>
				</li>
			</ul>

			{/* Attachments Placeholder */}
			<div className="mt-6 rounded-md border-2 border-dashed border-slate-300 p-6 text-center">
				<p className="text-slate-500">No documents uploaded yet</p>
				<p className="text-xs text-slate-400 mt-1">
					Upload a file or drag and drop • PNG, JPG, GIF up to 10MB
				</p>
			</div>

			{/* Add Tag Button */}
			<div className="mt-6 flex space-x-2">
				<button className="px-4 py-2 rounded-full bg-emerald-600 text-white text-sm hover:bg-emerald-700">
					Add More Tag
				</button>
			</div>
		</div>
	);
}
