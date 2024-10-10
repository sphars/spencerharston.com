import { createCanvas, registerFont, loadImage } from "canvas";
import Image from "@11ty/eleventy-img";

// register fonts
registerFont("./config/ogImage/fonts/Asap-Regular.ttf", { family: "Asap" });
registerFont("./config/ogImage/fonts/Asap-Italic.ttf", { family: "Asap", style: "italic" });

// wrap text in a canvas
// adapted from https://urre.me/writings/dynamic-open-graph-images/
async function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  let words = text.split(" ");
  let line = "";

  for (let n = 0; n < words.length; n++) {
    let testLine = line + words[n] + " ";
    let metrics = ctx.measureText(testLine);
    let testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      drawTextBG(ctx, line, ctx.font, ctx.textAlign, x, y);

      // context.fillText(line, x, y)
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  drawTextBG(ctx, line, ctx.font, ctx.textAlign, x, y);
  //context.fillText(line, x, y)
}

// draw background behind text on canvas
// adapted from https://stackoverflow.com/a/18901408
async function drawTextBG(ctx, txt, font, align, x, y) {
  // save current state as we make a lot of changes        
  ctx.save();

  // set font
  ctx.font = font;

  // draw text from top - makes life easier at the moment
  ctx.textBaseline = "top";

  // color for background
  ctx.fillStyle = "#cad3f5";

  // get text metrics
  let metrics = ctx.measureText(txt);

  // draw background rect assuming height of font, based text alignment
  if (ctx.textAlign === "start") {
    ctx.fillRect(x - 8, y - metrics.emHeightDescent, metrics.width + 4, metrics.emHeightDescent + 4);
  } else if (ctx.textAlign === "end") {
    ctx.fillRect(x - metrics.width - 8, y - metrics.emHeightDescent, metrics.width + 16, metrics.emHeightDescent + 4);
  }

  // text color
  ctx.fillStyle = "#1e2030";

  ctx.textAlign = align;

  // draw text on top
  ctx.fillText(txt, x, y - metrics.emHeightDescent);

  // restore original state
  ctx.restore();

}

/**
 * Generate an HTML meta image using canvas.
 * The image will be saved in `./dist/assets/img/meta`
 * @param string titleText The main text to print on the image
 * @returns Path to the saved image
 */
async function generateMetaImage(titleText) {
  const width = 1200;
  const height = 630;
  let titleFontSize = 72;
  let titleLineHeight = titleFontSize * 1.375;
  let subText = this.ctx.meta.domain;

  // create the canvas
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // create rectangle with background
  ctx.fillStyle = "#171717";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // add the image
  const bgImage = await loadImage("./config/ogImage/images/gradient.png");
  ctx.drawImage(bgImage, 0, 0);

  // add subText text
  ctx.fillStyle = "#fafafa";
  ctx.font = "italic 48px 'Asap'";
  ctx.textAlign = "end";
  // ctx.fillText(imageFooterText, canvas.width - 48, canvas.height - 50);
  drawTextBG(ctx, subText, ctx.font, ctx.textAlign, canvas.width - 48, canvas.height - 50);

  // add image title text
  ctx.font = `normal ${titleFontSize}px "Asap"`;
  ctx.textAlign = "start";
  ctx.fillStyle = "#fafafa";
  wrapText(ctx, titleText, 64, 144, canvas.width - 96, titleLineHeight);
  //drawTextBG(ctx, imageTitle, ctx.font, 48, 110);

  // create the buffer
  let buffer = canvas.toBuffer("image/png");

  // use 11ty/eleventy-img to save it
  let imgMetadata = await Image(buffer, {
    widths: [width],
    formats: ["png"],
    outputDir: "./dist/assets/img/meta",
    urlPath: "/assets/img/meta",
    sharpPngOptions: {
      quality: 95
    },
    filenameFormat: (id, src, width, format, options) => {
      let name = "";
      let url = `${this.ctx.page.url}`; // the url to the current page
      if (url === "/") {
        name = "index"; // for / root
      } else if (url.startsWith("/") && !url.endsWith("/")) {
        name = url.replace(".", "_").substring(1); // for /404.html and similar pages
      } else {
        if (url.startsWith("/posts/") && url.match(/\//g).length > 3) name = "post_"; // prefix /posts/xxxx/title/ pages
        name += url.substring(1, this.ctx.page.url.length - 1).split("/").at(-1); // for /path/to/page/ pages
      }
      return `${name}-${width}w.${format}`;
    }
  });

  let url = imgMetadata.png[imgMetadata.png.length - 1].url;
  return this.ctx.env === "production" ? `${this.ctx.meta.base_url}${url}` : url;
}

export default generateMetaImage;
