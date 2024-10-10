import dates from "./dates.js";
import collections from "./collections.js";

const filters = {
  ...dates,
  ...collections
};

export default (eleventyConfig) => {
  return Object.entries(filters).forEach(([name, func]) => eleventyConfig.addNunjucksFilter(name, func));
};