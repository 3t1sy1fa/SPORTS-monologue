const moment = require("moment");
require("dotenv").config();

module.exports = function (eleventyConfig) {
  // ---------------------------
  // 정적 자산 패스스루
  // ---------------------------
  ["src/style", "src/scripts", "src/images", "src/fonts", "admin"].forEach(
    (path) => {
      eleventyConfig.addPassthroughCopy(path);
    }
  );
  eleventyConfig.addPassthroughCopy({ "static/favicon.png": "favicon.png" });

  // ---------------------------
  // 컬렉션
  // ---------------------------
  eleventyConfig.addCollection("teamPosts", (c) =>
    c.getFilteredByGlob("src/teams-analysis/*.md")
  );
  eleventyConfig.addCollection("posts", (c) =>
    c.getFilteredByGlob("src/posts/*.md")
  );
  eleventyConfig.addCollection("log", (c) =>
    c.getFilteredByGlob("src/log/*.md")
  );

  // ---------------------------
  // 필터: 날짜 포맷
  // ---------------------------
  eleventyConfig.addFilter("date", (dateObj) => {
    if (!dateObj) return "";
    const d = new Date(dateObj);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  });

  // ---------------------------
  // 공용 유틸 필터
  // ---------------------------
  eleventyConfig.addFilter("map", (array, attribute) =>
    Array.isArray(array) ? array.map((item) => item?.[attribute]) : []
  );

  eleventyConfig.addFilter("toArray", (obj) => {
    if (!obj) return [];
    if (Array.isArray(obj)) return obj;
    if (typeof obj === "object") return Object.values(obj);
    return [];
  });

  // ---------------------------
  // ✅ 캘린더(리그 공용)
  //   buildCalendar(schedule, month, teamSlug?)
  //   - teamSlug가 있으면 해당 팀 관점에서 상대 로고 표시
  //   - 없으면 home 기준 상대 로고 표시
  // ---------------------------
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
                s?.date === dateStr &&
                (!teamSlug ||
                  s?.homeSlug === teamSlug ||
                  s?.awaySlug === teamSlug)
            )
          : null;

        // 상대 로고 추론
        let oppSlug = null;
        if (game) {
          const h = (
            game.homeSlug ||
            game.home ||
            game.homeTeamSlug ||
            ""
          ).toString();
          const a = (
            game.awaySlug ||
            game.away ||
            game.awayTeamSlug ||
            ""
          ).toString();
          if (teamSlug) {
            if (h.toLowerCase() === teamSlug.toLowerCase())
              oppSlug =
                a ||
                game.opponentSlug ||
                game.opponent ||
                game.opponentName ||
                null;
            else if (a.toLowerCase() === teamSlug.toLowerCase())
              oppSlug =
                h ||
                game.opponentSlug ||
                game.opponent ||
                game.opponentName ||
                null;
            else
              oppSlug =
                game.opponentSlug || game.opponent || game.opponentName || null;
          } else {
            // 팀 미지정: 홈 관점에서 상대
            oppSlug =
              a ||
              game.opponentSlug ||
              game.opponent ||
              game.opponentName ||
              null;
          }
        }

        const status = (game?.status || game?.state || "")
          .toString()
          .toLowerCase();
        const result = (game?.result || "").toString().toUpperCase();
        let cssClass = "scheduled";
        if (status === "종료" || status === "done") {
          if (result === "승" || result === "W") cssClass = "win";
          else if (result === "패" || result === "L") cssClass = "lose";
          else cssClass = "done";
        } else if (status === "예정" || status === "planned") {
          cssClass = "scheduled";
        }

        week.push({
          day: current.date(),
          logo: oppSlug || null,
          cssClass,
        });
        current.add(1, "day");
      }
      days.push(week);
    }
    return days;
  };
  eleventyConfig.addFilter("monthCalendar", buildCalendar);

  // ---------------------------
  // ✅ 캘린더(LG 전용) — TwinS-TAR에서 사용
  //   buildCalendarTwins(schedule, month)
  //   - 다양한 필드명(status/state/result/opponentSlug/opponentName) 호환
  //   - cssClass: win/lose/scheduled/done
  // ---------------------------
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
          ? schedule.find((s) => s?.date === dateStr)
          : null;

        // 상대 로고 추론 (LG 관점)
        let oppSlug = null;
        if (game) {
          const h = (
            game.homeSlug ||
            game.home ||
            game.homeTeamSlug ||
            ""
          ).toString();
          const a = (
            game.awaySlug ||
            game.away ||
            game.awayTeamSlug ||
            ""
          ).toString();
          const lg = "lg";
          if (h.toLowerCase() === lg) oppSlug = a;
          else if (a.toLowerCase() === lg) oppSlug = h;
          // 데이터에 opponent* 가 있는 경우 보정
          oppSlug =
            oppSlug ||
            game.opponentSlug ||
            game.opponent ||
            game.opponentName ||
            null;
        }

        const status = (game?.status || game?.state || "")
          .toString()
          .toLowerCase();
        const result = (game?.result || "").toString().toUpperCase();
        let cssClass = "scheduled";
        if (status === "종료" || status === "done") {
          if (result === "승" || result === "W") cssClass = "win";
          else if (result === "패" || result === "L") cssClass = "lose";
          else cssClass = "done";
        } else if (status === "예정" || status === "planned") {
          cssClass = "scheduled";
        }

        week.push({
          day: current.date(),
          logo: oppSlug || null,
          cssClass,
        });
        current.add(1, "day");
      }
      days.push(week);
    }
    return days;
  };
  eleventyConfig.addFilter("monthCalendarTwins", buildCalendarTwins);

  // ---------------------------
  // ✅ 최근 경기 1개 추출 (버그 수정)
  //   - 기존 winner === '종료' → status/state 기반으로 수정
  // ---------------------------
  eleventyConfig.addFilter("getRecentGame", (games) => {
    if (!Array.isArray(games)) return null;
    return (
      games
        .filter((g) => {
          const st = (g?.status || g?.state || "").toString().toLowerCase();
          return st === "종료" || st === "done";
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0] || null
    );
  });

  // ---------------------------
  // ✅ 팀 홈페이지/포스트/어제 경기/팀 경기
  // ---------------------------
  eleventyConfig.addFilter("getHomepage", (teamsBoard, slug) => {
    const team = Array.isArray(teamsBoard)
      ? teamsBoard.find((t) => t?.slug === slug)
      : null;
    return team?.homepage || "https://www.koreabaseball.com";
  });

  eleventyConfig.addFilter("getTeamPosts", (teamPosts, slug) =>
    Array.isArray(teamPosts)
      ? teamPosts.filter((post) => post?.data?.slug === slug)
      : []
  );

  // KST 기준 '어제' (빌드 시점 고정)
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
    if (!Array.isArray(games)) return [];
    return games
      .filter((g) => g?.homeSlug === teamSlug || g?.awaySlug === teamSlug)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  });

  // ---------------------------
  // 디렉터리 설정
  // ---------------------------
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
