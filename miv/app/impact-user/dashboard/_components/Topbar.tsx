"use client";

import { Bell, Moon, HelpCircle, Download } from "lucide-react";

export default function Topbar() {
  return (
    <header className="h-[72px] bg-white border-b border-black/10 px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="text-[#0f8f86] font-semibold">Venture Pipeline Homepage</div>
        <span className="text-xs px-3 py-1 rounded-full border border-emerald-300 bg-emerald-50 text-emerald-700">
          Live
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          <input
            className="w-[420px] rounded-full border border-black/10 bg-[#f7fafc] px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0ea5a0]/30"
            placeholder="Search ventures, sectors, countries..."
          />
        </div>

        {/* Icon buttons */}
        <button className="h-10 w-10 rounded-xl border border-black/10 bg-white hover:bg-black/5 flex items-center justify-center">
          <Bell size={18} />
        </button>
        <button className="h-10 w-10 rounded-xl border border-black/10 bg-white hover:bg-black/5 flex items-center justify-center">
          <Moon size={18} />
        </button>
        <button className="h-10 w-10 rounded-xl border border-black/10 bg-white hover:bg-black/5 flex items-center justify-center">
          <HelpCircle size={18} />
        </button>
        <button className="h-10 w-10 rounded-xl border border-black/10 bg-white hover:bg-black/5 flex items-center justify-center">
          <Download size={18} />
        </button>

        {/* Avatar */}
        <div className="h-11 w-11 rounded-full bg-[#0f8f86] text-white flex items-center justify-center font-semibold">
          U
        </div>
      </div>
    </header>
  );
}
