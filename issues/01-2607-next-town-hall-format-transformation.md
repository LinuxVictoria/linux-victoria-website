---
title: next town hall format transformation
status: open
type: feature
created: 2026-07-06
author: cael
---

## Description

LUV's monthly Town Hall has settled into a new recurring format at Kathleen Syme Library and Community Centre (the original venue, now back in use). Starting with the **next Town Hall — July 7, 2026** (tomorrow, relative to when this issue was filed; the page already exists at `src/events/2026-07-07-Linux-Town-Hall-July-2026.md` but predates this format), the event page should reflect this format going forward, every month:

- **6:00pm–7:00pm — Pre-activity, 2nd floor lobby (kitchenette on hand for tea/biscuits):**
  - **Hardware Exchange** — someone brings a box of second-hand hardware; people take what they want, donate what they don't need
  - **Book Circulation** (new) — people bring books to lend/circulate; others can borrow
- **7:00pm–8:30pm — Main room, Town Hall proper:**
  - Community discussion points (recurring agenda item)
  - Optional talk from a highlighted speaker (call out the speaker by name when there is one)
  - Lightning talks — always available, impromptu
- **After 8:30pm** — informal mingling, then the group walks to Papa Gino's nearby for pizza

This is a template/content change, not a one-off: every future Town Hall page should carry this same structure, with only the date/speaker/discussion points varying month to month.

## Expected behaviour

- The Town Hall event page (starting with the existing July 7, 2026 page, and as the pattern for subsequent months) has markdown sections for the pre-activity block (hardware exchange + book circulation + tea/biscuits, 6–7pm) and the main room block (discussion points, optional highlighted speaker, lightning talks, 7–8:30pm), plus a mention of the post-event pizza social.
- `startTime`/`endTime` front matter and `location` continue to describe the full span at Kathleen Syme Library the way existing event pages do (see `src/events/2026-07-07-Linux-Town-Hall-July-2026.md` for the current front-matter shape).
- No new front-matter fields, collections, or filters are introduced in `.eleventy.js` — this is content authored within the existing `template.njk` / `event.njk` structure so the SpaceClub! theme, event-details partial, and build pipeline are untouched.
- Ideally the recurring sections (hardware exchange, book circulation, lightning talks, pizza) are captured somewhere reusable (e.g. a shared blurb or partial) so each month's page doesn't hand-retype the same boilerplate — but only if that can be done without deviating from SpaceClub! template conventions.

## Actual behaviour

The current `src/events/2026-07-07-Linux-Town-Hall-July-2026.md` page (this Tuesday's Town Hall) only covers meet-and-greet / opening / closure and discussion points — no mention of the pre-activity lobby block, hardware exchange, book circulation, speaker highlight, or the post-event pizza.

