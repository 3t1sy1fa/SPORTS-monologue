require("dotenv").config();
const { google } = require("googleapis");
const fs = require("fs");

(async () => {
  const client = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    ["https://www.googleapis.com/auth/spreadsheets.readonly"]
  );

  const sheets = google.sheets({ version: "v4", auth: client });

  // ✅ Votes 데이터 가져오기
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: "votes!A:E",
  });

  const rows = res.data.values || [];
  const teams = {};
  const players = {};

  rows.slice(1).forEach((row) => {
    const [, type, teamSlug, playerSlug] = row;
    if (type === "team" && teamSlug) {
      teams[teamSlug] = (teams[teamSlug] || 0) + 1;
    }
    if (type === "player" && playerSlug) {
      players[playerSlug] = (players[playerSlug] || 0) + 1;
    }
  });

  fs.writeFileSync(
    "./src/_data/votes.json",
    JSON.stringify({ teams, players }, null, 2)
  );

  console.log("✅ votes.json 생성 완료");
})();