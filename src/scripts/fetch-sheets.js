const fs = require("fs");
const { google } = require("googleapis");

const SHEET_ID = process.env.SHEET_ID;
const CREDENTIALS = require("../credentials.json");
const OUTPUT_TEAMS = "./src/data/teams-board.json";
const OUTPUT_RESULTS = "./src/data/gameResults.json";

async function fetchSheets() {
  const auth = new google.auth.JWT(
    CREDENTIALS.client_email,
    null,
    CREDENTIALS.private_key,
    ["https://www.googleapis.com/auth/spreadsheets.readonly"]
  );
  const sheets = google.sheets({ version: "v4", auth });

  // 시트1: 팀 보드
  const teamsRes = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: "TeamsBoard!A2:F11",
  });

  const teamsData = teamsRes.data.values.map(row => ({
    name: row[0],
    slug: row[1],
    rank: parseInt(row[2]),
    wins: parseInt(row[3]),
    losses: parseInt(row[4]),
    lastGame: row[5],
  }));
  fs.writeFileSync(OUTPUT_TEAMS, JSON.stringify(teamsData, null, 2));

  // 시트2: 경기 결과
  const resultsRes = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: "GameResults!A2:D11",
  });

  const resultsData = resultsRes.data.values.map(row => ({
    team: row[0],
    date: row[1],
    summary: row[2],
    link: row[3],
  }));
  fs.writeFileSync(OUTPUT_RESULTS, JSON.stringify(resultsData, null, 2));

  console.log("✅ Sheets data fetched and saved successfully.");
}

fetchSheets().catch(console.error);