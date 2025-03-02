#!/usr/bin/env node

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { Command } from "commander";
import { input, number, select } from "@inquirer/prompts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BOOKS_DATA_FILE = path.join(__dirname, "../src/_data/books.json");
const RECORDS_DATA_FILE = path.join(__dirname, "../src/_data/records.json");

const mediaDataFiles = {
  books: path.join(__dirname, "../src/_data/books.json"),
  records: path.join(__dirname, "../src/_data/records.json")
};
const program = new Command();

const booksListChoices = [
  {
    value: "current",
    description: "current books"
  },
  {
    value: "read",
    description: "finished books"
  },
  {
    value: "tbr",
    description: "to be read books"
  },
  {
    value: "dnf",
    description: "did not finish books"
  }
];

function getLocalDate(dateInput = undefined) {
  const date = dateInput ? new Date(dateInput) : new Date();
  return date.toISOString();
}

async function loadData(media) {
  try {
    const data = await fs.readFile(mediaDataFiles[media], "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading ${media} database`, error);
    process.exit(1);
  }
}

async function saveData(media) {
  try {
    media.lastUpdated = getLocalDate();
    await fs.writeFile(mediaDataFiles[media], JSON.stringify(media, null, 2));
    await fs.appendFile(mediaDataFiles[media], "\n");
    console.log(`{media} database updated successfully`);
  } catch (error) {
    console.error(`Error saving the ${media} database`, error);
    process.exit(1);
  }
}

program.name("media-manager").description("Manage lists of media").version("1.0.0");

program.parse();
