// src/_data/voteSummary.js
const votes = require("./votes.json");

module.exports = () => {
  const players = {};

  votes.forEach(vote => {
    if (vote.targetType === "player") {
      const key = vote.playerSlug;
      if (!players[key]) {
        players[key] = {
          playerSlug: vote.playerSlug,
          playerName: vote.playerName || "이름 없음",
          playerTeamSlug: vote.playerTeamSlug || "",
          playerTotalVotes: 0
        };
      }
      players[key].playerTotalVotes++;
    }
  });

  return Object.values(players); // ✅ 배열로 반환
};