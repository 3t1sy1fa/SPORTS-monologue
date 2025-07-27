module.exports = function (eleventyConfig) {
  // ✅ 정적 파일 복사
  eleventyConfig.addPassthroughCopy("src/style");
  eleventyConfig.addPassthroughCopy("src/scripts");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("admin");

  // ✅ posts 컬렉션 등록
  eleventyConfig.addCollection("posts", function (collection) {
    return collection.getFilteredByGlob("src/posts/*.md");
  });

  // ✅ lab 컬렉션 등록
  eleventyConfig.addCollection("lab", function (collection) {
    return collection.getFilteredByGlob("src/lab/*.md");
  });

  // ✅ 날짜 필터 추가
  eleventyConfig.addFilter("date", function (dateObj) {
    if (!dateObj) return "";
    return new Date(dateObj).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
  });

  // ✅ 모든 md 글에 기본 layout 자동 적용
  eleventyConfig.addGlobalData("layout", "post.njk");

  // ✅ Eleventy 최종 설정 반환
  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "public"
    },
    markdownTemplateEngine: "njk"
  };
};