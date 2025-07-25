module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("style");
  eleventyConfig.addPassthroughCopy("scripts");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("fonts");
  eleventyConfig.addPassthroughCopy("admin");

  return {
    dir: {
      input: "src",
      output: "public"
    },
    passthroughFileCopy: true
  };
};