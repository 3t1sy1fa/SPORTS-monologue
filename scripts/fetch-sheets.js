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
    // 1️⃣ TeamsBoard → teams-board.json
    const teamsBoardRes = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: 'TeamsBoard!A2:F20',
    });

    const teamsBoardData = (teamsBoardRes.data.values || []).map(row => ({
      name: row[0],
      slug: row[1],
      rank: Number(row[2]),
      wins: Number(row[3]),
      losses: Number(row[4]),
      lastGame: row[5],
    }));

    fs.writeFileSync(
      './src/data/teams-board.json',
      JSON.stringify(teamsBoardData, null, 2)
    );
    console.log('✅ teams-board.json updated!');

    // 2️⃣ GameResults → gameResults.json
    const gameResultsRes = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: 'GameResults!A2:D20',
    });

    const gameResultsData = {};
    (gameResultsRes.data.values || []).forEach(row => {
      const teamSlug = row[0];
      gameResultsData[teamSlug] = {
        date: row[1],
        summary: row[2],
        link: row[3],
      };
    });

    fs.writeFileSync(
      './src/_data/gameResults.json',
      JSON.stringify(gameResultsData, null, 2)
    );
    console.log('✅ gameResults.json updated!');

    // 3️⃣ LatestGames → latest-games.json
    const latestGamesRes = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: 'LatestGames!A2:F10',
    });

    const latestGamesData = (latestGamesRes.data.values || []).map(row => ({
      home: row[0],
      homeSlug: row[1],
      away: row[2],
      awaySlug: row[3],
      score: row[4],
      date: row[5],
    }));

    fs.writeFileSync(
      './src/data/latest-games.json',
      JSON.stringify(latestGamesData, null, 2)
    );
    console.log('✅ latest-games.json updated!');

    // 4️⃣ PlayerStats → player-stats.json
    const playerStatsRes = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: 'PlayerStats!A2:E50',
    });

    const playerStatsData = (playerStatsRes.data.values || []).map(row => ({
      player: row[0],
      date: row[1],
      game: row[2],
      record: row[3],
      rating: row[4],
    }));

    fs.writeFileSync(
      './src/data/player-stats.json',
      JSON.stringify(playerStatsData, null, 2)
    );
    console.log('✅ player-stats.json updated!');

  } catch (err) {
    console.error('❌ Failed to fetch data from Google Sheets:', err);
    process.exit(1);
  }
})();