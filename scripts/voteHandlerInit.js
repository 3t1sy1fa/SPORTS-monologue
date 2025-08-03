import { handleVote } from "/scripts/voteHandler.js";

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".vote-btn").forEach((btn) => {
    // ✅ 같은 버튼에 중복으로 이벤트가 붙는 걸 방지
    btn.removeEventListener("click", handleClick);
    btn.addEventListener("click", handleClick);
  });
});

function handleClick(event) {
  const btn = event.currentTarget;
  const type = btn.dataset.type;
  const slug = btn.dataset.slug;

  if (!type || !slug) {
    console.error("❌ 투표 데이터 누락:", { type, slug });
    alert("투표 데이터를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.");
    return;
  }

  // ✅ 버튼 중복 클릭 방지
  btn.disabled = true;
  btn.textContent = "투표 중...";

  handleVote(type, slug)
    .finally(() => {
      btn.disabled = false;
      btn.textContent = "이 항목에 투표하기";
    });
}