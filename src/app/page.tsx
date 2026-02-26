import Link from "next/link";
import { Header } from "@/components/Header";
import { HeroSvg } from "@/components/HeroSvg";
import { ProjectCard } from "@/components/ProjectCard";
import { constellationProjects, featuredProjects } from "@/data/projects";

export default function HomePage() {
  return (
    <div className="space-bg min-h-screen">
      <Header />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 pb-16 pt-8 sm:px-6">
        <HeroSvg projects={constellationProjects} />

        <section id="featured-projects" aria-labelledby="featured-heading" className="space-y-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-cyan">Accessible Project List</p>
              <h2 id="featured-heading" className="text-2xl font-semibold text-white sm:text-3xl">
                Featured Projects
              </h2>
            </div>
            <Link href="/projects" className="text-sm text-cyan transition hover:text-cyan/80">
              View all projects
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>

        <section id="about" className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
          <p className="mb-2 text-xs uppercase tracking-[0.28em] text-cyan">About</p>
          <h2 className="mb-3 text-2xl font-semibold text-white">Biomedical Engineering, Signals, and Intelligent Assistive Systems</h2>
          <p className="max-w-3xl leading-relaxed text-slate-200">
            I build project pipelines at the intersection of biosignals and machine learning, with emphasis on
            wearable assistive devices and rehabilitation robotics. My work spans signal preprocessing,
            interpretable models, and systems-minded implementation that can move from a notebook to a practical
            prototype.
          </p>
        </section>

        <section id="contact" className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
          <p className="mb-2 text-xs uppercase tracking-[0.28em] text-cyan">Contact</p>
          <h2 className="mb-3 text-2xl font-semibold text-white">Let&apos;s Build</h2>
          <p className="mb-4 text-slate-200">Open to research collaborations, co-op opportunities, and technical discussions.</p>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link href="mailto:patrick.wang@uwaterloo.ca" className="rounded-full border border-white/25 px-4 py-2 text-white hover:border-cyan/60 hover:text-cyan">
              patrick.wang@uwaterloo.ca
            </Link>
            <Link
              href="https://github.com/wngxpp"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/25 px-4 py-2 text-white hover:border-cyan/60 hover:text-cyan"
            >
              GitHub
            </Link>
            <Link
              href="https://www.linkedin.com/in/wangxp"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/25 px-4 py-2 text-white hover:border-cyan/60 hover:text-cyan"
            >
              LinkedIn
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
