module.exports = function (eleventyConfig) {
  // 📁 정적 파일 폴더 그대로 복사
  eleventyConfig.addPassthroughCopy("src/style");
  eleventyConfig.addPassthroughCopy("src/scripts");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("admin");

  // 📚 posts 폴더에 있는 md 파일을 posts 컬렉션으로 등록
  eleventyConfig.addCollection("posts", function (collection) {
    return collection.getFilteredByGlob("src/posts/*.md");
  });

  // 📅 날짜 필터 (Luxon 없이 한국식 포맷)
  eleventyConfig.addFilter("date", function (dateObj) {
    if (!dateObj) return "";
    return new Date(dateObj).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
  });

  
  // 🪄 모든 글에 기본 layout 자동 적용
  eleventyConfig.addGlobalData("layout", "post.njk");
  eleventyConfig.addPassthroughCopy("src/style");

  // 🔧 Eleventy 설정
  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "public",
    },
    markdownTemplateEngine: "njk"
  };
};