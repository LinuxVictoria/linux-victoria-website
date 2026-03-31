# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development server (hot-reload on http://localhost:8080)
npm start

# Production build (Eleventy + Pagefind search index)
npm run build
```

No linting or tests are configured. Build output goes to `_site/`.

Deployment is automatic via Netlify on push. The build command on Netlify is:
```
npx @11ty/eleventy && npx pagefind --site _site
```

## Template conventions

This site is built on the **[SpaceClub! template](https://spaceclubwiki.talkingsites.org)** — an opinionated Eleventy-based starter for community/club websites. Before restructuring layouts, collections, or front matter fields, check the SpaceClub! docs. Deviating from the template's conventions makes future upstream syncs harder.

## Architecture

All Eleventy configuration lives in `.eleventy.js`.

### Content model

**Events** (`src/events/*.md`) — Markdown with front matter:
- `eventDate`, `startTime`, `endTime`, `location`, `featured`, optional `gallery`
- All times are interpreted in `Australia/Sydney` timezone
- The `.eleventy.js` end-time parser supports multiple formats: `HH:MM`, `HHMM`, 12-hour AM/PM

**Posts** (`src/posts/*.md`) — Markdown with front matter:
- `postDate`, `author`, `image`, optional `gallery`

**Galleries** — A folder path set in the front matter of an event or post; `.eleventy.js` auto-scans for images at build time.

### Collections (defined in `.eleventy.js`)

| Collection | Contents |
|---|---|
| `events` | All events |
| `upcomingEvents` / `pastEvents` | Filtered by current time (Sydney TZ) |
| `featuredEvents` | Events with `featured: true` |
| `previewEvents` / `previewPosts` | Slices used on the home page |
| `posts` | All posts |
| `galleries` | All content with a gallery path |

### Global data (`src/_data/`)

- `site.json` — site title, description, logo paths, timezone, base URL
- `navbar.json` — navigation structure
- `connect.json`, `contribute.json`, `initiatives.json` — content for home page sections
- `global.js` — exposes `currentYear`

### Templates

Layouts live in `src/_includes/layouts/` (`base.njk`, `event.njk`, `post.njk`, `index.njk`). Partials in `src/_includes/partials/` are composed into pages — e.g., `eventsList.njk`, `gallery.njk`, `newsletterForm.njk`.

Top-level pages (`src/*.md` / `src/*.njk`) specify their layout in front matter.

### Custom filters (`.eleventy.js`)

`formatDate`, `concat`, `hasGallery`, `stripLeadingSlash`, `jsonify`
