---
title: "LAIT Night Chats: Linux and AI Tuesday Conversations"
eventDate: 2026-06-30
startTime: 9:00 PM
endTime: 10:00 PM
location: "<a href='https://evenue.electronworkshop.com.au/rooms/rde-tyh-fqh-9z7/join'>Linux & AI eVenue</a>"
description: "Join us for weekly informal discussions exploring the intersection of Linux and AI. Every Tuesday night, technologists gather to share knowledge, collaborate, and build community."
preview_image: "http://linuxvictoria.org/assets/images/linux-and-ai-group.webp"
image: "/assets/images/linux-and-ai-group.webp"
hideEventDetails: true
---

<div id="lait-banner" class="alert alert-success mb-4" role="status">
  <div id="lait-banner-pre" style="display:none">
    <strong>LAIT Night starts soon</strong> — informal chat about Linux and AI, 9–10pm Melbourne time.<br>
    Audio-only online session. <a href="https://evenue.electronworkshop.com.au/rooms/rde-tyh-fqh-9z7/join" class="alert-link">Join on eVenue →</a>
    <span id="lait-countdown"></span>
  </div>
  <div id="lait-banner-live">
    <strong>LAIT Night is happening now</strong> — join us until 10pm Melbourne time.<br>
    Informal chat about Linux and AI, audio-only. <a href="https://evenue.electronworkshop.com.au/rooms/rde-tyh-fqh-9z7/join" class="alert-link">Join on eVenue →</a>
  </div>
</div>
<script>
(function () {
  var warnStart = new Date('2026-06-30T10:30:00Z');
  var start     = new Date('2026-06-30T11:00:00Z');
  var end       = new Date('2026-06-30T12:00:00Z');
  var now       = new Date();

  var banner  = document.getElementById('lait-banner');
  var pre     = document.getElementById('lait-banner-pre');
  var live    = document.getElementById('lait-banner-live');

  if (now >= warnStart && now < start) {
    banner.className = 'alert alert-info mb-4';
    pre.style.display = '';
    live.style.display = 'none';
    var mins = Math.ceil((start - now) / 60000);
    document.getElementById('lait-countdown').textContent = ' (' + mins + ' min)';
  } else if (now < warnStart || now >= end) {
    banner.style.display = 'none';
  }
})();
</script>

**LAIT Night Chats** bring together anyone curious about the intersection of Linux and Artificial Intelligence — running local LLMs, AI-powered system administration, open-source ML, and everything in between.

Season 3 is underway. Join us every Tuesday, 9–10pm Melbourne time. Audio-only online session.

## Season 3

**June 30th** — audio-only online · [Join on eVenue →](https://evenue.electronworkshop.com.au/rooms/rde-tyh-fqh-9z7/join)

**June 23rd** — Soft launch

---

## LAIT Nights

### Season 2

**April 21st** — multi-modal models · agentic protocols · robotics simulation · hardware for local AI · homelabbing · Home Assistant — [notes →](/posts/2026-04-21_lait-linux-and-ai)

**April 14th** · **April 7th** · **March 31st** · **March 24th** · **March 17th** · **March 10th** · **March 3rd** · **February 24th** — *[add topics via discussion](https://github.com/orgs/LinuxVictoria/discussions/61)*

**February 17th** — AI pricing · benchmarks · Whisper · Goose AI · Jan AI · DeepSeek · AI sentience readings — [notes →](/posts/2026-02-17_LAIT-Night)

### Season 1

Read [LAIT Night Season 1 Recap](/posts/lait-night-chat-linux-and-ai-season-1)

---

## What Are LAIT Night Chats?

Every Tuesday evening, we bring together technologists, researchers, tinkerers, and curious minds for informal discussions that explore how Linux and AI intersect in our daily work and personal projects. Think of it as a community knowledge exchange where experience levels don't matter - just curiosity and a willingness to learn together.

### The Format

Our sessions are designed to be flexible and community-driven:

- **Check-ins**: Share what you're working on, learning, or struggling with
- **Topic exploration**: Deep dives, demos, or collaborative problem-solving
- **Knowledge capture**: We document insights to build a shared resource library
- **Collaboration**: Discover opportunities to work together on projects

### What We Talk About

The conversations are as diverse as our community interests:

- Setting up and optimizing local LLMs on Linux systems
- AI tooling for system administration and automation
- Privacy-conscious AI services built with open-source tools
- Deploying ML models on edge devices and personal servers
- Contributing to open-source AI projects
- Linux kernel integrations and AI-powered workflows
- Ethics, governance, and decentralization in AI development

## Why Join?

**For the Linux enthusiast**: Discover how AI can enhance your workflows, automate tasks, and open new possibilities for your systems.

**For the AI practitioner**: Learn how Linux provides the foundation for robust, scalable, and privacy-respecting AI deployments.

**For the curious**: Engage with a community that values open source, collaborative learning, and practical problem-solving.

## Community-Driven Knowledge

One of our core goals is building a living knowledge base from our discussions. Each session contributes to a growing collection of insights, tools, configurations, and resources that benefit the entire community. We're not just talking - we're documenting and sharing what we learn.

## Get Involved

LAIT Night Chats work best when the community actively participates. Beyond attending sessions, there are several ways to contribute:

- **Facilitate**: Help guide discussions or propose topics
- **Document**: Take notes and help build our knowledge base
- **Share**: Bring interesting projects, tools, or challenges to explore
- **Connect**: Help spread the word to others who might be interested

## Questions or ideas?

Want to propose a topic, help facilitate, or get involved in planning Season 3? [Reach out](/contact), or find us on [Telegram](https://t.me/linuxvictoria) or the [LUV mailing list](https://lists.linux.org.au/mailman/listinfo/luv-talk).

---

*LAIT Night is a community of Linux and AI enthusiasts running informal discussions, knowledge sharing, and collaborative learning. Season 3 is underway.*
