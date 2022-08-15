module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        "spin-linear": "spin 1.7s linear infinite"
      },
      keyframes: {
        spin: {
          to: { transform: "rotate(-360deg)" }
        }
      },
      screens: {
        mobile: { max: "1023px" }
      }
    }
  },
  variants: {
    extend: {
      borderRadius: ["first", "last"],
      margin: ["first", "last"],
      backgroundColor: ["checked"],
      borderColor: ["checked"]
    }
  },
  plugins: []
};
