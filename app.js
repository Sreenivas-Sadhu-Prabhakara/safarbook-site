/* SafarBook explainer — tiny interactions, no dependencies.
   1) Sticky-nav active-link highlight on scroll.
   2) Smooth scroll for in-page anchors (with reduced-motion respect).
   3) Signature touch: the hero dispatch board "works itself" —
      the unassigned airport run gets a driver, goes ongoing, then
      completes; the Collected / Balance-out totals tick over.
      A live demo of the book -> assign -> collect cycle. */

(function () {
  "use strict";

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Active nav link on scroll ---------- */
  var links = Array.prototype.slice.call(
    document.querySelectorAll('.nav__links a[href^="#"]')
  );
  var sections = links
    .map(function (a) {
      return document.getElementById(a.getAttribute("href").slice(1));
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var byId = {};
    links.forEach(function (a) {
      byId[a.getAttribute("href").slice(1)] = a;
    });
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          var a = byId[e.target.id];
          if (!a) return;
          if (e.isIntersecting) {
            links.forEach(function (l) {
              l.style.color = "";
            });
            a.style.color = "var(--accent)";
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) {
      io.observe(s);
    });
  }

  /* ---------- 2. Smooth scroll for anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (ev) {
      var id = a.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      var el = document.querySelector(id);
      if (!el) return;
      ev.preventDefault();
      el.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start"
      });
      history.replaceState(null, "", id);
    });
  });

  /* ---------- 3. Signature: the board works itself ---------- */
  var rows = document.getElementById("reg-rows");
  var liveTag = document.getElementById("reg-live-tag");
  var caption = document.getElementById("reg-caption");
  var collectedEl = document.getElementById("reg-collected");
  var pendingEl = document.getElementById("reg-pending");

  if (!rows || !liveTag || !collectedEl || !pendingEl) return;

  // TRV-124, the unassigned airport run, is the trip that "works itself".
  var liveRow = rows.querySelector('[data-state="due"]');

  var TRIP_FARE = 1150;         // TRV-124 fare, no advance taken
  var BASE_COLLECTED = 11000;   // completed trips already collected today
  var BASE_PENDING = 5350;      // balance out across the other trips

  function rupee(n) {
    return "₹" + n.toLocaleString("en-IN");
  }

  // Cycle: needs a driver -> assigned -> ongoing -> completed -> reset.
  var stages = [
    {
      tag: "Needs a driver",
      tagClass: "tag--due",
      caption: "Assign Raju + MH-01-AB-4521 to TRV-124 → duty slip goes to his phone.",
      collected: BASE_COLLECTED,
      pending: BASE_PENDING,
      state: "due",
      flash: false
    },
    {
      tag: "Assigned",
      tagClass: "tag--due",
      caption: "Raju has the duty slip: Andheri → T2, collect ₹1,150 at drop-off.",
      collected: BASE_COLLECTED,
      pending: BASE_PENDING,
      state: "due",
      flash: true
    },
    {
      tag: "Ongoing",
      tagClass: "tag--due",
      caption: "Car's rolling — the board shows TRV-124 live, no WhatsApp needed.",
      collected: BASE_COLLECTED,
      pending: BASE_PENDING,
      state: "due",
      flash: false
    },
    {
      tag: "Completed",
      tagClass: "tag--paid",
      caption: "₹1,150 collected at T2 — balance cleared, payment note queued.",
      collected: BASE_COLLECTED + TRIP_FARE,
      pending: BASE_PENDING,
      state: "paid",
      flash: true
    }
  ];

  var i = 0;

  function applyStage(s) {
    liveTag.textContent = s.tag;
    liveTag.className = "reg-row__tag " + s.tagClass;
    if (liveRow) liveRow.setAttribute("data-state", s.state);
    caption.textContent = s.caption;
    collectedEl.textContent = rupee(s.collected);
    pendingEl.textContent = rupee(s.pending);
    if (liveRow && s.flash) {
      liveRow.classList.add("flash");
      setTimeout(function () {
        liveRow.classList.remove("flash");
      }, 900);
    }
  }

  // If the user prefers reduced motion, just show the completed end-state
  // once (the promise fulfilled) and don't loop.
  if (reduceMotion) {
    applyStage(stages[3]);
    caption.textContent =
      "Book → assign → collect → duty slip — the whole dispatch cycle, on one board.";
    return;
  }

  // Only animate while the widget is on screen (saves work, feels intentional).
  var running = false;
  var timer = null;

  function advance() {
    i = (i + 1) % stages.length;
    applyStage(stages[i]);
  }

  function loop() {
    timer = setTimeout(function () {
      advance();
      loop();
    }, i === 0 ? 2600 : 2000);
  }

  var vis = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !running) {
          running = true;
          loop();
        } else if (!e.isIntersecting && running) {
          running = false;
          clearTimeout(timer);
        }
      });
    },
    { threshold: 0.35 }
  );
  vis.observe(rows.closest(".register"));
})();
