document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("topicSelect");
  const posts = document.querySelectorAll(".post-item");

  if (select) {
    select.addEventListener("change", () => {
      const selectedTopic = select.value;

      posts.forEach(post => {
        if (selectedTopic === "all" || post.dataset.topic === selectedTopic) {
          post.style.display = "block";
        } else {
          post.style.display = "none";
        }
      });
    });
  }
});