const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { targetType, teamSlug, playerSlug } = JSON.parse(event.body);
    if (!targetType || (targetType === "team" && !teamSlug) || (targetType === "player" && !playerSlug)) {
      return { statusCode: 400, body: JSON.stringify({ message: "잘못된 요청입니다." }) };
    }

    // ✅ votes.json 경로
    const votesPath = path.join(__dirname, "../../src/_data/votes.json");
    const votes = fs.existsSync(votesPath)
      ? JSON.parse(fs.readFileSync(votesPath, "utf8"))
      : { teams: {}, players: {} };

    // ✅ 투표 카운트 증가
    if (targetType === "team") {
      votes.teams[teamSlug] = (votes.teams[teamSlug] || 0) + 1;
    }
    if (targetType === "player") {
      votes.players[playerSlug] = (votes.players[playerSlug] || 0) + 1;
    }

    // ✅ 파일 업데이트
    fs.writeFileSync(votesPath, JSON.stringify(votes, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "투표가 완료되었습니다." }),
    };
  } catch (error) {
    console.error("Vote error:", error);
    return { statusCode: 500, body: JSON.stringify({ message: "서버 오류 발생" }) };
  }
};