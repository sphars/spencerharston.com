import { execSync } from "child_process";

const spawnAndGetOutputString = (commandString) => {
  return execSync(commandString).toString().trim();
};

const getLatestGitCommitHash = (format = "long") =>
  spawnAndGetOutputString(
    `git rev-parse ${format === "short" ? "--short" : ""} HEAD`
  );

const getCurrentGitBranch = () =>
  spawnAndGetOutputString("git branch --show-current");

/**
 * Get the date of the last commit
 * @returns ISO-strict string of commit date
 */
const getCurrentGitCommitDate = () =>
  spawnAndGetOutputString("git log -n1 --format=%cI --date=iso-strict");

const getCurrentGitStatus = () => spawnAndGetOutputString("git status");

const utils = {
  getLatestGitCommitHash,
  getCurrentGitBranch,
  getCurrentGitCommitDate,
  getCurrentGitStatus,
};

export default utils;