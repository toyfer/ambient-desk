/* 前月・当月・翌月カレンダー */
(function (AD) {
  "use strict";

  function monthHTML(y, m, now) {
    var startWd = new Date(y, m - 1, 1).getDay();
    var days = new Date(y, m, 0).getDate();
    var isThis = (now.getFullYear() === y && now.getMonth() + 1 === m);
    var H = AD.holidays(y);
    var html = '<div class="month' + (isThis ? " now" : "") + '">';
    html += '<div class="mhead"><span class="my">' + y + "<small>年</small> " + m + "<small>月</small></span>";
    html += '<span class="wa">' + AD.waMonth(m) + "</span></div>";
    html += '<div class="mgrid">';
    html += '<span class="wd sun">日</span><span class="wd">月</span><span class="wd">火</span><span class="wd">水</span>';
    html += '<span class="wd">木</span><span class="wd">金</span><span class="wd sat">土</span>';
    var v, d;
    for (v = 0; v < startWd; v++) html += '<span class="d void"></span>';
    for (d = 1; d <= days; d++) {
      var wd = (startWd + d - 1) % 7;
      var name = H[m + "-" + d];
      var cls = "d";
      if (wd === 0) cls += " sun";
      if (wd === 6) cls += " sat";
      if (name) cls += " hol";
      if (isThis && d === now.getDate()) cls += " today";
      html += '<span class="' + cls + '"' + (name ? ' title="' + name + '"' : "") + ">" + d + "</span>";
    }
    html += "</div></div>";
    return html;
  }

  AD.buildCalendar = function () {
    var now = new Date();
    var base = new Date(now.getFullYear(), now.getMonth(), 1);
    var html = "";
    for (var off = -1; off <= 1; off++) {
      var d = new Date(base.getFullYear(), base.getMonth() + off, 1);
      html += monthHTML(d.getFullYear(), d.getMonth() + 1, now);
    }
    AD.$("cal").innerHTML = html;
  };
}(window.AD = window.AD || {}));
