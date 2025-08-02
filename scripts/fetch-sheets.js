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
      range: "TeamsBoard!A2:F20",
    });
    const teamsBoard = (teamsBoardRes.data.values || []).map((row) => ({
      name: row[0],
      slug: row[1],
      rank: Number(row[2]),
      wins: Number(row[3]),
      losses: Number(row[4]),
      lastGame: row[5],
    }));
    fs.writeFileSync("./src/_data/teams-board.json", JSON.stringify(teamsBoard, null, 2));

    /* --------------------------- 2️⃣ LeagueSchedule --------------------------- */
    const leagueScheduleRes = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: "LeagueSchedule!A2:F200",
    });
    const leagueSchedule = (leagueScheduleRes.data.values || []).map((row) => ({
      date: row[0],
      home: row[1],
      away: row[2],
      homeSlug: row[3],
      awaySlug: row[4],
      status: row[5],
    }));
    fs.writeFileSync("./src/_data/leagueSchedule.json", JSON.stringify(leagueSchedule, null, 2));

    /* ---------------------------- 3️⃣ twinsSchedule --------------------------- */
    const twinsScheduleRes = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: "twinsSchedule!A2:E100",
    });
    const twinsSchedule = (twinsScheduleRes.data.values || []).map((row) => ({
      date: row[0],
      opponent: row[1],
      opponentSlug: row[2],
      result: row[3],
      link: row[4],
    }));
    fs.writeFileSync("./src/_data/twinsSchedule.json", JSON.stringify(twinsSchedule, null, 2));

    /* ------------------------------- 4️⃣ Players ------------------------------- */
    const playersRes = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: "Players!A2:E200",
    });
    const players = (playersRes.data.values || []).map((row) => ({
      name: row[0],
      slug: row[1],
      position: row[2],
      teamSlug: row[3],
      note: row[4],
    }));
    fs.writeFileSync("./src/_data/players.json", JSON.stringify(players, null, 2));

    /* ----------------------------- 5️⃣ PlayerStats ----------------------------- */
    const playerStatsRes = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: "PlayerStats!A2:G500",
    });
    const playerStats = (playerStatsRes.data.values || []).map((row) => ({
      playerName: row[0],
      playerSlug: row[1],
      date: row[2],
      game: row[3],
      record: row[4],
      rating: row[5],
      teamSlug: row[6],
    }));
    fs.writeFileSync("./src/_data/playerStats.json", JSON.stringify(playerStats, null, 2));

    /* --------------------------------- 6️⃣ Votes -------------------------------- */
    const votesRes = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: "Votes!A:E",
    });
    const votesRows = votesRes.data.values || [];
    const votes = votesRows.slice(1).map((row) => ({
      voterId: row[0],
      targetType: row[1],
      teamSlug: row[2],
      playerSlug: row[3],
      timestamp: row[4],
    }));
    fs.writeFileSync("./src/_data/votes.json", JSON.stringify(votes, null, 2));

    /* ----------------------------- 7️⃣ VoteSummary ----------------------------- */
    const teams = {};
    const votePlayers = {}; // ✅ 이름 변경
    votes.forEach((vote) => {
      if (vote.targetType === "team" && vote.teamSlug) {
        teams[vote.teamSlug] = (teams[vote.teamSlug] || 0) + 1;
      }
      if (vote.targetType === "player" && vote.playerSlug) {
        votePlayers[vote.playerSlug] = (votePlayers[vote.playerSlug] || 0) + 1;
      }
    });
    const voteSummary = { teams, players: votePlayers };
    fs.writeFileSync("./src/_data/voteSummary.json", JSON.stringify(voteSummary, null, 2));

    console.log("✅ 모든 JSON 파일 생성 완료");
  } catch (error) {
    console.error("❌ fetch-sheets.js 오류:", error);
    process.exit(1);
  }
})();