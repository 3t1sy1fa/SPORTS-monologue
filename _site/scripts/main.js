// 임시 목록 (Netlify CMS 글 slug 기준 링크 생성)
const postListEl = document.getElementById("post-list");

const dummyPosts = [
  {
    title: "임찬규 복귀전 분석",
    category: "선수 분석",
    date: "2025-07-24",
    excerpt: "5이닝 무실점, 회복된 커맨드와 새로운 투구 패턴의 가능성...",
    slug: "2025-07-24-imchangyu-review"
  },
  {
    title: "LG vs SSG 주중 3연전 총평",
    category: "경기 분석",
    date: "2025-07-20",
    excerpt: "LG 트윈스의 주중 3연전 흐름, 불펜 운용 변화, 상반기 마무리 전략...",
    slug: "2025-07-20-lg-ssg-review"
  }
];

dummyPosts.forEach(post => {
  const el = document.createElement("div");
  el.className = "post-item";
  el.innerHTML = `
    <h4><a href="posts/${post.slug}/index.html">${post.title}</a></h4>
    <p><strong>${post.category}</strong> · ${post.date}</p>
    <p>${post.excerpt}</p>
  `;
  postListEl.appendChild(el);
});
