<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <title>소개 | Sports Monologue</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link href="https://cdn.jsdelivr.net/gh/spoqa/spoqa-han-sans/css/SpoqaHanSansNeo.css" rel="stylesheet" />
  <link rel="stylesheet" href="/style/main.css" />
</head>
<body>
  <header id="site-header"></header>

  <main class="main-container">
    <h1>Sports Monologue 소개</h1>
    <p>이 사이트는 "경기 그 이상을 보기 위해, 경영의 언어로 스포츠를 말하다"라는 철학 아래 운영됩니다.</p>
    <p>경기 내용을 콘텐츠로 분석하고, 그것을 다시 경영의 관점에서 해석함으로써 KBO와 야구 산업의 전략적 사고를 키우고자 합니다.</p>
    <p>운영자: 소율<br/>
       전공 지향: 스포츠 매니지먼트, 마케팅, 전력 분석<br/>
       최애 구단: LG 트윈스</p>
  </main>

  <footer id="site-footer"></footer>

  <script>
    fetch("/components/header.html")
      .then(res => res.text())
      .then(html => document.getElementById("site-header").innerHTML = html);

    fetch("/components/footer.html")
      .then(res => res.text())
      .then(html => document.getElementById("site-footer").innerHTML = html);
  </script>
</body>
</html>
