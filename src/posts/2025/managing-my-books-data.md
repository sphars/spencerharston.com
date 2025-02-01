---
title: Managing My Books Data
description: Why do something manually (that takes a few seconds to do), when a script (created over the course of several hours) can do it for you?
date: 2025-01-31 21:32:00
tags:
  - personal
  - reading
  - development
---

This is a follow-up to my [previous post](../creating-a-books-page) about creating a Books page.

I started thinking about how I wanted to manage the `books.json` pseudo-database I was using to power the [/books](/books) page. It really wasn't that big a deal to go and manually add new entries or move around as needed. But editing a JSON file is inconvenient, making sure to follow the syntax and everything. When I created the initial version of the page, I had about 100 `read` books already, and (hopefully) that was going to grow more.

Thinking about a convenient methods to add new books, I thought about a simple form. The form would ask for the title, author, rating, etc. and then could update the JSON appropriately. I didn't want to create some tiny service to do this, so I decided on a CLI to do it for me. I've seen some pretty sweet CLIs out there, with a great UX for data input, but I didn't know where to find these libraries.

While I try not to use much AI for actual code, it has been helpful in pointing me in the right direction, and quick prototyping. Using my tool of choice, Claude, I asked about creating a simple CLI to edit this file. It pointed me in the direction of using [commander](https://github.com/tj/commander.js) and [inquirer](https://github.com/SBoudrias/Inquirer.js) for CLI commands and prompts. Inquirer was a new one to me and it worked perfectly.

The initial script from Claude was basic: read JSON data, prompt for new book details, add to the data, and save the file. It worked easily enough.^[As I've experienced several times with gen AI tools, the versions of packages suggested are out of date. For this project, I adapted the suggested script for using the latest versions of both commander and inquirer.] I spent a few hours more perfecting the CLI how I wanted it, and adding some more features, such as moving books between the lists and data clean-up scripts.

## The book manager CLI

As mentioned, I'm keeping the CLI fairly simple. Currently there are three self-explanatory commands: add, move, and clean. For adding books, the input prompts are determined by which list is being added to (read books need the most data, and to be read needs the least). Moving books makes sure you can add to the list the book is already a part of, and asks for additional info if moving to the read list. The clean command was created to remove some unused book properties and standardize dates. I'm keeping it around incase I want to bulk-modify books in the future.

I added the scripts to my npm scripts, so all I have to do is run `npm run books`. Here's what it looks like:

```
❯ npm run books

> spencerharston.com@3.0.0 books
> scripts/book-manager.js

Usage: books-manager [options] [command]

Manage lists of books

Options:
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  add             add a new book to a list
  move            move a book between lists
  clean           clean up the book data
  help [command]  display help for command
```

Just as an example, here's what adding a book looks like

```
❯ npm run books add

> spencerharston.com@3.0.0 books
> scripts/book-manager.js add

✔ Select a list to add a book to: read
✔ Enter title:  The Hobbit
✔ Enter author:  J.R.R. Tolkien
✔ Enter Goodreads ID: 123
✔ Enter date read (YYYY-MM-DD): 2025-02-01T03:59:33.880Z
✔ Enter a rating (0-5): 5
✔ Enter binding: ebook
✔ Enter cover URL: http://example.com/cover.jpg
Database updated successfully
Book "The Hobbit" added to read list!
```

As always, making sure the dates are correct has been a pain. Ideally, I'd just save the date, but decided on saving the full ISO date by default. When I enter any date (or none) for the `dateRead` value, I have a function that will convert that to a "local" ISO date using my timezone. Now, I know ISO is supposed to be in UTC, but honestly, I don't care since I just care that the day/month/year are correctly displayed. My cleanup script will also convert all dates to that faux-ISO date too, and my template will read it as a local (MDT) date.

You can see the full script in its current form in the repo for this website: [book-manager.js](https://github.com/sphars/spencerharston.com/blob/main/scripts/book-manager.js).

## Additional Thoughts

I will likely be updating this script as I continue along. I have a couple of ideas to add to it, like searching, duplicate checking, fetching of cover URLs from a simple Goodreads ID, and other things. But for now it's good enough.

Creating this script has been a fun experience, though I think I spent more time "perfecting" the layout of books on the page than this script. However, I'm now considering making a media tracker sort of website, using this same structure, but include books, movies, TV shows, games, etc. I know there's a myriad of solutions out there that do this already, but it'd be kinda fun to make my own, with a more robust CLI. Add it to the to-do list I guess.

Now I just need to finish a book this year^[Of course I just had to pick a Sanderson novel to start the year with] so I can actually use it 😅
