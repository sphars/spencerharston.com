#!/usr/bin/env node

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { Command } from "commander";
import { input, number, select } from "@inquirer/prompts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const mediaDataFiles = {
  books: path.join(__dirname, "../src/_data/books.json"),
  records: path.join(__dirname, "../src/_data/records.json")
};
// const program = new Command();

const mediaTypes = [
  {
    name: "books",
    value: manageBooks
  },
  {
    name: "records",
    value: manageRecords
  }
];

const mediaOperations = [
  {
    name: "add",
    value: addItem,
    description: "add a new item"
  },
  {
    name: "move",
    value: moveItem,
    description: "move an item to a different list"
  }
];

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

async function addItem() {}

async function moveItem(params) {}

async function manageBooks() {
  const data = await loadData("books");
  try {
    const operation = await select({
      message: "Select an operation:",
      choices: booksListChoices
    });

    switch (operation) {
      case "value":
        break;

      default:
        break;
    }
  } catch (error) {
    if (error instanceof Error && error.name === "ExitPromptError") {
      // noop; silence this error
      console.log("Cancelled");
    }
  }
}

async function manageRecords() {
  const data = await loadData("records");
}

async function main() {
  try {
    const mediaType = await select({
      message: "Select media to manage",
      choices: mediaTypes
    });

    mediaType();
  } catch (error) {
    if (error instanceof Error && error.name === "ExitPromptError") {
      // noop; silence this error
      console.log("Cancelled");
    }
  }
}

main();
