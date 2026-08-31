---
title: Linux Town Hall September
description: Join us for the Linux Town Hall September meeting, with a featured talk on porting Debian 13 to LoongArch, plus short talks on the Framework laptop and Omarchy.
tags: ["Town Hall", "2026", "In-person", "Online"]
image: "/assets/images/linux-town-hall.webp"
eventDate: 2026-09-01
startTime: 6:00 PM
endTime: 8:30 PM
location: "In-person: Kathleen Syme Library and Community Centre, Carlton VIC (2nd floor lobby for pre-activity, then the training and learning room) \n Online: Electron eVenue"
---

<style>
.lth-hero {
  position: relative;
  border-radius: 1rem;
  background: var(--bs-primary-bg-subtle);
  padding: 1.75rem;
  margin-bottom: 2rem;
}

/* Headshot in the Featured Talk card: a full-height strip down the left edge.
   It lives inside .card-body (so it can float on phones, see below) but is
   positioned against the card itself, which is what lets it clear the body
   padding and run the full height. */
.lth-talk {
  position: relative;
  overflow: hidden;   /* trims the strip to the card's rounded corners */
}

.lth-talk-headshot {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 116px;
}

.lth-talk-headshot img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lth-talk .card-body {
  padding-left: 132px;
}

/* Speaker mesh: runs flush into the card's top-right corner (the card is
   position:relative, so 0/0 lands exactly there) and tears away on the left
   and bottom. Radius matches the card so the corner stays clean. */
.lth-speakers {
  position: absolute;
  top: 1px;
  right: 1px;
  width: 400px;
  z-index: 2;
}

.lth-mesh,
.lth-speaker-mesh {
  display: block;
  width: 100%;
  height: auto;
}

.lth-speaker-mesh { border-top-right-radius: 0.375rem; }

.lth-wire line {
  stroke: rgba(255, 255, 255, 0.9);
}

.lth-dots circle {
  fill: #fff;
}

@media (min-width: 992px) {
  /* keep the title and the long location line clear of the panel */
  .card-body > div > h1,
  .card-body > div > .mb-3 {
    padding-right: 422px;
  }
}

@media (min-width: 1200px) {
  .lth-speakers { width: 500px; }

  .card-body > div > h1,
  .card-body > div > .mb-3 {
    padding-right: 522px;
  }
}

@media (max-width: 991.98px) {
  .lth-speakers {
    position: static;
    width: 100%;
    margin: 0 0 1.5rem;
  }

  .lth-speaker-mesh { border-top-right-radius: 0; }
}

/* On a phone a full-height strip would eat the card, so the headshot becomes a
   torn shard in the top-right corner and the talk details wrap around it.
   Floated rather than absolute so the text reclaims the width below the shard,
   which is why the headshot sits inside .card-body in the markup. */
@media (max-width: 767.98px) {
  .lth-talk-headshot {
    position: static;
    float: right;
    width: 96px;
    margin: 0 0 0.4rem 0.85rem;
    background: var(--gradient);
    padding: 3px;
    clip-path: polygon(0% 10%, 52% 0%, 100% 14%, 88% 100%, 12% 92%);
    shape-outside: polygon(0% 10%, 52% 0%, 100% 14%, 88% 100%, 12% 92%);
  }

  .lth-talk-headshot img {
    height: auto;
    aspect-ratio: 1 / 1;
    clip-path: polygon(0% 10%, 52% 0%, 100% 14%, 88% 100%, 12% 92%);
  }

  .lth-talk .card-body { padding-left: 1rem; }
}

@media (min-width: 1200px) {
  .lth-talk-headshot { width: 140px; }
  .lth-talk .card-body { padding-left: 156px; }
}

/* The two short talks share a row below the featured one, so at half width they
   need a narrower strip and a smaller title to stop it wrapping into a ribbon.
   Scoped above 768px because below that every headshot becomes a floated shard. */
@media (min-width: 768px) {
  .lth-talk-sm .lth-talk-headshot { width: 100px; }
  .lth-talk-sm .card-body { padding-left: 116px; }
  .lth-talk-sm .card-title { font-size: 1.1rem; }
}

/* On a narrow card the headshot starves the talk title of width. */
@media (max-width: 575.98px) {
  .lth-hero { padding: 1.25rem; }
  .lth-talk-headshot { width: 84px; }
  .lth-hero .card-body { gap: 0.75rem !important; padding: 0.9rem; }
  .lth-hero .card-title { font-size: 1.15rem; }
}
</style>

<div class="lth-speakers" aria-label="Speakers">
<svg class="lth-mesh lth-speaker-mesh" viewBox="0 0 500 228" role="group" aria-label="Speakers from recent Linux Victoria meetups"><defs><pattern id="lsp0" patternUnits="userSpaceOnUse" x="39.8" y="0" width="136.9" height="171.7"><image href="/assets/images/linux-town-hall-september-2026-speakers/speaker-1.webp" x="0" y="0" width="136.9" height="171.7" preserveAspectRatio="xMidYMid slice"/></pattern><pattern id="lsp1" patternUnits="userSpaceOnUse" x="173.3" y="0" width="167.5" height="181.9"><image href="/assets/images/linux-town-hall-september-2026-speakers/speaker-2.webp" x="0" y="0" width="167.5" height="181.9" preserveAspectRatio="xMidYMid slice"/></pattern><pattern id="lsp2" patternUnits="userSpaceOnUse" x="317.3" y="0" width="134.6" height="191.3"><image href="/assets/images/linux-town-hall-september-2026-speakers/speaker-3.webp" x="0" y="0" width="134.6" height="191.3" preserveAspectRatio="xMidYMid slice"/></pattern></defs><g><polygon points="14.8,-8 39.8,-10.3 61.1,171.7" fill="#803D99"/><polygon points="14.8,-8 61.1,171.7 5.9,181" fill="#743a8c"/><polygon points="39.8,-10.3 173.3,-5.3 176.7,168.4 61.1,171.7" fill="url(#lsp0)"><title>A speaker presenting at a recent Linux Victoria Town Hall</title></polygon><polygon points="173.3,-5.3 317.3,-8.1 340.8,181.9 176.7,168.4" fill="url(#lsp1)"><title>A speaker presenting at June's Town Hall</title></polygon><polygon points="317.3,-8.1 451.9,-4 447.5,191.3 340.8,181.9" fill="url(#lsp2)"><title>A speaker presenting at Hardware Freedom Day</title></polygon><polygon points="451.9,-4 550.3,-9.4 561.6,189.6" fill="#8d4aa6"/><polygon points="451.9,-4 561.6,189.6 447.5,191.3" fill="#743a8c"/><polygon points="5.9,181 61.1,171.7 34.5,219.5" fill="#803D99"/><polygon points="5.9,181 34.5,219.5 17.8,217" fill="#743a8c"/><polygon points="61.1,171.7 176.7,168.4 174.8,198.2" fill="#6b3280"/><polygon points="61.1,171.7 174.8,198.2 34.5,219.5" fill="#743a8c"/><polygon points="176.7,168.4 340.8,181.9 331.4,212.3" fill="#743a8c"/><polygon points="176.7,168.4 331.4,212.3 174.8,198.2" fill="#743a8c"/><polygon points="340.8,181.9 447.5,191.3 467.4,200.2" fill="#9651ae"/><polygon points="340.8,181.9 467.4,200.2 331.4,212.3" fill="#743a8c"/><polygon points="447.5,191.3 561.6,189.6 553.8,217.9" fill="#8d4aa6"/><polygon points="447.5,191.3 553.8,217.9 467.4,200.2" fill="#743a8c"/></g><g class="lth-wire" stroke-width="2.4"><line x1="14.8" y1="-8" x2="39.8" y2="-10.3"/><line x1="14.8" y1="-8" x2="5.9" y2="181"/><line x1="39.8" y1="-10.3" x2="173.3" y2="-5.3"/><line x1="39.8" y1="-10.3" x2="61.1" y2="171.7"/><line x1="173.3" y1="-5.3" x2="317.3" y2="-8.1"/><line x1="173.3" y1="-5.3" x2="176.7" y2="168.4"/><line x1="317.3" y1="-8.1" x2="451.9" y2="-4"/><line x1="317.3" y1="-8.1" x2="340.8" y2="181.9"/><line x1="451.9" y1="-4" x2="550.3" y2="-9.4"/><line x1="451.9" y1="-4" x2="447.5" y2="191.3"/><line x1="550.3" y1="-9.4" x2="561.6" y2="189.6"/><line x1="5.9" y1="181" x2="61.1" y2="171.7"/><line x1="5.9" y1="181" x2="17.8" y2="217"/><line x1="61.1" y1="171.7" x2="176.7" y2="168.4"/><line x1="61.1" y1="171.7" x2="34.5" y2="219.5"/><line x1="176.7" y1="168.4" x2="340.8" y2="181.9"/><line x1="176.7" y1="168.4" x2="174.8" y2="198.2"/><line x1="340.8" y1="181.9" x2="447.5" y2="191.3"/><line x1="340.8" y1="181.9" x2="331.4" y2="212.3"/><line x1="447.5" y1="191.3" x2="561.6" y2="189.6"/><line x1="447.5" y1="191.3" x2="467.4" y2="200.2"/><line x1="561.6" y1="189.6" x2="553.8" y2="217.9"/><line x1="17.8" y1="217" x2="34.5" y2="219.5"/><line x1="34.5" y1="219.5" x2="174.8" y2="198.2"/><line x1="174.8" y1="198.2" x2="331.4" y2="212.3"/><line x1="331.4" y1="212.3" x2="467.4" y2="200.2"/><line x1="467.4" y1="200.2" x2="553.8" y2="217.9"/></g><g class="lth-dots"><circle cx="14.8" cy="-8" r="3.6"/><circle cx="317.3" cy="-8.1" r="3.6"/><circle cx="61.1" cy="171.7" r="3.6"/><circle cx="447.5" cy="191.3" r="3.6"/><circle cx="174.8" cy="198.2" r="3.6"/><circle cx="553.8" cy="217.9" r="3.6"/></g></svg>
</div>

<div class="lth-hero">

Join us for the Linux Town Hall September meeting for hardware, books, community discussion, the upcoming Software Freedom Day, a featured talk, and two short talks.

<div class="row g-3 lth-talks">
<div class="col-12">
<div class="card border-primary shadow-sm h-100 mb-0 lth-talk">
<div class="card-body">
<div class="lth-talk-headshot">
<img src="/assets/images/linux-town-hall-september-2026-speakers/wencey-wang.webp" alt="Wencey Wang">
</div>
<span class="badge bg-primary mb-2"><i class="bi bi-mic-fill me-1"></i> Featured Talk</span>
<h3 class="card-title mb-1">Porting Debian 13 to LoongArch</h3>
<p class="mb-0 text-secondary"><i class="bi bi-person-fill me-1"></i> <strong>Wencey Wang</strong></p>
</div>
</div>
</div>
<div class="col-md-6">
<div class="card border-primary shadow-sm h-100 mb-0 lth-talk lth-talk-sm">
<div class="card-body">
<div class="lth-talk-headshot">
<img src="/assets/images/linux-town-hall-september-2026-speakers/andrew-pam.webp" alt="Andrew Pam">
</div>
<h3 class="card-title mb-1">Life With a Framework Laptop</h3>
<p class="mb-0 text-secondary"><i class="bi bi-person-fill me-1"></i> <strong>Andrew Pam</strong></p>
</div>
</div>
</div>
<div class="col-md-6">
<div class="card border-primary shadow-sm h-100 mb-0 lth-talk lth-talk-sm">
<div class="card-body">
<div class="lth-talk-headshot">
<img src="/assets/images/linux-town-hall-september-2026-speakers/alexar-pendashteh.webp" alt="Alexar Pendashteh">
</div>
<h3 class="card-title mb-1">Omarchy, a Linux Distro with AI</h3>
<p class="mb-0 text-secondary"><i class="bi bi-person-fill me-1"></i> <strong>Alexar Pendashteh</strong></p>
</div>
</div>
</div>
</div>

</div>

## Key Discussion Points
- Software Freedom Day: planning, ideas, and how to get involved
- Linux & AI planning

For upcoming events, we welcome more talks, demos, lightning talk, and presentations:   
<https://linuxvictoria.org/submissions/>

## Pre-Activity: Hardware Exchange & Book Circulation

From 6pm, drop by the 2nd floor lobby (kettle's on for tea and biscuits) for two ongoing community swaps:

- **Hardware Exchange**:  bring along second-hand hardware you no longer need; take home whatever someone else has brought
- **Book Circulation**: bring books to lend, borrow one that catches your eye

No obligation either way. Come for one, both, or just the tea.

## Join In Person

From 7pm, the Town Hall proper moves to the training and learning space (the upstairs room with the computers) at Kathleen Syme Library, for community discussion points, our featured talk, and two short talks.

Maps Link for Kathleen Syme Library:   
<https://maps.app.goo.gl/FhSaC53ERfJYRaBC7>

## How To Join Online

Link to join:   
<https://electronworkshop.com.au/goto/venue>

We use a self-hosted Big Blue Button instance (aka BBB) for this meeting, managed by Electron Workshop and hosted by Serversaurus.

[RSVP](https://luma.com/6p6cr6iz?utm_source=linux-victoria) isn't required but helps us to know numbers (and you will receive updates)

### Schedule

- 18:00 Pre-activity - 2nd floor lobby: tea & biscuits, Hardware Exchange, Book Circulation
- 19:00 Meet and greet
- 19:30 Opening - community discussion points and Software Freedom Day planning
- 19:45 Featured Talk - **Porting Debian 13 to LoongArch** with Wencey Wang
- 20:05 Short talk - **Life With a Framework Laptop** with Andrew Pam
- 20:15 Short talk - **Omarchy, a Linux Distro with AI** with Alexar Pendashteh
- 20:30 Closure - then pizza at Papa Gino's nearby for anyone keen
