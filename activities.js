(function () {
  const feedEl = document.getElementById("activities-feed");
  const statusEl = document.getElementById("activities-status");
  if (!feedEl) return;

  function showStatus(html, visible) {
    if (!statusEl) return;
    statusEl.innerHTML = html;
    statusEl.style.display = visible ? "block" : "none";
  }

  function formatDate(iso) {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return iso;
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function messageToHtml(message) {
    if (!message) return "<p><em>Photo update</em></p>";
    const parts = message.trim().split(/\n+/).filter(Boolean);
    return parts.map((p) => "<p>" + escapeHtml(p) + "</p>").join("");
  }

  function renderPosts(data) {
    const posts = data.posts || [];

    if (!posts.length) {
      feedEl.innerHTML = "";
      showStatus(
        "<p><strong>Waiting for Facebook connection.</strong></p>" +
          "<p>When you can log in to Facebook, add the GitHub secret <code>FB_PAGE_ACCESS_TOKEN</code> (Page access token), then run <em>Actions → Fetch Facebook Posts</em>.</p>" +
          "<p>Page ID defaults to <code>61591944000616</code>. Until then, visit the " +
          "<a href=\"https://www.facebook.com/people/Inner-Wheel-Club-of-Dagupan-East-District-379/61591944000616/\" target=\"_blank\" rel=\"noopener\">official Facebook page</a>.</p>",
        true
      );
      return;
    }

    showStatus("", false);
    feedEl.innerHTML = posts
      .map((post) => {
        const images = post.images || [];
        const imgHtml = images.length
          ? `<div class="fb-post-image"><img src="${escapeHtml(images[0])}" alt="Activity photo" loading="lazy" referrerpolicy="no-referrer" /></div>`
          : `<div class="fb-post-image logo-only"><img src="public/iwcde-logo.png" alt="Inner Wheel Club of Dagupan East" /></div>`;

        const link = post.permalink_url
          ? `<a href="${escapeHtml(post.permalink_url)}" target="_blank" rel="noopener">View on Facebook</a>`
          : "";

        return `
          <article class="fb-post">
            <div class="fb-post-header">
              <div class="fb-avatar">IW</div>
              <div class="fb-meta">
                <strong>Inner Wheel Club of Dagupan East District 379</strong>
                <span class="fb-date">${escapeHtml(formatDate(post.created_time))}</span>
              </div>
            </div>
            ${imgHtml}
            <div class="fb-post-body">
              ${messageToHtml(post.message)}
            </div>
            <div class="fb-post-footer">
              ${link}
            </div>
          </article>`;
      })
      .join("");
  }

  showStatus("<p>Loading recent activities…</p>", true);

  fetch("data/posts.json?t=" + Date.now())
    .then((r) => {
      if (!r.ok) throw new Error("Could not load posts.json");
      return r.json();
    })
    .then((data) => renderPosts(data))
    .catch(() => {
      feedEl.innerHTML = "";
      showStatus(
        "<p><strong>Could not load activity data.</strong> Open the " +
          "<a href=\"https://www.facebook.com/people/Inner-Wheel-Club-of-Dagupan-East-District-379/61591944000616/\" target=\"_blank\" rel=\"noopener\">Facebook page</a> meanwhile.</p>",
        true
      );
    });
})();
