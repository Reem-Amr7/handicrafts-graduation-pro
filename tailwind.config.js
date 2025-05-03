/** @type {import('tailwindcss').Config} */
const flowbite = require("flowbite-react/tailwind");
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  
  theme: {
    extend: {
      colors: {
        'custom-navbar': '#715E38D9',
      },
      
      fontFamily: {
        kufi: ["Reem Kufi", "sans-serif"],
        cairo: ['Cairo', 'sans-serif'],
      },
    },
  },
  plugins: [
    flowbite.plugin(),
  ],
}

