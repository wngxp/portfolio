import Link from "next/link";
import { Header } from "@/components/Header";

export default function AboutPage() {
  return (
    <div className="space-bg min-h-screen">
      <Header />
      <main className="mx-auto w-full max-w-4xl px-4 pb-16 pt-8 sm:px-6">
        <p className="text-xs uppercase tracking-[0.28em] text-cyan">About</p>
        <h1 className="mb-4 text-3xl font-semibold text-white sm:text-4xl">Patrick Wang</h1>

        <section className="space-y-4 rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
          <p className="leading-relaxed text-slate-200">
            I am a Biomedical Engineering student at the University of Waterloo focused on biosignal-driven
            intelligence for wearables and rehabilitation robotics. My work combines signal processing,
            machine learning, and practical systems implementation.
          </p>
          <p className="leading-relaxed text-slate-300">
            I care about building models that are not only accurate, but interpretable, robust, and usable in
            real-world assistive contexts.
          </p>
          <div className="flex flex-wrap gap-3 pt-2 text-sm">
            <Link
              href="/projects"
              className="rounded-full border border-cyan/55 bg-cyan/15 px-4 py-2 text-cyan transition hover:bg-cyan/25"
            >
              View Projects
            </Link>
            <Link
              href="mailto:patrick.wang@uwaterloo.ca"
              className="rounded-full border border-white/25 px-4 py-2 text-white transition hover:border-cyan/55 hover:text-cyan"
            >
              Contact
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
