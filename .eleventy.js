const fs = require("fs").promises;

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/style");
  eleventyConfig.addPassthroughCopy("src/scripts");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("admin");


  eleventyConfig.addCollection("teamPosts", function (collection) {
    return collection.getFilteredByGlob("src/teams-analysis/*.md");
  });

  eleventyConfig.addCollection("posts", function (collection) {
    return collection.getFilteredByGlob("src/posts/*.md");
  });

  eleventyConfig.addCollection("lab", function (collection) {
    return collection.getFilteredByGlob("src/lab/*.md");
  });

  eleventyConfig.addFilter("date", function (dateObj) {
    if (!dateObj) return "";
    return new Date(dateObj).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  });

  // ✅ 레이아웃 별칭 등록
  eleventyConfig.addLayoutAlias("team-layout", "layouts/team-layout.njk");

  return {
    dir: {
      input: "src",
      includes: "includes",
      layouts: "layouts",
      output: "_site",
    },
  };
};
