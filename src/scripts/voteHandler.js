// ✅ voteHandler.js
export async function handleVote(targetType, slug) {
  try {
    const res = await fetch("/.netlify/functions/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetType,
        ...(targetType === "player" ? { playerSlug: slug } : { teamSlug: slug }),
      }),
    });

    const data = await res.json();
    alert(data.message);
  } catch (error) {
    alert("투표 중 오류가 발생했습니다.");
    console.error(error);
  }
}