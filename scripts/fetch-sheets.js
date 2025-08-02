require("dotenv").config();
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

const client = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  null,
  process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  ["https://www.googleapis.com/auth/spreadsheets.readonly"]
);

const sheets = google.sheets({ version: "v4", auth: client });

// 📌 시트 → JSON 파일 매핑 (파일명을 CamelCase로 변경)
const sheetConfig = [
  { sheetName: "TeamsBoard", range: "A2:J20", file: "teamsBoard.json", map: row => ({
      name: row[0],
      slug: row[1],
      rank: Number(row[2]),
      wins: Number(row[3]),
      losses: Number(row[4]),
      draws: Number(row[5]),
      winRate: parseFloat(row[6]),
      gamesBehind: row[7],
      lastGame: row[8],
      homepage: row[9]
    })
  },
  { sheetName: "LeagueSchedule", range: "A2:L300", file: "leagueSchedule.json", map: row => ({
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
      doubleHeader: row[11]
    })
  },
  { sheetName: "twinsSchedule", range: "A2:H100", file: "twinsSchedule.json", map: row => ({
      season: row[0],
      date: row[1],
      opponent: row[2],
      opponentSlug: row[3],
      homeAway: row[4],
      status: row[5],
      result: row[6],
      score: row[7]
    })
  },
  { sheetName: "Players", range: "A2:G200", file: "players.json", map: row => ({
      name: row[0],
      slug: row[1],
      teamSlug: row[2],
      position: row[3],
      note: row[4],
      number: row[5],
      popularity: Number(row[6] || 0)
    })
  },
  { sheetName: "PlayerStats", range: "A2:G500", file: "playerStats.json", map: row => ({
      playerSlug: row[0],
      playerName: row[1],
      date: row[2],
      game: row[3],
      record: row[4],
      rating: row[5],
      teamSlug: row[6]
    })
  },
  { sheetName: "Votes", range: "A2:E1000", file: "votes.json", map: row => ({
      voterId: row[0],
      targetType: row[1],
      teamSlug: row[2],
      playerSlug: row[3],
      timestamp: row[4]
    })
  },
  { sheetName: "VoteSummary", range: "A2:G1000", file: "voteSummary.json", map: row => ({
      teamSlug: row[0],
      teamName: row[1],
      teamTotalVotes: Number(row[2]),
      playerSlug: row[3],
      playerName: row[4],
      playerTeamSlug: row[5],
      playerTotalVotes: Number(row[6])
    })
  }
];

// ✅ 저장 경로 (_data 폴더)
const outputDir = path.join(__dirname, "../src/_data");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

(async () => {
  try {
    for (const { sheetName, range, file, map } of sheetConfig) {
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.SHEET_ID,
        range: `${sheetName}!${range}`
      });

      const rows = res.data.values || [];
      const data = rows.map(map);

      fs.writeFileSync(
        path.join(outputDir, file),
        JSON.stringify(data, null, 2),
        "utf8"
      );
      console.log(`✅ ${sheetName} → ${file} 변환 완료`);
    }

    console.log("🚀 모든 시트 데이터가 _data 폴더에 JSON으로 변환되었습니다.");
  } catch (error) {
    console.error("❌ 시트 데이터 변환 실패:", error);
    process.exit(1);
  }
})();