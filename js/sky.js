/* 時間帯で明るさが変わる背景 */
(function (AD) {
  "use strict";

  function hexRgb(hex) {
    return AD.hexToRgb ? AD.hexToRgb(hex) : [31, 36, 48];
  }

  function rgba(hex, a) {
    var c = hexRgb(hex);
    return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")";
  }

  function dayFactor(h) {
    if (h < 5 || h >= 20.5) return 0;
    if (h < 7.5) return (h - 5) / 2.5;
    if (h < 16.5) return 1;
    if (h < 20.5) return (20.5 - h) / 4;
    return 0;
  }

  function paint(h) {
    var t = AD._theme || {};
    var bg = t.bg || "#1f2430";
    var accent = t.accent || "#ffcc66";
    var func = t.func || "#5ccfe6";
    var sat = t.sat || "#73d0ff";
    var hol = t.hol || "#f28779";
    var str = t.str || "#d5ff80";
    var f = dayFactor(h);
    var night = 1 - f;
    var light = AD.lumHex ? AD.lumHex(bg) > 0.55 : false;
    var lift = light ? 0.06 : 0.22;
    var dayBg = AD.mixHex ? AD.mixHex(bg, "#ffffff", lift * f) : bg;
    var sky = AD.$("sky");
    if (sky) {
      sky.style.background =
        "radial-gradient(120% 90% at 50% " + (18 + night * 70) + "%, " +
        rgba(accent, 0.08 + f * 0.22) + " 0%, " +
        rgba(func, 0.04 + f * 0.10) + " 36%, " +
        dayBg + " 72%)";
    }
    var glow = AD.$("sunglow");
    if (glow) {
      var y = (1 - Math.sin(Math.max(0, Math.min(1, (h - 5.5) / 13)) * Math.PI)) * 42 - 8;
      glow.style.transform = "translateY(" + y.toFixed(1) + "vh)";
      glow.style.opacity = (0.12 + f * 0.72).toFixed(2);
      glow.style.background =
        "radial-gradient(circle, " + rgba(accent, 0.18 + f * 0.28) + ", " +
        rgba(hol, 0.05 + f * 0.08) + " 34%, rgba(0,0,0,0) 64%)";
    }
    var b1 = document.querySelector(".b1");
    var b2 = document.querySelector(".b2");
    var b3 = document.querySelector(".b3");
    if (b1) {
      b1.style.opacity = (0.35 + f * 0.55).toFixed(2);
      b1.style.background = "radial-gradient(circle, " + rgba(sat, 0.16 + f * 0.28) + ", rgba(0,0,0,0) 68%)";
    }
    if (b2) {
      b2.style.opacity = (0.22 + night * 0.45).toFixed(2);
      b2.style.background = "radial-gradient(circle, " + rgba(hol, 0.12 + night * 0.18) + ", rgba(0,0,0,0) 68%)";
    }
    if (b3) {
      b3.style.opacity = (0.18 + f * 0.28).toFixed(2);
      b3.style.background = "radial-gradient(circle, " + rgba(str, 0.10 + f * 0.16) + ", rgba(0,0,0,0) 70%)";
    }
    var vig = document.querySelector(".vignette");
    if (vig) {
      vig.style.opacity = (0.35 + night * 0.45).toFixed(2);
    }
  }

  AD.initSky = function () {
    paint(new Date().getHours() + new Date().getMinutes() / 60);
  };

  AD.updateAmbient = function () {
    var now = new Date();
    paint(now.getHours() + now.getMinutes() / 60);
  };

  AD.setSkyMotion = function () {};
}(window.AD = window.AD || {}));
