export async function handleVote(type, slug) {
  const body = {
    targetType: type,
    teamSlug: type === "team" ? slug : "",
    playerSlug: type === "player" ? slug : "",
  };

  const res = await fetch("/.netlify/functions/vote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  alert(data.message);

  // ✅ 투표 후 표 수 업데이트
  await updateVoteCounts();
}

export async function updateVoteCounts() {
  const res = await fetch("/.netlify/functions/getVotes");
  const { teams, players } = await res.json();

  // 팀별 표 수 갱신
  document.querySelectorAll(".team-card").forEach((card) => {
    const slug = card.dataset.slug;
    const countElem = card.querySelector(".vote-count");
    if (countElem) {
      countElem.textContent = `투표 수: ${teams[slug] || 0}표`;
    }
  });

  // 선수 페이지 표 수 갱신
  const playerCountElem = document.querySelector(".player-vote-count");
  if (playerCountElem) {
    const slug = playerCountElem.dataset.slug;
    playerCountElem.textContent = `${players[slug] || 0}표`;
  }
}

// 페이지 로드 시 표 수 불러오기
document.addEventListener("DOMContentLoaded", updateVoteCounts);