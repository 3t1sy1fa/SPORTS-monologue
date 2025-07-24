document.addEventListener("DOMContentLoaded", () => {
  const posts = [
    {
      title: "[LG] 김영우",
      summary: "LG의 공격 흐름을 바꾼 조용한 변수...",
      url: "#"
    },
    {
      title: "[분석] 임찬규",
      summary: "7월 들어 구원 ERA가 1.50으로 급감한 배경",
      url: "#"
    }
  ];

  const postList = document.getElementById("post-list");

  posts.forEach(post => {
    const div = document.createElement("div");
    div.className = "post";
    div.innerHTML = `<h2><a href="${post.url}">${post.title}</a></h2><p>${post.summary}</p>`;
    postList.appendChild(div);
  });
});
