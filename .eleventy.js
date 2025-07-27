module.exports = function (eleventyConfig) {
  // ✅ 정적 파일 그대로 복사

  eleventyConfig.addPassthroughCopy("src/style");
  eleventyConfig.addPassthroughCopy("src/scripts");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addGlobalData("game-results", () => require("./src/data/game-results.json"));

  // ✅ posts 컬렉션 등록 (src/posts/*.md)
  eleventyConfig.addCollection("posts", function (collection) {
    return collection.getFilteredByGlob("src/posts/*.md");
  });

  // ✅ lab 컬렉션 등록 (src/lab/*.md)
  eleventyConfig.addCollection("lab", function (collection) {
    return collection.getFilteredByGlob("src/lab/*.md");
  });
  

  // ✅ 날짜 포맷 필터 (한국식 yyyy.mm.dd)
  eleventyConfig.addFilter("date", function (dateObj) {
    if (!dateObj) return "";
    return new Date(dateObj).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
  });

  // ✅ 모든 마크다운 문서에 기본 layout 지정 (post.njk)
  eleventyConfig.addGlobalData("layout", "post.njk");

  // ✅ Eleventy 설정 반환
  return {
    dir: {
      input: "src",
      includes: "includes", // 이게 틀리면 layout 경로 못 찾음
      data: "data",
      output: "public"
    }
  };
};