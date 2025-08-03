const votes = require("./votes.json");

module.exports = () => {
  // 원본 객체를 그대로 쓰지 않고, 매번 복사본을 만들어 반환
  return {
    teams: Array.isArray(votes.teams) 
      ? votes.teams.map(team => ({ ...team })) 
      : [],
    players: Array.isArray(votes.players) 
      ? votes.players.map(player => ({ ...player })) 
      : [],
  };
};