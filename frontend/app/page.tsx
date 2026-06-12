// app/page.tsx
import Link from "next/link";
import { BriefcaseIcon, SparklesIcon, LayoutDashboardIcon } from "lucide-react";

const features = [
  {
    icon: LayoutDashboardIcon,
    title: "Kanban application board",
    desc: "Track every application from saved to offer in a clean drag-and-drop board.",
  },
  {
    icon: SparklesIcon,
    title: "AI resume tailoring",
    desc: "Paste any job description and get Claude-powered resume bullet points in seconds.",
  },
  {
    icon: BriefcaseIcon,
    title: "Interview prep",
    desc: "Auto-generate role-specific interview questions and model answers for every application.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-brand-50 to-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 font-semibold text-brand-700 text-lg">
          <BriefcaseIcon className="h-5 w-5" />
          ResumeAI
        </div>
        <div className="flex gap-3">
          <Link href="/auth/login" className="btn-secondary text-sm">
            Sign in
          </Link>
          <Link href="/auth/register" className="btn-primary text-sm">
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <span className="inline-block mb-4 rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700">
          Powered by Claude AI
        </span>
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-6">
          Land your dream job,{" "}
          <span className="text-brand-600">faster</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Track every application, get AI-tailored resume bullet points for each
          role, and walk into every interview prepared.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/register" className="btn-primary px-8 py-3 text-base">
            Start tracking free
          </Link>
          <Link href="/auth/login" className="btn-secondary px-8 py-3 text-base">
            Sign in
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card">
              <div className="h-10 w-10 rounded-lg bg-brand-100 flex items-center justify-center mb-4">
                <Icon className="h-5 w-5 text-brand-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
