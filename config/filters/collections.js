import { DateTime } from "luxon";

const sortDesc = (collection) => collection.sort((a, b) => b.date - a.date);

const limit = (collection, limit) => collection.slice(0, limit);

const postsByTag = (collection, tag) =>
  collection.filter((entry) => entry.data.tags.includes(tag));

const postsByYear = (collection, year) =>
  collection.filter(
    (entry) => DateTime.fromJSDate(entry.date).year.toString() === year
  );

export default {
  sortDesc,
  limit,
  postsByTag,
  postsByYear,
};
