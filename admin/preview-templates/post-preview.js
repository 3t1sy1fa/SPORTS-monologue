import CMS from "netlify-cms-app";
import "../style/main.css"; // CSS를 미리보기에도 적용

const PostPreview = ({ entry }) => {
  const title = entry.getIn(["data", "title"]);
  const category = entry.getIn(["data", "category"]);
  const body = entry.getIn(["data", "body"]);

  return `
    <main class="post-page">
      <h1 class="post-title">${title}</h1>
      <p class="post-category">[${category}]</p>
      <article class="post-body">${body}</article>
    </main>
  `;
};

CMS.registerPreviewTemplate("posts", PostPreview);