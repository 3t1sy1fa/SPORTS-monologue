export async function handleVote(type, slug) {
  try {
    const res = await fetch("/.netlify/functions/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetType: type,
        ...(type === "team" ? { teamSlug: slug } : { playerSlug: slug }),
      }),
    });

    const data = await res.json();
    alert(data.message || "투표가 완료되었습니다.");

    // ✅ 투표 후 페이지 새로고침
    if (res.ok) {
      window.location.reload();
    }
  } catch (err) {
    console.error("투표 중 오류 발생:", err);
    alert("투표 중 오류가 발생했습니다.");
  }
}