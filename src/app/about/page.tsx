import Link from "next/link";
import type { ReactNode } from "react";
import { Header } from "@/components/Header";

type AboutSectionProps = {
  title: string;
  children: ReactNode;
};

function AboutSection({ title, children }: AboutSectionProps) {
  return (
    <section className="relative rounded-2xl border border-white/12 bg-white/[0.035] p-5 backdrop-blur-sm sm:p-6">
      <div className="absolute left-0 top-0 hidden h-full w-10 items-start justify-center sm:flex">
        <div className="relative mt-8 h-[calc(100%-2.25rem)] w-px bg-cyan/30">
          <span className="absolute -left-[4px] top-0 h-2 w-2 rounded-full bg-cyan shadow-[0_0_12px_rgba(56,189,248,0.8)]" />
        </div>
      </div>
      <div className="sm:pl-8">
        <h2 className="text-lg font-semibold text-white sm:text-xl">{title}</h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-200 sm:text-base">{children}</div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <div className="space-bg min-h-screen">
      <Header />
      <main className="mx-auto w-full max-w-5xl px-4 pb-16 pt-8 sm:px-6">
        <p className="text-xs uppercase tracking-[0.28em] text-cyan/90">Profile</p>
        <h1 className="mb-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">About me</h1>
        <p className="mb-7 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
          Patrick Wang, undergraduate Biomedical Engineering student at the University of Waterloo.
          I focus on biosignal processing, physiology, and machine learning for wearable rehabilitation
          systems, with a strong interest in translating neural and muscular signals into intelligent
          assistive technologies.
        </p>

        <div className="space-y-4">
          <AboutSection title="Origins">
            <p>
              I was born in China and spent my first seven years in Shanghai, later living in Montréal,
              Québec before moving to Waterloo for university.
            </p>
            <p>
              I am fluent in Chinese, French, and English, moderately fluent in Spanish, and currently
              learning German.
            </p>
          </AboutSection>

          <AboutSection title="Academic Experience">
            <p>
              During an exchange semester in Switzerland, I deepened my bioengineering focus through
              coursework spanning neuroscience and machine learning for bioengineers.
            </p>
            <p>
              A representative project used neuron and whisker activation data to classify and predict mouse
              intent. My core technical interests are EMG, EEG, IMU, and machine learning for human movement
              systems.
            </p>
          </AboutSection>

          <AboutSection title="Analytical Background">
            <p>
              My analytical foundation was shaped by high school competition mathematics and has carried into
              systems-level engineering thinking.
            </p>
            <p>
              In the University of Waterloo Euclid Contest, I scored 87 in Grade 11 (Honor Roll Group 4) and
              91 in Grade 12 (Honor Roll Group 3).
            </p>
          </AboutSection>

          <AboutSection title="Outside the Lab">
            <p>
              Outside research, I train powerlifting and cardio: bench 225, squat 275, deadlift 315, with a
              sub-2-hour half marathon.
            </p>
            <p>
              I also play guitar, bass, and drums, and spend time outdoors hiking and skiing, including many
              alpine hikes during my Swiss exchange.
            </p>
          </AboutSection>

          <section className="rounded-2xl border border-cyan/25 bg-cyan/[0.06] p-5 text-sm leading-relaxed text-slate-200 sm:p-6 sm:text-base">
            Top 500 finish in Canada for Clash Royale. I also led the BME2028 clan. If you are a fellow
            player, there is always room for one more.
          </section>
        </div>

        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <Link
            href="/projects"
            className="rounded-full border border-cyan/55 bg-cyan/15 px-4 py-2 text-cyan transition hover:bg-cyan/25"
          >
            View Projects
          </Link>
          <Link
            href="mailto:patrick.wang@uwaterloo.ca"
            className="rounded-full border border-white/25 px-4 py-2 text-white transition hover:border-cyan/55 hover:text-cyan"
          >
            Contact
          </Link>
        </div>
      </main>
    </div>
  );
}
