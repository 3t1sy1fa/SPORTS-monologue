// src/scripts/voteHandler.js
export async function handleVote(type, slug) {
  try {
    if (!type || !slug) {
      console.error("❌ 투표 데이터 누락:", { type, slug });
      alert("투표 정보를 불러오는 데 문제가 발생했습니다.");
      return;
    }

    const res = await fetch("/.netlify/functions/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetType: type,
        teamSlug: type === "team" ? slug : "",
        playerSlug: type === "player" ? slug : "",
      }),
    });

    if (!res.ok) {
      throw new Error(`서버 오류: ${res.status}`);
    }

    const data = await res.json();
    alert(data.message || "투표가 완료되었습니다. 결과는 잠시 후 반영됩니다");
  } catch (error) {
    console.error("❌ 투표 요청 중 오류:", error);
    alert("투표 중 문제가 발생했습니다. 다시 시도해 주세요.");
  }
}