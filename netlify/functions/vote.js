// netlify/functions/vote.js
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { targetType, teamSlug, playerSlug } = JSON.parse(event.body);
    const votesPath = path.join(__dirname, "../../src/_data/votes.json");
    const votes = fs.existsSync(votesPath)
      ? JSON.parse(fs.readFileSync(votesPath, "utf8"))
      : [];

    const newVote = {
      targetType,
      teamSlug: teamSlug || "",
      playerSlug: playerSlug || "",
      timestamp: new Date().toISOString(),
    };

    votes.push(newVote);
    fs.writeFileSync(votesPath, JSON.stringify(votes, null, 2));

    // 🔑 Netlify Build Hook 호출 (사이트 재빌드)
    await fetch(process.env.NETLIFY_BUILD_HOOK, { method: "POST" });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "투표 완료! 잠시 후 반영됩니다." }),
    };
  } catch (error) {
    console.error("Vote save error:", error);
    return { statusCode: 500, body: "Internal Server Error" };
  }
};