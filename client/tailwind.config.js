// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        sandy: "linear-gradient(to bottom right, #fceabb, #f8b500)",
      },
    },
  },
  plugins: [],
};
