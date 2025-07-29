require('dotenv').config();
const { google } = require('googleapis');
const fs = require('fs');

// ✅ Google API 인증
const client = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  null,
  process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  ['https://www.googleapis.com/auth/spreadsheets.readonly']
);

const sheets = google.sheets({ version: 'v4', auth: client });

(async () => {
  try {
    // 1️⃣ TeamsBoard 시트 → teams-board.json
    const teamsBoardRes = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: 'TeamsBoard!A2:F20', // (이름, slug, rank, wins, losses, lastGame)
    });

    const teamsBoardData = (teamsBoardRes.data.values || []).map(row => ({
      name: row[0],
      slug: row[1],
      rank: Number(row[2]),
      wins: Number(row[3]),
      losses: Number(row[4]),
      lastGame: row[5]
    }));

    fs.writeFileSync(
      './src/data/teams-board.json',
      JSON.stringify(teamsBoardData, null, 2)
    );
    console.log('✅ teams-board.json updated!');

    // 2️⃣ GameResults 시트 → gameResults.json
    const gameResultsRes = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: 'GameResults!A2:D20', // (teamSlug, date, summary, link)
    });

    const gameResultsData = {};
    (gameResultsRes.data.values || []).forEach(row => {
      const teamSlug = row[0];
      gameResultsData[teamSlug] = {
        date: row[1],
        summary: row[2],
        link: row[3]
      };
    });

    fs.writeFileSync(
      './src/_data/gameResults.json',
      JSON.stringify(gameResultsData, null, 2)
    );
    console.log('✅ gameResults.json updated!');
  } catch (err) {
    console.error('❌ Failed to fetch data from Google Sheets:', err);
    process.exit(1);
  }
})();