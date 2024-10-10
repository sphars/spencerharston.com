import meta from "../src/_data/meta.js";

export default {
  type: "atom",
  outputPath: "/feed.xml",
  collection: {
    name: "posts",
    limit: 10
  },
  metadata: {
    language: meta.language,
    title: meta.title,
    subtitle: meta.description,
    base: meta.base_url,
    author: {
      name: meta.author.name,
      email: meta.author.email
    }
  }
};
