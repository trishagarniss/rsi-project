/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {}, // <--- Ini yang membedakan dengan versi 3
  },
};
export default config;