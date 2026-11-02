/* 国民の祝日・振替休日・国民の休日
   国民の祝日に関する法律 第2条・第3条に基づく算出 */
(function (AD) {
  "use strict";

  function nthMonday(y, m, n) {
    var f = new Date(y, m - 1, 1).getDay();
    var off = f <= 1 ? 1 - f : 8 - f;
    return 1 + off + (n - 1) * 7;
  }

  function vernal(y) {
    return Math.floor(20.8431 + 0.242194 * (y - 1980) - Math.floor((y - 1980) / 4));
  }

  function autumnal(y) {
    return Math.floor(23.2488 + 0.242194 * (y - 1980) - Math.floor((y - 1980) / 4));
  }

  var cache = {};

  AD.holidays = function (year) {
    if (cache[year]) return cache[year];
    var H = {};
    function add(m, d, name) { H[m + "-" + d] = name; }

    add(1, 1, "元日");
    add(1, nthMonday(year, 1, 2), "成人の日");
    add(2, 11, "建国記念の日");
    add(2, 23, "天皇誕生日");
    add(3, vernal(year), "春分の日");
    add(4, 29, "昭和の日");
    add(5, 3, "憲法記念日");
    add(5, 4, "みどりの日");
    add(5, 5, "こどもの日");
    add(7, nthMonday(year, 7, 3), "海の日");
    add(8, 11, "山の日");
    add(9, nthMonday(year, 9, 3), "敬老の日");
    add(9, autumnal(year), "秋分の日");
    add(10, nthMonday(year, 10, 2), "スポーツの日");
    add(11, 3, "文化の日");
    add(11, 23, "勤労感謝の日");

    function dim(m) { return new Date(year, m, 0).getDate(); }
    var m, d, k, i;

    for (m = 1; m <= 12; m++) {
      for (d = 2; d < dim(m); d++) {
        k = m + "-" + d;
        if (H[k]) continue;
        if (H[m + "-" + (d - 1)] && H[m + "-" + (d + 1)] &&
            new Date(year, m - 1, d).getDay() !== 0) {
          H[k] = "国民の休日";
        }
      }
    }

    var snapshot = Object.keys(H);
    for (i = 0; i < snapshot.length; i++) {
      var p = snapshot[i].split("-");
      var sm = +p[0], sd = +p[1];
      if (new Date(year, sm - 1, sd).getDay() !== 0) continue;
      var nd = sd + 1, nm = sm;
      while (nm <= 12) {
        if (nd > dim(nm)) { nm++; nd = 1; continue; }
        var nk = nm + "-" + nd;
        if (H[nk]) { nd++; continue; }
        H[nk] = "振替休日";
        break;
      }
    }

    cache[year] = H;
    return H;
  };

  AD.holName = function (y, m, d) {
    return AD.holidays(y)[m + "-" + d] || null;
  };

  AD.isHoliday = function (date) {
    return !!AD.holName(date.getFullYear(), date.getMonth() + 1, date.getDate());
  };

  AD.nextHoliday = function (now) {
    var t = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    for (var i = 0; i < 400; i++) {
      var d = new Date(t.getFullYear(), t.getMonth(), t.getDate() + i);
      var n = AD.holName(d.getFullYear(), d.getMonth() + 1, d.getDate());
      if (n) {
        return { name: n, date: d, days: i, label: AD.ymd(d) };
      }
    }
    return null;
  };

  AD.monthHolidays = function (y, m) {
    var H = AD.holidays(y);
    var items = [];
    var last = new Date(y, m, 0).getDate();
    for (var d = 1; d <= last; d++) {
      var n = H[m + "-" + d];
      if (!n) continue;
      items.push({
        day: d,
        name: n,
        date: new Date(y, m - 1, d),
        wd: AD.WD[new Date(y, m - 1, d).getDay()]
      });
    }
    return items;
  };

  AD.yearHolidayCount = function (y) {
    return Object.keys(AD.holidays(y)).length;
  };

  AD.remainingHolidays = function (now) {
    var y = now.getFullYear();
    var H = AD.holidays(y);
    var m0 = now.getMonth() + 1, d0 = now.getDate();
    var n = 0;
    Object.keys(H).forEach(function (k) {
      var p = k.split("-");
      var m = +p[0], d = +p[1];
      if (m > m0 || (m === m0 && d >= d0)) n++;
    });
    return n;
  };

  /* 土日＋祝日が連続するブロックを走査し、次の3日以上の連休を返す */
  AD.nextLongWeekend = function (now) {
    var start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var i = 0, best = null;
    while (i < 400) {
      var d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      var off = (d.getDay() === 0 || d.getDay() === 6 || AD.isHoliday(d));
      if (!off) { i++; continue; }
      var from = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      var len = 0;
      while (len < 20) {
        var cur = new Date(from.getFullYear(), from.getMonth(), from.getDate() + len);
        if (!(cur.getDay() === 0 || cur.getDay() === 6 || AD.isHoliday(cur))) break;
        len++;
      }
      if (len >= 3) {
        var to = new Date(from.getFullYear(), from.getMonth(), from.getDate() + len - 1);
        var until = Math.max(0, Math.round((from - start) / 86400000));
        return { from: from, to: to, days: len, until: until };
      }
      i += len || 1;
    }
    return best;
  };
}(window.AD = window.AD || {}));
