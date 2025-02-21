import { DateTime } from "luxon";
import meta from "../src/_data/meta.js";

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

const booksByYear = (books, year) => books.filter((book) => getDateTimeObj(new Date(book.dateRead)).year === year);

const getBookDateReadYears = (books) =>
  [...new Set(books.map((book) => getDateTimeObj(new Date(book.dateRead)).year))].sort().reverse();

const getDateTimeObj = (jsDateObj) => {
  if (typeof jsDateObj === "object") {
    return DateTime.fromJSDate(jsDateObj, { zone: "utc" }).setZone(meta.timezone, {
      keepLocalTime: true
    });
  } else if (typeof jsDateObj === "string") {
    return DateTime.fromISO(jsDateObj, { zone: "utc" });
  }
};

const dateISO = (dateObj) => getDateTimeObj(dateObj).toUTC().toISO();

const dateISOAlt = (dateObj) => getDateTimeObj(dateObj).toISO();

const dateHtmlString = (dateObj) => getDateTimeObj(dateObj).toFormat("yyyy-LL-dd");

const dateByFormat = (dateObj, format = "yyyy-LL-dd") => getDateTimeObj(dateObj).toFormat(format);

const dateToJsDate = (dateObj) => new Date(dateObj);

const filters = {
  sortByKey,
  sortDateByKey,
  limit,
  postsByTag,
  postsByYear,
  booksByYear,
  getBookDateReadYears,
  getDateTimeObj,
  dateISO,
  dateISOAlt,
  dateHtmlString,
  dateByFormat,
  dateToJsDate
};

export default (eleventyConfig) => {
  return Object.entries(filters).forEach(([name, func]) => eleventyConfig.addNunjucksFilter(name, func));
};
