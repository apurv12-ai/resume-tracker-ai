"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BriefcaseIcon, PlusIcon, Loader2, X, ExternalLinkIcon,
  Trash2Icon, SparklesIcon, LogOutIcon, SearchIcon, FilterIcon
} from "lucide-react";
import api from "@/lib/api";
import { isAuthenticated, clearAuth } from "@/lib/auth";

// ── Types ────────────────────────────────────────────────────────
type Status = "SAVED" | "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED";

interface Application {
  id: string;
  company: string;
  role: string;
  status: Status;
  jobUrl?: string;
  notes?: string;
  appliedAt?: string;
  createdAt: string;
}

// ── Column config ────────────────────────────────────────────────
const COLUMNS: { status: Status; label: string; color: string; bg: string }[] = [
  { status: "SAVED",     label: "Saved",     color: "text-gray-600",   bg: "bg-gray-100" },
  { status: "APPLIED",   label: "Applied",   color: "text-blue-600",   bg: "bg-blue-100" },
  { status: "INTERVIEW", label: "Interview", color: "text-purple-600", bg: "bg-purple-100" },
  { status: "OFFER",     label: "Offer",     color: "text-green-600",  bg: "bg-green-100" },
  { status: "REJECTED",  label: "Rejected",  color: "text-red-500",    bg: "bg-red-100" },
];

// ── Empty form ───────────────────────────────────────────────────
const EMPTY_FORM = { company: "", role: "", status: "SAVED" as Status, jobUrl: "", notes: "" };

export default function ApplicationsPage() {
  const router = useRouter();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editApp, setEditApp] = useState<Application | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<Status | "ALL">("ALL");

  // Auth guard
  useEffect(() => {
    if (!isAuthenticated()) { router.push("/auth/login"); return; }
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      const res = await api.get("/applications");
      setApps(res.data);
    } catch { /* handled by interceptor */ }
    finally { setLoading(false); }
  };

  // ── Open modal ───────────────────────────────────────────────
  const openAdd = () => {
    setEditApp(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (app: Application) => {
    setEditApp(app);
    setForm({ company: app.company, role: app.role, status: app.status, jobUrl: app.jobUrl || "", notes: app.notes || "" });
    setShowModal(true);
  };

  // ── Save (create or update) ──────────────────────────────────
  const handleSave = async () => {
    if (!form.company.trim() || !form.role.trim()) return;
    setSaving(true);
    try {
      if (editApp) {
        await api.put(`/applications/${editApp.id}`, form);
      } else {
        await api.post("/applications", form);
      }
      await fetchApps();
      setShowModal(false);
    } catch { /* error handled */ }
    finally { setSaving(false); }
  };

  // ── Delete ───────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this application?")) return;
    await api.delete(`/applications/${id}`);
    setApps((prev) => prev.filter((a) => a.id !== id));
  };

  // ── Drag & Drop ──────────────────────────────────────────────
  const handleDragStart = (id: string) => setDragId(id);

  const handleDrop = async (status: Status) => {
    if (!dragId) return;
    const app = apps.find((a) => a.id === dragId);
    if (!app || app.status === status) { setDragId(null); return; }
    // Optimistic update
    setApps((prev) => prev.map((a) => a.id === dragId ? { ...a, status } : a));
    setDragId(null);
    await api.put(`/applications/${dragId}`, { ...app, status });
  };

  const handleLogout = () => { clearAuth(); router.push("/auth/login"); };

  const byStatus = (s: Status) =>
    apps.filter((a) => {
      const matchesSearch =
        search.trim() === "" ||
        a.company.toLowerCase().includes(search.toLowerCase()) ||
        a.role.toLowerCase().includes(search.toLowerCase());
      return a.status === s && matchesSearch;
    });

  const visibleColumns = filterStatus === "ALL" ? COLUMNS : COLUMNS.filter((c) => c.status === filterStatus);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-brand-700 text-lg">
            <BriefcaseIcon className="h-5 w-5" />
            ResumeAI
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
            <Link href="/applications" className="font-medium text-brand-700">Applications</Link>
            <Link href="/ai-tailor" className="text-gray-600 hover:text-gray-900">AI Tailor</Link>
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={openAdd} className="btn-primary text-sm">
              <PlusIcon className="h-4 w-4" /> Add application
            </button>
            <button onClick={handleLogout} className="btn-secondary text-sm">
              <LogOutIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Stats bar + search/filter */}
      <div className="max-w-screen-xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-6 text-sm text-gray-600 flex-1">
          <span className="font-medium text-gray-900">{apps.length} total</span>
          {COLUMNS.filter(c => c.status !== "SAVED").map(c => (
            <span key={c.status}>
              <span className={`font-medium ${c.color}`}>{apps.filter(a => a.status === c.status).length}</span> {c.label.toLowerCase()}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search company or role…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-9 w-56 text-sm"
            />
          </div>

          {/* Status filter */}
          <div className="relative">
            <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as Status | "ALL")}
              className="input pl-9 text-sm appearance-none cursor-pointer"
            >
              <option value="ALL">All columns</option>
              {COLUMNS.map((c) => (
                <option key={c.status} value={c.status}>{c.label} only</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Kanban board */}
      <main className="max-w-screen-xl mx-auto px-6 pb-10">
        <div className={`grid grid-cols-1 gap-4 ${visibleColumns.length === 1 ? "md:grid-cols-1 max-w-md" : visibleColumns.length <= 3 ? "md:grid-cols-3" : "md:grid-cols-5"}`}>
          {visibleColumns.map(({ status, label, color, bg }) => (
            <div
              key={status}
              className="flex flex-col gap-3"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(status)}
            >
              {/* Column header */}
              <div className={`flex items-center justify-between rounded-lg px-3 py-2 ${bg}`}>
                <span className={`text-sm font-semibold ${color}`}>{label}</span>
                <span className={`text-xs font-medium ${color} opacity-70`}>{byStatus(status).length}</span>
              </div>

              {/* Cards */}
              {byStatus(status).map((app) => (
                <div
                  key={app.id}
                  draggable
                  onDragStart={() => handleDragStart(app.id)}
                  className="card p-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-semibold text-sm text-gray-900 leading-snug">{app.company}</p>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button onClick={() => openEdit(app)} className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700">
                        <SparklesIcon className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => handleDelete(app.id)} className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500">
                        <Trash2Icon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{app.role}</p>
                  {app.jobUrl && (
                    <a href={app.jobUrl} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-brand-600 hover:underline">
                      <ExternalLinkIcon className="h-3 w-3" /> View job
                    </a>
                  )}
                  {app.notes && (
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{app.notes}</p>
                  )}
                </div>
              ))}

              {/* Empty state */}
              {byStatus(status).length === 0 && (
                <div className="rounded-lg border-2 border-dashed border-gray-200 p-4 text-center text-xs text-gray-400">
                  Drop here
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">
                {editApp ? "Edit application" : "Add application"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="label">Company *</label>
                <input className="input" placeholder="e.g. Google" value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })} />
              </div>
              <div>
                <label className="label">Role *</label>
                <input className="input" placeholder="e.g. Software Engineer" value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })} />
              </div>
              <div>
                <label className="label">Status</label>
                <select className="input" value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as Status })}>
                  {COLUMNS.map(c => <option key={c.status} value={c.status}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Job URL</label>
                <input className="input" placeholder="https://..." value={form.jobUrl}
                  onChange={(e) => setForm({ ...form, jobUrl: e.target.value })} />
              </div>
              <div>
                <label className="label">Notes</label>
                <textarea className="input resize-none" rows={3} placeholder="Any notes..."
                  value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.company || !form.role}
                className="btn-primary flex-1">
                {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}