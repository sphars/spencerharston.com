module.exports = {
  eleventyComputed: {
    layout: "layouts/post",
    permalink: "posts/{% dateByFormat page.date, 'yyyy' %}/{{ title | slugify }}/",
    type: "post"
  }
};