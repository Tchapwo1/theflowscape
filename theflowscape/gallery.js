/* ==========================================================
   The Flowscape — Luxury 3D Coverflow Controller
   ========================================================== */

(function () {
  "use strict";

  var PERSPECTIVE = 1600;
  var SCALE_STEP = 0.16;
  var MAX_VISIBLE = 2;
  var DEPTH = 240;
  var TILT = 12;
  var SIDE_TILT = 8;
  var GAP_MULTIPLIER = 30;
  var GAP_VALUE = 8;
  var MOVE_MS = 600;
  var DIM_VALUE = 0.48;

  function initSmooth3DSlideshow(root) {
    var stage = root.querySelector(".fg-stage");
    var cards = Array.prototype.slice.call(root.querySelectorAll(".fg-card"));
    var n = cards.length;
    if (!n) return;

    var detailWrap = root.querySelector(".fg-detail");
    var detail = root.querySelector(".fg-detail-copy");
    var status = root.querySelector(".fg-status-pill");
    var cta = root.querySelector(".fg-cta-btn");
    var ctaLabel = root.querySelector(".fg-cta-label");
    var dotsWrap = root.querySelector(".fg-dots");
    var prevBtn = root.querySelector(".fg-prev");
    var nextBtn = root.querySelector(".fg-next");
    var counterEl = root.querySelector(".fg-counter");
    var live = root.querySelector(".fg-live");

    var active = parseInt(root.getAttribute("data-start") || "1", 10) || 1;
    var locked = false;

    // Build indicator dots
    if (dotsWrap) {
      dotsWrap.innerHTML = "";
    }
    var dots = cards.map(function (card, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "fg-dot";
      b.setAttribute("aria-label", "Show " + (card.getAttribute("data-name") || "slide " + (i + 1)));
      b.addEventListener("click", function () {
        if (!locked) {
          lock();
          setActive(i);
        }
      });
      if (dotsWrap) dotsWrap.appendChild(b);
      return b;
    });

    // Input lock to prevent rapid clicking jitter
    function lock() {
      locked = true;
      window.setTimeout(function () {
        locked = false;
      }, MOVE_MS);
    }

    function step(dir) {
      if (locked) return;
      lock();
      setActive((((active + dir) % n) + n) % n);
    }

    function setActive(index) {
      active = index;
      render();
    }

    function getSpacing() {
      var cardW = cards[0].offsetWidth || 440;
      var isMobile = window.innerWidth <= 600;
      if (isMobile) {
        return cardW * 0.62;
      }
      return GAP_VALUE * GAP_MULTIPLIER; // 240px
    }

    function render() {
      var gap = getSpacing();

      cards.forEach(function (card, i) {
        var rel = i - active;
        if (rel > n / 2) rel -= n;
        if (rel < -n / 2) rel += n;

        var ax = Math.abs(rel);
        var visible = ax <= MAX_VISIBLE;
        var isActive = rel === 0;
        var sc = Math.max(0.4, 1 - ax * SCALE_STEP);

        var tx = rel * gap;
        var tz = -ax * DEPTH;
        var ry = -rel * TILT;
        var rz = rel * SIDE_TILT;

        card.style.transform =
          "translate(-50%, -50%) " +
          "translateX(" + tx + "px) " +
          "translateZ(" + tz + "px) " +
          "rotateY(" + ry + "deg) " +
          "rotateZ(" + rz + "deg) " +
          "scale(" + sc + ")";

        card.style.opacity = visible ? "1" : "0";
        card.style.zIndex = String(10 - ax);
        card.style.pointerEvents = visible ? "auto" : "none";

        card.classList.toggle("is-active", isActive);
        card.classList.toggle("is-hidden", !visible);
        card.setAttribute("aria-hidden", visible ? "false" : "true");
        card.setAttribute("aria-current", isActive ? "true" : "false");

        // Dim overlay
        var dimEl = card.querySelector(".fg-card-dim");
        if (dimEl) {
          dimEl.style.opacity = isActive ? "0" : String(DIM_VALUE);
        }
      });

      // Update dots
      dots.forEach(function (d, i) {
        d.classList.toggle("is-active", i === active);
      });

      // Update counter (e.g. 02 / 05)
      if (counterEl) {
        var currentFormatted = active + 1 < 10 ? "0" + (active + 1) : active + 1;
        var totalFormatted = n < 10 ? "0" + n : n;
        counterEl.innerHTML = "<b>" + currentFormatted + "</b> / " + totalFormatted;
      }

      // Update details below carousel
      var cur = cards[active];
      if (detailWrap && cur) {
        detailWrap.classList.add("is-swapping");
        setTimeout(function () {
          if (detail) detail.textContent = cur.getAttribute("data-desc") || "";
          if (status) status.innerHTML = "<span>🪷</span> " + (cur.getAttribute("data-status") || "");
          detailWrap.classList.remove("is-swapping");
        }, 180);
      }

      if (cta && cur) {
        var href = cur.getAttribute("data-href");
        cta.href = href || "#circle";
        if (ctaLabel) ctaLabel.textContent = cur.getAttribute("data-cta") || "Explore Sanctuary";
      }

      if (live && cur) {
        live.textContent = "Showing " + (cur.getAttribute("data-name") || "") + ", " + (active + 1) + " of " + n;
      }
    }

    // Click handling
    cards.forEach(function (card, i) {
      card.addEventListener("click", function (e) {
        if (locked) return;
        lock();
        if (i === active) {
          // If already active and clicked, advance to next
          setActive((active + 1) % n);
        } else {
          setActive(i);
        }
      });
    });

    if (prevBtn) {
      prevBtn.addEventListener("click", function () { step(-1); });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () { step(1); });
    }

    if (stage) {
      stage.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          step(1);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          step(-1);
        }
      });
    }

    // Touch Swipe
    var touchStartX = 0;
    var touchEndX = 0;
    if (stage) {
      stage.addEventListener("touchstart", function (e) {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      stage.addEventListener("touchend", function (e) {
        touchEndX = e.changedTouches[0].screenX;
        var diff = touchEndX - touchStartX;
        if (Math.abs(diff) > 40) {
          if (diff < 0) {
            step(1);
          } else {
            step(-1);
          }
        }
      }, { passive: true });
    }

    window.addEventListener("resize", function () {
      render();
    });

    render();
  }

  document.addEventListener("DOMContentLoaded", function () {
    var galleries = document.querySelectorAll(".flow-gallery");
    galleries.forEach(initSmooth3DSlideshow);
  });

  if (document.readyState === "interactive" || document.readyState === "complete") {
    var galleries = document.querySelectorAll(".flow-gallery");
    galleries.forEach(initSmooth3DSlideshow);
  }
})();
