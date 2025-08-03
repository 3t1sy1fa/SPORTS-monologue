import { handleVote } from "/scripts/voteHandler.js";

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".vote-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      handleVote(btn.dataset.type, btn.dataset.slug);
    });
  });
});