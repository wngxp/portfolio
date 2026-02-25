import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#04070f",
        navy: "#071329",
        cyan: "#87d7ff",
        rose: "#ff7e9b"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(135,215,255,.28), 0 0 30px rgba(135,215,255,.28)"
      },
      backgroundImage: {
        noise:
          "url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'140\' height=\'140\' viewBox=\'0 0 140 140\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'1.1\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'140\' height=\'140\' filter=\'url(%23n)\' opacity=\'.2\'/%3E%3C/svg%3E')"
      }
    }
  },
  plugins: []
};

export default config;
