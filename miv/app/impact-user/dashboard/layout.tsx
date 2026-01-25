import { ReactNode } from "react";
import Image from "next/image";
import {
  MdDashboard,
  MdOutlineAnalytics,
  MdSettings,
  MdOutlineSupportAgent,
} from "react-icons/md";
import { FaRegChartBar, FaRegHandshake } from "react-icons/fa";
import { HiOutlineCurrencyDollar } from "react-icons/hi2";
import { GiStairsGoal } from "react-icons/gi";
import { TbReportAnalytics } from "react-icons/tb";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F7FAFA]">
      {/* SIDEBAR */}
      <aside className="w-[280px] bg-gradient-to-b from-[#0B2233] to-[#061A27] text-white flex flex-col">
        {/* LOGO */}
        <div className="px-6 py-8 border-b border-white/10">
          <Image src="/logo.svg" alt="MiV" width={140} height={60} />
          <p className="text-sm text-white/70 mt-1">
            Mekong Inclusive Ventures
          </p>
        </div>

        {/* NAV */}
        <nav className="px-5 py-6 space-y-8 flex-1">
          {/* MAIN */}
          <div>
            <p className="text-xs tracking-[0.25em] text-[#7FE6DE] mb-3 font-semibold">
              MAIN
            </p>

            <div className="space-y-2">
              <div className="h-12 bg-[#0E8F86] rounded-xl flex items-center px-4 gap-3 font-semibold shadow">
                <MdDashboard className="text-xl" />
                Dashboard
              </div>

              {[
                ["Diagnostics & Readiness", <FaRegChartBar />],
                ["Capital Facilitation", <HiOutlineCurrencyDollar />],
                ["GEDSI Tracker", <GiStairsGoal />],
                ["Investor Management", <FaRegHandshake />],
                ["Funding Round Tracker", <MdOutlineAnalytics />],
              ].map(([label, icon]) => (
                <div
                  key={label as string}
                  className="h-12 rounded-xl flex items-center px-4 gap-3 text-white/90 hover:bg-white/5 transition"
                >
                  <span className="text-lg">{icon}</span>
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* REPORTS */}
          <div>
            <p className="text-xs tracking-[0.25em] text-[#7FE6DE] mb-3 font-semibold">
              REPORTS
            </p>

            {[
              ["Impact Reports", <TbReportAnalytics />],
              ["Performance Analytics", <MdOutlineAnalytics />],
            ].map(([label, icon]) => (
              <div
                key={label as string}
                className="h-12 rounded-xl flex items-center px-4 gap-3 text-white/90 hover:bg-white/5 transition"
              >
                <span className="text-lg">{icon}</span>
                {label}
              </div>
            ))}
          </div>

          {/* SETTINGS */}
          <div>
            <p className="text-xs tracking-[0.25em] text-[#7FE6DE] mb-3 font-semibold">
              SETTINGS
            </p>

            {[
              ["System Settings", <MdSettings />],
              ["Help & Support", <MdOutlineSupportAgent />],
            ].map(([label, icon]) => (
              <div
                key={label as string}
                className="h-12 rounded-xl flex items-center px-4 gap-3 text-white/90 hover:bg-white/5 transition"
              >
                <span className="text-lg">{icon}</span>
                {label}
              </div>
            ))}
          </div>
        </nav>

        {/* FOOTER */}
        <div className="p-6 border-t border-white/10 flex items-center gap-3">
          <Image
            src="/cartoon-illustration-llama-characterized-its-fluffy-turquoise-body-black-legs-animal-has-large-expressive-eyes-387691345 1.png"
            alt="Llama"
            width={40}
            height={40}
          />
          <span className="text-sm text-white/80">Follow MiV</span>
        </div>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
