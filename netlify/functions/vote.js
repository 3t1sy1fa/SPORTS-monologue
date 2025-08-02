const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { targetType, teamSlug, playerSlug } = JSON.parse(event.body);

    if (!targetType || (targetType === "player" && !playerSlug) || (targetType === "team" && !teamSlug)) {
      return { statusCode: 400, body: "Invalid vote payload" };
    }

    const votesPath = path.join(__dirname, "../../src/_data/votes.json");
    const votes = fs.existsSync(votesPath)
      ? JSON.parse(fs.readFileSync(votesPath, "utf8"))
      : [];

    const voterId = event.headers["client-ip"] || `anon-${Date.now()}`;
    const isDuplicate = votes.some(
      (vote) =>
        vote.voterId === voterId &&
        vote.targetType === targetType &&
        (targetType === "player" ? vote.playerSlug === playerSlug : vote.teamSlug === teamSlug)
    );

    if (isDuplicate) {
      return { statusCode: 400, body: JSON.stringify({ message: "이미 투표하셨습니다." }) };
    }

    const newVote = {
      voterId,
      targetType,
      teamSlug: teamSlug || "",
      playerSlug: playerSlug || "",
      timestamp: new Date().toISOString(),
    };

    votes.push(newVote);
    fs.writeFileSync(votesPath, JSON.stringify(votes, null, 2));

    // ✅ Netlify 빌드 트리거
    await fetch(process.env.NETLIFY_BUILD_HOOK, { method: "POST" });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "투표가 완료되었습니다. 사이트가 곧 업데이트됩니다.", vote: newVote }),
    };
  } catch (error) {
    console.error("Vote save error:", error);
    return { statusCode: 500, body: "Internal Server Error" };
  }
};