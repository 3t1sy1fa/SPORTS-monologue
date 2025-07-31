document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".log-nav button");
  const posts = document.querySelectorAll(".log-post");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const topic = button.dataset.topic;

      // 버튼 활성화 표시
      buttons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      // 글 필터링
      posts.forEach(post => {
        if (topic === "all" || post.dataset.topic === topic) {
          post.style.display = "block";
        } else {
          post.style.display = "none";
        }
      });
    });
  });
});