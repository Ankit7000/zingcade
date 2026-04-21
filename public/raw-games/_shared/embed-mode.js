(function () {
  const params = new URLSearchParams(window.location.search);

  if (params.get("embed") !== "1") {
    return;
  }

  const EMBED_MESSAGE = "zingcade:embed-size";
  let rafId = 0;

  function applyEmbedClasses() {
    document.documentElement.classList.add("embed-mode");
    if (document.body) {
      document.body.classList.add("embed-mode");
    }
  }

  function getSlug() {
    const parts = window.location.pathname.split("/").filter(Boolean);
    const rawGamesIndex = parts.indexOf("raw-games");
    return rawGamesIndex >= 0 ? parts[rawGamesIndex + 1] || "" : "";
  }

  function postSize() {
    applyEmbedClasses();

    if (window.parent === window) {
      return;
    }

    const doc = document.documentElement;
    const body = document.body;
    const height = Math.max(
      doc ? Math.ceil(doc.scrollHeight) : 0,
      body ? Math.ceil(body.scrollHeight) : 0
    );

    window.parent.postMessage(
      {
        type: EMBED_MESSAGE,
        slug: getSlug(),
        height,
      },
      window.location.origin
    );
  }

  function schedulePostSize() {
    window.cancelAnimationFrame(rafId);
    rafId = window.requestAnimationFrame(postSize);
  }

  applyEmbedClasses();
  document.addEventListener("DOMContentLoaded", schedulePostSize);
  window.addEventListener("load", schedulePostSize);
  window.addEventListener("resize", schedulePostSize);
  window.addEventListener("orientationchange", schedulePostSize);
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) {
      schedulePostSize();
    }
  });

  if ("ResizeObserver" in window) {
    const resizeObserver = new ResizeObserver(schedulePostSize);
    resizeObserver.observe(document.documentElement);

    if (document.body) {
      resizeObserver.observe(document.body);
    } else {
      document.addEventListener("DOMContentLoaded", function () {
        if (document.body) {
          resizeObserver.observe(document.body);
        }
      });
    }
  }

  if ("MutationObserver" in window) {
    const mutationObserver = new MutationObserver(schedulePostSize);
    document.addEventListener("DOMContentLoaded", function () {
      if (document.body) {
        mutationObserver.observe(document.body, {
          attributes: true,
          childList: true,
          subtree: true,
        });
      }
    });
  }
})();
