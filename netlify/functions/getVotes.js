const fs = require("fs");
const path = require("path");

exports.handler = async () => {
  try {
    const votesPath = path.join(__dirname, "../../src/_data/votes.json");
    const votes = fs.existsSync(votesPath)
      ? JSON.parse(fs.readFileSync(votesPath, "utf8"))
      : [];

    // 표 집계
    const teams = {};
    const players = {};

    votes.forEach((vote) => {
      if (vote.targetType === "team") {
        teams[vote.teamSlug] = (teams[vote.teamSlug] || 0) + 1;
      }
      if (vote.targetType === "player") {
        players[vote.playerSlug] = (players[vote.playerSlug] || 0) + 1;
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ teams, players }),
    };
  } catch (error) {
    console.error("Get votes error:", error);
    return { statusCode: 500, body: "Internal Server Error" };
  }
};