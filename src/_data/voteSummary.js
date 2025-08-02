const votes = require("./votes.json");

module.exports = () => {
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

  return { teams, players };
};