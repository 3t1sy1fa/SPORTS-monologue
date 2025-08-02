export async function handleVote(type, slug) {
  try {
    const payload = { targetType: type };
    if (type === "team") payload.teamSlug = slug;
    else payload.playerSlug = slug;

    const res = await fetch("/.netlify/functions/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    alert(data.message);
    location.reload();
  } catch (err) {
    console.error("Vote error:", err);
    alert("투표 중 오류가 발생했습니다.");
  }
}