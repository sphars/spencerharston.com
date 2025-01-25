import { DateTime } from "luxon";

const sortByKey = (collection, key, dir = "asc") => {
  if (dir === "asc") return collection.sort((a, b) => a[key].localeCompare(b[key]));
  if (dir === "desc") return collection.sort((a, b) => b[key].localeCompare(a[key]));
  else return collection;
};

const sortDateByKey = (collection, key = "date", dir = "asc") => {
  if (dir === "asc") return collection.sort((a, b) => new Date(a[key]) - new Date(b[key]));
  if (dir === "desc") return collection.sort((a, b) => new Date(b[key]) - new Date(a[key]));
  else return collection;
};

const limit = (collection, limit) => collection.slice(0, limit);

const postsByTag = (collection, tag) => collection.filter((entry) => entry.data.tags.includes(tag));

const postsByYear = (collection, year) =>
  collection.filter((entry) => DateTime.fromJSDate(entry.date).year.toString() === year);

const booksByYear = (books, year) => {
  return books.filter((book) => {
    const date = new Date(book.dateRead);
    return date.getFullYear() === year;
  });
};

const getBookDateReadYears = (books) => [...new Set(books.map((book) => new Date(book.dateRead).getFullYear()))];

export default {
  sortByKey,
  sortDateByKey,
  limit,
  postsByTag,
  postsByYear,
  booksByYear,
  getBookDateReadYears
};
