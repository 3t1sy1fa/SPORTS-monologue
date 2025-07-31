import CMS from "netlify-cms-app";
import "../../style/main.css"; // 사이트 스타일 적용

const PostPreview = ({ entry }) => {
  const title = entry.getIn(["data", "title"]);
  const category = entry.getIn(["data", "category"]);
  const body = entry.getIn(["data", "body"]);

  return `
    <main class="post-page">
      <h1 class="post-title">${title}</h1>
      <p class="post-category">[${category}]</p>
      <div class="post-body">${body}</div>
    </main>
  `;
};

const LogPreview = ({ entry }) => {
  const title = entry.getIn(["data", "title"]);
  const category = entry.getIn(["data", "category"]);
  const body = entry.getIn(["data", "body"]);

  return `
    <main class="log-container">
      <h2>${title}</h2>
      <p class="log-post-category">[${category}]</p>
      <div class="log-post-desc">${body}</div>
    </main>
  `;
};

const TeamAnalysisPreview = ({ entry }) => {
  const title = entry.getIn(["data", "title"]);
  const category = entry.getIn(["data", "category"]);
  const body = entry.getIn(["data", "body"]);

  return `
    <main class="team-analysis">
      <h1>${title}</h1>
      <p>팀: ${category}</p>
      <div class="team-body">${body}</div>
    </main>
  `;
};

CMS.registerPreviewTemplate("posts", PostPreview);
CMS.registerPreviewTemplate("log", LogPreview);
CMS.registerPreviewTemplate("teamAnalysis", TeamAnalysisPreview);