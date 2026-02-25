import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/70 backdrop-blur-md">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="text-sm font-semibold tracking-[0.2em] text-white sm:text-base">
          WXP PORTFOLIO
        </Link>

        <div className="flex flex-wrap items-center gap-3 text-xs sm:gap-4 sm:text-sm">
          <Link href="/projects" className="text-slate-200 transition hover:text-cyan">
            Projects
          </Link>
          <Link
            href="https://github.com/wngxp"
            target="_blank"
            rel="noreferrer"
            className="text-slate-200 transition hover:text-cyan"
          >
            GitHub
          </Link>
          <Link
            href="https://www.linkedin.com/in/wangxp"
            target="_blank"
            rel="noreferrer"
            className="text-slate-200 transition hover:text-cyan"
          >
            LinkedIn
          </Link>
          <Link href="mailto:patrick.wang@uwaterloo.ca" className="text-slate-200 transition hover:text-cyan">
            Email
          </Link>
          <Link href="/resume.pdf" className="text-slate-200 transition hover:text-cyan">
            Resume
          </Link>
        </div>
      </nav>
    </header>
  );
}
