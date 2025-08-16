const moment = require("moment");
require("dotenv").config();

module.exports = function (eleventyConfig) {
  /* ---------------------------
     Static passthrough
  --------------------------- */
  ["src/style", "src/scripts", "src/images", "src/fonts", "admin"].forEach(
    (p) => eleventyConfig.addPassthroughCopy(p)
  );
  eleventyConfig.addPassthroughCopy({ "static/favicon.png": "favicon.png" });

  /* ---------------------------
     Collections
  --------------------------- */
  eleventyConfig.addCollection("teamPosts", (c) =>
    c.getFilteredByGlob("src/teams-analysis/*.md")
  );
  eleventyConfig.addCollection("posts", (c) =>
    c.getFilteredByGlob("src/posts/*.md")
  );
  eleventyConfig.addCollection("log", (c) =>
    c.getFilteredByGlob("src/log/*.md")
  );

  /* ---------------------------
     Base filters
  --------------------------- */
  eleventyConfig.addFilter("date", (dateObj) => {
    if (!dateObj) return "";
    try {
      return new Date(dateObj).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return "";
    }
  });

  // 배열 안전화: 배열 그대로 / 객체면 values / 아니면 빈 배열
  eleventyConfig.addFilter("safeList", (v) => {
    if (Array.isArray(v)) return v;
    if (v && typeof v === "object") return Object.values(v);
    return [];
  });

  // 이미 써온 이름도 유지하고 싶을 때
  eleventyConfig.addFilter("toArray", (v) => {
    if (Array.isArray(v)) return v;
    if (v && typeof v === "object") return Object.values(v);
    return [];
  });

  eleventyConfig.addFilter("map", (array, attr) =>
    Array.isArray(array) ? array.map((x) => x?.[attr]) : []
  );

  /* ---------------------------
     Calendar (generic)
  --------------------------- */
  const buildCalendar = (schedule, month, teamSlug = null) => {
    const start = moment(month).startOf("month").startOf("week");
    const end = moment(month).endOf("month").endOf("week");
    const days = [];
    let cur = start.clone();

    const list = Array.isArray(schedule) ? schedule : [];
    while (cur.isBefore(end)) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const dateStr = cur.format("YYYY-MM-DD");
        const game = list.find((s) => {
          const sameDate = s?.date === dateStr;
          if (!sameDate) return false;
          if (!teamSlug) return true;
          return s?.homeSlug === teamSlug || s?.awaySlug === teamSlug;
        });

        week.push({
          day: cur.date(),
          logo: game
            ? game.homeSlug === teamSlug
              ? game.awaySlug
              : game.homeSlug
            : null,
          state: game?.state || "",
          status: game?.status || "",
          result: game?.result || "",
        });
        cur.add(1, "day");
      }
      days.push(week);
    }
    return days;
  };
  eleventyConfig.addFilter("monthCalendar", buildCalendar);

  /* ---------------------------
     Calendar (Twins page 전용)
  --------------------------- */
  const buildCalendarTwins = (schedule, month) => {
    const start = moment(month).startOf("month").startOf("week");
    const end = moment(month).endOf("month").endOf("week");
    const list = Array.isArray(schedule) ? schedule : [];
    const rows = [];
    let cur = start.clone();

    while (cur.isBefore(end)) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const dateStr = cur.format("YYYY-MM-DD");
        const game = list.find((s) => s?.date === dateStr);

        let cssClass = "scheduled";
        if (game && (game.status === "종료" || game.state === "done")) {
          if (game.result === "승" || game.result === "W") cssClass = "win";
          else if (game.result === "패" || game.result === "L")
            cssClass = "lose";
          else cssClass = "done";
        }

        week.push({
          day: cur.date(),
          logo: game
            ? game.opponentSlug || game.awaySlug || game.homeSlug
            : null,
          cssClass,
        });
        cur.add(1, "day");
      }
      rows.push(week);
    }
    return rows;
  };
  eleventyConfig.addFilter("monthCalendarTwins", buildCalendarTwins);

  /* ---------------------------
     Domain helpers
  --------------------------- */
  // 팀 필터(대/소문자 안전)
  eleventyConfig.addFilter("filterByTeam", (array, teamSlug) => {
    const list = Array.isArray(array) ? array : [];
    if (!teamSlug) return list;
    const key = String(teamSlug).toLowerCase();
    return list.filter((p) => {
      const t =
        (p?.teamSlug || p?.playerTeamSlug || p?.team || p?.team_code || "") +
        "";
      return t.toLowerCase() === key;
    });
  });

  // LG 로스터만
  eleventyConfig.addFilter("rosterLG", (array) =>
    (Array.isArray(array) ? array : []).filter((p) => {
      const t =
        (p?.teamSlug || p?.playerTeamSlug || p?.team || p?.team_code || "") +
        "";
      return t.toLowerCase() === "lg";
    })
  );

  // 투표 TOP3 (LG만)
  eleventyConfig.addFilter("topVotesLG", (votes) => {
    const list = Array.isArray(votes) ? votes : [];
    const onlyLG = list.filter((v) => {
      const t = (v?.playerTeamSlug || v?.teamSlug || v?.team || "") + "";
      return t.toLowerCase() === "lg";
    });
    // 숫자 정렬 안전화
    onlyLG.sort((a, b) => {
      const av = Number(a?.playerTotalVotes ?? a?.votes ?? 0);
      const bv = Number(b?.playerTotalVotes ?? b?.votes ?? 0);
      return bv - av;
    });
    return onlyLG.slice(0, 3);
  });

  // 최근 종료 경기 3개
  eleventyConfig.addFilter("recentDone3", (schedule) => {
    const list = Array.isArray(schedule) ? schedule : [];
    // 날짜가 문자열 YYYY-MM-DD 라고 가정
    const done = list.filter(
      (g) => g && (g.status === "종료" || g.state === "done")
    );
    done.sort((a, b) => new Date(b.date) - new Date(a.date));
    return done.slice(0, 3);
  });

  // 홈 보드 등 기존 필터 유지
  eleventyConfig.addFilter("getRecentGame", (games) => {
    if (!Array.isArray(games)) return null;
    const done = games
      .filter((g) => String(g?.winner).trim() === "종료")
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    return done[0] || null;
  });

  eleventyConfig.addFilter("getHomepage", (teamsBoard, slug) => {
    const list = Array.isArray(teamsBoard) ? teamsBoard : [];
    const team = list.find((t) => t?.slug === slug);
    return team?.homepage || "https://www.koreabaseball.com";
  });

  eleventyConfig.addFilter("getTeamPosts", (teamPosts, slug) => {
    const list = Array.isArray(teamPosts) ? teamPosts : [];
    return list.filter((post) => post?.data?.slug === slug);
  });

  eleventyConfig.addFilter("latestGames", (games) => {
    if (!Array.isArray(games)) return [];
    const now = new Date();
    const KST_OFFSET = 9 * 60 * 60 * 1000;
    const DAY = 24 * 60 * 60 * 1000;
    const kstNow = new Date(now.getTime() + KST_OFFSET);
    const kstYesterday = new Date(kstNow.getTime() - DAY);
    const yyyyMmDd = kstYesterday.toISOString().split("T")[0];
    return games.filter((g) => g?.date === yyyyMmDd).slice(0, 5);
  });

  eleventyConfig.addFilter("teamGames", (games, teamSlug) => {
    const list = Array.isArray(games) ? games : [];
    const key = (teamSlug || "") + "";
    return list
      .filter((g) => g?.homeSlug === key || g?.awaySlug === key)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  });

  /* ---------------------------
     Dir
  --------------------------- */
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
