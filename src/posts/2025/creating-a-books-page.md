---
title: Creating a Books Page
description: How and why I decided to create a Books page to keep track of my reading.
date: 2025-01-16 23:56:00
updated: 2025-01-25 14:27:00
tags:
  - personal
  - reading
---

tl;dr: Go to my [/books](/books) page.

For the past couple years, I kept track of my books here on my website. For [2023](/posts/2023/books-of-2023) and [2024](/posts/2024/books-of-2024), I simply updated a post listing the books I'm currently reading, have finished, did not finish, and want to read.

This is simple enough of course, but I've now decided to list every book on a single page. The source of data for the page could be managed from a simple JSON file. Moving the data from the post pages to JSON was straightforward enough.

I also used to use Goodreads to keep track of my books, but it has been several years since I last updated my account, which has plenty of data that I'd like to use for this. Unfortunately, they [stopped offering API keys in December 2020](https://www.goodreads.com/api), which probably would've made getting this data a bit simpler.

Anyways, here's how I built my [/books](/books) page.

## Collect the data

My book data is scattered across a few different places: Goodreads, my Calibre library, my website, and somewhere else probably. I started with downloading my existing Goodreads data. There are two places in Goodreads to download data, account data and library data. After 10 minutes of digging into that data export did I realize it contains next to no personal book data. The real book data is exported by going to [My Books > Import and Export](https://www.goodreads.com/review/import).

The Goodreads library export includes lots of data I didn't need for my purposes. Using the simple [csvtojson](https://www.npmjs.com/package/csvtojson) package, I created a script to get the data I wanted in an initial format I was looking for. I combined that data with the data from my website^[Part of doing this new Books page is because my website's book data was stored in the markdown. I had to manually collect this data, and I should've used a better data format initially.] and from my Calibre library^[Calibre probably has a way to track books but I had to make some assumptions based on when I last modified a book's data file.]. I cleaned up any duplicate entries, made sure all the fields were there, and threw it all in a new JSON file.

## Enhance the data

The compiled JSON of book data had the basic data I wanted: title, author, and status. But most were missing some data, such as ISBN number, Goodreads ID, my personal rating, or relevant dates. I only needed extended data for read books, so I added my rating, an approximate date that I finished reading, and added identifiers manually.

To display covers for books I'm reading or have read, I planned to use the [OpenLibrary Covers API](https://openlibrary.org/dev/docs/api/covers) to get the cover art URLs. Each book in OpenLibrary has multiple editions, each with their own artwork. Rarely did two editions share the exact same image; there were differences in color, size, and quality. I wanted decent quality covers, so I would have to manually select the ISBN of the edition (and accompanying cover). But as I mentioned, I was missing the ISBNs for many books.

To aid in both these issues, I created another script to do two things. First, I searched OpenLibrary by title and author to just get an ISBN and a URL to the entry. With the URL, I then visited the page for each book and grabbed the ISBN for the edition that had the cover I wanted. The second part of the script would use the ISBN to query OpenLibrary to get the medium-sized cover URL for that book. Finally, the script would augment my JSON data with the updated data.

This script got me 95%-ish completed data. Unfortunately, OpenLibrary couldn't find a couple books, or they didn't have any good quality covers. For these items, I manually added a link to the Goodreads cover image URL.

With that, I had all the data I needed to display my books.

## Display the data

Inspired by a few others' pages I've seen recently, I wanted to show my books in a grid. Each entry would show the cover, date read, whether it was the audiobook version, and a star for 4+ ratings. ~~Initially I wanted to group by year, but decided to lump all in one list.~~

_Update 1/25/2024: I changed my mind, I did want to group the books by year. I created a couple of nunjucks filters: one to get the set of years for `dateRead`, and one to filter books by year. The data is still one big list but the filters handle the grouping for me._

I added the `books.json` file to my 11ty `_data` directory. The books were already in the right order but for fool-proofing, I have some 11ty filters to handle sorting by `dateRead` or `title`. I displayed the books using a CSS grid layout, each book entry containing the cover image, month and year read, a 🎧 for audiobooks, and a ⭐ for ratings 4 and up.

The images are processed using the 11ty image package, which takes the image source URL, resizes and renames the image to some set parameters, and caches it. The initial images I chose are fairly low resolution, thanks to OpenLibrary offering S, M, and L image variations. This step does add some time to the build, from about 2 seconds to 30-ish seconds for 100 images, but I'm okay with that. It only slows down the first build, thanks to that cache.

Altogether, it looks kinda basic, but I like it.

## Scripts

The scripts I wrote to help me organize my books

### Goodreads cleanup script

Inspired by [this script](https://thisguise.wtf/blog/2024/12/06/building-a-goodreads-bookshelf-for-11ty/) from Chazz Basuta, and some help from Claude.ai. This script also includes processing and adding my separate tracking of books from my website. Adjust as needed. See the full gist for personal books data structure.

[goodreads-cleanup.js](https://gist.github.com/sphars/ff804c646c54c339df4bd2b70760f695#file-goodreads-cleanup-js)

### Enrich books script

The script that searched OpenLibrary and fetched cover URLs. Caveat, I did have some assistance creating this script from Claude.ai. Hey, it works though.

[enrich-books.js](https://gist.github.com/sphars/ff804c646c54c339df4bd2b70760f695#file-enrich-books-js)

### Final book check script

Script that would identify books that were missing ratings or were duplicates.

[book-checker.js](https://gist.github.com/sphars/ff804c646c54c339df4bd2b70760f695#file-book-checker-js)

## Closing Thoughts

This exercise in creating this page was fun, and I'm glad I finally did it. I do think my scripts could be simplified further (and I honestly might change the data later on), but getting the job done is better than not at all.

Working through and collecting this data has made me realize I read a lot of fiction compared to non-fiction. It's not a bad thing! But I do wish to read more non-fiction books. I typically read right bed, and it's hard to really get into anything at that time of day.

My wife has started keeping a book journal for all the books she reads, and lately she's reading, like, triple the amount of books I read. I'm considering doing my own book journal of sorts, and integrating it in my website, or as an external app or something. I'll get around to doing it, one day. Maybe.
