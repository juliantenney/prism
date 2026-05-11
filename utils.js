// Utility helpers shared across the app.
// Exposed on window.Utils for simple access without modules.

(function () {
  "use strict";

  /**
   * Generate a RFC4122-ish v4 UUID.
   * Collisions are extremely unlikely for this usage.
   */
  function uuid() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // Fallback implementation using random numbers.
    const hex = [];
    for (let i = 0; i < 256; i++) {
      hex[i] = (i + 0x100).toString(16).substring(1);
    }
    const r = new Uint8Array(16);
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      crypto.getRandomValues(r);
    } else {
      for (let i = 0; i < 16; i++) {
        r[i] = Math.floor(Math.random() * 256);
      }
    }
    r[6] = (r[6] & 0x0f) | 0x40;
    r[8] = (r[8] & 0x3f) | 0x80;
    return (
      hex[r[0]] +
      hex[r[1]] +
      hex[r[2]] +
      hex[r[3]] +
      "-" +
      hex[r[4]] +
      hex[r[5]] +
      "-" +
      hex[r[6]] +
      hex[r[7]] +
      "-" +
      hex[r[8]] +
      hex[r[9]] +
      "-" +
      hex[r[10]] +
      hex[r[11]] +
      hex[r[12]] +
      hex[r[13]] +
      hex[r[14]] +
      hex[r[15]]
    );
  }

  /**
   * Debounce wrapper: postpone invocation until no calls occur for ms.
   */
  function debounce(fn, ms) {
    let timer = null;
    return function debounced(...args) {
      const ctx = this;
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(function () {
        timer = null;
        fn.apply(ctx, args);
      }, ms);
    };
  }

  /**
   * Format a timestamp into a readable local date/time string.
   */
  function formatDate(ts) {
    if (!ts) return "—";
    try {
      const d = new Date(ts);
      return d.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return "—";
    }
  }

  /**
   * Copy the provided text to the clipboard where supported.
   * Resolves true on success, false otherwise.
   */
  function copyText(str) {
    if (!str) return Promise.resolve(false);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard
        .writeText(str)
        .then(function () {
          return true;
        })
        .catch(function () {
          return false;
        });
    }
    // Fallback using a hidden textarea.
    return new Promise(function (resolve) {
      const ta = document.createElement("textarea");
      ta.value = str;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      ta.style.top = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        const ok = document.execCommand("copy");
        resolve(ok);
      } catch (e) {
        resolve(false);
      } finally {
        document.body.removeChild(ta);
      }
    });
  }

  window.Utils = {
    uuid: uuid,
    debounce: debounce,
    formatDate: formatDate,
    copyText: copyText
  };
})();

