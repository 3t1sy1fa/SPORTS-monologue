const moment = require("moment");

module.exports = function (eleventyConfig) {
  // ✅ 정적 파일 복사
  ["src/style", "src/scripts", "src/images", "src/fonts", "admin"].forEach((path) =>
    eleventyConfig.addPassthroughCopy(path)
  );
  eleventyConfig.addPassthroughCopy({ "static/favicon.png": "favicon.png" });

  // ✅ 컬렉션
  eleventyConfig.addCollection("teamPosts", (c) => c.getFilteredByGlob("src/teams-analysis/*.md"));
  eleventyConfig.addCollection("posts", (c) => c.getFilteredByGlob("src/posts/*.md"));
  eleventyConfig.addCollection("log", (c) => c.getFilteredByGlob("src/log/*.md"));

  // ✅ 날짜 필터
  eleventyConfig.addFilter("date", (dateObj) =>
    dateObj
      ? new Date(dateObj).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })
      : ""
  );

  // ✅ 캘린더 필터
  eleventyConfig.addFilter("monthCalendar", (schedule, month) => {
    const start = moment(month).startOf("month").startOf("week");
    const end = moment(month).endOf("month").endOf("week");
    const days = [];
    let current = start.clone();

    while (current.isBefore(end)) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const dateStr = current.format("YYYY-MM-DD");
        const game = schedule.find((s) => s.date === dateStr);
        week.push({
          day: current.date(),
          result: game ? game.result : "",
          logo: game ? game.opponentSlug : null,
          opponent: game ? game.opponent : null,
          link: game ? game.link : null,
        });
        current.add(1, "day");
      }
      days.push(week);
    }
    return days;
  });

  // ✅ 최근 경기 필터
  eleventyConfig.addFilter("getRecentGame", (games) => {
    if (!Array.isArray(games)) return null;
    return games.filter((g) => String(g.status).trim() === "종료").sort((a, b) => new Date(b.date) - new Date(a.date))[0] || null;
  });

  // ✅ 홈페이지 필터
  eleventyConfig.addFilter("getHomepage", (teamsBoard, slug) => {
    const team = teamsBoard.find((t) => t.slug === slug);
    return team?.homepage || "https://www.koreabaseball.com";
  });

  // ✅ 구단별 분석글 필터
  eleventyConfig.addFilter("getTeamPosts", (teamPosts, slug) => {
    return teamPosts.filter((post) => post.data?.slug === slug);
  });

  return {
    dir: {
      input: "src",
      includes: "includes",
      layouts: "layouts",
      output: "_site",
      data: "_data",
    },
  };
};