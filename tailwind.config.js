import withMT from "@material-tailwind/react/utils/withMT";
import theme from "./src/components/themes/theme";
/** @type {import('tailwindcss').Config} */
export default withMT({
  
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    theme
  },
  plugins: [],
});