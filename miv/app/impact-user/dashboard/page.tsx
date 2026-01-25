import Image from "next/image";

export default function DashboardPage() {
  return (
    <div className="px-8 py-6 space-y-8">
      {/* HERO */}
      <div className="relative h-[160px] rounded-2xl overflow-hidden">
        <Image
          src="/hero.png"
          alt="Hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
        <h1 className="absolute left-8 top-1/2 -translate-y-1/2 text-white text-4xl font-bold">
          Welcome Back Jaanika!
        </h1>
      </div>

      {/* QUICK + NOTIFICATIONS */}
      <div className="grid grid-cols-2 gap-6">
        {/* QUICK */}
        <div className="rounded-2xl bg-white shadow border">
          <div className="bg-[#0E8F86] text-white px-6 py-4 font-semibold rounded-t-2xl">
            Quick Suggestion
          </div>

          <div className="p-6 space-y-4">
            {[
              "Complete my profile",
              "Track my progress",
              "Upload Document",
              "Apply for Funding",
              "Review Feedback",
              "Get Recommendations",
            ].map((item) => (
              <div
                key={item}
                className="h-12 bg-[#A9C9C7] rounded-xl flex items-center justify-center text-white font-medium"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* NOTIFICATIONS */}
        <div className="rounded-2xl bg-white shadow border">
          <div className="bg-[#0E8F86] text-white px-6 py-4 font-semibold rounded-t-2xl">
            Notifications
          </div>

          <div className="p-6 space-y-4">
            {[
              "A new funding opportunity is now available for your startup.",
              "Congratulations! Your funding application has been approved.",
              "Your latest profile update is incomplete.",
              "Reminder: Venture intake deadline is approaching.",
            ].map((msg, i) => (
              <div
                key={i}
                className="p-4 border rounded-xl text-sm flex gap-3"
              >
                ⚠️ <span>{msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-3 gap-6">
        <div className="rounded-2xl bg-white shadow border p-6">
          <p className="font-semibold">Quick Venture Summary</p>

          {[
            ["Progress Overall", "65%"],
            ["Readiness Score", "48%"],
            ["Funding Progress", "30%"],
            ["Capital Raised", "$120k"],
          ].map(([label, val]) => (
            <div key={label} className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span>{label}</span>
                <span>{val}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded">
                <div className="h-full w-2/3 bg-[#0E8F86] rounded" />
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border-dashed border-2 flex items-center justify-center text-gray-400">
          + Add New Venture
        </div>

        <div className="rounded-2xl border-dashed border-2 flex items-center justify-center text-gray-400">
          + Add New Venture
        </div>
      </div>

      {/* ANALYTICS */}
      <div className="rounded-2xl bg-white shadow border p-6">
        <p className="font-semibold mb-1">Performance Analytics</p>
        <p className="text-xs text-gray-500 mb-6">
          Monitor key performance indicators
        </p>

        <div className="grid grid-cols-2 gap-6">
          <div className="border rounded-xl p-4">
            <p className="text-xs text-gray-500">Venture Conversion Rate</p>
            <p className="text-2xl font-bold">15.2%</p>
          </div>

          <div className="border rounded-xl p-4">
            <p className="text-xs text-gray-500">Average Time to Funding</p>
            <p className="text-2xl font-bold">42 days</p>
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white shadow border p-6">
          <p className="font-semibold mb-4">Venture Conversion Funnel</p>
          {["Intake", "Diagnostics", "Readiness", "Funded"].map((s, i) => (
            <div key={s} className="mb-3">
              <div className="text-xs mb-1">{s}</div>
              <div className="h-4 bg-[#F26D5B]/30 rounded">
                <div
                  className="h-full bg-[#F26D5B] rounded"
                  style={{ width: `${90 - i * 20}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-white shadow border p-6">
          <p className="font-semibold mb-4">Time to Funding Distribution</p>
          <div className="flex items-end gap-4 h-40">
            {[30, 60, 90, 50, 25].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-[#F26D5B] rounded-xl"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
