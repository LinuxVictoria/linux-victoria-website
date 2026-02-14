# Linux Victoria Website

The official website for Linux Victoria (LUV), built with [Eleventy](https://www.11ty.dev/), [Bootstrap](https://getbootstrap.com/), and [Pagefind](https://pagefind.app/).

Based on the [SpaceClub! Website Template](https://spaceclubwiki.talkingsites.org).

New to Markdown? Check out the [Markdown Guide](https://www.markdownguide.org/getting-started/) to learn the basics.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Creating an Event](#creating-an-event)
- [Creating a Post](#creating-a-post)
- [Frontmatter Reference](#frontmatter-reference)
  - [Event Properties](#event-properties)
  - [Post Properties](#post-properties)
- [Images](#images)
- [Search & SEO](#search--seo)
- [Build & Deploy](#build--deploy)
- [For Website Maintainers](#for-website-maintainers)

---

## Quick Start

```bash
# Install dependencies
npm install

# Run local development server
npm start

# Build for production
npm run build

# Rebuild search index
npx pagefind --site _site
```

---

## Creating an Event

1. Copy the template file:
   ```
   src/events/template.njk -> src/events/YYYY-MM-DD_your-event-title.md
   ```

2. **Important:** Change the file extension from `.njk` to `.md` - only `.md` files appear in the events list!

3. Fill in the frontmatter (see [Event Properties](#event-properties))

4. Write your event details in the body using Markdown

5. Save and commit your changes

### Event File Example

```markdown
---
title: "Monthly Meetup - February"
description: "Join us for our monthly community meetup to discuss all things Linux!"
eventDate: 2026-02-15
startTime: 7:00 PM
endTime: 9:00 PM
location: Melbourne CBD
image: "/assets/images/meetup-feb.webp"
tags: ["Upcoming", "Meetup", "2026"]
---

# Monthly Meetup

Welcome to our February meetup! 

## Agenda
- Introductions
- Lightning talks
- Q&A
```

---

## Creating a Post

1. Copy the template file:
   ```
   src/posts/template.njk -> src/posts/YYYY-MM-DD_your-post-title.md
   ```

2. **Important:** Change the file extension from `.njk` to `.md` - only `.md` files appear in the posts list!

3. Fill in the frontmatter (see [Post Properties](#post-properties))

4. Write your post content in the body using Markdown

5. Save and commit your changes

### Post File Example

```markdown
---
title: "Event Recap: February Meetup"
description: "A summary of what happened at our February meetup."
postDate: 2026-02-16
author: Your Name
image: "/assets/images/meetup-recap.webp"
tags: ["Recap", "Meetup", "2026"]
---

Great turnout at last night's meetup! Here's what we covered...
```

---

## Frontmatter Reference

### Event Properties

| Property | Required | Description |
|----------|----------|-------------|
| `title` | ✅ Yes | Event name. Shown on cards, page heading, search results, and browser tab. |
| `description` | ✅ Yes | Short summary. Shown on event cards and in search results. |
| `eventDate` | ✅ Yes | Format: `YYYY-MM-DD` (e.g., `2026-02-15`). Use `"TBA"` if unscheduled. |
| `startTime` | ✅ Yes | Format: `H:MM AM/PM` (e.g., `7:00 PM`). |
| `endTime` | ✅ Yes | Format: `H:MM AM/PM` (e.g., `9:00 PM`). |
| `location` | ✅ Yes | Venue name or address. For online events use `"Electron eVenue"` or `"Online - TBC"`. |
| `image` | Optional | Path to event image. Use `.webp` format. Example: `"/assets/images/event.webp"` |
| `preview_image` | Optional | Full URL for social sharing. Example: `"https://linuxvictoria.org/assets/images/event.webp"` |
| `tags` | Optional | Array of tags. Example: `["Upcoming", "Workshop", "2026"]` |
| `featured` | Optional | Set to `true` to highlight the event. |
| `recapPost` | Optional | Link to the recap post. Example: `/posts/2026-02-16_meetup-recap/` |
| `gallery` | Optional | Path to folder with gallery images. Example: `"/assets/images/event-gallery"` |
| `permalink` | Optional | Custom URL path. |

### Post Properties

| Property | Required | Description |
|----------|----------|-------------|
| `title` | ✅ Yes | Post title. Shown on cards, page heading, search results, and browser tab. |
| `description` | ✅ Yes | Short summary. Shown on post cards and in search results. |
| `postDate` | ✅ Yes | Format: `YYYY-MM-DD` (e.g., `2026-02-16`). |
| `author` | ✅ Yes | Author name. Shown on the post page. |
| `image` | Optional | Path to post image. Use `.webp` format. Example: `"/assets/images/post.webp"` |
| `preview_image` | Optional | Full URL for social sharing. Example: `"https://linuxvictoria.org/assets/images/post.webp"` |
| `tags` | Optional | Array of tags. Example: `["Recap", "Workshop", "2026"]` |
| `gallery` | Optional | Path to folder with gallery images. Example: `"/assets/images/post-gallery"` |
| `eventPage` | Optional | Link to the related event. Example: `/events/2026-02-15_meetup/` |
| `permalink` | Optional | Custom URL path. |

---

## Images

**Use `.webp` format for all images.** PNG and JPG files can be large and slow to load. WebP provides better compression with the same quality.

You can convert images to webp using online tools or command line:
```bash
# Using cwebp (install via brew install webp)
cwebp input.png -o output.webp
```

Place images in `src/assets/images/`.

---

## Search & SEO

The `title` and `description` fields appear in:
- **Website search** (navbar search icon)
- **Search engines** like Google
- **Social media** previews when sharing links

After making changes, rebuild the search index:
```bash
npx pagefind --site _site
```

---

## Build & Deploy

### Local Development

```bash
npm start
```
Opens a local server at `http://localhost:8080` with hot reload.

### Production Build

```bash
npm run build
```
Generates static files in the `_site` folder.

### Deployment

Push to the main branch to deploy on Netlify.

---

## Contributing

1. Fork the repository
2. Create your event or post following the guides above
3. Submit a Pull Request

File naming: Use the format `YYYY-MM-DD_your-title.md` with lowercase and hyphens.

For help with graphics, venues, or getting events listed on Luma/Meetup, contact [team@linuxvictoria.org](mailto:team@linuxvictoria.org).

---

## License

See [LICENSE](LICENSE) for details.

---

# For Website Maintainers

This section covers how the website is structured for those maintaining or customising it.

## Project Structure

```
src/
├── _data/              # Global data files (JSON)
├── _includes/
│   ├── layouts/        # Page layouts (Nunjucks)
│   └── partials/       # Reusable components
├── assets/
│   ├── css/            # Stylesheets
│   ├── js/             # JavaScript files
│   ├── images/         # All images
│   └── fonts/          # Custom fonts
├── events/             # Event pages
├── posts/              # Blog posts
└── *.md / *.njk        # Static pages
```

## Data Files (`src/_data/`)

| File | Purpose |
|------|---------|
| `site.json` | Site title, description, logo, favicon, timezone, date format |
| `navbar.json` | Navigation menu items (title and href for each link) |
| `initiatives.json` | Homepage initiative cards (title, description, image, link, cta) |
| `connect.json` | Social/contact links |
| `contribute.json` | Contribution options |
| `luvCards.json` | LUV page content cards |
| `global.js` | Global computed data |

## Layouts (`src/_includes/layouts/`)

| Layout | Used For |
|--------|----------|
| `base.njk` | Base template - includes navbar, footer, meta tags, Bootstrap, Pagefind |
| `index.njk` | Homepage layout |
| `event.njk` | Individual event pages |
| `post.njk` | Individual blog post pages |

## Partials (`src/_includes/partials/`)

Reusable components that can be included in layouts or pages:

| Partial | Purpose |
|---------|---------|
| `navbar.njk` | Top navigation bar with search |
| `footer.njk` | Site footer with copyright and GitHub link |
| `eventsList.njk` | Renders list of events |
| `postsList.njk` | Renders list of posts |
| `cards.njk` | Generic card component |
| `homeCards.njk` | Homepage card grid |
| `initiativesList.njk` | Initiative cards on homepage |
| `gallery.njk` | Image gallery component |
| `galleryAll.njk` | Full gallery page |
| `featured.njk` | Featured events/posts |
| `event-details.njk` | Event metadata (date, time, location) |
| `form.njk` | Contact form component |
| `newsletterForm.njk` | Newsletter signup form |
| `newsletterEngageForm.njk` | Engage newsletter form |
| `btn.njk` | Button component |

## Modifying the Navbar

Edit `src/_data/navbar.json`:
```json
[
  { "title": "Contact", "href": "/contact" },
  { "title": "Events", "href": "/events" }
]
```

## Modifying the Footer

Edit `src/_includes/partials/footer.njk` directly.

## Modifying Site Settings

Edit `src/_data/site.json`:
```json
{
  "title": "Linux Victoria",
  "description": "...",
  "logo": "/assets/images/logo-lv.svg",
  "favicon": "/assets/images/favicon-lv.ico",
  "timezone": "Australia/Sydney",
  "dateFormat": "dddd, Do MMMM YYYY"
}
```

## Adding a Gallery to an Event or Post

1. Create a folder in `src/assets/images/` with your gallery images
2. Add the `gallery` property to your frontmatter:
   ```yaml
   gallery: "/assets/images/my-event-gallery"
   ```
3. The gallery will automatically display at the bottom of the page

## Static Pages

Pages like `contact.md`, `faq.md`, `luv.md` are in the `src/` root. Edit them directly or create new `.md` files with frontmatter:

```yaml
---
title: "Page Title"
description: "Page description"
layout: "base.njk"
---
```

## Eleventy Config

The main configuration is in `.eleventy.js`. It defines:
- Passthrough copies (assets, admin, redirects)
- Collections (events, posts, upcoming/past events, featured items)
- Filters (date formatting, markdown rendering)
- Gallery scanning logic

## Collections

Events and posts are automatically collected based on their folder. Key collections:
- `events` - All events
- `posts` - All posts
- `upcomingEvents` - Events with future dates
- `pastEvents` - Events with past dates
- `featuredEvents` - Events with `featured: true`
- `featuredPosts` - Posts with `featured: true`

---

**Based on the [SpaceClub! Website Template](https://spaceclubwiki.talkingsites.org)**
