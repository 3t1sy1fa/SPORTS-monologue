const votes = require("./votes.json");

module.exports = () => {
  return {
    teams: votes.teams || {},
    players: votes.players || {},
  };
};