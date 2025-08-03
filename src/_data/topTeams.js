const voteSummary = require("./voteSummary.json");

module.exports = () => {
  if (!voteSummary || !Array.isArray(voteSummary.teams)) return [];

  return [...voteSummary.teams]
    .sort((a, b) => b.teamTotalVotes - a.teamTotalVotes)
    .slice(0, 3);
};