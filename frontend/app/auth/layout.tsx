// app/auth/layout.tsx
import Link from "next/link";
import { BriefcaseIcon } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Logo bar */}
      <div className="flex justify-center pt-10">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-brand-700 text-lg"
        >
          <BriefcaseIcon className="h-5 w-5" />
          ResumeAI
        </Link>
      </div>

      {/* Form card */}
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
