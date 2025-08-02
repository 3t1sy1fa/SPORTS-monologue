const fetch = require("node-fetch");

exports.handler = async () => {
  try {
    const res = await fetch(process.env.NETLIFY_BUILD_HOOK, { method: "POST" });
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Rebuild triggered", status: res.status }),
    };
  } catch (error) {
    console.error("Build hook error:", error);
    return { statusCode: 500, body: "Build trigger failed" };
  }
};