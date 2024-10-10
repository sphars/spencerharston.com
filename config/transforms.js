import { minify } from "html-minifier-terser";

const htmlMinify = (content, outputPath) => {
  if (outputPath.endsWith(".html")) {
    let minified = minify(content, {
      useShortDoctype: true,
      removeComments: true,
      collapseWhitespace: true,
      preserveLineBreaks: true,
      minifyJS: true,
      minifyCSS: true
    });
    return minified;
  }
  return content;
};

const transforms = {
  htmlMinify
};

export default (eleventyConfig) => {
  return Object.entries(transforms).forEach(([name, func]) => eleventyConfig.addTransform(name, func));
};
