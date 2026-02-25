"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import type { Project } from "@/data/projects";

type ProjectPanelProps = {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  fullscreenOnMobile?: boolean;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function ProjectPanel({
  project,
  isOpen,
  onClose,
  fullscreenOnMobile = false
}: ProjectPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const panelClassName = useMemo(() => {
    return fullscreenOnMobile
      ? "fixed inset-0 z-50 w-full border-l border-white/15 bg-slate-950/90 p-6 backdrop-blur-md sm:max-w-md sm:inset-y-6 sm:right-6 sm:left-auto sm:rounded-2xl"
      : "fixed inset-y-0 right-0 z-50 w-full border-l border-white/15 bg-slate-950/85 p-6 backdrop-blur-md sm:max-w-md";
  }, [fullscreenOnMobile]);

  useEffect(() => {
    if (!isOpen || !panelRef.current) {
      return;
    }

    closeRef.current?.focus();

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) {
        return;
      }

      const elements = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
      ).filter((node) => !node.hasAttribute("disabled"));

      if (!elements.length) {
        event.preventDefault();
        return;
      }

      const first = elements[0];
      const last = elements[elements.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (!active || active === first) {
          event.preventDefault();
          last.focus();
        }
      } else if (!active || active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && project && (
        <>
          <motion.button
            type="button"
            aria-label="Close project details"
            className="fixed inset-0 z-40 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-panel-title"
            className={panelClassName}
            initial={{ x: 420, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 420, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
          >
            <div className="mb-6 flex items-center justify-between gap-2">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan">Project Focus</p>
              <button
                ref={closeRef}
                type="button"
                className="rounded-full border border-white/25 px-3 py-1 text-sm text-white transition hover:border-cyan/65 hover:text-cyan"
                onClick={onClose}
              >
                Close
              </button>
            </div>

            <h2 id="project-panel-title" className="mb-2 text-2xl font-semibold text-white">
              {project.title}
            </h2>
            <p className="mb-4 text-sm text-slate-300">{project.tagline}</p>
            <p className="mb-5 text-sm leading-relaxed text-slate-200">{project.description}</p>

            <div className="mb-6 flex flex-wrap gap-2">
              {project.tech.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/25 bg-white/5 px-2.5 py-1 text-xs text-slate-100"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/projects/${project.slug}`}
                className="rounded-full border border-cyan/55 bg-cyan/15 px-4 py-2 text-sm text-cyan transition hover:bg-cyan/25"
              >
                Read more
              </Link>
              {project.links.github && (
                <Link
                  href={project.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/25 px-4 py-2 text-sm text-white transition hover:border-cyan/50 hover:text-cyan"
                >
                  GitHub
                </Link>
              )}
              {project.links.demo && (
                <Link
                  href={project.links.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/25 px-4 py-2 text-sm text-white transition hover:border-cyan/50 hover:text-cyan"
                >
                  Demo
                </Link>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
