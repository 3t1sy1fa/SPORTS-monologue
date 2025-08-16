const moment = require("moment");
require("dotenv").config();

module.exports = function (eleventyConfig) {
  // 정적 자산 패스스루
  ["src/style", "src/scripts", "src/images", "src/fonts", "admin"].forEach(
    (path) => {
      eleventyConfig.addPassthroughCopy(path);
    }
  );
  eleventyConfig.addPassthroughCopy({ "static/favicon.png": "favicon.png" });

  // 컬렉션
  eleventyConfig.addCollection("teamPosts", (c) =>
    c.getFilteredByGlob("src/teams-analysis/*.md")
  );
  eleventyConfig.addCollection("posts", (c) =>
    c.getFilteredByGlob("src/posts/*.md")
  );
  eleventyConfig.addCollection("log", (c) =>
    c.getFilteredByGlob("src/log/*.md")
  );

  // 날짜 포맷 필터
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
     ✅ 캘린더(리그 공용)
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
        const game = Array.isArray(schedule)
          ? schedule.find(
              (s) =>
                s.date === dateStr &&
                (!teamSlug ||
                  s.homeSlug === teamSlug ||
                  s.awaySlug === teamSlug)
            )
          : null;

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
  eleventyConfig.addFilter("monthCalendar", buildCalendar);

  /* ---------------------------
     ✅ 캘린더(LG 전용)
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
        const game = Array.isArray(schedule)
          ? schedule.find((s) => s.date === dateStr)
          : null;

        let cssClass = "scheduled"; // 기본: 예정
        if (game?.status === "종료") {
          cssClass = game.result === "승" ? "win" : "lose";
        }

        week.push({
          day: current.date(),
          logo: game ? game.opponentSlug || game.logo || null : null,
          cssClass,
        });
        current.add(1, "day");
      }
      days.push(week);
    }
    return days;
  };
  eleventyConfig.addFilter("monthCalendarTwins", buildCalendarTwins);

  // 유틸 필터
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
    const team = Array.isArray(teamsBoard)
      ? teamsBoard.find((t) => t.slug === slug)
      : null;
    return team?.homepage || "https://www.koreabaseball.com";
  });

  eleventyConfig.addFilter("getTeamPosts", (teamPosts, slug) =>
    Array.isArray(teamPosts)
      ? teamPosts.filter((post) => post.data?.slug === slug)
      : []
  );

  // 어제 경기(빌드 시점 기준, KST)
  eleventyConfig.addFilter("latestGames", (games) => {
    if (!Array.isArray(games)) return [];
    const now = new Date();
    const KST_OFFSET = 9 * 60 * 60 * 1000;
    const DAY = 24 * 60 * 60 * 1000;
    const kstNow = new Date(now.getTime() + KST_OFFSET);
    const kstYesterday = new Date(kstNow.getTime() - DAY);
    const yyyyMmDd = kstYesterday.toISOString().split("T")[0];
    return games.filter((g) => g.date === yyyyMmDd).slice(0, 5);
  });

  eleventyConfig.addFilter("teamGames", (games, teamSlug) => {
    if (!Array.isArray(games)) return [];
    return games
      .filter((g) => g.homeSlug === teamSlug || g.awaySlug === teamSlug)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  });

  eleventyConfig.addFilter("toArray", (obj) => (obj ? Object.values(obj) : []));

  /* =====================================================
     ⭐ 추가: 데이터 키 제각각이어도 버티는 필터 2개
     1) onlyLG: players에서 LG만 필터
     2) votesTop3LG: voteSummary.players에서 LG 상위 3명
  ====================================================== */
  eleventyConfig.addFilter("onlyLG", (players) => {
    if (!Array.isArray(players)) return [];
    return players.filter((p) => {
      const slug =
        (p.teamSlug ||
          p.playerTeamSlug ||
          p.team ||
          p.team_code ||
          p.teamCode ||
          "") + "";
      return slug.toLowerCase() === "lg";
    });
  });

  eleventyConfig.addFilter("votesTop3LG", (votePlayers) => {
    if (!Array.isArray(votePlayers)) return [];
    const list = votePlayers
      .filter((v) => {
        const team = (v.playerTeamSlug || v.teamSlug || v.team || "") + "";
        return team.toLowerCase() === "lg";
      })
      .map((v) => ({
        slug: v.playerSlug || v.slug || v.id,
        name: v.playerName || v.name || "이름 미정",
        votes: Number(v.playerTotalVotes || v.votes || 0),
      }))
      .sort((a, b) => b.votes - a.votes)
      .slice(0, 3);
    return list;
  });

  // 디렉터리 설정
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
