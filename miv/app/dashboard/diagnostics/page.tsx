"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
    Facebook, 
    Linkedin, 
    Zap, 
    ShieldAlert, 
    AlertTriangle, 
    Clock,
    Search,
    Bell,
    Moon,
    Globe,
    Download,
    User
} from "lucide-react";
import {
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    Tooltip,
} from "recharts";

const diagnosticData = [
    { name: "Investment Readiness", score: 68 },
    { name: "Team & Governance", score: 75 },
    { name: "Market & Attraction", score: 54 },
    { name: "Product & Technology", score: 81 },
    { name: "Financial & Risk", score: 49 },
];

export default function DiagnosticsPage() {
    return (
        <div className="bg-[#F8FAFC] min-h-screen font-sans text-slate-900">
            {/* 1. TOP NAVIGATION BAR */}
            <div className="bg-white border-b border-slate-200 px-8 py-3 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <h2 className="text-teal-600 font-bold text-sm">Venture Pipeline Homepage</h2>
                    {/* ACTIVE LIVE BADGE */}
                    <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">Live</span>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-2 w-4 h-4 text-slate-400" />
                        <input className="bg-slate-50 border-none rounded-md py-1.5 pl-10 pr-4 text-xs w-full focus:ring-2 focus:ring-teal-500 transition-all outline-none" placeholder="Search ventures..." />
                    </div>
                    <div className="flex items-center gap-4 text-slate-400">
                        <Bell className="w-5 h-5 hover:text-teal-600 cursor-pointer transition-colors" />
                        <Moon className="w-5 h-5 hover:text-teal-600 cursor-pointer transition-colors" />
                        <Globe className="w-5 h-5 hover:text-teal-600 cursor-pointer transition-colors" />
                        <div className="h-8 w-8 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:bg-teal-600 transition-colors shadow-sm">U</div>
                    </div>
                </div>
            </div>

            {/* 2. HERO BANNER */}
            <div className="relative h-48 w-full overflow-hidden">
                <img src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80" className="w-full h-full object-cover scale-105" />
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-12 backdrop-blur-[1px]">
                    <h1 className="text-white text-5xl font-black tracking-tight animate-in fade-in slide-in-from-left-4 duration-1000">Diagnostics & Readiness</h1>
                </div>
            </div>

            <div className="p-8 max-w-7xl mx-auto space-y-6">
                {/* 3. IDENTITY & METADATA CARD */}
                <Card className="border-none shadow-sm overflow-hidden bg-white hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-8 flex flex-wrap lg:flex-nowrap items-center gap-12">
                        <div className="h-24 w-24 bg-[#93C5C1] rounded-xl flex items-center justify-center text-slate-700 text-4xl font-black shadow-inner">MC</div>
                        
                        <div className="flex-1 min-w-[200px]">
                            <h2 className="text-3xl font-black text-slate-800">Moomin Cafe</h2>
                            <p className="text-slate-400 font-bold text-sm uppercase tracking-wide">Sector: Hospitality</p>
                        </div>

                        <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-[11px] text-slate-500 font-medium border-l border-slate-100 pl-8">
                            <div>Application Number: <span className="text-slate-800 font-bold">1122A</span></div>
                            <div>Application Owner: <span className="text-slate-800 font-bold">Jaanika R</span></div>
                            <div>Country: <span className="text-slate-800 font-bold">Cambodia</span></div>
                            <div>Contact: <span className="text-slate-800 font-bold">+61 411223322</span></div>
                            <div>Date Lodged: <span className="text-slate-800 font-bold">01/02/2003</span></div>
                        </div>

                        <div className="w-72 bg-slate-50 p-4 rounded-xl border border-slate-100 group">
                            <div className="flex justify-between items-center mb-2">
                                <Badge className="bg-teal-600 text-white border-none rounded-md px-3 py-1 animate-pulse">In Progress</Badge>
                                <span className="text-xs font-bold text-slate-600">55%</span>
                            </div>
                            <Progress value={55} className="h-3 bg-slate-200 transition-all duration-1000" />
                        </div>
                    </CardContent>
                </Card>

                {/* 4. MAIN DIAGNOSTICS GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-none shadow-sm p-8 bg-white h-full relative overflow-hidden">
                            <div className="flex justify-between mb-8">
                                <h3 className="text-2xl font-black text-teal-600 uppercase italic tracking-tighter">Diagnostics</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <h4 className="font-bold text-slate-800 uppercase text-xs tracking-widest">Summary</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed font-medium max-w-sm">
                                        This diagnostic assessment indicates that the venture is technically sound and supported by a capable team, 
                                        reflected in high Product & Technology and Team & Governance scores.
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 bg-teal-500 rounded-full animate-pulse" />
                                        <p className="text-[9px] text-slate-400 italic">Analysed by Dialogic Engine v2.4</p>
                                    </div>
                                    
                                    <div className="pt-8">
                                        <div className="text-6xl font-black text-indigo-700 hover:scale-105 transition-transform cursor-default inline-block">60.5%</div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Overall Score</p>
                                    </div>
                                </div>

                                {/* RADAR CHART WITH INTERACTIVITY */}
                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={diagnosticData}>
                                            <PolarGrid stroke="#f1f5f9" />
                                            <PolarAngleAxis dataKey="name" fontSize={8} tick={{ fill: '#94a3b8', fontWeight: 'bold' }} />
                                            <Tooltip 
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '10px' }}
                                            />
                                            <Radar 
                                                dataKey="score" 
                                                stroke="#0d9488" 
                                                fill="#0d9488" 
                                                fillOpacity={0.6} 
                                                isAnimationActive={true}
                                                animationDuration={1500}
                                            />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div className="absolute bottom-4 right-8 text-[9px] text-slate-300 font-bold uppercase">Last Updated: 21 Jan 2026, 10:15am AEDT</div>
                        </Card>
                    </div>

                    {/* SIDEBAR RISKS WITH HOVER STATES */}
                    <div className="space-y-6">
                        <Card className="border-none shadow-sm p-6 bg-white">
                            <div className="flex items-center gap-3 mb-6">
                                <ShieldAlert className="w-5 h-5 text-red-500 animate-bounce" />
                                <span className="text-xs font-black uppercase tracking-widest text-slate-800">Risk Assessment</span>
                            </div>
                            <div className="space-y-4">
                                <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500 flex gap-3 hover:bg-red-100 transition-colors cursor-help">
                                    <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                                    <p className="text-[10px] font-bold text-red-800 leading-snug">Low Team Capability Score detected. Investor confidence may be impacted.</p>
                                </div>
                                <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500 flex gap-3 hover:bg-blue-100 transition-colors cursor-help">
                                    <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                    <p className="text-[10px] font-bold text-blue-800 leading-snug">Financial data for Q1 2026 pending AI verification cycle.</p>
                                </div>
                            </div>
                        </Card>

                        <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-4 relative overflow-hidden group">
                            {/* SCANNING BACKGROUND EFFECT */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-500/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
                            
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 bg-teal-400 rounded-full animate-pulse shadow-[0_0_8px_#2dd4bf]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-400">AI Analysis Active</span>
                            </div>
                            <p className="text-xs text-slate-300 font-medium leading-relaxed">
                                Dialogic Engine is currently scanning cross-border hospitality regulations for <span className="text-white font-bold underline decoration-teal-500">Moomin Cafe</span>.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 5. MiV FOOTER */}
                <div className="mt-12 bg-white rounded-xl border border-slate-100 p-8 flex flex-col md:flex-row justify-between items-center gap-8 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                        <div className="text-2xl font-black text-teal-700 tracking-tighter hover:scale-110 transition-transform cursor-pointer">MiV</div>
                        <p className="text-[10px] text-slate-400 max-w-[200px] leading-tight font-medium">
                            #1381, National Rd 2, Phum Tuol Roka, Sangkat Chat Angre Krom, Khan Meanchey, Phnom Penh, Cambodia
                        </p>
                    </div>
                    <div className="text-center group">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 group-hover:text-teal-600 transition-colors">Phone Number</p>
                        <p className="text-sm font-black text-slate-800">+855 17 350 544</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Follow MiV</p>
                        <div className="flex gap-4">
                            <Facebook className="w-5 h-5 text-blue-600 cursor-pointer hover:scale-125 transition-transform hover:text-blue-500" />
                            <Linkedin className="w-5 h-5 text-blue-700 cursor-pointer hover:scale-125 transition-transform hover:text-blue-600" />
                        </div>
                    </div>
                </div>
            </div>
            
            {/* ADD THIS CUSTOM CSS TO YOUR GLOBAL CSS OR STYLE TAG */}
            <style jsx global>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
}