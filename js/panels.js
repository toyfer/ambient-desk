/* 各パネルの描画 */
(function (AD) {
  "use strict";

  var CITIES = [];
  var tzFmt = {};

  AD.initWorld = function () {
    var cfg = window.AD_CONFIG || {};
    CITIES = Array.isArray(cfg.cities) ? cfg.cities : [];
    var root = AD.$("world");
    var wrap = AD.$("worldwrap");
    if (!CITIES.length) {
      if (wrap) wrap.style.display = "none";
      if (root) root.innerHTML = "";
      return;
    }
    if (wrap) wrap.style.display = "";
    var html = "";
    for (var i = 0; i < CITIES.length; i++) {
      html += "<li><span>" + CITIES[i][0] + '</span><b data-tz="' + CITIES[i][1] + '">--:--</b></li>';
    }
    root.innerHTML = html;
  };

  function updateWorld(now) {
    var root = AD.$("world");
    if (!root) return;
    for (var i = 0; i < CITIES.length; i++) {
      var tz = CITIES[i][1];
      var node = root.querySelector('[data-tz="' + tz + '"]');
      if (!node) continue;
      try {
        if (!tzFmt[tz]) {
          tzFmt[tz] = new Intl.DateTimeFormat("ja-JP", {
            timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false
          });
        }
        node.textContent = tzFmt[tz].format(now);
      } catch (e) {
        node.textContent = "—";
      }
    }
  }

  AD.updateClock = function () {
    var now = new Date();
    var h = now.getHours(), mi = now.getMinutes(), s = now.getSeconds();
    var y = now.getFullYear(), m = now.getMonth() + 1, d = now.getDate();

    if (AD.paintClock) AD.paintClock(h, mi, s);
    else {
      var c = AD.$("clock");
      if (c) c.textContent = AD.pad2(h) + ":" + AD.pad2(mi);
      var sec = AD.$("sec");
      if (sec) sec.textContent = AD.pad2(s);
    }
    AD.$("date").textContent = y + "年" + m + "月" + d + "日";
    AD.$("wday").textContent = AD.WD[now.getDay()] + "曜日";
    AD.$("era").textContent = AD.eraYear(y);
    AD.$("greet").textContent = AD.greeting(h);

    var rk = AD.rokuyo(now);
    var note = AD.todayNote(now);
    AD.$("meta").textContent =
      AD.dayOfYear(now) + "日目 · 第" + AD.isoWeek(now) + "週 · " +
      AD.eto(y) + "（" + AD.etoAnimal(y) + "） · " + AD.season(m, d) +
      " · " + AD.waMonth(m);
    AD.$("roku").textContent = rk.name;
    AD.$("rokuhint").textContent = rk.hint;
    AD.$("note").textContent = note || "";
    AD.$("note").style.display = note ? "" : "none";

    var secOfDay = h * 3600 + mi * 60 + s;
    var p = secOfDay / 86400 * 100;
    AD.$("daybar").style.width = p.toFixed(2) + "%";
    AD.$("daypct").textContent = p.toFixed(1) + "%";

    var yp = (AD.dayOfYear(now) - 1 + secOfDay / 86400) / AD.daysInYear(y) * 100;
    AD.$("yearbar").style.width = yp.toFixed(2) + "%";
    AD.$("yearpct").textContent = yp.toFixed(1) + "%";

    updateWorld(now);
    AD.updateUntilSunset(now, secOfDay);
  };

  AD.updateUntilSunset = function (now, secOfDay) {
    var node = AD.$("untilset");
    if (!node || !AD._sun) return;
    var setSec = AD._sun.set * 60;
    var riseSec = AD._sun.rise * 60;
    if (secOfDay < riseSec) {
      node.textContent = "日の出まで " + AD.durText((riseSec - secOfDay) / 60);
    } else if (secOfDay < setSec) {
      node.textContent = "日の入りまで " + AD.durText((setSec - secOfDay) / 60);
    } else {
      node.textContent = "日没後";
    }
  };

  AD.updateDayInfo = function () {
    var now = new Date();
    var st = AD.sunTimes(now);
    AD._sun = st;
    AD.$("sunrise").textContent = AD.hhmm(st.rise);
    AD.$("sunset").textContent = AD.hhmm(st.set);
    AD.$("noon").textContent = AD.hhmm(st.noon);
    AD.$("alt").textContent = st.alt.toFixed(1) + "°";
    AD.$("daylen").textContent = AD.durText((st.set - st.rise + 1440) % 1440);
    AD.$("twilight").textContent = AD.hhmm(st.civilRise) + " – " + AD.hhmm(st.civilSet);

    var age = AD.moonAge(now);
    AD.$("moonicon").textContent = AD.moonIcon(age);
    AD.$("moonage").textContent = age.toFixed(1);
    AD.$("moonname").textContent = AD.moonName(age);
    AD.$("nextfull").textContent = AD.md(AD.nextMoon(now, 14.765294));
    AD.$("nextnew").textContent = AD.md(AD.nextMoon(now, 0));

    var term = AD.solarTerms(now);
    AD.$("termnow").textContent = term.current;
    AD.$("termfrom").textContent = term.currentDate ? AD.md(term.currentDate) + "〜" : "";
    AD.$("termnext").textContent = term.next;
    AD.$("termnextd").textContent = term.nextDate ? AD.md(term.nextDate) : "";
  };

  AD.renderHolidays = function () {
    var now = new Date();
    var nx = AD.nextHoliday(now);
    if (nx) {
      AD.$("nextName").textContent = nx.name;
      AD.$("nextDate").textContent = nx.label +
        (nx.days === 0 ? " · 今日" : " · あと " + nx.days + " 日");
    }

    var lw = AD.nextLongWeekend(now);
    if (lw) {
      AD.$("lwspan").textContent = AD.md(lw.from) + " – " + AD.md(lw.to) +
        " · " + lw.days + "連休" +
        (lw.until === 0 ? "（開催中）" : " · あと " + lw.until + " 日");
    } else {
      AD.$("lwspan").textContent = "—";
    }

    var fest = AD.nextFestival(now);
    if (fest) {
      var days = Math.round((fest.date - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 86400000);
      AD.$("festspan").textContent = fest.name + "（" + fest.alias + "） · " + AD.md(fest.date) +
        (days === 0 ? " · 今日" : " · あと " + days + " 日");
    }

    var y = now.getFullYear(), m = now.getMonth() + 1;
    var items = AD.monthHolidays(y, m);
    var html = "";
    if (!items.length) {
      html = "<li>今月の祝日はありません</li>";
    } else {
      for (var i = 0; i < items.length; i++) {
        var it = items[i];
        html += "<li>" + m + "/" + it.day + " " + it.name + "</li>";
      }
    }
    AD.$("hlist").innerHTML = html;

    AD.$("remain").textContent =
      "今年の残り " + (AD.daysInYear(y) - AD.dayOfYear(now)) + " 日 · 祝日 残り " +
      AD.remainingHolidays(now) + " 日 · 平日 残り " + AD.workdaysLeft(now) + " 日";
  };
}(window.AD = window.AD || {}));
