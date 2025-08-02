module.exports = function(data) {
  const leagueSchedule = data.leagueSchedule || [];
  return function(slug) {
    return leagueSchedule.filter(
      game => game.homeSlug === slug || game.awaySlug === slug
    );
  };
};