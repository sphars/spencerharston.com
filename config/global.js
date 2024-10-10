import { readdirSync } from "node:fs";

const postCount = () => {
  const files = readdirSync("./src/posts/", {recursive:true}).filter(item => item.endsWith(".md"));
  const drafts = files.filter(item => item.startsWith("drafts/")).length;
  const posts = files.length - drafts;
  console.log(`Posts: ${posts}`);
  console.log(`Drafts: ${drafts}`);
  
  return {
    posts: posts,
    drafts: drafts
  };
};

const global = {
  postCount
};

export default (eleventyConfig) => {
  return Object.entries(global).forEach(([name, data]) => eleventyConfig.addGlobalData(name, data));
};
