// netlify/functions/scheduler.js
export async function handler() {
  try {
    const response = await fetch("https://api.netlify.com/build_hooks/XXXXXX", {
      method: "POST",
    });
    if (!response.ok) throw new Error("Failed to trigger build");

    return {
      statusCode: 200,
      body: "✅ Daily build triggered successfully!",
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: `❌ Error: ${error.message}`,
    };
  }
}