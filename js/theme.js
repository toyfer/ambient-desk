/* 配色テーマ。config.theme で切替、config.colors で上書き */
(function (AD) {
  "use strict";

  AD.THEMES = {
    "ayu-mirage": {
      bg: "#1f2430",
      fg: "#cccac2",
      fg2: "#cccac2cc",
      muted: "#707a8c",
      line: "#707a8c33",
      glassA: "#171b24cc",
      glassB: "#1f2430b8",
      accent: "#ffcc66",
      hol: "#f28779",
      sun: "#f28779",
      sat: "#73d0ff",
      func: "#5ccfe6",
      str: "#d5ff80",
      today: "#ffcc66",
      todayInk: "#1f2430",
      bar: "#73d0ff",
      bar2: "#ffcc66"
    },
    "ayu-dark": {
      bg: "#0b0e14",
      fg: "#bfbdb6",
      fg2: "#bfbdb6cc",
      muted: "#565b66",
      line: "#565b6633",
      glassA: "#0d1017cc",
      glassB: "#0b0e14b8",
      accent: "#e6b450",
      hol: "#f07178",
      sun: "#f07178",
      sat: "#59c2ff",
      func: "#39bae6",
      str: "#aad94c",
      today: "#e6b450",
      todayInk: "#0b0e14",
      bar: "#59c2ff",
      bar2: "#e6b450"
    },
    "ayu-light": {
      bg: "#f8f9fa",
      fg: "#5c6166",
      fg2: "#5c6166cc",
      muted: "#8a9199",
      line: "#8a919933",
      glassA: "#fcfcfce6",
      glassB: "#f8f9fad4",
      accent: "#f2ae49",
      hol: "#f07171",
      sun: "#f07171",
      sat: "#399ee6",
      func: "#55b4d4",
      str: "#86b300",
      today: "#f2ae49",
      todayInk: "#5c6166",
      bar: "#399ee6",
      bar2: "#f2ae49"
    }
  };

  function hexToRgb(hex) {
    var h = String(hex || "").replace("#", "");
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    if (h.length === 8) h = h.slice(0, 6);
    var n = parseInt(h, 16);
    if (!isFinite(n)) return [31, 36, 48];
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function rgbToHex(r, g, b) {
    function p(v) {
      v = Math.max(0, Math.min(255, Math.round(v)));
      return ("0" + v.toString(16)).slice(-2);
    }
    return "#" + p(r) + p(g) + p(b);
  }

  function mix(a, b, t) {
    var A = hexToRgb(a), B = hexToRgb(b);
    return rgbToHex(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t);
  }

  function lum(hex) {
    var c = hexToRgb(hex);
    return (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255;
  }

  AD.hexToRgb = hexToRgb;
  AD.mixHex = mix;
  AD.lumHex = lum;

  AD.applyTheme = function (cfg) {
    cfg = cfg || window.AD_CONFIG || {};
    var name = cfg.theme || "ayu-mirage";
    var base = AD.THEMES[name] || AD.THEMES["ayu-mirage"];
    var over = cfg.colors || {};
    var t = {};
    var k;
    for (k in base) if (Object.prototype.hasOwnProperty.call(base, k)) t[k] = base[k];
    for (k in over) if (Object.prototype.hasOwnProperty.call(over, k) && over[k]) t[k] = over[k];
    AD._theme = t;
    var root = document.documentElement;
    root.style.setProperty("--bg", t.bg);
    root.style.setProperty("--fg", t.fg);
    root.style.setProperty("--fg2", t.fg2);
    root.style.setProperty("--muted", t.muted);
    root.style.setProperty("--line", t.line);
    root.style.setProperty("--glassA", t.glassA);
    root.style.setProperty("--glassB", t.glassB);
    root.style.setProperty("--accent", t.accent);
    root.style.setProperty("--hol", t.hol);
    root.style.setProperty("--sun", t.sun);
    root.style.setProperty("--sat", t.sat);
    root.style.setProperty("--func", t.func);
    root.style.setProperty("--str", t.str);
    root.style.setProperty("--today", t.today);
    root.style.setProperty("--todayInk", t.todayInk);
    root.style.setProperty("--bar", t.bar);
    root.style.setProperty("--bar2", t.bar2);
    document.body.style.background = t.bg;
    document.body.classList.toggle("light", lum(t.bg) > 0.55);
  };
}(window.AD = window.AD || {}));
