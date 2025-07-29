module.exports = function (eleventyConfig) {
  // ✅ 정적 리소스 패스스루
  ["src/style", "src/scripts", "src/images", "src/fonts", "admin"]
    .forEach(path => eleventyConfig.addPassthroughCopy(path));

  // ✅ 컬렉션 등록
  eleventyConfig.addCollection("teamPosts", (collection) =>
    collection.getFilteredByGlob("src/teams-analysis/*.md")
  );

  eleventyConfig.addCollection("posts", (collection) =>
    collection.getFilteredByGlob("src/posts/*.md")
  );

  eleventyConfig.addCollection("log", (collection) =>
    collection.getFilteredByGlob("src/log/*.md")
  );

  // ✅ 날짜 필터 (한국식)
  eleventyConfig.addFilter("date", (dateObj) => {
    if (!dateObj) return "";
    return new Date(dateObj).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  });

  // ✅ 레이아웃 별칭 등록
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