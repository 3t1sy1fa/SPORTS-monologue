module.exports = function(eleventyConfig) {
  eleventyConfig.addLayoutAlias("team-layout", "includes/team-layout.njk");
 
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
      includes: "includes",  // src/includes
      layouts: "includes",   // src/includes를 layout 경로로 지정
      output: "_site"
    }
  }
};
