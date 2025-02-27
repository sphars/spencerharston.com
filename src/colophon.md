---
layout: layouts/default
title: Colophon
description: How this website was built
---

_col·​o·​phon (kŏl′ə-fŏn″, -fən): an inscription at the end of a book or manuscript (or website) usually with facts about its production_

## About This Website

This website was built with the following:

- Static site generator: [Eleventy](https://www.11ty.dev)
  - Theme: Customized [TailwindCSS](https://www.tailwindcss.com)
  - Fonts: [IBM Plex Sans](https://fonts.google.com/specimen/IBM+Plex+Sans) and [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) (this changes constantly)
  - Icons: [Tabler Icons](https://tabler.io/icons)
- Hosting: [Cloudflare Pages](https://pages.cloudflare.com/) (deployment) and [GitHub](https://github.com/sphars/spencerharston.com) (source code)
- Domain registrar: [Porkbun](https://porkbun.com)
- Editor: [VS Code](https://code.visualstudio.com)
  - Theme: [Catppuccin Macchiato](https://marketplace.visualstudio.com/items?itemName=Catppuccin.catppuccin-vsc)
  - Font: [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) (this also changes constantly)

### License

The source code of this website is licensed under the [MIT license]({{ meta.repo }}/blob/main/LICENSE). The content of this site is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). My thoughts and hot takes on this website are (unfortunately) my own.

## Build Info

This site's last commit was on {{ buildInfo.git.time.formatted }} and was built on {{ buildInfo.time.formatted }}.

Commit: [`{{ buildInfo.git.hash.short }}`]({{ meta.repo }}/tree/{{ buildInfo.git.hash.long }})
