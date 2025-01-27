#!/usr/bin/env node

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { Command } from "commander";
import { input, number, select } from "@inquirer/prompts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "../src/_data/books.json");
const program = new Command();

const listChoices = [
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

async function loadBooks() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading books database", error);
    process.exit(1);
  }
}

async function saveBooks(books) {
  try {
    books.lastUpdated = getLocalDate();
    await fs.writeFile(DATA_FILE, JSON.stringify(books, null, 2));
    await fs.appendFile(DATA_FILE, "\n");
    console.log("Database updated successfully");
  } catch (error) {
    console.error("Error saving books database:", error);
    process.exit(1);
  }
}

async function addBook(list) {
  try {
    const books = await loadBooks();

    const bookInfo = {
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

    books[list].push(bookInfo);

    await saveBooks(books);
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

async function moveBook(fromList) {
  try {
    const books = await loadBooks();
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
      choices: listChoices.filter((choice) => choice.value !== fromList)
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
    await saveBooks(books);
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

async function clean() {
  try {
    const books = await loadBooks();
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

    await saveBooks(books);
    console.log(`Cleaned up book lists`);
  } catch (error) {
    console.error("Error cleaning lists:", error);
    process.exit(1);
  }
}

program.name("books-manager").description("Manage lists of books").version("1.0.0");

program
  .command("add")
  .description("add a new book to a list")
  .action(async () => {
    try {
      const list = await select({
        message: "Select a list to add a book to:",
        choices: listChoices
      });
      await addBook(list);
    } catch (error) {
      if (error instanceof Error && error.name === "ExitPromptError") {
        // noop; silence this error
        console.log("Cancelled");
      } else {
        console.error("Error adding book:", error);
        process.exit(1);
      }
    }
  });

program
  .command("move")
  .description("move a book between lists")
  .action(async () => {
    try {
      const fromList = await select({
        message: "Select a list to move a book from:",
        choices: listChoices
      });
      await moveBook(fromList);
    } catch (error) {
      if (error instanceof Error && error.name === "ExitPromptError") {
        // noop; silence this error
        console.log("Cancelled");
      } else {
        console.error("Error moving book:", error);
        process.exit(1);
      }
    }
  });

program.command("clean").description("clean up the book data").action(clean);

program.parse();
