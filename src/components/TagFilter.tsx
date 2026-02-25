"use client";

import type { ProjectCategory } from "@/data/projects";

type TagFilterProps = {
  categories: ProjectCategory[];
  tags: string[];
  selectedCategory: ProjectCategory | "All";
  selectedTag: string | "All";
  onCategoryChange: (value: ProjectCategory | "All") => void;
  onTagChange: (value: string | "All") => void;
};

export function TagFilter({
  categories,
  tags,
  selectedCategory,
  selectedTag,
  onCategoryChange,
  onTagChange
}: TagFilterProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm">
      <div>
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-400">Category</p>
        <div className="flex flex-wrap gap-2">
          {["All", ...categories].map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category as ProjectCategory | "All")}
              className={`rounded-full border px-3 py-1.5 text-xs transition ${
                selectedCategory === category
                  ? "border-cyan/70 bg-cyan/20 text-cyan"
                  : "border-white/20 bg-white/5 text-slate-200 hover:border-cyan/45"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-400">Tech Tag</p>
        <select
          aria-label="Filter by tech tag"
          value={selectedTag}
          onChange={(event) => onTagChange(event.target.value as string | "All")}
          className="w-full rounded-xl border border-white/20 bg-ink/70 px-3 py-2 text-sm text-white focus:border-cyan/70 focus:outline-none"
        >
          <option value="All">All tags</option>
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
