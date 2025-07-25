module.exports = function (eleventyConfig) {
  // ⬛ 정적 파일 복사
  eleventyConfig.addPassthroughCopy("src/style");
  eleventyConfig.addPassthroughCopy("src/scripts");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/admin");

  // ⬛ posts 컬렉션 등록
  eleventyConfig.addCollection("posts", function (collection) {
    return collection.getFilteredByGlob("src/posts/*.md");
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "public",
    },
    markdownTemplateEngine: "njk",
  };
};