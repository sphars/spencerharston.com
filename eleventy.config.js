// External plugins
import readingTime from "eleventy-plugin-reading-time";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import safeLinks from "@sardine/eleventy-plugin-external-links";

// Custom config "plugins"
import filters from "./config/filters/index.js";
import collections from "./config/collections.js";
import shortcodes from "./config/shortcodes.js";
import transforms from "./config/transforms.js";
import global from "./config/global.js";
import feed from "./config/feed.js";
import markdown from "./config/markdown.js";

/**
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig 
 * @returns {ReturnType<import("@11ty/eleventy/src/defaultConfig")>}
 */
export default function (eleventyConfig) {

  // building for production
  if (process.env.ELEVENTY_ENV === "production") {
    console.log("BUILDING FOR PRODUCTION");
    eleventyConfig.ignores.add("src/posts/drafts");
    eleventyConfig.addPlugin(transforms);
    eleventyConfig.quietMode = true;
  }

  // passthrough copying of assets files
  // images except those in /content subdir as they're handled by the markdown-it-eleventy-img plugin
  // all files of specific fonts are copied over for now
  eleventyConfig.addPassthroughCopy({ 
    "src/assets/scripts/": "assets/scripts/",
    "src/assets/favicons/": "assets/favicons/",
    "src/assets/favicons/favicon.ico": "/favicon.ico",
    "src/assets/img/*[!content]": "assets/img/",
    "node_modules/@fontsource/inria-sans/": "assets/fonts/inria-sans/",
    "node_modules/@fontsource/ibm-plex-mono/": "assets/fonts/ibm-plex-mono/",
    "src/robots.txt": "robots.txt"
  });

  // add watch target for css and tailwind
  eleventyConfig.addWatchTarget("./src/assets/css/");

  // add plugins
  eleventyConfig.addPlugin(global);
  eleventyConfig.addPlugin(shortcodes);
  eleventyConfig.addPlugin(filters);
  eleventyConfig.addPlugin(collections);
  eleventyConfig.addPlugin(markdown);
  eleventyConfig.addPlugin(readingTime);
  eleventyConfig.addPlugin(safeLinks);
  eleventyConfig.addPlugin(feedPlugin, feed);
  
  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: [
      "md",
      "html",
      "njk"
    ],
    markdownTemplateEngine: "njk"
  };
};