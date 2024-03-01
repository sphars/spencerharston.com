module.exports = {
  eleventyComputed: {
    draft: true,
    title: data => `[DRAFT] ${data.title}`,
    permalink: "posts/drafts/{{ page.fileSlug }}/",
  }
};