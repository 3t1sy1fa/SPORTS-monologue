import { handleVote } from "/scripts/voteHandler.js";

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".vote-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.type;
      const slug = btn.dataset.slug;

      if (!type || !slug) {
        console.error("투표 데이터 누락:", { type, slug });
        return;
      }

      handleVote(type, slug);
    });
  });
});