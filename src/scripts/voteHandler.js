// src/scripts/voteHandler.js
export async function handleVote(type, slug) {
  try {
    const res = await fetch("/.netlify/functions/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetType: type,
        teamSlug: type === "team" ? slug : "",
        playerSlug: type === "player" ? slug : "",
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "투표 중 오류가 발생했습니다.");
    } else {
      alert(data.message || "투표가 완료되었습니다!");
      location.reload(); // ✅ 새로고침해서 실시간 반영
    }
  } catch (error) {
    alert("서버 오류가 발생했습니다. 다시 시도해주세요.");
    console.error(error);
  }
}