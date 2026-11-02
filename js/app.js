/* 起動・タイマー。操作は js/config.js を編集する */
(function (AD) {
  "use strict";

  var lastDay = -1;
  var cfg = window.AD_CONFIG || {};

  function applyConfig() {
    var glass = cfg.glass !== false;
    var motion = cfg.motion !== false;
    var taskbar = Number(cfg.taskbar);
    if (!isFinite(taskbar) || taskbar < 0) taskbar = 56;
    var lat = Number(cfg.lat);
    var lon = Number(cfg.lon);
    if (isFinite(lat)) AD.LAT = lat;
    if (isFinite(lon)) AD.LON = lon;

    if (AD.applyTheme) AD.applyTheme(cfg);

    document.body.classList.toggle("no-glass", !glass);
    document.body.classList.toggle("paused", !motion);
    document.documentElement.style.setProperty("--taskbar", taskbar + "px");

    var blobs = document.querySelectorAll(".blob");
    for (var i = 0; i < blobs.length; i++) {
      blobs[i].style.animationPlayState = motion ? "running" : "paused";
    }
    if (AD.setSkyMotion) AD.setSkyMotion(motion);
  }

  function tick() {
    var now = new Date();
    AD.updateClock();
    if (now.getDate() !== lastDay) {
      lastDay = now.getDate();
      AD.buildCalendar();
      AD.renderHolidays();
      AD.updateDayInfo();
    }
  }

  AD.boot = function () {
    applyConfig();
    AD.initSky();
    AD.initWorld();
    AD.initBattery();
    if (AD.initSysinfo) AD.initSysinfo();
    AD.buildCalendar();
    AD.renderHolidays();
    AD.updateDayInfo();
    AD.updateAmbient();
    tick();

    setInterval(tick, 1000);
    setInterval(AD.updateAmbient, 60000);
    setInterval(AD.updateDayInfo, 600000);
    if (AD.updateSysinfo) setInterval(AD.updateSysinfo, 15000);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", AD.boot);
  } else {
    AD.boot();
  }
}(window.AD = window.AD || {}));
