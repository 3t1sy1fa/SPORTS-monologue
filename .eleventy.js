const moment = require("moment");
require("dotenv").config();

module.exports = function (eleventyConfig) {
  ["src/style", "src/scripts", "src/images", "src/fonts", "src/admin"].forEach(
    (path) => {
      eleventyConfig.addPassthroughCopy(path);
    }
  );
  eleventyConfig.addPassthroughCopy({ "static/favicon.png": "favicon.png" });

  eleventyConfig.addCollection("teamPosts", (c) =>
    c.getFilteredByGlob("src/teams-analysis/*.md")
  );
  eleventyConfig.addCollection("posts", (c) =>
    c.getFilteredByGlob("src/posts/*.md")
  );
  eleventyConfig.addCollection("log", (c) =>
    c.getFilteredByGlob("src/log/*.md")
  );

  eleventyConfig.addFilter("date", (dateObj) =>
    dateObj
      ? new Date(dateObj).toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
      : ""
  );

  /* ---------------------------
     ✅ 기본 캘린더
  --------------------------- */
  const buildCalendar = (schedule, month, teamSlug = null) => {
    const start = moment(month).startOf("month").startOf("week");
    const end = moment(month).endOf("month").endOf("week");
    const days = [];
    let current = start.clone();

    while (current.isBefore(end)) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const dateStr = current.format("YYYY-MM-DD");
        const game = schedule.find(
          (s) =>
            s.date === dateStr &&
            (!teamSlug || s.homeSlug === teamSlug || s.awaySlug === teamSlug)
        );

        week.push({
          day: current.date(),
          logo: game
            ? game.homeSlug === teamSlug
              ? game.awaySlug
              : game.homeSlug
            : null,
          result: game?.status || "",
        });
        current.add(1, "day");
      }
      days.push(week);
    }
    return days;
  };

  /* ---------------------------
     ✅ LG 전용 캘린더
  --------------------------- */
  const buildCalendarTwins = (schedule, month) => {
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
          logo: game ? game.opponentSlug : null,
          cssClass:
            game?.status === "종료"
              ? game.result === "승"
                ? "win"
                : "lose"
              : "scheduled",
        });
        current.add(1, "day");
      }
      days.push(week);
    }
    return days;
  };

  eleventyConfig.addFilter("monthCalendar", buildCalendar);
  eleventyConfig.addFilter("monthCalendarLG", (schedule, month) =>
    buildCalendar(schedule, month, "lg")
  );
  eleventyConfig.addFilter("monthCalendarTwins", buildCalendarTwins);

  eleventyConfig.addFilter("map", (array, attribute) =>
    Array.isArray(array) ? array.map((item) => item[attribute]) : []
  );
  eleventyConfig.addFilter("getRecentGame", (games) => {
    if (!Array.isArray(games)) return null;
    return (
      games
        .filter((g) => String(g.winner).trim() === "종료")
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0] || null
    );
  });
  eleventyConfig.addFilter("getHomepage", (teamsBoard, slug) => {
    const team = teamsBoard.find((t) => t.slug === slug);
    return team?.homepage || "https://www.koreabaseball.com";
  });
  eleventyConfig.addFilter("getTeamPosts", (teamPosts, slug) =>
    teamPosts.filter((post) => post.data?.slug === slug)
  );
  eleventyConfig.addFilter("latestGames", (games) => {
    if (!Array.isArray(games)) return [];
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split("T")[0];
    return games.filter((g) => g.date === yesterday).slice(0, 5);
  });
  eleventyConfig.addFilter("teamGames", (games, teamSlug) => {
    if (!Array.isArray(games)) return [];
    return games
      .filter((g) => g.homeSlug === teamSlug || g.awaySlug === teamSlug)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  });
  eleventyConfig.addFilter("toArray", (obj) => (obj ? Object.values(obj) : []));

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
