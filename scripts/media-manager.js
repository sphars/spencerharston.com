#!/usr/bin/env node

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { confirm, input, number, select } from "@inquirer/prompts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Media type JSON file locations
const mediaDataFiles = {
  books: path.join(__dirname, "../src/_data/books.json"),
  records: path.join(__dirname, "../src/_data/records.json")
};

// Helper functions
function getLocalDate(dateInput = undefined) {
  const date = dateInput ? new Date(dateInput) : new Date();
  return date.toISOString();
}

function infoAsString(mediaItem) {
  return Object.entries(mediaItem)
    .map(([key, value]) => {
      return `${key}: \u001B[32m${value}\u001B[39m`;
    })
    .join("\n");
}

// Load/save operations
async function loadData(mediaType) {
  try {
    const data = await fs.readFile(mediaDataFiles[mediaType], "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading ${mediaType} database`, error);
    process.exit(1);
  }
}

async function saveData(mediaType, media) {
  try {
    media.lastUpdated = getLocalDate();
    await fs.writeFile(mediaDataFiles[mediaType], JSON.stringify(media, null, 2));
    await fs.appendFile(mediaDataFiles[mediaType], "\n");
    console.log(`${mediaType} database updated successfully`);
  } catch (error) {
    console.error(`Error saving the ${mediaType} database`, error);
    process.exit(1);
  }
}

// Books management
const bookLists = [
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

async function manageBooks() {
  // const data = await loadData("books");
  try {
    const operation = await select({
      message: "Select an operation:",
      choices: [
        {
          name: "add",
          value: addBook,
          description: "add a new book"
        },
        {
          name: "move",
          value: moveBook,
          description: "move a book to a different list"
        },
        {
          name: "clean",
          value: cleanBooks,
          description: "clean up books lists"
        }
      ]
    });

    operation();
  } catch (error) {
    if (error instanceof Error && error.name === "ExitPromptError") {
      // noop; silence this error
      console.log("Cancelled");
    }
  }
}

async function addBook() {
  // choose a list to add to
  let list = "";
  try {
    list = await select({
      message: "Select a list to add a book to:",
      choices: bookLists
    });
  } catch (error) {
    if (error instanceof Error && error.name === "ExitPromptError") {
      // noop; silence this error
      console.log("Cancelled");
    }
  }

  // load books and ask for details
  try {
    const books = await loadData("books");

    let bookInfo = {};
    let confirmation = false;

    do {
      bookInfo = {
        title: await input({ message: "Enter title: ", required: true }),
        author: await input({ message: "Enter author: ", required: true }),
        goodreadsId: await input({ message: "Enter Goodreads ID:", required: true })
      };

      if (list === "current") {
        const additionalBookInfo = {
          binding: await select({
            message: "Enter binding:",
            default: "ebook",
            choices: ["ebook", "physical", "audiobook"]
          }),
          coverUrl: await input({ message: "Enter cover URL:" })
        };

        Object.assign(bookInfo, additionalBookInfo);
      }

      if (list === "read") {
        const additionalBookInfo = {
          dateRead: await input({
            message: "Enter date read (YYYY-MM-DD):",
            required: true,
            default: getLocalDate()
          }),
          rating: await number({ message: "Enter a rating (0-5):", required: true, min: 0, max: 5 }),
          binding: await select({
            message: "Enter binding:",
            default: "ebook",
            choices: ["ebook", "physical", "audiobook"]
          }),
          coverUrl: await input({ message: "Enter cover URL:" })
        };

        Object.assign(bookInfo, additionalBookInfo);
      }
      const itemString = infoAsString(bookInfo);
      confirmation = await confirm({ message: `Is this correct?\n${itemString}\n`, required: true });
    } while (confirmation !== true);

    books[list].push(bookInfo);

    await saveData("books", books);
    console.log(`Book "${bookInfo.title}" added to ${list} list!`);
  } catch (error) {
    if (error instanceof Error && error.name === "ExitPromptError") {
      // noop; silence this error
      console.log("Cancelled");
    } else {
      console.error("Error adding book:", error);
      process.exit(1);
    }
  }
}

async function moveBook() {
  // choose a list to get book from
  let fromList = "";
  try {
    fromList = await select({
      message: "Select a list to move a book from:",
      choices: bookLists
    });
  } catch (error) {
    if (error instanceof Error && error.name === "ExitPromptError") {
      // noop; silence this error
      console.log("Cancelled");
    }
  }

  try {
    const books = await loadData("books");
    const booksList = books[fromList];

    if (booksList.length === 0) {
      console.log(`No books in the ${fromList} list`);
      return;
    }

    const bookChoices = booksList.map((book, index) => ({
      name: `${book.title} by ${book.author}`,
      value: index,
      description: book.goodreadsId
    }));

    const bookIndex = await select({
      message: "Select a book to move:",
      choices: bookChoices.sort((a, b) => a.name.localeCompare(b.name))
    });

    const toList = await select({
      message: "Select destination list:",
      choices: bookLists.filter((choice) => choice.value !== fromList)
    });

    const bookInfo = booksList[bookIndex];
    books[fromList].splice(bookIndex, 1);

    // if moving to "current" list, ask for more info
    if (toList === "current" && fromList !== "current") {
      const additionalBookInfo = {
        binding: await select({
          message: "Enter binding:",
          default: "ebook",
          choices: ["ebook", "physical", "audiobook"]
        }),
        coverUrl: await input({ message: "Enter cover URL:" })
      };

      Object.assign(bookInfo, additionalBookInfo);
    }

    // if moving to "read" list, ask for more info
    if (toList === "read" && fromList !== "read") {
      const additionalBookInfo = {
        dateRead: await input({
          message: "Enter date read (YYYY-MM-DD):",
          required: true,
          default: getLocalDate(),
          transformer(value = "", { isFinal }) {
            return isFinal ? getLocalDate(value) : value;
          }
        }),
        rating: await number({ message: "Enter a rating (0-5):", required: true, min: 0, max: 5 }),
        binding: bookInfo.binding
          ? bookInfo.binding
          : await select({
              message: "Enter binding:",
              default: "ebook",
              choices: ["ebook", "physical", "audiobook"]
            }),
        coverUrl: bookInfo.coverUrl ? bookInfo.coverUrl : await input({ message: "Enter cover URL:" })
      };

      Object.assign(bookInfo, additionalBookInfo);
    }

    books[toList].push(bookInfo);
    await saveData("books", books);
    console.log(`Moved "${bookInfo.title}" from ${fromList} to ${toList}`);
  } catch (error) {
    if (error instanceof Error && error.name === "ExitPromptError") {
      // noop; silence this error
      console.log("Cancelled");
    } else {
      console.error("Error moving book:", error);
      process.exit(1);
    }
  }
}

async function cleanBooks() {
  try {
    const books = await loadData("books");
    const bookLists = Object.entries(books).filter((list) => Array.isArray(list[1]));
    bookLists.forEach((list) => {
      list[1].forEach((book) => {
        delete book.goodreadsLink;
        delete book.isbn13;
        if (book.dateRead) book.dateRead = getLocalDate(book.dateRead);
      });
      // sort the read list by date read asc
      books[list[0]] =
        list[0] === "read" ? list[1].sort((a, b) => new Date(a.dateRead) - new Date(b.dateRead)) : list[1];
    });

    await saveData("books", books);
    console.log(`Cleaned up book lists`);
  } catch (error) {
    console.error("Error cleaning lists:", error);
    process.exit(1);
  }
}

// Records management
async function manageRecords() {
  // only able to add records right now
  addRecord();
}

async function addRecord() {
  const data = await loadData("records");

  try {
    let recordInfo = {};
    let confirmation = false;

    do {
      recordInfo = {
        title: await input({ message: "Enter album title:", required: true }),
        artist: await input({ message: "Enter album artist:", required: true }),
        year: await number({ message: "Enter release year:", required: true }),
        coverUrl: await input({ message: "Enter cover url:", required: true }),
        catno: await input({ message: "Enter catalog Number:", required: true }),
        id: await number({ message: "Enter Discogs master ID:", required: true }),
        dateAdded: await input({
          message: "Enter date added to collection (YYYY-MM-DD):",
          required: true,
          default: getLocalDate()
        })
      };
      const itemString = infoAsString(recordInfo);
      confirmation = await confirm({ message: `Is this correct?\n${itemString}\n`, required: true });
    } while (confirmation !== true);

    data.records.push(recordInfo);
    await saveData("records", data);
  } catch (error) {
    if (error instanceof Error && error.name === "ExitPromptError") {
      // noop; silence this error
      console.log("Cancelled");
    } else {
      console.error("Error adding record:", error);
      process.exit(1);
    }
  }
}

async function main() {
  try {
    const mediaType = await select({
      message: "Select media to manage",
      choices: [
        {
          name: "books",
          value: manageBooks
        },
        {
          name: "records",
          value: manageRecords
        }
      ]
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
