import Link from "next/link";
import { Header } from "@/components/Header";
import { HeroSvg } from "@/components/HeroSvg";
import { constellationProjects } from "@/data/projects";

export default function HomePage() {
  return (
    <div className="space-bg min-h-screen">
      <Header />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-16 pt-8 sm:px-6">
        <HeroSvg projects={constellationProjects} />

        <section className="rounded-2xl border border-white/12 bg-white/[0.03] p-5 backdrop-blur-sm">
          <p className="text-sm text-slate-300">
            Prefer a structured view?
            <Link href="/projects" className="ml-2 text-cyan transition hover:text-cyan/80">
              Browse all projects
            </Link>
            <span className="mx-2 text-slate-500">|</span>
            <Link href="/about" className="text-cyan transition hover:text-cyan/80">
              About Patrick
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
