import Link from "next/link";

type IconProps = {
  className?: string;
};

function GitHubIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.21.68-.48v-1.69c-2.78.6-3.37-1.18-3.37-1.18-.46-1.14-1.1-1.45-1.1-1.45-.9-.62.07-.61.07-.61 1 .07 1.52 1 1.52 1 .88 1.49 2.33 1.06 2.9.8.08-.64.35-1.06.63-1.3-2.22-.25-4.56-1.09-4.56-4.86 0-1.07.39-1.95 1.02-2.64-.1-.26-.45-1.31.1-2.72 0 0 .83-.26 2.74 1.01A9.63 9.63 0 0 1 12 6.83c.85 0 1.7.12 2.5.36 1.91-1.27 2.74-1.01 2.74-1.01.55 1.41.2 2.46.1 2.72.64.69 1.02 1.57 1.02 2.64 0 3.78-2.34 4.61-4.57 4.86.36.3.68.87.68 1.76v2.61c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

function LinkedInIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M6.94 8.5a1.56 1.56 0 1 1 0-3.12 1.56 1.56 0 0 1 0 3.12ZM5.62 9.75h2.65V18H5.62V9.75Zm4.3 0h2.54v1.13h.03c.35-.67 1.22-1.38 2.5-1.38 2.67 0 3.16 1.7 3.16 3.9V18h-2.65v-3.98c0-.95-.02-2.17-1.35-2.17-1.35 0-1.56 1.03-1.56 2.1V18H9.92V9.75Z" />
    </svg>
  );
}

function MailIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function DocIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 3.5h7l3 3V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
      <path d="M14 3.5v3h3" />
      <path d="M9 12.5h6M9 16h6" />
    </svg>
  );
}

export function Header() {
  const iconClass = "h-4 w-4";

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/70 backdrop-blur-md">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="text-sm font-semibold tracking-[0.16em] text-white sm:text-base">
          PATRICK WANG
        </Link>

        <div className="flex items-center gap-3 text-xs sm:gap-4 sm:text-sm">
          <Link href="/projects" className="text-slate-200 transition hover:text-cyan">
            Projects
          </Link>
          <Link href="/about" className="text-slate-200 transition hover:text-cyan">
            About
          </Link>
          <Link
            href="https://github.com/wngxpp"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="rounded-full border border-white/15 p-2 text-slate-200 transition hover:border-cyan/60 hover:text-cyan"
          >
            <GitHubIcon className={iconClass} />
          </Link>
          <Link
            href="https://www.linkedin.com/in/wangxp"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="rounded-full border border-white/15 p-2 text-slate-200 transition hover:border-cyan/60 hover:text-cyan"
          >
            <LinkedInIcon className={iconClass} />
          </Link>
          <Link
            href="mailto:patrick.wang@uwaterloo.ca"
            aria-label="Email"
            className="rounded-full border border-white/15 p-2 text-slate-200 transition hover:border-cyan/60 hover:text-cyan"
          >
            <MailIcon className={iconClass} />
          </Link>
          <Link
            href="/resume.pdf"
            aria-label="Resume"
            className="rounded-full border border-white/15 p-2 text-slate-200 transition hover:border-cyan/60 hover:text-cyan"
          >
            <DocIcon className={iconClass} />
          </Link>
        </div>
      </nav>
    </header>
  );
}
