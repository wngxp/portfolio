"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Project } from "@/data/projects";
import { glossaryMap, glossaryTerms, type GlossaryTerm } from "@/data/glossary";
import { ProjectPanel } from "@/components/ProjectPanel";

type HeroSvgProps = {
  projects: Project[];
};

type Point = {
  x: number;
  y: number;
};

const ORIGIN: Point = { x: 500, y: 340 };
const HEAD_LEFT_OUTLINE_PATH =
  "M0 774C33 714.5 86.5 711 131.5 697C179.5 682.067 325 626.5 344 614C359.5 603.803 384 596 384 555.5C384 538.71 384.5 520.167 384 502.5M500 571.5C452 568.5 455.01 563.848 420.5 534.5C357 480.5 371.5 478.5 365.5 437C360.584 403 351 397.5 349 371C347.307 348.564 349 348.5 351 336";
const HEAD_RIGHT_OUTLINE_PATH =
  "M1000 774C967 714.5 913.5 711 868.5 697C820.5 682.067 675 626.5 656 614C640.5 603.803 616 596 616 555.5C616 538.71 615.5 520.167 616 502.5M500 571.5C548 568.5 544.99 563.848 579.5 534.5C643 480.5 628.5 478.5 634.5 437C639.416 403 649 397.5 651 371C652.693 348.564 651 348.5 649 336";
const HEAD_RIM_ELLIPSE_PATH =
  "M500 308.5C541.4 308.5 578.868 311.633 605.975 316.692C619.532 319.223 630.472 322.231 638.011 325.559C641.782 327.223 644.674 328.955 646.615 330.727C648.558 332.499 649.5 334.262 649.5 336C649.5 337.738 648.558 339.501 646.615 341.273C644.674 343.045 641.782 344.777 638.011 346.441C630.472 349.769 619.532 352.777 605.975 355.308C578.868 360.367 541.4 363.5 500 363.5C458.6 363.5 421.132 360.367 394.025 355.308C380.468 352.777 369.528 349.769 361.989 346.441C358.218 344.777 355.326 343.045 353.385 341.273C351.442 339.501 350.5 337.738 350.5 336C350.5 334.262 351.442 332.499 353.385 330.727C355.326 328.955 358.218 327.223 361.989 325.559C369.528 322.231 380.468 319.223 394.025 316.692C421.132 311.633 458.6 308.5 500 308.5Z";
const HEAD_FILL_PATH =
  "M350 336C360 450 385 520 395 575C410 650 450 710 500 745C550 710 590 650 605 575C615 520 640 450 650 336C611 316 555 308 500 308C445 308 389 316 350 336Z";
const FACE_PLATE_PATH =
  "M500 388C470 388 452 418 452 468C452 522 470 560 500 579C530 560 548 522 548 468C548 418 530 388 500 388Z";
const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

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

function AcronymTooltip({ acronym }: { acronym: GlossaryTerm["acronym"] }) {
  const item = glossaryMap[acronym];

  return (
    <span className="group relative inline-block">
      <span
        tabIndex={0}
        className="cursor-help rounded-sm border-b border-dotted border-cyan/70 text-cyan focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan/45"
      >
        {acronym}
      </span>
      <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-56 -translate-x-1/2 rounded-xl border border-white/20 bg-slate-950/95 p-2 text-left text-xs text-slate-100 opacity-0 shadow-glow transition group-hover:opacity-100 group-focus-within:opacity-100">
        <strong className="block text-cyan">{item.expanded}</strong>
        <span className="text-slate-300">{item.definition}</span>
      </span>
    </span>
  );
}

function GlossaryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open || !modalRef.current) {
      return;
    }

    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !modalRef.current) {
        return;
      }

      const elements = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
      ).filter((el) => !el.hasAttribute("disabled"));
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

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close glossary"
            className="fixed inset-0 z-40 bg-black/55"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="glossary-title"
            className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/15 bg-slate-950/88 p-6 backdrop-blur-md"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 id="glossary-title" className="text-lg font-semibold text-white">
                Glossary
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/25 px-3 py-1 text-xs text-white transition hover:border-cyan/55 hover:text-cyan"
              >
                Close
              </button>
            </div>
            <div className="space-y-3">
              {glossaryTerms.map((term) => (
                <div key={term.acronym} className="rounded-xl border border-white/15 bg-white/5 p-3">
                  <p className="text-sm font-semibold text-cyan">
                    {term.acronym} <span className="font-normal text-slate-300">- {term.expanded}</span>
                  </p>
                  <p className="mt-1 text-sm text-slate-200">{term.definition}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function HeroSvg({ projects }: HeroSvgProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [mobileExplore, setMobileExplore] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
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
      py: 84 + project.node.y * 334,
      r: project.node.r ?? 12
    }));
  }, [projects]);

  const stars = useMemo(
    () => [
      { x: 94, y: 72, r: 1.1, o: 0.4 },
      { x: 142, y: 134, r: 0.9, o: 0.34 },
      { x: 216, y: 58, r: 1.2, o: 0.46 },
      { x: 318, y: 96, r: 1.1, o: 0.33 },
      { x: 372, y: 142, r: 0.8, o: 0.3 },
      { x: 445, y: 78, r: 1, o: 0.37 },
      { x: 558, y: 62, r: 1.2, o: 0.36 },
      { x: 632, y: 104, r: 1, o: 0.35 },
      { x: 706, y: 84, r: 0.9, o: 0.3 },
      { x: 794, y: 128, r: 1.1, o: 0.42 },
      { x: 866, y: 74, r: 1, o: 0.38 },
      { x: 912, y: 142, r: 1.1, o: 0.35 },
      { x: 168, y: 212, r: 1, o: 0.33 },
      { x: 264, y: 192, r: 0.9, o: 0.34 },
      { x: 332, y: 238, r: 1.1, o: 0.38 },
      { x: 488, y: 208, r: 1.3, o: 0.36 },
      { x: 612, y: 228, r: 0.9, o: 0.31 },
      { x: 704, y: 194, r: 1.2, o: 0.4 },
      { x: 824, y: 232, r: 1, o: 0.32 },
      { x: 906, y: 206, r: 1, o: 0.36 }
    ],
    []
  );

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
        <div className="mb-5 max-w-2xl space-y-3">
          <p className="text-[10px] uppercase tracking-[0.34em] text-cyan/85 sm:text-xs">
            Interactive Research Constellation
          </p>
          <h1 className="text-4xl font-semibold text-white sm:text-6xl">Patrick Wang</h1>
          <p className="text-sm text-slate-200 sm:text-base">
            Biomedical Engineering student @ University of Waterloo
          </p>
          <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
            I build wearable intelligence from biosignals - <AcronymTooltip acronym="EMG" />,{" "}
            <AcronymTooltip acronym="EEG" />, and <AcronymTooltip acronym="IMU" /> - using machine
            learning.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <Link
              href="/projects"
              className="rounded-full border border-cyan/60 bg-cyan/15 px-4 py-2 text-sm text-cyan transition hover:bg-cyan/25"
            >
              Explore Projects
            </Link>
            <Link
              href="/about"
              className="rounded-full border border-white/25 px-4 py-2 text-sm text-white transition hover:border-cyan/55 hover:text-cyan"
            >
              About
            </Link>
            <button
              type="button"
              onClick={() => setIsGlossaryOpen(true)}
              className="rounded-full border border-white/25 px-4 py-2 text-sm text-white transition hover:border-cyan/55 hover:text-cyan"
            >
              Glossary
            </button>
          </div>
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
            viewBox="0 0 1000 800"
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
              <linearGradient id="headCoreGradient" x1="500" y1="308" x2="500" y2="745" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="rgba(30,64,102,0.56)" />
                <stop offset="50%" stopColor="rgba(18,36,64,0.5)" />
                <stop offset="100%" stopColor="rgba(8,18,36,0.72)" />
              </linearGradient>
              <radialGradient id="facePlateGradient" cx="50%" cy="38%" r="62%">
                <stop offset="0%" stopColor="rgba(146,214,255,0.18)" />
                <stop offset="58%" stopColor="rgba(74,138,192,0.16)" />
                <stop offset="100%" stopColor="rgba(12,26,48,0.06)" />
              </radialGradient>
              <radialGradient id="cavityPulseGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(138,210,255,0.34)" />
                <stop offset="100%" stopColor="rgba(138,210,255,0)" />
              </radialGradient>
              <filter id="nodeSoftBlur" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="4" />
              </filter>
              <filter id="headGlow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="2" />
              </filter>
              <filter id="headSoftBloom" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="9" />
              </filter>
              <filter id="headShimmerBlur" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="4.6" />
              </filter>
            </defs>

            <g>
              {stars.map((star, index) => (
                <motion.circle
                  key={`star-${index}`}
                  cx={star.x}
                  cy={star.y}
                  r={star.r}
                  fill="rgba(188,222,255,0.9)"
                  animate={
                    prefersReducedMotion
                      ? { opacity: star.o }
                      : { opacity: [star.o * 0.75, star.o, star.o * 0.75] }
                  }
                  transition={{ duration: 4 + (index % 5), repeat: Infinity, ease: "easeInOut" }}
                />
              ))}
            </g>

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
                {edges.map(([a, b]) => {
                  const start = points[a];
                  const end = points[b];
                  if (!start || !end) {
                    return null;
                  }

                  const lineDelay = Math.max(a, b) * 0.07 + 0.11;
                  const lineLength = Math.hypot(end.px - start.px, end.py - start.py);

                  return (
                    <motion.line
                      key={`${start.slug}-${end.slug}`}
                      x1={ORIGIN.x}
                      y1={ORIGIN.y}
                      x2={ORIGIN.x}
                      y2={ORIGIN.y}
                      stroke="rgba(138, 195, 247, 0.46)"
                      strokeWidth="1.35"
                      strokeDasharray={lineLength}
                      animate={
                        prefersReducedMotion
                          ? {
                              x1: start.px,
                              y1: start.py,
                              x2: end.px,
                              y2: end.py,
                              opacity: 0.56,
                              strokeDashoffset: 0
                            }
                          : {
                              x1: effectiveOpen ? start.px : ORIGIN.x,
                              y1: effectiveOpen ? start.py : ORIGIN.y,
                              x2: effectiveOpen ? end.px : ORIGIN.x,
                              y2: effectiveOpen ? end.py : ORIGIN.y,
                              opacity: effectiveOpen ? 0.78 : 0,
                              strokeDashoffset: effectiveOpen ? 0 : lineLength
                            }
                      }
                      initial={{ strokeDashoffset: lineLength, opacity: 0 }}
                      transition={{
                        type: prefersReducedMotion ? "tween" : "spring",
                        stiffness: 150,
                        damping: 22,
                        delay: lineDelay
                      }}
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
                        opacity: effectiveOpen || prefersReducedMotion ? 1 : 0.72
                      }}
                      transition={{
                        type: prefersReducedMotion ? "tween" : "spring",
                        stiffness: 170,
                        damping: 20,
                        delay: index * 0.07
                      }}
                    >
                      <motion.circle
                        cx={ORIGIN.x}
                        cy={ORIGIN.y}
                        r={point.r + 14}
                        fill="url(#nodeGlow)"
                        filter="url(#nodeSoftBlur)"
                        animate={{ opacity: isHovered ? 0.72 : 0.32 }}
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
                            : { scale: isHovered ? 1.06 : [1, 0.985, 1] }
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

              <motion.g
                className="cursor-pointer"
                animate={prefersReducedMotion ? { scale: 1 } : { scale: effectiveOpen ? 1.012 : 1 }}
                transition={{ duration: 0.55, ease: "easeInOut" }}
              >
                <path d={HEAD_FILL_PATH} fill="url(#headCoreGradient)" />
                <path d={HEAD_FILL_PATH} fill="none" stroke="rgba(100,160,212,0.18)" strokeWidth="1" />
                <path d={FACE_PLATE_PATH} fill="url(#facePlateGradient)" />
                <path d="M500 404L500 578" fill="none" stroke="rgba(144,206,248,0.15)" strokeWidth="1.1" />
                <path
                  d="M466 452C476 445 489 442 500 442C511 442 524 445 534 452"
                  fill="none"
                  stroke="rgba(150,212,248,0.12)"
                  strokeWidth="1.05"
                />
                <path
                  d="M477 534C485 540 494 543 500 543C506 543 515 540 523 534"
                  fill="none"
                  stroke="rgba(150,212,248,0.12)"
                  strokeWidth="1.05"
                />
                <motion.ellipse
                  cx={500}
                  cy={336}
                  rx={128}
                  ry={30}
                  fill="url(#cavityPulseGradient)"
                  filter="url(#headSoftBloom)"
                  animate={
                    prefersReducedMotion
                      ? { opacity: 0.3 }
                      : {
                          opacity: effectiveOpen ? [0.25, 0.5, 0.25] : [0.1, 0.24, 0.1],
                          scaleX: effectiveOpen ? [0.98, 1.03, 0.98] : [0.96, 1, 0.96]
                        }
                  }
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.path
                  d="M388 356C438 332 562 332 612 356"
                  fill="none"
                  stroke="rgba(176,230,255,0.22)"
                  strokeWidth="1.2"
                  filter="url(#headShimmerBlur)"
                  animate={
                    prefersReducedMotion
                      ? { opacity: 0.2 }
                      : { opacity: effectiveOpen ? [0.14, 0.32, 0.14] : [0.08, 0.2, 0.08] }
                  }
                  transition={{ duration: 2.3, repeat: Infinity, ease: "easeInOut" }}
                />

                <path
                  d={HEAD_LEFT_OUTLINE_PATH}
                  fill="none"
                  stroke="rgba(138, 195, 247, 0.22)"
                  strokeWidth="2.6"
                  filter="url(#headGlow)"
                />
                <path
                  d={HEAD_RIGHT_OUTLINE_PATH}
                  fill="none"
                  stroke="rgba(138, 195, 247, 0.22)"
                  strokeWidth="2.6"
                  filter="url(#headGlow)"
                />
                <path
                  d={HEAD_RIM_ELLIPSE_PATH}
                  fill="none"
                  stroke="rgba(138, 195, 247, 0.22)"
                  strokeWidth="2.6"
                  filter="url(#headGlow)"
                />

                <path d={HEAD_LEFT_OUTLINE_PATH} fill="none" stroke="rgba(138, 195, 247, 0.46)" strokeWidth="1.35" />
                <path d={HEAD_RIGHT_OUTLINE_PATH} fill="none" stroke="rgba(138, 195, 247, 0.46)" strokeWidth="1.35" />
                <path d={HEAD_RIM_ELLIPSE_PATH} fill="none" stroke="rgba(138, 195, 247, 0.46)" strokeWidth="1.35" />

                <motion.circle
                  role="button"
                  tabIndex={0}
                  aria-label={effectiveOpen ? "Collapse constellation" : "Open constellation"}
                  cx={500}
                  cy={536}
                  r={240}
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
              </motion.g>
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

      <GlossaryModal open={isGlossaryOpen} onClose={() => setIsGlossaryOpen(false)} />
    </section>
  );
}
