import Link from "next/link";

export default function NotFound() {
  return (
    <main className="space-bg min-h-screen px-4 py-20">
      <div className="mx-auto max-w-xl rounded-2xl border border-white/15 bg-white/5 p-8 text-center backdrop-blur-md">
        <h1 className="mb-2 text-3xl font-semibold text-white">Project not found</h1>
        <p className="mb-4 text-slate-300">This page does not exist in the current portfolio dataset.</p>
        <Link href="/projects" className="rounded-full border border-cyan/55 px-4 py-2 text-cyan">
          Back to projects
        </Link>
      </div>
    </main>
  );
}
