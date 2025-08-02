// buildHook.js
const fetch = require("node-fetch");

exports.handler = async () => {
  const res = await fetch(process.env.NETLIFY_BUILD_HOOK, { method: "POST" });
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Rebuild triggered", status: res.status }),
  };
};