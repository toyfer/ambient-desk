/* 桁ごとにめくれる時計 */
(function (AD) {
  "use strict";

  function flip(el, next) {
    if (!el) return;
    var cur = el.getAttribute("data-v");
    if (cur === next) return;
    el.setAttribute("data-v", next);
    el.textContent = next;
    el.classList.remove("tick");
    void el.offsetWidth;
    el.classList.add("tick");
  }

  AD.paintClock = function (h, mi, s) {
    var hh = AD.pad2(h);
    var mm = AD.pad2(mi);
    var ss = AD.pad2(s);
    flip(AD.$("h0"), hh.charAt(0));
    flip(AD.$("h1"), hh.charAt(1));
    flip(AD.$("m0"), mm.charAt(0));
    flip(AD.$("m1"), mm.charAt(1));
    flip(AD.$("s0"), ss.charAt(0));
    flip(AD.$("s1"), ss.charAt(1));
  };
}(window.AD = window.AD || {}));
