/* Battery Status API（対応ブラウザのみ、オフライン） */
(function (AD) {
  "use strict";

  var bat = null;

  function paint() {
    var node = AD.$("batt");
    if (!node) return;
    if (!bat) {
      node.textContent = "—";
      return;
    }
    var pct = Math.round(bat.level * 100);
    var label = pct + "%";
    if (bat.charging) label += " 充電中";
    else if (typeof bat.dischargingTime === "number" &&
             isFinite(bat.dischargingTime) && bat.dischargingTime < 86400) {
      var m = Math.round(bat.dischargingTime / 60);
      label += " 残り " + Math.floor(m / 60) + ":" + AD.pad2(m % 60);
    }
    node.textContent = label;
  }

  AD.initBattery = function () {
    if (!navigator.getBattery) {
      var n = AD.$("battrow");
      if (n) n.style.display = "none";
      return;
    }
    navigator.getBattery().then(function (b) {
      bat = b;
      paint();
      b.addEventListener("levelchange", paint);
      b.addEventListener("chargingchange", paint);
    }).catch(function () {
      var n = AD.$("battrow");
      if (n) n.style.display = "none";
    });
  };
}(window.AD = window.AD || {}));
