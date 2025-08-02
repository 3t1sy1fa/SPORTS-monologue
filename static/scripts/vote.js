document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll(".vote-form");

  forms.forEach(form => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const teamSlug = form.dataset.team;

      const res = await fetch("/.netlify/functions/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetType: "team",
          teamSlug,
        }),
      });

      const data = await res.json();
      alert(data.message);

      // ✅ Netlify 빌드 트리거
      await fetch("/.netlify/functions/buildHook", { method: "POST" });
    });
  });
});