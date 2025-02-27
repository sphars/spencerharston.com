---
layout: layouts/default
title: Projects
description: Things I've created or worked on, just for fun or to fulfill a need.
---

{{ description }}

## Math Sheets

Website: [mathsheets.net](https://www.mathsheets.net)  
Repo: [sphars/math-sheets](https://github.com/sphars/math-sheets)

[Mathsheets.net](https://www.mathsheets.net) is a simple math problem generator. I created this as a tribute to the worksheets my dad would create during the summers for my siblings and I growing up. I probably hated doing them then but I'm glad he did. The generated files are created purely from memory, while the technology is more modern&mdash;web-based using Typescript + Vite for strictly client-side, vanilla JS and HTML.

As a throwback to the time period, I included a dot-matrix imitation font for printing and I used the fabulous [98.css](https://github.com/jdan/98.css) CSS library to give it that late 90s/early 00s feel.

## RSS Feed Generator/Scraper

Website: [sphars.github.io/rss-feeds](https://sphars.github.io/rss-feeds/)  
Repo: [sphars/rss-feeds](https://github.com/sphars/rss-feeds)

This feed generator and web scraper was born out of a desire to get the daily [The Far Side comics](https://www.thefarside.com/) delivered to me in a way that doesn't require me to visit the website daily. Currently The Far Side is the only site this scrapes but it was a good experience in scraping and learning how to generate compliant RSS feeds.

## Car Repo Scraper

Repo: [sphars/car-repo-scraper](https://github.com/sphars/car-repo-scraper)

Another web scraping project, this one was created when we were shopping for a new car when we were expecting our second child. The idea was to scrape local repossession websites to notify me when new cars are posted. Using GitHub Actions, it scrapes websites once a day, and utilizes the fantastic [ntfy.sh](https://ntfy.sh/) service to deliver notifications. Ideally, I'd combine this with the above scraper to generate an RSS feed for new cars. Currently only one website is scraped, and I've since purchased a car, but it's still going.

## YACCK

Website: [sphars.github.io/yacck/](https://sphars.github.io/yacck/)  
Repo: [sphars/yacck](https://github.com/sphars/yacck)

I once came across a simple CSS library, [mvp.css](https://andybrewer.github.io/mvp/), that introduced me to the world of class-less CSS libraries. I decided to make my own, using only semantic HTML elements. It's been a while since it was updated, but should still work. I am not currently using it on any production sites, but I intend (haha) to pick it back up and work on it some more.

## aboutblank.page

Website: [aboutblank.page](https://aboutblank.page/)  
Repo: [sphars/about-blank](https://github.com/sphars/about-blank)

A simple, 99% blank website consisting of a full-view background color. I made this intended as a new tab page for browsers because I wanted a blank page for new tabs rather than the default search bar + auto-generated bookmarks in browsers. Unfortunately, the default blank page (`about:blank`) in most browsers (notably Chromium-based) doesn't respect color preferences so it's always a blank white page. This site respects the user preference and allows you to set the color explicitly or randomly. I currently use this in all my browsers as my home page.

More random projects can be see on my [GitHub profile](https://github.com/sphars).
