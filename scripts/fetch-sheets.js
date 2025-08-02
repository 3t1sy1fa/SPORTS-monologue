// scripts/fetch-sheets.js
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");

// ✅ 로컬 환경일 경우만 .env 로드
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// ✅ 환경 변수 불러오기
const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
const privateKey = process.env.GOOGLE_PRIVATE_KEY
  ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")
  : null;
const sheetId = process.env.SHEET_ID;

if (!clientEmail || !privateKey || !sheetId) {
  console.error("❌ Missing required environment variables.");
  process.exit(1);
}

const client = new google.auth.JWT(
  clientEmail,
  null,
  privateKey,
  ["https://www.googleapis.com/auth/spreadsheets.readonly"]
);

const sheets = google.sheets({ version: "v4", auth: client });

(async () => {
  try {
    // 1️⃣ TeamsBoard → teams-board.json
    const teamsBoardRes = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "TeamsBoard!A2:F20",
    });

    const teamsBoardData = (teamsBoardRes.data.values || []).map((row) => ({
      name: row[0],
      slug: row[1],
      rank: Number(row[2]),
      wins: Number(row[3]),
      losses: Number(row[4]),
      lastGame: row[5],
    }));

    fs.writeFileSync(
      path.join(__dirname, "../src/_data/teams-board.json"),
      JSON.stringify(teamsBoardData, null, 2)
    );

    // 2️⃣ LeagueSchedule → league-schedule.json
    const leagueScheduleRes = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "LeagueSchedule!A2:E100",
    });

    const leagueScheduleData = (leagueScheduleRes.data.values || []).map((row) => ({
      date: row[0],
      home: row[1],
      away: row[2],
      status: row[3],
      score: row[4],
    }));

    fs.writeFileSync(
      path.join(__dirname, "../src/_data/league-schedule.json"),
      JSON.stringify(leagueScheduleData, null, 2)
    );

    console.log("✅ Google Sheets data fetched successfully.");
  } catch (error) {
    console.error("❌ Error fetching Google Sheets data:", error);
    process.exit(1);
  }
})();