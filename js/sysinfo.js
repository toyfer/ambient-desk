/* オフラインで取れる端末情報 */
(function (AD) {
  "use strict";

  function hide(id) {
    var n = AD.$(id);
    if (n) n.style.display = "none";
  }

  function set(id, text) {
    var n = AD.$(id);
    if (n) n.textContent = text;
  }

  function netText() {
    var c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!c) return "";
    var bits = [];
    if (c.effectiveType) bits.push(c.effectiveType);
    if (typeof c.downlink === "number" && isFinite(c.downlink)) bits.push(c.downlink + " Mbps");
    if (c.saveData) bits.push("節約");
    if (typeof c.rtt === "number" && isFinite(c.rtt) && c.rtt > 0) bits.push(c.rtt + " ms");
    return bits.join(" · ");
  }

  function memText() {
    if (typeof navigator.deviceMemory !== "number") return "";
    return navigator.deviceMemory + " GB";
  }

  function screenText() {
    var w = window.screen && screen.width;
    var h = window.screen && screen.height;
    if (!w || !h) return "";
    var dpr = window.devicePixelRatio || 1;
    var out = w + " × " + h;
    if (dpr !== 1) out += " · " + dpr.toFixed(dpr % 1 ? 2 : 0) + "x";
    if (typeof screen.colorDepth === "number") out += " · " + screen.colorDepth + "bit";
    return out;
  }

  function langText() {
    var langs = navigator.languages && navigator.languages.length
      ? navigator.languages.slice(0, 3).join(" / ")
      : (navigator.language || "");
    return langs;
  }

  function tzText() {
    try {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      var off = -new Date().getTimezoneOffset();
      var sign = off >= 0 ? "+" : "−";
      var abs = Math.abs(off);
      var label = "UTC" + sign + AD.pad2(Math.floor(abs / 60)) + ":" + AD.pad2(abs % 60);
      return tz ? tz + " · " + label : label;
    } catch (e) {
      return "";
    }
  }

  function onlineText() {
    return navigator.onLine ? "オンライン" : "オフライン";
  }

  function visText() {
    return document.hidden ? "背面" : "表示中";
  }

  function hwText() {
    if (typeof navigator.hardwareConcurrency !== "number") return "";
    return navigator.hardwareConcurrency + " スレッド";
  }

  function jsHeapText() {
    var m = performance && performance.memory;
    if (!m || typeof m.usedJSHeapSize !== "number") return "";
    var used = m.usedJSHeapSize / 1048576;
    var lim = m.jsHeapSizeLimit / 1048576;
    return used.toFixed(0) + " / " + lim.toFixed(0) + " MB";
  }

  AD.updateSysinfo = function () {
    var net = netText();
    var mem = memText();
    var scr = screenText();
    var lang = langText();
    var tz = tzText();
    var hw = hwText();
    var heap = jsHeapText();
    if (net) set("net", net); else hide("netrow");
    if (mem) set("mem", mem); else hide("memrow");
    if (scr) set("scr", scr); else hide("scrrow");
    if (lang) set("lang", lang); else hide("langrow");
    if (tz) set("tz", tz); else hide("tzrow");
    if (hw) set("hw", hw); else hide("hwrow");
    if (heap) set("heap", heap); else hide("heaprow");
    set("online", onlineText());
    set("vis", visText());
  };

  AD.initSysinfo = function () {
    AD.updateSysinfo();
    window.addEventListener("online", AD.updateSysinfo);
    window.addEventListener("offline", AD.updateSysinfo);
    document.addEventListener("visibilitychange", AD.updateSysinfo);
    var c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (c && c.addEventListener) c.addEventListener("change", AD.updateSysinfo);
  };
}(window.AD = window.AD || {}));
