const { google } = require("googleapis");

exports.handler = async () => {
  try {
    const client = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      ["https://www.googleapis.com/auth/spreadsheets.readonly"]
    );
    const sheets = google.sheets({ version: "v4", auth: client });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: "Votes!A2:E500",
    });

    const votes = res.data.values || [];
    const teams = {};
    const players = {};

    votes.forEach(([voterId, targetType, teamSlug, playerSlug]) => {
      if (targetType === "team") {
        teams[teamSlug] = (teams[teamSlug] || 0) + 1;
      }
      if (targetType === "player") {
        players[playerSlug] = (players[playerSlug] || 0) + 1;
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ teams, players }),
    };
  } catch (error) {
    console.error("Get votes error:", error);
    return { statusCode: 500, body: "Internal Server Error" };
  }
};