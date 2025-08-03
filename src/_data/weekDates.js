const leagueSchedule = require("./leagueSchedule.json");
const moment = require("moment");

module.exports = () => {
  if (!leagueSchedule || !Array.isArray(leagueSchedule)) return [];

  const weekStart = moment().startOf("week").add(1, "day"); // 월요일
  const weekEnd = moment(weekStart).add(6, "days"); // 일요일

  // 7일 기준 배열 생성
  const days = [];
  for (let i = 0; i < 7; i++) {
    const date = moment(weekStart).add(i, "days").format("YYYY-MM-DD");
    const games = leagueSchedule.filter((g) => g.date === date);
    days.push({ date, games });
  }

  return days;
};