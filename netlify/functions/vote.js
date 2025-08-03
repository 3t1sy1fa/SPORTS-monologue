const { google } = require("googleapis");
const fetch = require("node-fetch");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { targetType, teamSlug, playerSlug } = JSON.parse(event.body);

    // ✅ Validation
    const validTypes = ["player", "team"];
    if (!validTypes.includes(targetType)) {
      return { statusCode: 400, body: "Invalid target type" };
    }
    if ((targetType === "player" && !playerSlug) || 
        (targetType === "team" && !teamSlug)) {
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

    // ✅ 시트에 새로운 투표 추가
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: "Votes!A:E", // 실제 열 개수와 맞추기
      valueInputOption: "RAW",
      requestBody: {
        values: [
          [
            Date.now().toString(),        // voterId
            targetType,                   // targetType
            teamSlug || "",                // teamSlug
            playerSlug || "",              // playerSlug
            new Date().toISOString()       // timestamp
          ],
        ],
      },
    });

    // ✅ Build Hook 호출 → 사이트 리빌드
    if (process.env.NETLIFY_BUILD_HOOK) {
      const res = await fetch(process.env.NETLIFY_BUILD_HOOK, { method: "POST" });
      if (!res.ok) {
        console.error("Build hook failed:", res.status, await res.text());
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "투표가 완료되었습니다." }),
    };
  } catch (error) {
    console.error("❌ Vote error:", error);
    return { statusCode: 500, body: "Internal Server Error" };
  }
};