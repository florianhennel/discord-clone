/** @type {import('tailwindcss').Config} */
export default {
  content: ["index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "futurisic-blue": "url('./src/assets/login_bg_blue.jpg')",
        "futurisic-green": "url('./src/assets/login_bg_green.jpg')",
      },
      height: {
        "1/12": "8.333333%",
        "1/20": "5%",
      },
      maxWidth: {
        "5/6": "83.333333%",
      },
    },
  },
  plugins: [],
};
