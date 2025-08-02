export async function handleVote(type, slug) {
  const res = await fetch("/.netlify/functions/vote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      targetType: type,
      teamSlug: type === "team" ? slug : "",
      playerSlug: type === "player" ? slug : "",
    }),
  });

  const data = await res.json();
  alert(data.message);
}