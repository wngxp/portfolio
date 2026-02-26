# Biomedical Engineering Portfolio (Next.js + TypeScript + Tailwind)

Premium portfolio MVP with an interactive SVG constellation hero, data-driven project content, and accessible fallback project listings.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel, import the repository.
3. Keep defaults (`npm install`, `npm run build`).
4. Deploy.

## How to add a project

Edit [`src/data/projects.ts`](/Users/wxp/dev/portfolio/src/data/projects.ts). This file is the single source of truth.

1. Add a new object to the `projects` array using the `Project` model.
2. Set `featured` to control homepage cards.
3. Set `showInConstellation` to control hero nodes (recommended max 6-7).
4. Add `node` coordinates (`x`, `y` in `0..1`) for constellation layout.
5. Optional links: `github`, `demo`.
6. Optional hover preview image: `previewImage: "/previews/<slug>.jpg"`.

All pages (`/`, `/projects`, `/projects/[slug]`) update automatically.

## Preview Images

- Put preview thumbnails in `public/previews/`.
- Recommended dimensions: `1280x720` (preferred) or `960x540`.
- The node hover preview card uses `next/image` and falls back to a styled placeholder when `previewImage` is omitted.

## Notes

- Place your resume at `public/resume.pdf`.
- If `.next` was accidentally tracked before, stop tracking it with:

```bash
git rm -r --cached .next && git commit -m "Stop tracking .next"
```
