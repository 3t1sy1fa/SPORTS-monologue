// netlify/functions/buildHook.js
// - POST 전용
// - 토큰 검증(쿼리 token 또는 헤더 x-build-token)
// - CORS 지원
// - node-fetch 불필요 (Node 18+ 기본 fetch 사용)

exports.handler = async (event) => {
  try {
    // CORS 프리플라이트
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": process.env.CORS_ORIGIN || "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, X-Build-Token",
          "Access-Control-Max-Age": "86400",
        },
        body: "",
      };
    }

    // 메서드 제한
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    // 토큰 검증
    const url = new URL(event.rawUrl);
    const token =
      url.searchParams.get("token") || event.headers["x-build-token"];
    if (!token || token !== process.env.BUILD_TRIGGER_TOKEN) {
      return { statusCode: 401, body: "Unauthorized" };
    }

    // 환경변수 체크
    const hook = process.env.NETLIFY_BUILD_HOOK;
    if (!hook) {
      return { statusCode: 500, body: "Missing NETLIFY_BUILD_HOOK" };
    }

    // 빌드 트리거
    const res = await fetch(hook, { method: "POST" });
    const text = await res.text();

    const headers = {
      "Access-Control-Allow-Origin": process.env.CORS_ORIGIN || "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    };

    if (!res.ok) {
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({
          message: "Build hook failed",
          status: res.status,
          body: text,
        }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "Rebuild triggered",
        status: res.status,
      }),
    };
  } catch (error) {
    console.error("Build hook error:", error);
    return { statusCode: 500, body: "Build trigger failed" };
  }
};
