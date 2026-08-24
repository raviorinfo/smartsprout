import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sprout: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        candy: {
          pink: "#f9a8d4",
          rose: "#fb7185",
          peach: "#fdba74",
          coral: "#f87171",
        },
        sky: {
          light: "#bae6fd",
          medium: "#38bdf8",
          deep: "#0284c7",
        },
        sunshine: {
          light: "#fef08a",
          medium: "#facc15",
          deep: "#eab308",
        },
        lavender: {
          light: "#e9d5ff",
          medium: "#c084fc",
          deep: "#9333ea",
        },
        ocean: {
          light: "#a5f3fc",
          medium: "#22d3ee",
          deep: "#0891b2",
        },
      },
      fontFamily: {
        heading: ["Nunito", "ui-rounded", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        playful: "0 8px 30px rgba(0, 0, 0, 0.08)",
        "playful-lg": "0 12px 40px rgba(0, 0, 0, 0.12)",
        glow: "0 0 20px rgba(34, 197, 94, 0.3)",
        "glow-pink": "0 0 20px rgba(249, 168, 212, 0.4)",
        "glow-blue": "0 0 20px rgba(56, 189, 248, 0.4)",
        "glow-yellow": "0 0 20px rgba(250, 204, 21, 0.4)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 2s infinite",
        "bounce-gentle": "bounceGentle 2s ease-in-out infinite",
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        wiggle: "wiggle 1s ease-in-out infinite",
        sparkle: "sparkle 2s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        bounceGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        sparkle: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.1)" },
        },
      },
      backgroundImage: {
        "gradient-playful":
          "linear-gradient(135deg, #f0fdf4 0%, #ede9fe 50%, #fdf2f8 100%)",
        "gradient-hero":
          "linear-gradient(135deg, #dcfce7 0%, #bae6fd 33%, #e9d5ff 66%, #fef08a 100%)",
        "gradient-card":
          "linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
