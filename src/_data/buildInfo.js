import utils from "../../config/utils.js";
import meta from "./meta.js";
import { DateTime } from "luxon";

/**
 * Get the information about the current build
 * @returns Object with current build info
 */
const getBuildInfo = () => {
  const dateFormatString = "EEE, MMM dd, y 'at' h:mm:ss a ZZZZ";

  const gitDateRaw = DateTime.fromISO(utils.getCurrentGitCommitDate());
  const gitDateFormatted = gitDateRaw
    .setZone(meta.timezone)
    .toFormat(dateFormatString);

  const buildTime = DateTime.now();
  const buildTimeRaw = buildTime.toISO();
  const buildTimeFormatted = buildTime
    .setZone(meta.timezone)
    .toFormat(dateFormatString);

  console.log(`Commit time: ${gitDateRaw}`);
  console.log(`Build time: ${buildTimeRaw}`);

  return {
    git: {
      hash: {
        short: utils.getLatestGitCommitHash("short"),
        long: utils.getLatestGitCommitHash("long"),
      },
      time: {
        raw: gitDateRaw,
        formatted: gitDateFormatted,
      },
      branch: utils.getCurrentGitBranch(),
    },
    time: {
      raw: buildTimeRaw,
      formatted: buildTimeFormatted,
    },
  };
};

export default getBuildInfo;
