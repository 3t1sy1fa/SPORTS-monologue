export async function handleVote(type, slug) {
  try {
    const body = {
      targetType: type,
      teamSlug: type === "team" ? slug : "",
      playerSlug: type === "player" ? slug : ""
    };

    const res = await fetch("/.netlify/functions/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "투표 중 오류가 발생했습니다.");
      return;
    }

    alert("✅ 투표가 완료되었습니다!");
    // ✅ Netlify 빌드 트리거 → 최신 votes.json 반영
    await fetch("/.netlify/functions/buildHook", { method: "POST" });
  } catch (error) {
    console.error("투표 처리 오류:", error);
    alert("서버 오류로 투표가 실패했습니다.");
  }
}