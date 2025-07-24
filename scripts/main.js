document.addEventListener("DOMContentLoaded", () => {
  const postList = document.getElementById("post-list");
  if (postList) {
    postList.innerHTML = "<p>작성된 글이 여기에 표시됩니다. (.md 파싱 필요)</p>";
  }
  const preview = document.getElementById("posts");
  if (preview) {
    preview.innerHTML = "<p>최신 글 미리보기 영역입니다.</p>";
  }
});
