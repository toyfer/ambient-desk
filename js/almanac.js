/* 六曜・和月名・五節句・雑節（オフライン算出）
   六曜は 1927-01-01 先勝を基準とした 6 日周期 */
(function (AD) {
  "use strict";

  var ROKUYO = [
    { name: "先勝", hint: "午前吉・午後凶" },
    { name: "友引", hint: "祝い吉・葬儀凶" },
    { name: "先負", hint: "午前凶・午後吉" },
    { name: "仏滅", hint: "万事控えめに" },
    { name: "大安", hint: "万事大吉" },
    { name: "赤口", hint: "正午のみ吉" }
  ];

  var WAMONTH = [
    "睦月", "如月", "弥生", "卯月", "皙月", "水無月",
    "文月", "葉月", "長月", "神無月", "霜月", "師走"
  ];

  var FESTIVALS = [
    { m: 1, d: 7, name: "人日", alias: "七草" },
    { m: 3, d: 3, name: "上巳", alias: "緋祭り" },
    { m: 5, d: 5, name: "端午", alias: "菅蒲" },
    { m: 7, d: 7, name: "七夕", alias: "星祭り" },
    { m: 9, d: 9, name: "重陽", alias: "菊の節句" }
  ];

  var ZAS = [
    { m: 2, d: 3, name: "節分" },
    { m: 4, d: 8, name: "花祭り" },
    { m: 8, d: 15, name: "お盆" },
    { m: 12, d: 31, name: "大晦日" }
  ];

  var REF = Date.UTC(1927, 0, 1);

  AD.rokuyo = function (date) {
    var t = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
    var days = Math.round((t - REF) / 86400000);
    var i = ((days % 6) + 6) % 6;
    return ROKUYO[i];
  };

  AD.waMonth = function (month) {
    return WAMONTH[month - 1] || "";
  };

  AD.todayNote = function (date) {
    var m = date.getMonth() + 1, d = date.getDate();
    var i;
    for (i = 0; i < FESTIVALS.length; i++) {
      if (FESTIVALS[i].m === m && FESTIVALS[i].d === d) {
        return FESTIVALS[i].name + "（" + FESTIVALS[i].alias + "）";
      }
    }
    for (i = 0; i < ZAS.length; i++) {
      if (ZAS[i].m === m && ZAS[i].d === d) return ZAS[i].name;
    }
    return "";
  };

  AD.nextFestival = function (now) {
    var y = now.getFullYear(), m = now.getMonth() + 1, d = now.getDate();
    var i, f, fy;
    for (i = 0; i < FESTIVALS.length; i++) {
      f = FESTIVALS[i];
      if (f.m > m || (f.m === m && f.d >= d)) {
        return { name: f.name, alias: f.alias, date: new Date(y, f.m - 1, f.d) };
      }
    }
    f = FESTIVALS[0];
    fy = y + 1;
    return { name: f.name, alias: f.alias, date: new Date(fy, f.m - 1, f.d) };
  };
}(window.AD = window.AD || {}));
