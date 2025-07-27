module.exports = function(eleventyConfig) {
  eleventyConfig.addLayoutAlias("team-layout", "layouts/team-layout.njk");

  eleventyConfig.addPassthroughCopy("src/style");
  eleventyConfig.addPassthroughCopy("src/scripts");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("admin");

  eleventyConfig.addGlobalData("game-results", () => require("./src/data/game-results.json"));

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
      day: "2-digit"
    });
  });

  return {
    dir: {
     input: "src",
     includes: "includes",
     layouts: "layouts",
     output: "_site"
   }
  };
};