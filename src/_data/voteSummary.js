const votes = require("./votes.json");

module.exports = () => {
  return {
    teams: Array.isArray(votes.teams) ? [...votes.teams] : [],
    players: Array.isArray(votes.players) ? [...votes.players] : [],
  };
};