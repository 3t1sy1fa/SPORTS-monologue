// scripts/voteHandler.js
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
    alert(data.message || "투표 완료!");

  } catch (error) {
    alert("투표 중 오류가 발생했습니다. 다시 시도해주세요.");
    console.error(error);
  }
}