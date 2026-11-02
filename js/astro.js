/* 天文計算
   日の出・日の入り・南中・薄明: NOAA 近似式
   月齢: 朔望月
   二十四節気: 太陽黄経 15° 刻み
   観測地点は AD.LAT / AD.LON（config.js から上書き） */
(function (AD) {
  "use strict";

  AD.LAT = 35.6895;
  AD.LON = 139.6917;

  var RAD = Math.PI / 180;
  var SYNODIC = 29.530588853;
  var NEW_MOON_REF = Date.UTC(2000, 0, 6, 18, 14);

  function solarParams(date) {
    var start = new Date(date.getFullYear(), 0, 0);
    var doy = Math.floor((date - start) / 86400000);
    var hh = date.getHours() + date.getMinutes() / 60;
    var g = (2 * Math.PI / 365) * (doy - 1 + (hh - 12) / 24);
    var eq = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g)
          - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
    var decl = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g)
          - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g)
          - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
    return { eq: eq, decl: decl };
  }

  function eventMinutes(date, zenithDeg, rising) {
    var p = solarParams(date);
    var lat = AD.LAT * RAD;
    var zen = zenithDeg * RAD;
    var cosH = (Math.cos(zen) - Math.sin(lat) * Math.sin(p.decl)) /
               (Math.cos(lat) * Math.cos(p.decl));
    cosH = Math.max(-1, Math.min(1, cosH));
    var ha = Math.acos(cosH) / RAD;
    var tz = -date.getTimezoneOffset();
    var utc = rising
      ? 720 - 4 * (AD.LON + ha) - p.eq
      : 720 - 4 * (AD.LON - ha) - p.eq;
    return ((utc + tz) % 1440 + 1440) % 1440;
  }

  AD.sunTimes = function (date) {
    var p = solarParams(date);
    var tz = -date.getTimezoneOffset();
    var noon = ((720 - 4 * AD.LON - p.eq + tz) % 1440 + 1440) % 1440;
    var alt = Math.asin(
      Math.sin(AD.LAT * RAD) * Math.sin(p.decl) +
      Math.cos(AD.LAT * RAD) * Math.cos(p.decl)
    ) / RAD;
    return {
      rise: eventMinutes(date, 90.833, true),
      set: eventMinutes(date, 90.833, false),
      civilRise: eventMinutes(date, 96, true),
      civilSet: eventMinutes(date, 96, false),
      noon: noon,
      alt: alt
    };
  };

  AD.moonAge = function (date) {
    var days = (date.getTime() - NEW_MOON_REF) / 86400000;
    var a = days % SYNODIC;
    return a < 0 ? a + SYNODIC : a;
  };

  var MOON_NAMES = [
    [0, "新月"], [3.7, "三日月"], [7.4, "上弦の月"], [11.1, "十日夜"],
    [14.8, "満月"], [18.5, "十八夜"], [22.1, "下弦の月"], [25.8, "二十六夜"]
  ];
  var MOON_ICONS = [
    "\uD83C\uDF11", "\uD83C\uDF12", "\uD83C\uDF13", "\uD83C\uDF14",
    "\uD83C\uDF15", "\uD83C\uDF16", "\uD83C\uDF17", "\uD83C\uDF18"
  ];

  AD.moonName = function (age) {
    var best = 0, bestD = 99, i;
    for (i = 0; i < MOON_NAMES.length; i++) {
      var dd = Math.abs(age - MOON_NAMES[i][0]);
      dd = Math.min(dd, SYNODIC - dd);
      if (dd < bestD) { bestD = dd; best = i; }
    }
    return MOON_NAMES[best][1];
  };

  AD.moonIcon = function (age) {
    return MOON_ICONS[Math.round(age / SYNODIC * 8) % 8];
  };

  AD.nextMoon = function (now, targetAge) {
    var age = AD.moonAge(now);
    var delta = (targetAge - age + SYNODIC) % SYNODIC;
    var d = new Date(now.getTime() + delta * 86400000);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };

  AD.sunLongitude = function (date) {
    var n = (date.getTime() - Date.UTC(2000, 0, 1, 12, 0, 0)) / 86400000;
    var L = (280.460 + 0.9856474 * n) % 360;
    var g = ((357.528 + 0.9856003 * n) % 360) * RAD;
    var lambda = L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g);
    return ((lambda % 360) + 360) % 360;
  };

  var TERMS = [
    [0, "春分"], [15, "清明"], [30, "穀雨"], [45, "立夏"],
    [60, "小満"], [75, "芒種"], [90, "夏至"], [105, "小暑"],
    [120, "大暑"], [135, "立秋"], [150, "処暑"], [165, "白露"],
    [180, "秋分"], [195, "寒露"], [210, "霜降"], [225, "立冬"],
    [240, "小雪"], [255, "大雪"], [270, "冬至"], [285, "小寒"],
    [300, "大寒"], [315, "立春"], [330, "雨水"], [345, "啓蟄"]
  ];

  function termName(deg) {
    for (var i = 0; i < TERMS.length; i++) {
      if (TERMS[i][0] === deg) return TERMS[i][1];
    }
    return "";
  }

  function crossed(prev, cur, target) {
    if (prev <= cur) return prev < target && target <= cur;
    return prev < target || target <= cur;
  }

  function dateOfLongitude(from, target, dir) {
    var step = dir < 0 ? -1 : 1;
    for (var i = 0; i <= 22; i++) {
      var a = new Date(from.getFullYear(), from.getMonth(), from.getDate() + step * i, 12);
      var b = new Date(a.getFullYear(), a.getMonth(), a.getDate() + step, 12);
      var La = AD.sunLongitude(a);
      var Lb = AD.sunLongitude(b);
      if (dir < 0) {
        if (crossed(Lb, La, target)) {
          return new Date(a.getFullYear(), a.getMonth(), a.getDate());
        }
      } else if (crossed(La, Lb, target)) {
        return new Date(b.getFullYear(), b.getMonth(), b.getDate());
      }
    }
    return null;
  }

  AD.solarTerms = function (now) {
    var noon = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
    var lon = AD.sunLongitude(noon);
    var lastDeg = Math.floor(lon / 15) * 15;
    var nextDeg = (lastDeg + 15) % 360;
    return {
      current: termName(lastDeg),
      currentDeg: lastDeg,
      currentDate: dateOfLongitude(noon, lastDeg, -1),
      next: termName(nextDeg),
      nextDeg: nextDeg,
      nextDate: dateOfLongitude(noon, nextDeg, 1)
    };
  };
}(window.AD = window.AD || {}));
