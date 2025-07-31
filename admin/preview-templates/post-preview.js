import CMS from "netlify-cms-app";
import "../src/style/main.css"; // 사이트 CSS 적용

const PostPreview = ({ entry, widgetFor }) => {
  const data = entry.getIn(["data"]).toJS();

  return `
    <div class="main-container post-page">
      <h1 class="post-title">${data.title || "제목 없음"}</h1>
      <p class="post-meta">${data.date || ""}</p>
      <div class="post-body">
        ${widgetFor("body")}
      </div>
    </div>
  `;
};

CMS.registerPreviewTemplate("posts", PostPreview);