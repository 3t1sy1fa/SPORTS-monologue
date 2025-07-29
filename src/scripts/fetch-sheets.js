require('dotenv').config();
const { google } = require('googleapis');
const fs = require('fs');

const client = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  null,
  process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  ['https://www.googleapis.com/auth/spreadsheets.readonly']
);

const sheets = google.sheets({ version: 'v4', auth: client });

(async () => {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: 'Sheet1!A1:E20',
  });

  fs.writeFileSync('./src/data/gameResults.json', JSON.stringify(res.data.values, null, 2));
  console.log('✅ gameResults.json updated!');
})();