import defaultTheme from "tailwindcss/defaultTheme";

import tailwindTypography from "@tailwindcss/typography";
import tailwindForms from "@tailwindcss/forms";
import tailwindAspectRatio from "@tailwindcss/aspect-ratio";
import tailwindcssAnimate from "tailwindcss-animate";

// Custom color with css variable color in __theme_color.scss
function customColors(cssVar: string) {
  return ({
    opacityVariable,
    opacityValue,
  }: {
    opacityVariable?: string;
    opacityValue?: number;
  }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${cssVar}), ${opacityValue})`;
    }
    if (opacityVariable !== undefined) {
      return `rgba(var(${cssVar}), var(${opacityVariable}, 1))`;
    }
    return `rgb(var(${cssVar}))`;
  };
}

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    container: {
      center: "true",
      padding: {
        DEFAULT: "1rem",
        "2xl": "128px",
      },
    },
    fontFamily: {
      display: ["var(--font-display)", ...defaultTheme.fontFamily.sans],
      body: ["var(--font-body)", ...defaultTheme.fontFamily.sans],
      bebasNeue: ["var(--font-bebas-neue)"],
    },
    extend: {
      colors: {
        primary: {
          "50": 'customColors("--c-primary-50")',
          "100": 'customColors("--c-primary-100")',
          "200": 'customColors("--c-primary-200")',
          "300": 'customColors("--c-primary-300")',
          "400": 'customColors("--c-primary-400")',
          "500": 'customColors("--c-primary-500")',
          "700": 'customColors("--c-primary-700")',
          "800": 'customColors("--c-primary-800")',
          "900": 'customColors("--c-primary-900")',
          "6000": 'customColors("--c-primary-600")',
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          "50": 'customColors("--c-secondary-50")',
          "100": 'customColors("--c-secondary-100")',
          "200": 'customColors("--c-secondary-200")',
          "300": 'customColors("--c-secondary-300")',
          "400": 'customColors("--c-secondary-400")',
          "500": 'customColors("--c-secondary-500")',
          "700": 'customColors("--c-secondary-700")',
          "800": 'customColors("--c-secondary-800")',
          "900": 'customColors("--c-secondary-900")',
          "6000": 'customColors("--c-secondary-600")',
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        neutral: {
          "50": 'customColors("--c-neutral-50")',
          "100": 'customColors("--c-neutral-100")',
          "200": 'customColors("--c-neutral-200")',
          "300": 'customColors("--c-neutral-300")',
          "400": 'customColors("--c-neutral-400")',
          "500": 'customColors("--c-neutral-500")',
          "700": 'customColors("--c-neutral-700")',
          "800": 'customColors("--c-neutral-800")',
          "900": 'customColors("--c-neutral-900")',
          "6000": 'customColors("--c-neutral-600")',
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        graph: {
          red: "#FF6A6A",
          green: "#1AC069",
        },
        dark: {
          "0": "#1E2224",
          "1": "#16181A",
          "2": "#181B1D",
          "3": "#101213",
          "4": "#222629",
          "5": "#1F2224",
          "6": "#2C3235",
        },
        light: {
          "0": "#FFFFFF",
          "1": "#FBFBFB",
          "2": "#F6F6F6",
          "3": "#F0EDF4",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    tailwindTypography,
    tailwindForms,
    tailwindAspectRatio,
    tailwindcssAnimate,
  ],
};
