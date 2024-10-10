import { DateTime } from "luxon";

/**
 * Get the collection of all posts, including drafts
 * @param {*} collectionApi The callback function from eleventy
 * @returns An array of markdown template in the posts subdir
 */
const posts = (collectionApi) => {
  const posts = collectionApi.getFilteredByGlob("./src/posts/**/*.md");
  return posts;
};

/**
 * Get a collection of all drafts
 * @param {*} collectionApi The collection API passed from eleventy
 * @returns An array of markdown template in the posts/drafts subdir
 */
const drafts = (collectionApi) => {
  const drafts = collectionApi.getFilteredByGlob("./src/posts/drafts/*.md");
  return drafts;
};

/**
 * Get an array of unique tags from items in all collections
 * @param {*} collectionApi The collection API passed from eleventy
 * @returns An array of unique tags from posts
 */
const tagList = (collectionApi) => {
  let uniqueTags = new Set();

  collectionApi.getAll().forEach((item) => {
    if (item.data.type !== "post" || !item.data.tags) return;

    const tags =
      typeof item.data.tags === "string" ? [item.data.tags] : item.data.tags;

    for (const tag of tags) {
      tag.startsWith("_") || uniqueTags.add(tag);
    }
  });

  const tags = [...uniqueTags].sort();
  console.log(`Tags [${tags.length}]: ${tags}`);

  return tags;
};

/**
 * Get a list of years based on post dates in all collections
 * @param {*} collectionApi The callback function for eleventy
 * @returns An array of unique years from posts
 */
const yearList = (collectionApi) => {
  let uniqueYears = new Set();

  collectionApi.getAll().forEach((item) => {
    if (item.data.type !== "post" || !item.data.date) return;

    const itemYear = DateTime.fromJSDate(item.date).year.toString();
    uniqueYears.add(itemYear);
  });

  const years = [...uniqueYears].sort();
  console.log(`Years [${years.length}]: ${years}`);
  return years;
};

const collections = {
  drafts,
  posts,
  tagList,
  yearList,
};

export default (eleventyConfig) => {
  return Object.entries(collections).forEach(([name, func]) =>
    eleventyConfig.addCollection(name, func)
  );
};
