const moment = require("moment");

module.exports = function(eleventyConfig) {
  // ✅ 정적 리소스
  eleventyConfig.addPassthroughCopy({ "static/favicon.png": "favicon.png" });
  ["src/style", "src/scripts", "src/images", "src/fonts", "admin"]
    .forEach(path => eleventyConfig.addPassthroughCopy(path));

  // ✅ 컬렉션
  eleventyConfig.addCollection("teamPosts", c => c.getFilteredByGlob("src/teams-analysis/*.md"));
  eleventyConfig.addCollection("posts", c => c.getFilteredByGlob("src/posts/*.md"));
  eleventyConfig.addCollection("sportsPosts", c =>
    c.getFilteredByGlob("src/posts/*.md").filter(p => p.data.category === "스포츠 경영")
  );
  eleventyConfig.addCollection("sportsTopics", c => {
    const posts = c.getFilteredByGlob("src/posts/*.md")
      .filter(p => p.data.category === "스포츠 경영");
    const uniqueTopics = new Set();
    posts.forEach(p => p.data.topic && uniqueTopics.add(p.data.topic));
    return Array.from(uniqueTopics);
  });
  eleventyConfig.addCollection("log", c => c.getFilteredByGlob("src/log/*.md"));

  // ✅ 날짜 필터
  eleventyConfig.addFilter("date", dateObj =>
    dateObj ? new Date(dateObj).toLocaleDateString("ko-KR", {
      year: "numeric", month: "2-digit", day: "2-digit",
    }) : ""
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
        const game = schedule.find(s => s.date === dateStr);
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

  // ✅ 팀별 경기 필터
  eleventyConfig.addFilter("teamGames", (schedule, slug) => {
    if (!Array.isArray(schedule)) return [];
    return schedule.filter(
      game => game.homeSlug === slug || game.awaySlug === slug
    );
  });

  // 🔥 종료된 경기 중 최신 5개만 추출
  eleventyConfig.addFilter("latestGames", (games) => {
    if (!Array.isArray(games)) return [];
    return games
      .filter(game => String(game.status).trim() === "종료") // 종료 경기만
      .sort((a, b) => new Date(b.date) - new Date(a.date)) // 최신순 정렬
      .slice(0, 5); // 상위 5개
  });

  // ✅ 팀 홈페이지 필터
  eleventyConfig.addFilter("getHomepage", (teamsBoard, slug) => {
    if (!Array.isArray(teamsBoard)) return "https://www.koreabaseball.com";
    const team = teamsBoard.find(t => t.slug === slug);
    return team?.homepage || "https://www.koreabaseball.com";
  });

  // ✅ 구단별 분석글 필터
  eleventyConfig.addFilter("getTeamPosts", (teamPosts, slug) => {
    if (!Array.isArray(teamPosts)) return [];
    return teamPosts.filter(post => post.data?.slug === slug);
  });

  // ✅ 레이아웃 별칭
  eleventyConfig.addLayoutAlias("team-layout", "layouts/team-layout.njk");

  return {
    dir: {
      input: "src",
      includes: "includes",
      layouts: "layouts",
      output: "_site",
      data: "_data"
    },
  };
};