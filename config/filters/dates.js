import { DateTime } from "luxon";
import meta from "../../src/_data/meta.js";

const getDateTimeObj = (jsDateObj) => {
  if (typeof jsDateObj === "object") {
    return DateTime.fromJSDate(jsDateObj, { zone: "utc" }).setZone(
      meta.timezone,
      {
        keepLocalTime: true,
      }
    );
  } else if (typeof jsDateObj === "string") {
    return DateTime.fromISO(jsDateObj, { zone: "utc" });
  }
};

const dateISO = (dateObj) => getDateTimeObj(dateObj).toUTC().toISO();

const dateISOAlt = (dateObj) => getDateTimeObj(dateObj).toISO();

const dateHtmlString = (dateObj) =>
  getDateTimeObj(dateObj).toFormat("yyyy-LL-dd");

const dateByFormat = (dateObj, format = "yyyy-LL-dd") =>
  getDateTimeObj(dateObj).toFormat(format);

export default {
  getDateTimeObj,
  dateISO,
  dateISOAlt,
  dateHtmlString,
  dateByFormat,
};
