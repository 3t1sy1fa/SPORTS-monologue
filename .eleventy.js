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

  // ✅ 글로벌 데이터
  eleventyConfig.addGlobalData("teamsBoard", () => safeRequire("./src/data/teams-board.json"));
  eleventyConfig.addGlobalData("players", () => safeRequire("./src/data/players.json"));
  eleventyConfig.addGlobalData("twinsPlayers", () => {
    const players = safeRequire("./src/data/players.json");
    return players.filter(p => p.teamSlug === "lg");
  });
  eleventyConfig.addGlobalData("playerStats", () => safeRequire("./src/data/player-stats.json"));
  eleventyConfig.addGlobalData("twinsSchedule", () => safeRequire("./src/data/twins-schedule.json"));
  eleventyConfig.addGlobalData("leagueSchedule", () => safeRequire("./src/data/league-schedule.json"));
  eleventyConfig.addGlobalData("votes", () => safeRequire("./src/data/votes.json"));
  eleventyConfig.addGlobalData("voteSummary", () => safeRequire("./src/data/vote-summary.json"));

  // ✅ 안전한 require
  function safeRequire(path) {
    try {
      return require(path);
    } catch (err) {
      console.warn(`⚠️ Missing or invalid data file: ${path}`);
      return [];
    }
  }

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