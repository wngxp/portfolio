import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { bySlug } from "@/data/projects";

type ProjectDetailProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProjectDetailPage({ params }: ProjectDetailProps) {
  const { slug } = await params;
  const project = bySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-bg min-h-screen">
      <Header />
      <main className="mx-auto w-full max-w-4xl px-4 pb-16 pt-8 sm:px-6">
        <Link href="/projects" className="mb-6 inline-block text-sm text-cyan hover:text-cyan/80">
          ← Back to projects
        </Link>

        <article className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm sm:p-8">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-cyan">{project.category}</p>
          <h1 className="mb-2 text-3xl font-semibold text-white sm:text-4xl">{project.title}</h1>
          <p className="mb-6 text-slate-300">{project.tagline}</p>

          <div className="mb-6 flex flex-wrap gap-2">
            {project.tech.map((item) => (
              <span key={item} className="rounded-full border border-white/20 px-2.5 py-1 text-xs text-slate-200">
                {item}
              </span>
            ))}
          </div>

          <p className="mb-6 whitespace-pre-line leading-relaxed text-slate-200">{project.description}</p>

          {project.slug === "coop-secure-uploader" && (
            <p className="mb-6 rounded-xl border border-rose/30 bg-rose/10 px-3 py-2 text-sm text-rose-100">
              Code and details omitted due to confidentiality.
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            {project.links.github && (
              <Link
                href={project.links.github}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/25 px-4 py-2 text-sm text-white hover:border-cyan/60 hover:text-cyan"
              >
                GitHub
              </Link>
            )}
            {project.links.demo && (
              <Link
                href={project.links.demo}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/25 px-4 py-2 text-sm text-white hover:border-cyan/60 hover:text-cyan"
              >
                Demo
              </Link>
            )}
          </div>
        </article>
      </main>
    </div>
  );
}
