export default () => ({
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    cssnano: process.env.ELEVENTY_ENV === "production" ? { preset: ["default", {discardComments: {removeAll:true}}]} : {} }
});
