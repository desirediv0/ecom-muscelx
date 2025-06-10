/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        jost: ["var(--font-jost)"],
        poppins: ["var(--font-poppins)"],
      },
      colors: {
        background: "#fff",
        foreground: "#222",
        card: {
          DEFAULT: "#fff",
          foreground: "#222",
        },
        popover: {
          DEFAULT: "#fff",
          foreground: "#222",
        },
        primary: {
          DEFAULT: "#F44336",
          foreground: "#fff",
        },
        secondary: {
          DEFAULT: "#F47C20",
          foreground: "#fff",
        },
        muted: {
          DEFAULT: "#f5f5f5",
          foreground: "#888",
        },
        accent: {
          DEFAULT: "#F44336",
          foreground: "#fff",
        },
        destructive: {
          DEFAULT: "#e53935",
          foreground: "#fff",
        },
        border: "#eee",
        input: "#eee",
        ring: "#F44336",
        chart: {
          1: "#F44336",
          2: "#F47C20",
          3: "#222",
          4: "#f5f5f5",
          5: "#e53935",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
