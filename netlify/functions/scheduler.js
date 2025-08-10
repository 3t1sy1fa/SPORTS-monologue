// netlify/functions/scheduler.js
// Netlify Scheduled Function이 매일 정해진 시각(UTC)으로 실행
// 내부에서 빌드 훅 POST 호출

exports.handler = async () => {
  try {
    const hook = process.env.NETLIFY_BUILD_HOOK;
    if (!hook) {
      return { statusCode: 500, body: "Missing NETLIFY_BUILD_HOOK" };
    }

    const res = await fetch(hook, { method: "POST" });
    if (!res.ok) {
      const text = await res.text();
      return {
        statusCode: 502,
        body: JSON.stringify({
          message: "Scheduled build hook failed",
          status: res.status,
          body: text,
        }),
      };
    }

    return { statusCode: 200, body: "Scheduled rebuild triggered" };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: "Scheduler failed" };
  }
};
