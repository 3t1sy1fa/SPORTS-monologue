module.exports = function (eleventyConfig) {
  // ✅ 정적 파일 복사
  eleventyConfig.addPassthroughCopy("src/style");
  eleventyConfig.addPassthroughCopy("src/scripts");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("admin");

  // ✅ JSON 데이터 전역 등록
  eleventyConfig.addGlobalData("game-results", () =>
    require("./src/data/game-results.json")
  );

  // ✅ posts 컬렉션
  eleventyConfig.addCollection("posts", function (collection) {
    return collection.getFilteredByGlob("src/posts/*.md");
  });

  // ✅ lab 컬렉션
  eleventyConfig.addCollection("lab", function (collection) {
    return collection.getFilteredByGlob("src/lab/*.md");
  });

  // ✅ 날짜 포맷 필터
  eleventyConfig.addFilter("date", function (dateObj) {
    if (!dateObj) return "";
    return new Date(dateObj).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  });

  // ✅ 레이아웃 alias
  eleventyConfig.addLayoutAlias("team-layout", "layouts/team-layout.njk");

  // ✅ 디렉터리 설정 반환
  return {
    dir: {
      input: "src",
      includes: "includes",
      layouts: "layouts",
      output: "_site",
    },
  };
};

console.log("✅ Eleventy config loaded");