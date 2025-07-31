import CMS from "netlify-cms-app";
import PostTemplate from "../src/includes/post.njk"; // 실제 글 레이아웃 파일

const PostPreview = ({ entry }) => {
  return (
    <div class="post-page">
      <h1>{entry.getIn(["data", "title"])}</h1>
      <p>{entry.getIn(["data", "date"])}</p>
      <div>{entry.getIn(["data", "body"])}</div>
    </div>
  );
};

CMS.registerPreviewTemplate("posts", PostPreview);