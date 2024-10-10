export const eleventyComputed = {
  layout: "layouts/post",
  permalink: "posts/{{ page.date | dateByFormat('yyyy') }}/{{ title | slugify }}/",
  type: "post"
  // ,redirectFrom: "/posts/{{ page.fileSlug }}/"
};