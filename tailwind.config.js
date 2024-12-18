/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // screens: {
    //   "2xl": { max: "1535px" }, // => @media (max-width: 1535px) { ... }
    //   xl: { max: "1279px" }, // => @media (max-width: 1279px) { ... }
    //   lg: { max: "1023px" }, // => @media (max-width: 1023px) { ... }
    //   md: { max: "767px" }, // => @media (max-width: 767px) { ... }
    //   sm: { max: "639px" }, // => @media (max-width: 639px) { ... }
    // },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        "osas-lightBlueGray": "#B3B6D4",
        "osas-darkBlue": "#0D0F1D",
        "osas-brightBlue": "#3B82F6",
        "osas-lightGray": "#D9D9D9",
        "osas-lightBlueGray2": "#DFE2F8",
        "osas-customBlue": "#CAF3FFCC",
        "osas-customWhite": "#FEFEFE",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@xpd/tailwind-3dtransforms"),
  ],
};
