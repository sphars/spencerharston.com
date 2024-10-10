import { parse, join, dirname } from "node:path";

// markdown plugins
import markdownIt from "markdown-it";
import markdownItFootnote from "markdown-it-footnote";
import markdownItImageFigures from "markdown-it-image-figures";
import markdownItAnchor from "markdown-it-anchor";
import markdownItAttrs from "markdown-it-attrs";
import markdownItEleventyImg from "markdown-it-eleventy-img";

// markdown plugin options
const markdownItOptions = {
  html: true,
};

const markdownItAnchorOptions = {
  level: [2, 3],
};

const markdownItImageFiguresOptions = {
  figcaption: true,
};

const markdownItEleventyImgOptions = {
  imgOptions: {
    widths: [480, 720, 1000],
    formats: ["webp", "jpeg"],
    urlPath: "/assets/img/content",
    outputDir: "./dist/assets/img/content",
    filenameFormat: (id, src, width, format) => {
      const { name } = parse(src);
      return `${name}-${width}w.${format}`;
    },
  },
  globalAttributes: {
    decoding: "async",
    loading: "lazy",
    sizes: "100vw",
  },
  resolvePath: (filepath, env) => join(dirname(env.page.inputPath), filepath),
};

const markdownLib = markdownIt(markdownItOptions)
  .use(markdownItFootnote)
  .use(markdownItAnchor, markdownItAnchorOptions)
  .use(markdownItAttrs)
  .use(markdownItImageFigures, markdownItImageFiguresOptions)
  .use(markdownItEleventyImg, markdownItEleventyImgOptions);

export default (eleventyConfig) => {
  eleventyConfig.setLibrary("md", markdownLib);
};
