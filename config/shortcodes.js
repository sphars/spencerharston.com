import utils from "./utils.js";
import meta from "../src/_data/meta.js";
import generateMetaImage from "./ogImage/metaImage.js";

import { readFile } from "fs";
import { promisify } from "util";
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

const shortcodes = {
  pageSourceUrl,
  iconify,
  generateMetaImage
};

export default (eleventyConfig) => {
  return Object.entries(shortcodes).forEach(([name, func]) => eleventyConfig.addShortcode(name, func));
};