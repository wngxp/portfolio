"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import type { Project } from "@/data/projects";
import { ProjectPanel } from "@/components/ProjectPanel";

type HeroSvgProps = {
  projects: Project[];
};

type Point = {
  x: number;
  y: number;
};

const HEAD_CENTER: Point = { x: 500, y: 530 };
const ORIGIN: Point = { x: 500, y: 435 };

function buildEdges(points: Project[]) {
  return [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [2, 5],
    [5, 0],
    [5, 4]
  ].filter(([a, b]) => points[a] && points[b]);
}

export function HeroSvg({ projects }: HeroSvgProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [mobileExplore, setMobileExplore] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [parallax, setParallax] = useState<Point>({ x: 0, y: 0 });

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const onChange = () => setIsMobile(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const points = useMemo(() => {
    return projects.map((project) => ({
      ...project,
      px: project.node.x * 1000,
      py: 80 + project.node.y * 340,
      r: project.node.r ?? 12
    }));
  }, [projects]);

  const edges = useMemo(() => buildEdges(projects), [projects]);
  const selectedProject = useMemo(
    () => projects.find((project) => project.slug === selectedSlug) ?? null,
    [projects, selectedSlug]
  );

  const effectiveOpen = prefersReducedMotion ? true : isOpen;

  const handleHeadToggle = () => {
    if (prefersReducedMotion || isMobile) {
      return;
    }
    setIsOpen((prev) => !prev);
    if (isOpen) {
      setSelectedSlug(null);
    }
  };

  const handlePointerMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (prefersReducedMotion || isMobile) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    setParallax({ x: x * 10, y: y * 8 });
  };

  const resetParallax = () => setParallax({ x: 0, y: 0 });

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/15 bg-slate-950/30 px-4 py-6 shadow-glow sm:px-6 sm:py-8">
      <div className="relative mx-auto max-w-6xl">
        <div className="mb-4 max-w-3xl">
          <p className="mb-2 text-xs uppercase tracking-[0.28em] text-cyan">Interactive Research Constellation</p>
          <h1 className="mb-3 text-3xl font-semibold text-white sm:text-5xl">
            Biomedical Engineering Portfolio: Biosignals + ML for Wearable Rehab Robotics
          </h1>
          <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
            Signal glossary: Electromyography (EMG), electroencephalography (EEG), inertial
            measurement unit (IMU), convolutional neural network (CNN).
          </p>
        </div>

        <div className="flex items-center gap-3 pb-4 md:hidden">
          <button
            type="button"
            onClick={() => setMobileExplore((prev) => !prev)}
            className="rounded-full border border-cyan/60 bg-cyan/20 px-4 py-2 text-sm font-medium text-cyan"
          >
            {mobileExplore ? "Hide Project List" : "Explore Projects"}
          </button>
          <span className="text-xs text-slate-400">Tap a project to open details</span>
        </div>

        <div className={clsx("relative", isMobile ? "h-[340px]" : "h-[540px]")}>
          <svg
            viewBox="0 0 1000 680"
            className="h-full w-full"
            aria-label="Project constellation"
            onMouseMove={handlePointerMove}
            onMouseLeave={resetParallax}
          >
            <defs>
              <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(135,215,255,0.95)" />
                <stop offset="100%" stopColor="rgba(135,215,255,0)" />
              </radialGradient>
            </defs>

            <motion.g
              animate={
                prefersReducedMotion
                  ? { x: 0, y: 0 }
                  : {
                      x: parallax.x,
                      y: parallax.y
                    }
              }
              transition={{ type: "spring", stiffness: 80, damping: 16, mass: 0.6 }}
            >
              <motion.g
                animate={prefersReducedMotion ? {} : { y: [0, -6, 0] }}
                transition={
                  prefersReducedMotion
                    ? undefined
                    : { duration: 7, repeat: Infinity, ease: "easeInOut" }
                }
              >
                {edges.map(([a, b], index) => {
                  const start = points[a];
                  const end = points[b];
                  if (!start || !end) {
                    return null;
                  }

                  return (
                    <motion.line
                      key={`${start.slug}-${end.slug}`}
                      x1={effectiveOpen ? start.px : ORIGIN.x}
                      y1={effectiveOpen ? start.py : ORIGIN.y}
                      x2={effectiveOpen ? end.px : ORIGIN.x}
                      y2={effectiveOpen ? end.py : ORIGIN.y}
                      stroke="rgba(138, 195, 247, 0.42)"
                      strokeWidth="1.4"
                      animate={
                        prefersReducedMotion
                          ? { opacity: 0.5 }
                          : {
                              pathLength: effectiveOpen ? 1 : 0,
                              opacity: effectiveOpen ? 0.75 : 0
                            }
                      }
                      initial={{ pathLength: prefersReducedMotion ? 1 : 0, opacity: 0 }}
                      transition={{ delay: index * 0.03, duration: 0.7, ease: "easeOut" }}
                    />
                  );
                })}

                {points.map((point, index) => {
                  const isHovered = hoveredSlug === point.slug;

                  return (
                    <motion.g
                      key={point.slug}
                      initial={false}
                      animate={{
                        x: effectiveOpen ? point.px - ORIGIN.x : 0,
                        y: effectiveOpen ? point.py - ORIGIN.y : 0,
                        opacity: effectiveOpen || prefersReducedMotion ? 1 : 0.7
                      }}
                      transition={{ duration: 0.6, delay: index * 0.04, ease: "easeOut" }}
                    >
                      <motion.circle
                        cx={ORIGIN.x}
                        cy={ORIGIN.y}
                        r={point.r + 14}
                        fill="url(#nodeGlow)"
                        animate={{ opacity: isHovered ? 0.7 : 0.25 }}
                        transition={{ duration: 0.2 }}
                      />
                      <motion.circle
                        role="button"
                        tabIndex={0}
                        aria-label={`Open ${point.title} details`}
                        cx={ORIGIN.x}
                        cy={ORIGIN.y}
                        r={point.r}
                        fill={isHovered ? "#b7e8ff" : "#8ac3f7"}
                        stroke="rgba(255,255,255,.75)"
                        strokeWidth={isHovered ? 1.3 : 0.8}
                        className={clsx(
                          "cursor-pointer outline-none transition",
                          !effectiveOpen && "pointer-events-none"
                        )}
                        animate={
                          prefersReducedMotion
                            ? { scale: 1 }
                            : { scale: isHovered ? 1.06 : [1, 0.98, 1] }
                        }
                        transition={{ duration: isHovered ? 0.2 : 2.4, repeat: isHovered ? 0 : Infinity }}
                        onMouseEnter={() => setHoveredSlug(point.slug)}
                        onMouseLeave={() => setHoveredSlug((prev) => (prev === point.slug ? null : prev))}
                        onFocus={() => setHoveredSlug(point.slug)}
                        onBlur={() => setHoveredSlug((prev) => (prev === point.slug ? null : prev))}
                        onClick={() => setSelectedSlug(point.slug)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setSelectedSlug(point.slug);
                          }
                        }}
                      />

                      <AnimatePresence>
                        {isHovered && effectiveOpen && (
                          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <rect
                              x={ORIGIN.x + 18}
                              y={ORIGIN.y - 34}
                              rx={8}
                              width={Math.max(150, point.title.length * 8.3)}
                              height={28}
                              fill="rgba(5, 11, 25, 0.9)"
                              stroke="rgba(133, 214, 255, 0.5)"
                            />
                            <text
                              x={ORIGIN.x + 28}
                              y={ORIGIN.y - 16}
                              fill="#dcefff"
                              fontSize="12"
                              letterSpacing="0.02em"
                            >
                              {point.title}
                            </text>
                          </motion.g>
                        )}
                      </AnimatePresence>
                    </motion.g>
                  );
                })}
              </motion.g>

              <g>
                <motion.path
                  d="M 500 584 C 464 584 434 553 434 511 C 434 465 466 424 500 424 C 534 424 566 465 566 511 C 566 553 536 584 500 584"
                  fill="rgba(7,19,41,0.78)"
                  stroke="rgba(170,220,255,0.75)"
                  strokeWidth="2"
                />
                <motion.path
                  d="M 447 507 C 455 459 474 432 500 432 C 526 432 545 459 553 507"
                  fill="none"
                  stroke="rgba(166, 223, 255, 0.8)"
                  strokeWidth="2"
                />
                <motion.path
                  d="M 445 520 L 555 520"
                  fill="none"
                  stroke="rgba(120,190,235,0.52)"
                  strokeWidth="1.4"
                />

                <motion.path
                  d="M 454 505 C 462 457 479 432 500 432 C 521 432 538 457 546 505"
                  fill="none"
                  stroke="rgba(255,160,190,0.95)"
                  strokeWidth="3"
                  animate={
                    prefersReducedMotion
                      ? { opacity: 0.8, y: -24 }
                      : {
                          opacity: effectiveOpen ? 1 : 0.65,
                          y: effectiveOpen ? -28 : 0,
                          rotate: effectiveOpen ? -8 : 0
                        }
                  }
                  style={{ transformOrigin: `${HEAD_CENTER.x}px ${HEAD_CENTER.y - 34}px` }}
                  transition={{ type: "spring", stiffness: 180, damping: 22 }}
                />

                <motion.circle
                  role="button"
                  tabIndex={0}
                  aria-label={effectiveOpen ? "Collapse constellation" : "Open constellation"}
                  cx={HEAD_CENTER.x}
                  cy={HEAD_CENTER.y}
                  r={72}
                  fill="transparent"
                  className="cursor-pointer outline-none"
                  onClick={handleHeadToggle}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleHeadToggle();
                    }
                  }}
                />
              </g>
            </motion.g>
          </svg>

          {!prefersReducedMotion && !isMobile && (
            <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-slate-400">
              Click the head to {isOpen ? "close" : "open"} explore mode
            </div>
          )}
        </div>

        <AnimatePresence>
          {mobileExplore && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute inset-0 z-30 rounded-3xl border border-white/15 bg-slate-950/96 p-4 md:hidden"
            >
              <h2 className="mb-3 text-lg font-semibold text-white">Explore Projects</h2>
              <div className="grid gap-2 overflow-y-auto pb-16">
                {projects.map((project) => (
                  <button
                    key={project.slug}
                    type="button"
                    className="rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-left text-sm text-white"
                    onClick={() => {
                      setSelectedSlug(project.slug);
                      setMobileExplore(false);
                    }}
                  >
                    <span className="block font-medium">{project.title}</span>
                    <span className="text-xs text-slate-300">{project.tagline}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ProjectPanel
        project={selectedProject}
        isOpen={Boolean(selectedProject)}
        onClose={() => setSelectedSlug(null)}
        fullscreenOnMobile
      />
    </section>
  );
}
