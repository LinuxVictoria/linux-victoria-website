// "On now" bar and the /join page.
// Reads the online events inlined by partials/liveBar.njk: [{title, url,
// joinUrl, start, end, when}], start/end as ISO instants. All text goes in via
// textContent, and only https links are used, so event data can't inject markup.
(function () {
  var LEAD_MS = 15 * 60 * 1000; // bar and redirect open this long before start

  var data = document.getElementById('online-events');
  if (!data) return;
  var events;
  try { events = JSON.parse(data.textContent); } catch (e) { return; }
  if (!Array.isArray(events)) return;

  var now = Date.now();
  var current = null;
  for (var i = 0; i < events.length; i++) {
    var ev = events[i];
    var start = Date.parse(ev.start), end = Date.parse(ev.end);
    if (!/^https:\/\//.test(ev.joinUrl) || isNaN(start) || isNaN(end)) continue;
    if (now >= start - LEAD_MS && now < end) {
      current = { ev: ev, started: now >= start };
      break;
    }
  }

  function text(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  var joinPage = document.getElementById('join-page');

  // On /join: send people straight to the room, or list what's coming up.
  if (joinPage) {
    // Drop listed events that ended since the last build.
    var items = joinPage.querySelectorAll('[data-end]');
    for (var j = 0; j < items.length; j++) {
      if (Date.parse(items[j].getAttribute('data-end')) <= now) items[j].hidden = true;
    }
    var anyLeft = joinPage.querySelector('[data-end]:not([hidden])');
    var empty = document.getElementById('join-empty');
    if (!anyLeft && empty) empty.hidden = false;

    if (current) {
      text('join-live-title', current.ev.title);
      text('join-live-when', current.ev.when);
      var btn = document.getElementById('join-live-link');
      if (btn) btn.href = current.ev.joinUrl;
      document.getElementById('join-live').hidden = false;
      window.location.replace(current.ev.joinUrl);
    }
    return; // the page itself is the join link; no bar needed
  }

  if (!current) return;
  var bar = document.getElementById('live-bar');
  if (!bar) return;
  text('live-bar-title', current.ev.title);
  text('live-bar-state', current.started ? 'is on now' : 'starts soon');
  document.getElementById('live-bar-link').href = current.ev.joinUrl;
  bar.hidden = false;
})();
