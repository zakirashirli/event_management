# Lumen Cinema

A vanilla HTML, CSS and JavaScript cinema seat selector. From this directory run `npm start`, then open http://127.0.0.1:4173. Requires Node.js 18 or newer; no dependency installation or build step is needed. Use HTTP rather than opening the HTML as a local file because the application uses JavaScript modules. No backend or payment processing is used.

## Git learning experiment

This project was implemented in November 2026. Author and committer timestamps are explicitly simulated; they do not represent when development actually occurred. Existing repository history and the sibling `eventss` project are preserved. No repository publication is implied.

The user approved twelve commits over four milestone periods within October 18–November 8, 2026 (+04:00). These are shortened milestone periods, not four full calendar weeks.

| Milestone | Dates | Work |
| --- | --- | --- |
| 1 | Oct 18, 21, 24 | Structure, design, venue model |
| 2 | Oct 25, 28, 31 | Generation, inspection, seat states |
| 3 | Nov 1, 2, 4 | Navigation, cart, persistence |
| 4 | Nov 5, 7, 8 | Responsive UI, mouse navigation, verification |

## Features and design

Hall 01 has 132 seats in eleven rows of twelve, divided by a central aisle. Classic rows A–C cost AZN 12, Prime rows D–G cost AZN 18, and Lounge rows H, J, K and L cost AZN 26. Fifteen seats are unavailable in the fixed demonstration data.

Click or keyboard-activate a seat to inspect it, then choose Add to Cart. Unavailable seats remain inspectable to explain their status. Cart items can be removed and are restored after refresh. Prices come from the canonical venue model; saved data contains only validated seat IDs. The storage key isolates this hall and screening. Blocked storage falls back to an in-memory cart with a visible notice after an attempted save.

Navigation supports all seven required buttons, bounded mouse-wheel zoom, and mouse/pen drag panning. Drag gestures suppress accidental seat inspection. Touch users can scroll normally and use the visible navigation controls. There is no live availability, checkout, authentication or multi-user locking. Google Fonts is optional; local fallback fonts work offline.

## Verification

Run `npm test` for venue integrity and persisted-data validation tests. To run the optional browser integration checks, install Playwright separately, start the server, and run `node tests/browser.cjs`. It uses installed Microsoft Edge by default; set `BROWSER_CHANNEL=chrome` to use installed Chrome. `PLAYWRIGHT_MODULE` can point to an existing Playwright installation.

Browser checks cover inspection without addition, duplicate prevention, mixed-price totals, removal synchronization, reload restoration, unavailable seats, seven controls, wheel zoom, drag suppression, malformed storage, no runtime errors, and layouts at 1440, 768, 390 and 320 pixels. A desktop screenshot was visually inspected.

## Demonstration checklist

1. Introduce the cinema, its three zones and prices.
2. Demonstrate all navigation buttons and Reset / center view.
3. Inspect a seat before adding it; add a second price category.
4. Show duplicate prevention, remove a ticket, then refresh.
5. Inspect an unavailable seat and resize the browser.
6. Explain `venue.js`, dynamic button generation in `app.js`, and `storage.js`.
7. Demonstrate wheel zoom and dragging for the optional bonus.

The source brief additionally asks for a personally narrated video and a PDF submission report with student identity, screenshot, public URLs and final hash. Those external submission artifacts are not represented as completed by this repository. No upload, push, or repository visibility change has been performed.
