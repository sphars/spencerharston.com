# spencerharston.com

![Eleventy](https://img.shields.io/badge/eleventy-2.0.1-blue)

The personal website of Spencer Harston - an eternal WIP.

Powered by [11ty](https://www.11ty.dev/), [Tailwind](https://www.tailwindcss.com/), and ADHD

## Fork This Website

This site can be copied and modified for personal use by forking and modifying as needed.

> **Note**  
> While you are free to utilize the source code of this website, be aware that the site generation process is rather opinionated, not optimized, and may not fit your needs. And of course the content itself is of my own creation. See [LICENSE](#license) below.

### Requirements

* Node v20 or greater (using [nvm](https://github.com/nvm-sh/nvm) is suggested)
* Git

### Fork and Install Dependencies

Fork this repository in GitHub, give it a new name, then run the following on your machine:

```
git clone NEW_REPO_GIT_URL
cd NEW_REPO_NAME
npm install
```

### Running Locally

During development, the site can be ran "live", which will reload itself as changes are made. Run the following command:

```
npm run start
```

Open a browser to `http://localhost:8080`. This will watch for code changes and reload the page automatically.

To skip using a local server, you can also just build the website with


### Building the Site

To build the website without starting a server or watching the input files, use the `build` script:

```
npm run build
```

Building the website will output all resulting files in the `./dist` directory and is ready for deployment.

#### Production

By setting a specific environment variable, the site can be built for production, which will do a couple of additional steps:

 - Skip any draft pages in `./src/posts/drafts`
 - Generate images for HTML `meta` tags, which will make the build process take a bit longer ([script](./config/ogImage/metaImage.js))
 - Set source code urls to GitHub as specified in the [metadata](./src/_data/meta.js)
 - Minimize the resulting CSS and HTML files 

Set the `ELEVENTY_ENV` environment variable to `production` in your deployment server and run the build command, or by prefixing to the command like so (useful for building locally):

```
ELEVENTY_ENV=production npm run build
```

### Changing Fonts

Site fonts:

1. Install the font package from [Fontsource](https://fontsource.org/)
2. Update `./src/assets/css/site.css` to import the needed Fontsource CSS files (at least the `400.css` file)
3. Update `./tailwind.config.js` under `theme.extend.fontFamily` to set the font family 
4. Update `./eleventy.config.js`'s `eleventy.addPassthroughCopy()` object

Meta images fonts:

1. Get the font's `.ttf` files from [Google Fonts](https://fonts.google.com) and copy them to `./config/ogImage/fonts` to generate the meta images
    - The Fontsource npm packages currently don't include the `.ttf` files, so getting them directly from Google Fonts is easiest
    - I want to script this at some point
2. Update the `registerFont()` functions and any `ctx.font =` statements in `./config/ogImage/metaImages.js` to updated font-family values. Point the location to the downloaded font .ttf files

Favicon fonts:

1. Go to [favicon.io](https://favicon.io) to create the new favicons using your preferred font and copy the resulting files to `./src/assets/favicons`
2. You may need to add a new `v=` value to the link hrefs in `./src/_includes/partials/head.njk` to bust caching when a new icon set is created

## Credits

* Built with [Eleventy](https://www.11ty.dev)
* Deployed on [Cloudflare Pages](https://pages.cloudflare.com/)
* More on the [Colophon page](https://www.spencerharston.com/colophon)
* Many example projects from the 11ty community

## LICENSE
The source code to generate this website is licensed under the [MIT license](/LICENSE). Other licenses may be in use when installing the npm packages. The content of this site is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
