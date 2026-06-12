"use client";
// app/dashboard/page.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BriefcaseIcon, SparklesIcon, LogOutIcon,
  TrendingUpIcon, MessageSquareIcon, Loader2, AwardIcon
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { getUser, clearAuth, isAuthenticated } from "@/lib/auth";
import type { User } from "@/lib/auth";
import api from "@/lib/api";

interface Stats {
  total: number;
  statusCounts: Record<string, number>;
  statusBreakdown: { status: string; count: number }[];
  timeline: { week: string; count: number }[];
  rates: { interviewRate: number; offerRate: number; responseRate: number };
}

const STATUS_COLORS: Record<string, string> = {
  SAVED: "#9ca3af",
  APPLIED: "#3b82f6",
  INTERVIEW: "#a855f7",
  OFFER: "#22c55e",
  REJECTED: "#ef4444",
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth/login");
      return;
    }
    setUser(getUser());
    fetchStats();
  }, [router]);

  const fetchStats = async () => {
    try {
      const res = await api.get("/stats");
      setStats(res.data);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    router.push("/auth/login");
  };

  if (!user) return null;

  const statCards = [
    { label: "Total applications", value: stats?.total ?? 0, icon: BriefcaseIcon, color: "text-brand-600 bg-brand-50" },
    { label: "Response rate", value: `${stats?.rates.responseRate ?? 0}%`, icon: TrendingUpIcon, color: "text-blue-600 bg-blue-50" },
    { label: "Interview rate", value: `${stats?.rates.interviewRate ?? 0}%`, icon: MessageSquareIcon, color: "text-purple-600 bg-purple-50" },
    { label: "Offer rate", value: `${stats?.rates.offerRate ?? 0}%`, icon: AwardIcon, color: "text-green-600 bg-green-50" },
  ];

  const pieData = (stats?.statusBreakdown ?? []).filter(d => d.count > 0);
  const timelineData = (stats?.timeline ?? []).map(t => ({
    ...t,
    label: new Date(t.week).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-brand-700 text-lg">
            <BriefcaseIcon className="h-5 w-5" />
            ResumeAI
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/dashboard" className="font-medium text-brand-700">Dashboard</Link>
            <Link href="/applications" className="text-gray-600 hover:text-gray-900">Applications</Link>
            <Link href="/ai-tailor" className="text-gray-600 hover:text-gray-900">AI Tailor</Link>
            <Link href="/ats" className="text-gray-600 hover:text-gray-900">ATS Check</Link>
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-gray-600">
              Hi, {user.name.split(" ")[0]}
            </span>
            <button onClick={handleLogout} className="btn-secondary text-sm gap-1.5">
              <LogOutIcon className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user.name.split(" ")[0]}
          </h1>
          <p className="text-gray-600 mt-1">
            Here&apos;s how your job search is going.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
          </div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {statCards.map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="card flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    <p className="text-sm text-gray-500">{label}</p>
                  </div>
                </div>
              ))}
            </div>

            {stats && stats.total === 0 ? (
              /* Empty state */
              <div className="card flex flex-col items-center justify-center py-16 text-center">
                <BriefcaseIcon className="h-12 w-12 text-gray-200 mb-4" />
                <p className="text-gray-500 mb-4">No applications yet. Add your first one to see analytics here.</p>
                <Link href="/applications" className="btn-primary">Add application</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Timeline chart */}
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-4">Applications over time</h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={timelineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                      <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#9ca3af" />
                      <Tooltip />
                      <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="Applications" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Status breakdown pie */}
                <div className="card">
                  <h3 className="font-semibold text-gray-900 mb-4">Status breakdown</h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="count"
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={85}
                        paddingAngle={2}
                      >
                        {pieData.map((entry) => (
                          <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Quick actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/applications" className="card hover:border-brand-300 transition-colors group">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-brand-100 flex items-center justify-center group-hover:bg-brand-200 transition-colors">
                    <BriefcaseIcon className="h-5 w-5 text-brand-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Application board</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Track all your job applications in a Kanban board.
                    </p>
                  </div>
                </div>
              </Link>

              <Link href="/ai-tailor" className="card hover:border-brand-300 transition-colors group">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <SparklesIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">AI resume tailor</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Get a tailored resume and interview prep for any role.
                    </p>
                  </div>
                </div>
              </Link>

              <Link href="/ats" className="card hover:border-brand-300 transition-colors group">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <AwardIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">ATS checker</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Upload your resume PDF and get an ATS compatibility score.
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}