#!/usr/bin/env node

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { Command } from "commander";
import { input, number, select } from "@inquirer/prompts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "../src/_data/books.json");
const program = new Command();

function getLocalDate() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
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
        isbn13: await input({ message: "Enter ISBN-13:" }),
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
      console.log("cancelled");
    } else {
      console.error("Error adding book:", error);
      process.exit(1);
    }
  }
}

program.name("books-manager").description("manage lists of books").version("1.0.0");

program
  .command("add")
  .description("add a new book to a list")
  .action(async () => {
    try {
      const list = await select({
        message: "Select a list to add a book to:",
        choices: [
          {
            name: "current",
            value: "current",
            description: "current books"
          },
          {
            name: "read",
            value: "read",
            description: "finished books"
          },
          {
            name: "tbr",
            value: "tbr",
            description: "to be read books"
          },
          {
            name: "dnf",
            value: "dnf",
            description: "did not finish books"
          }
        ]
      });
      await addBook(list);
    } catch (error) {
      if (error instanceof Error && error.name === "ExitPromptError") {
        // noop; silence this error
        console.log("cancelled");
      } else {
        console.error("Error adding book:", error);
        process.exit(1);
      }
    }
  });

program.parse();
