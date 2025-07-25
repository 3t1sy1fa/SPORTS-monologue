module.exports = function (eleventyConfig) {
  // 정적 자산 복사 (스타일, 스크립트, 이미지, 폰트, CMS 등)
  eleventyConfig.addPassthroughCopy("src/style");
  eleventyConfig.addPassthroughCopy("src/scripts");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("admin");

  // posts 컬렉션 등록 (.md 글들을 자동 수집)
  eleventyConfig.addCollection("posts", function (collection) {
    return collection.getFilteredByGlob("src/posts/*.md");
  });

  return {
    dir: {
      input: "src",          // 소스 폴더
      includes: "_includes", // 템플릿 포함 경로
      data: "_data",         // 데이터 경로
      output: "public",      // 최종 결과물 출력 경로
    },
    markdownTemplateEngine: "njk" // Markdown 내부 템플릿 엔진
  };
};