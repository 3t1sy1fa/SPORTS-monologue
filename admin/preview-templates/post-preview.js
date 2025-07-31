import CMS from "netlify-cms-app";
import "../../style/main.css";

const PostPreview = ({ entry }) => {
  const title = entry.getIn(["data", "title"]);
  const category = entry.getIn(["data", "category"]);
  const body = entry.getIn(["data", "body"]);

  return `
    <body>
      <header class="main-header">
        <div class="logo-box">
          <a href="/" class="logo">SPORTS / Monologue</a>
        </div>
        <nav class="nav-menu">
          <ul>
            <li><a href="/players">선수분석</a></li>
            <li><a href="/teams">구단분석</a></li>
            <li><a href="/games">경기분석</a></li>
            <li><a href="/about">소개</a></li>
            <li><a href="/contact">문의</a></li>
          </ul>
        </nav>
      </header>

      <main class="post-page">
        <h1 class="post-title">${title}</h1>
        <p class="post-category">[${category}]</p>
        <div class="post-body">${body}</div>
      </main>

      <footer class="site-footer">
        © 2025 Sports Monologue. All rights reserved.
      </footer>
    </body>
  `;
};

CMS.registerPreviewTemplate("posts", PostPreview);