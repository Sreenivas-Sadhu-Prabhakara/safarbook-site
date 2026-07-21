# SafarBook — explainer site

A standalone marketing/explainer page for **SafarBook**, the trip-booking and
dispatch book for small Indian taxi and travel (tours/cab) operators.

> **Every car out, every rupee tracked.** — pricing on discovery, subscription basis

This is *not* the product UI. It is a polished, self-contained landing page that
makes the idea instantly clear to a non-technical operator and to an investor
skimming for 30 seconds.

## What the product does

The bookings are known a day ahead — same cars, same drivers, a fare on every
trip. Only the juggling is manual. SafarBook puts that juggling on one board:

- **Trip booking** — customer, from → to, date, type and fare, with the advance captured.
- **Driver &amp; vehicle assignment** — attach a car and driver from your fleet; no double-booking.
- **Advance &amp; balance tracking** — balance is always fare minus advance, kept live.
- **Numbered duty slips** — route, guest and exactly how much to collect, queued to the driver.
- **Daily dispatch board** — today's trips, unassigned queue, ongoing, completed, pending balances.
- **Outbox** — booking confirmations, payment notes and duty slips, drafted for you to send.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page markup — all sections, inline SVG only. |
| `styles.css` | All styling. Palette built around the blue accent `#2563eb`. |
| `app.js` | Sticky-nav highlight, smooth scroll, and the animated hero "dispatch board" where an unassigned trip gets a driver, goes ongoing, then completes. No dependencies. |
| `favicon.svg` | Dispatch-book mark. |
| `og.svg` / `og.png` | 1200×630 social share image. |

## Design notes

- Palette: blue accent `#2563eb`, deep slate ink, off-white board paper, a muted
  blue tint, green for completed, and a burnt-orange warning colour for pending balances.
- **Signature:** money and route codes are always set in tabular monospace, so the
  whole page reads like a dispatcher's daily board. The hero widget is a live
  dispatch board where an unassigned airport run visibly moves
  needs-a-driver → assigned → ongoing → completed.
- Fully self-contained: no CDNs, no external fonts, images or scripts. System
  font stack only. Renders correctly opened as a local `file://` and deploys to
  any static host unchanged.
- Responsive down to mobile with no horizontal page scroll; the wide dispatch
  table scrolls inside its own container.
- Respects `prefers-reduced-motion` (the hero animation freezes on its end-state).

## Run it

Just open `index.html` in a browser. No build step. To serve locally:

```sh
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Deploy

Pushed to GitHub Pages via `.github/workflows/deploy-pages.yml` (Actions-based).
`.nojekyll` is included so files are served verbatim. Also works unchanged on any
static host (Netlify, Cloudflare Pages, S3).

---

A **KARYA** studio build · sreeni.nintendo@gmail.com
