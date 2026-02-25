import Link from "next/link";
import type { Project } from "@/data/projects";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm transition hover:-translate-y-1 hover:border-cyan/60 hover:bg-white/10">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-white">{project.title}</h3>
        <span className="rounded-full border border-cyan/40 bg-cyan/10 px-2 py-1 text-xs uppercase tracking-wide text-cyan">
          {project.category}
        </span>
      </div>
      <p className="mb-3 text-sm text-slate-200">{project.tagline}</p>
      <p className="mb-4 text-sm leading-relaxed text-slate-300">{project.description}</p>
      <div className="mb-4 flex flex-wrap gap-2">
        {project.tech.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-white/20 bg-white/5 px-2 py-1 text-xs text-slate-200"
          >
            {tech}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap gap-3 text-sm">
        <Link
          href={`/projects/${project.slug}`}
          className="rounded-full border border-white/25 px-3 py-1.5 text-white transition hover:border-cyan/60 hover:text-cyan"
        >
          Read more
        </Link>
        {project.links.github && (
          <Link
            href={project.links.github}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/25 px-3 py-1.5 text-white transition hover:border-cyan/60 hover:text-cyan"
          >
            GitHub
          </Link>
        )}
        {project.links.demo && (
          <Link
            href={project.links.demo}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/25 px-3 py-1.5 text-white transition hover:border-cyan/60 hover:text-cyan"
          >
            Demo
          </Link>
        )}
      </div>
    </article>
  );
}
