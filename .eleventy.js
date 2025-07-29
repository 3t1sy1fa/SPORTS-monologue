module.exports = function (eleventyConfig) {
  // ✅ 정적 리소스 그대로 복사
  ["src/style", "src/scripts", "src/images", "src/fonts", "admin"]
    .forEach(path => eleventyConfig.addPassthroughCopy(path));

    
  // ✅ 팀 분석 컬렉션
  eleventyConfig.addCollection("teamPosts", (collection) =>
    collection.getFilteredByGlob("src/teams-analysis/*.md")
  );

  // ✅ 일반 글 컬렉션
  eleventyConfig.addCollection("posts", (collection) =>
    collection.getFilteredByGlob("src/posts/*.md")
  );

  // ✅ 로그 컬렉션
  eleventyConfig.addCollection("log", (collection) =>
    collection.getFilteredByGlob("src/log/*.md")
  );

  // ✅ teams-board.json을 전역 데이터로 등록
  const teamsBoard = require("./src/data/teams-board.json");
  eleventyConfig.addGlobalData("teamsBoard", teamsBoard);

  // ✅ 날짜 필터 (한국식 yyyy.mm.dd)
  eleventyConfig.addFilter("date", (dateObj) => {
    if (!dateObj) return "";
    return new Date(dateObj).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  });

  // ✅ 레이아웃 별칭
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