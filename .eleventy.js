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

  // ✅ 스포츠 경영 글만 가져오기
  eleventyConfig.addCollection("sportsPosts", (collection) =>
    collection.getFilteredByGlob("src/posts/*.md")
      .filter((post) => post.data.category === "스포츠 경영")
  );

  // ✅ 스포츠 경영 주제 목록
  eleventyConfig.addCollection("sportsTopics", (collection) => {
    const posts = collection.getFilteredByGlob("src/posts/*.md")
      .filter((post) => post.data.category === "스포츠 경영");

    const uniqueTopics = new Set();
    posts.forEach(post => {
      if (post.data.topic) uniqueTopics.add(post.data.topic);
    });

    return Array.from(uniqueTopics);
  });

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

  // ✅ 디렉토리 구조
  return {
    dir: {
      input: "src",
      includes: "includes",
      layouts: "layouts",
      output: "_site",
    },
  };
};