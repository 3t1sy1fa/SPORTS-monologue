// netlify/functions/vote.js
const { google } = require("googleapis");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { targetType, teamSlug, playerSlug } = JSON.parse(event.body);

    if (!targetType || (targetType === "player" && !playerSlug) || (targetType === "team" && !teamSlug)) {
      return { statusCode: 400, body: "Invalid vote payload" };
    }

    // ✅ Google Sheets 인증
    const client = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      ["https://www.googleapis.com/auth/spreadsheets"]
    );

    const sheets = google.sheets({ version: "v4", auth: client });

    // ✅ 투표 데이터 시트에 추가
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: "votes!A:E",
      valueInputOption: "RAW",
      requestBody: {
        values: [
          [
            new Date().toISOString(),
            targetType,
            teamSlug || "",
            playerSlug || "",
            event.headers["x-nf-client-connection-ip"] || "unknown",
          ],
        ],
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "투표가 완료되었습니다." }),
    };
  } catch (error) {
    console.error("Vote save error:", error);
    return { statusCode: 500, body: "Internal Server Error" };
  }
};