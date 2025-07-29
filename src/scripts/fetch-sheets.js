const { GoogleSpreadsheet } = require('google-spreadsheet');
const fs = require('fs');
require('dotenv').config();

(async () => {
  try {
    const SHEET_ID = process.env.SHEET_ID;
    const CREDS = JSON.parse(process.env.GOOGLE_CREDENTIALS);

    const doc = new GoogleSpreadsheet(SHEET_ID);
    await doc.useServiceAccountAuth(CREDS);
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    const data = rows.map(row => ({
      name: row['팀'],
      rank: row['순위'],
      wins: row['승'],
      losses: row['패'],
      lastGame: row['최근경기']
    }));

    fs.writeFileSync('./src/data/gameResults.json', JSON.stringify(data, null, 2));
    console.log('✅ gameResults.json 업데이트 완료');
  } catch (error) {
    console.error('❌ 스크립트 실행 오류:', error);
  }
})();