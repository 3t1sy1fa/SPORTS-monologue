const fs = require("fs");
const { GoogleSpreadsheet } = require("google-spreadsheet");
require("dotenv").config();

const SHEET_ID = process.env.SHEET_ID;
const CREDS = require(process.env.GOOGLE_CREDENTIALS);

async function fetchData() {
  const doc = new GoogleSpreadsheet(SHEET_ID);
  await doc.useServiceAccountAuth(CREDS);
  await doc.loadInfo();

  // 시트1 → teams-board.json
  const teamsSheet = doc.sheetsByTitle["TeamsBoard"];
  const teamsRows = await teamsSheet.getRows();
  const teamsData = teamsRows.map(row => ({
    name: row.Name,
    slug: row.Slug,
    rank: parseInt(row.Rank),
    wins: parseInt(row.Wins),
    losses: parseInt(row.Losses),
    lastGame: row.LastGame
  }));

  fs.writeFileSync("./src/data/teams-board.json", JSON.stringify(teamsData, null, 2));

  // 시트2 → gameResults.json
  const resultsSheet = doc.sheetsByTitle["GameResults"];
  const resultsRows = await resultsSheet.getRows();
  const resultsData = {};
  resultsRows.forEach(row => {
    resultsData[row.Slug] = {
      date: row.Date,
      summary: row.Summary,
      link: row.Link
    };
  });

  fs.writeFileSync("./src/data/gameResults.json", JSON.stringify(resultsData, null, 2));

  console.log("✅ 데이터 동기화 완료");
}

fetchData();