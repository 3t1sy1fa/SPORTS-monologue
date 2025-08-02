require("dotenv").config();
const { google } = require("googleapis");
const fs = require("fs");

(async () => {
  try {
    // ✅ Google API 인증
    const client = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      ["https://www.googleapis.com/auth/spreadsheets.readonly"]
    );
    const sheets = google.sheets({ version: "v4", auth: client });

    /* ----------------------------- 1️⃣ TeamsBoard ----------------------------- */
    const teamsBoardRes = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: "TeamsBoard!A2:J20", // 10개 컬럼
    });
    const teamsBoard = (teamsBoardRes.data.values || []).map((row) => ({
      name: row[0],
      slug: row[1],
      rank: Number(row[2]),
      wins: Number(row[3]),
      losses: Number(row[4]),
      draws: Number(row[5]),
      winRate: row[6],
      gamesBehind: row[7],
      lastGame: row[8],
      homepage: row[9],
    }));
    fs.writeFileSync(
      "./src/_data/teams-board.json",
      JSON.stringify(teamsBoard, null, 2)
    );

    /* --------------------------- 2️⃣ LeagueSchedule --------------------------- */
    const leagueScheduleRes = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: "LeagueSchedule!A2:L200", // 컬럼 수에 맞춰 L까지
    });
    const leagueSchedule = (leagueScheduleRes.data.values || []).map((row) => ({
      season: row[0],
      date: row[1],
      gameNo: row[2],
      home: row[3],
      homeSlug: row[4],
      away: row[5],
      awaySlug: row[6],
      homeScore: row[7],
      awayScore: row[8],
      status: row[9],
      winner: row[10],
      doubleHeader: row[11],
    }));
    fs.writeFileSync(
      "./src/_data/leagueSchedule.json",
      JSON.stringify(leagueSchedule, null, 2)
    );

    /* ---------------------------- 3️⃣ twinsSchedule --------------------------- */
    const twinsScheduleRes = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: "twinsSchedule!A2:H100", // 컬럼 8개
    });
    const twinsSchedule = (twinsScheduleRes.data.values || []).map((row) => ({
      season: row[0],
      date: row[1],
      opponent: row[2],
      opponentSlug: row[3],
      homeAway: row[4],
      status: row[5],
      result: row[6],
      score: row[7],
    }));
    fs.writeFileSync(
      "./src/_data/twinsSchedule.json",
      JSON.stringify(twinsSchedule, null, 2)
    );

    /* ------------------------------- 4️⃣ Players ------------------------------- */
    const playersRes = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: "Players!A2:G200", // 7개 컬럼
    });
    const players = (playersRes.data.values || []).map((row) => ({
      name: row[0],
      slug: row[1],
      teamSlug: row[2],
      position: row[3],
      note: row[4],
      number: row[5],
      popularity: Number(row[6] || 0),
    }));
    fs.writeFileSync(
      "./src/_data/players.json",
      JSON.stringify(players, null, 2)
    );

    /* ----------------------------- 5️⃣ PlayerStats ----------------------------- */
    const playerStatsRes = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: "PlayerStats!A2:G500", // 7개 컬럼
    });
    const playerStats = (playerStatsRes.data.values || []).map((row) => ({
      playerSlug: row[0],
      playerName: row[1],
      date: row[2],
      game: row[3],
      record: row[4],
      rating: row[5],
      teamSlug: row[6],
    }));
    fs.writeFileSync(
      "./src/_data/playerStats.json",
      JSON.stringify(playerStats, null, 2)
    );

    /* --------------------------------- 6️⃣ Votes -------------------------------- */
    const votesRes = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: "Votes!A2:E500", // 5개 컬럼
    });
    const votes = (votesRes.data.values || []).map((row) => ({
      voterId: row[0],
      targetType: row[1],
      teamSlug: row[2],
      playerSlug: row[3],
      timestamp: row[4],
    }));
    fs.writeFileSync(
      "./src/_data/votes.json",
      JSON.stringify(votes, null, 2)
    );

    /* ----------------------------- 7️⃣ VoteSummary ----------------------------- */
    const teamsCount = {};
    const playersCount = {};

    votes.forEach((vote) => {
      if (vote.targetType === "team" && vote.teamSlug) {
        teamsCount[vote.teamSlug] = (teamsCount[vote.teamSlug] || 0) + 1;
      }
      if (vote.targetType === "player" && vote.playerSlug) {
        playersCount[vote.playerSlug] = (playersCount[vote.playerSlug] || 0) + 1;
      }
    });

    const voteSummary = { teams: teamsCount, players: playersCount };
    fs.writeFileSync(
      "./src/_data/voteSummary.json",
      JSON.stringify(voteSummary, null, 2)
    );

    console.log("✅ 모든 JSON 파일 생성 완료");
  } catch (error) {
    console.error("❌ fetch-sheets.js 오류:", error);
    process.exit(1);
  }
})();