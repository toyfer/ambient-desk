/* 共通ユーティリティ */
(function (AD) {
  "use strict";

  AD.$ = function (id) { return document.getElementById(id); };

  AD.WD = ["日", "月", "火", "水", "木", "金", "土"];

  AD.pad2 = function (n) {
    return ("0" + n).slice(-2);
  };

  AD.hhmm = function (min) {
    var t = Math.round(min) % 1440;
    if (t < 0) t += 1440;
    return AD.pad2(Math.floor(t / 60)) + ":" + AD.pad2(t % 60);
  };

  AD.durText = function (min) {
    var t = Math.round(min);
    if (t < 0) t += 1440;
    return Math.floor(t / 60) + "時間" + AD.pad2(t % 60) + "分";
  };

  AD.isoWeek = function (date) {
    var d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    var dn = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dn);
    var ys = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - ys) / 86400000) + 1) / 7);
  };

  AD.dayOfYear = function (date) {
    return Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
  };

  AD.daysInYear = function (y) {
    return ((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0) ? 366 : 365;
  };

  AD.eraYear = function (y) {
    if (y >= 2019) return "令和" + (y === 2019 ? "元" : (y - 2018)) + "年";
    if (y >= 1989) return "平成" + (y === 1989 ? "元" : (y - 1988)) + "年";
    return "昭和" + (y - 1925) + "年";
  };

  AD.greeting = function (h) {
    if (h < 5) return "おやすみなさい";
    if (h < 11) return "おはようございます";
    if (h < 18) return "こんにちは";
    if (h < 23) return "こんばんは";
    return "おやすみなさい";
  };

  AD.season = function (m, d) {
    var x = m * 100 + d;
    if (x < 106) return "厳冬";
    if (x < 204) return "晩冬";
    if (x < 306) return "早春";
    if (x < 405) return "仲春";
    if (x < 506) return "晩春";
    if (x < 606) return "初夏";
    if (x < 707) return "梅雨";
    if (x < 808) return "盛夏";
    if (x < 908) return "初秋";
    if (x < 1008) return "仲秋";
    if (x < 1107) return "晩秋";
    if (x < 1207) return "初冬";
    return "厳冬";
  };

  var JIKKAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
  var JUNISHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
  var ETOS = ["鼠", "牛", "虎", "兎", "龍", "蛇", "馬", "羊", "猿", "鶏", "犬", "猪"];

  AD.eto = function (year) {
    var n = ((year - 1984) % 60 + 60) % 60;
    return JIKKAN[n % 10] + JUNISHI[n % 12];
  };

  AD.etoAnimal = function (year) {
    return ETOS[((year - 1984) % 12 + 12) % 12];
  };

  AD.ymd = function (d) {
    return (d.getMonth() + 1) + "月" + d.getDate() + "日（" + AD.WD[d.getDay()] + "）";
  };

  AD.md = function (d) {
    return (d.getMonth() + 1) + "/" + d.getDate();
  };

  AD.workdaysLeft = function (now) {
    var y = now.getFullYear();
    var end = new Date(y, 11, 31);
    var cur = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var n = 0;
    while (cur <= end) {
      var wd = cur.getDay();
      if (wd !== 0 && wd !== 6 && !AD.isHoliday(cur)) n++;
      cur.setDate(cur.getDate() + 1);
    }
    return n;
  };
}(window.AD = window.AD || {}));
