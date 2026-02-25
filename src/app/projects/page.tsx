"use client";

import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { ProjectCard } from "@/components/ProjectCard";
import { TagFilter } from "@/components/TagFilter";
import { projectCategories, projects, type ProjectCategory } from "@/data/projects";

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | "All">("All");
  const [selectedTag, setSelectedTag] = useState<string | "All">("All");

  const allTags = useMemo(
    () => Array.from(new Set(projects.flatMap((project) => project.tech))).sort((a, b) => a.localeCompare(b)),
    []
  );

  const filtered = useMemo(() => {
    return projects.filter((project) => {
      const categoryMatch = selectedCategory === "All" || project.category === selectedCategory;
      const tagMatch = selectedTag === "All" || project.tech.includes(selectedTag);
      return categoryMatch && tagMatch;
    });
  }, [selectedCategory, selectedTag]);

  return (
    <div className="space-bg min-h-screen">
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6">
        <p className="text-xs uppercase tracking-[0.28em] text-cyan">Portfolio Index</p>
        <h1 className="mb-6 text-3xl font-semibold text-white sm:text-4xl">All Projects</h1>

        <div className="mb-6">
          <TagFilter
            categories={projectCategories}
            tags={allTags}
            selectedCategory={selectedCategory}
            selectedTag={selectedTag}
            onCategoryChange={setSelectedCategory}
            onTagChange={setSelectedTag}
          />
        </div>

        <p className="mb-4 text-sm text-slate-300">{filtered.length} project(s) shown</p>

        <section className="grid gap-4 sm:grid-cols-2">
          {filtered.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </section>
      </main>
    </div>
  );
}
