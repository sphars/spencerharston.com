import utils from "./utils.js";
import meta from "../src/_data/meta.js";
import generateMetaImage from "./ogImage/metaImage.js";

import { readFile } from "fs";
import { promisify } from "util";
import Image from "@11ty/eleventy-img";
const asyncReadFile = promisify(readFile);

/**
 * Async shortcode for producing an icon
 * @param string iconName The tabler icon name to use
 * @returns An SVG element for the icon
 */
const iconify = async (iconName) => {
  const path = `./node_modules/@tabler/icons/icons/outline/${iconName}.svg`;
  const icon = await asyncReadFile(path);
  return icon.toString();
};

function pageSourceUrl() {
  const hash = utils.getLatestGitCommitHash("short");
  const path = this.page.inputPath.slice(2);
  return `${meta.repo}/blob/${hash}/${path}`;
}

async function image(src, alt, title, widths = [300, 600], classes = "", custId = "") {
  if (alt === undefined) {
    throw new Error(`Missing \`alt\` on image from: ${src}`);
  }

  let metadata = await Image(src, {
    widths: widths,
    formats: ["jpeg"],
    outputDir: "./dist/assets/img/content",
    urlPath: "/assets/img/content",
    filenameFormat: function (id, src, width, format, options) {
      return `${custId || id}-${width}w.${format}`;
    },
    sharpJpegOptions: {
      quality: 90
    }
  });

  let data = metadata.jpeg[metadata.jpeg.length - 1];
  return `<img src="${data.url}" title="${title}" class="${classes}" width="${data.width}" height="${data.height}" alt="${alt}" loading="lazy" decoding="async">`;
}

const shortcodes = {
  pageSourceUrl,
  iconify,
  generateMetaImage,
  image
};

export default (eleventyConfig) => {
  return Object.entries(shortcodes).forEach(([name, func]) => eleventyConfig.addShortcode(name, func));
};
