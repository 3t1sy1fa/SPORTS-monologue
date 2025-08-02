const fs = require("fs");
const fetch = require("node-fetch");

(async () => {
  const res = await fetch("https://api.netlify.com/api/v1/sites/[SITE_ID]/forms/[FORM_ID]/submissions", {
    headers: {
      Authorization: `Bearer ${process.env.NETLIFY_AUTH_TOKEN}`
    }
  });
  const submissions = await res.json();

  const votes = submissions.map(sub => ({
    teamSlug: sub.data.teamSlug || "",
    teamName: sub.data.teamName || "",
    teamTotalVotes: sub.data.teamSlug ? 1 : 0,
    playerSlug: sub.data.playerSlug || "",
    playerName: sub.data.playerName || "",
    playerTeamSlug: sub.data.playerTeamSlug || "",
    playerTotalVotes: sub.data.playerSlug ? 1 : 0
  }));

  // 동일 slug의 표 합산
  const aggregated = votes.reduce((acc, v) => {
    if (v.teamSlug) {
      const key = `team_${v.teamSlug}`;
      acc[key] = acc[key] || {
        teamSlug: v.teamSlug,
        teamName: v.teamName,
        teamTotalVotes: 0,
        playerSlug: "",
        playerName: "",
        playerTeamSlug: "",
        playerTotalVotes: 0
      };
      acc[key].teamTotalVotes++;
    }

    if (v.playerSlug) {
      const key = `player_${v.playerSlug}`;
      acc[key] = acc[key] || {
        teamSlug: "",
        teamName: "",
        teamTotalVotes: 0,
        playerSlug: v.playerSlug,
        playerName: v.playerName,
        playerTeamSlug: v.playerTeamSlug,
        playerTotalVotes: 0
      };
      acc[key].playerTotalVotes++;
    }
    return acc;
  }, {});

  fs.writeFileSync("./src/_data/votes.json", JSON.stringify(Object.values(aggregated), null, 2));
})();