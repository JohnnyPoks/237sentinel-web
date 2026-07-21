/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Warm neutrals — a civic, human, institutional base. Not cold blue-grey.
        sand: {
          50: "#FBF7F0",
          100: "#F5EEE1",
          200: "#EADFC9",
          300: "#DCCBA9",
          400: "#C4AC7E",
        },
        ink: {
          DEFAULT: "#2B2621", // warm near-black
          soft: "#5A5147",
          faint: "#8A8073",
        },
        // Verdict states — the national identity expressed through FUNCTION.
        // These are the meaning, not decoration. Tuned for AA contrast on sand.
        verified: {
          DEFAULT: "#1E7A4D",
          bg: "#E4F1E7",
          ink: "#0F3D26",
        },
        unconfirmed: {
          DEFAULT: "#B9791A",
          bg: "#FBEED4",
          ink: "#5C3B08",
        },
        altered: {
          DEFAULT: "#B23A2E",
          bg: "#F9E1DC",
          ink: "#5A1810",
        },
      },
      fontFamily: {
        // Display: a warm serif with personality — institutional but human.
        display: ['"Fraunces"', "Georgia", "serif"],
        // Body: Public Sans, a typeface built for public/government interfaces,
        // highly legible on a mid-range Android screen.
        sans: ['"Public Sans"', "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      maxWidth: {
        readable: "42rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(43,38,33,0.06), 0 8px 24px -12px rgba(43,38,33,0.18)",
      },
    },
  },
  plugins: [],
};
