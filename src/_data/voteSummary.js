// src/_data/voteSummary.js
const votes = require("./votes.json");

module.exports = () => {
  const teamVotes = {};
  const playerVotes = {};

  votes.forEach((vote) => {
    if (vote.targetType === "team") {
      teamVotes[vote.teamSlug] = (teamVotes[vote.teamSlug] || 0) + 1;
    }
    if (vote.targetType === "player") {
      playerVotes[vote.playerSlug] = (playerVotes[vote.playerSlug] || 0) + 1;
    }
  });

  // 객체 → 배열 변환
  const teamArray = Object.entries(teamVotes).map(([teamSlug, totalVotes]) => ({
    teamSlug,
    teamTotalVotes: totalVotes,
  }));

  const playerArray = Object.entries(playerVotes).map(([playerSlug, totalVotes]) => ({
    playerSlug,
    playerTotalVotes: totalVotes,
  }));

  return {
    teams: teamArray,
    players: playerArray,
  };
};