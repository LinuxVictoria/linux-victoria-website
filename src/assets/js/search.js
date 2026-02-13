// /assets/js/search.js — Bootstrap-only Pagefind search with title-first ranking

let pf, pfReady = false;

async function ensurePagefind() {
  if (pfReady) return;
  pf = await import("/pagefind/pagefind.js");  // served from _site/pagefind/
  await pf.init();
  pfReady = true;
}

// Navbar button calls this
function openSearch() {
  const el = document.getElementById('searchModal');
  const modal = bootstrap.Modal.getOrCreateInstance(el);
  modal.show();
}

function esc(s) {
  const map = { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;', "'":'&#39;' };
  return (s || '').replace(/[&<>"']/g, m => map[m]);
}

function truncate(text, n = 140) {
  const t = (text || '').trim();
  return t.length > n ? t.slice(0, n).trim() + '…' : t;
}

function emptyStateHTML() {
  return `
    <div class="text-muted text-center py-4">
      <i class="bi bi-search fs-1 d-block mb-3"></i>
      Start typing to search…
    </div>`;
}

// Merge tags from meta and filters; drop generic 'post/page'
function extractTags(meta, filters) {
  const out = [];
  const seen = new Set();
  const skip = new Set(['post','posts','page','pages']);

  function addAll(arr) {
    for (const raw of arr || []) {
      const s = String(raw).trim();
      const k = s.toLowerCase();
      if (!s || skip.has(k) || seen.has(k)) continue;
      seen.add(k);
      out.push(s);
    }
  }
  const m = meta?.tags;
  addAll(Array.isArray(m) ? m : (m ? String(m).split(/[,|]/) : []));
  const f = (filters?.tags ?? filters?.tag);
  addAll(Array.isArray(f) ? f : (f ? [f] : []));
  return out;
}

// Normalizer to make matching robust
function norm(s) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")                 // split accents
    .replace(/\p{Diacritic}/gu, ""); // strip accents
}

document.addEventListener('DOMContentLoaded', () => {
  const modalEl = document.getElementById('searchModal');
  modalEl?.addEventListener('shown.bs.modal', () => {
    const input = document.getElementById('searchInput');
    const resultsEl = document.getElementById('searchResults');
    resultsEl.innerHTML = emptyStateHTML();
    input?.focus();
    ensurePagefind(); // warm quietly
  });
});

// Called by your input's oninput
async function performSearch() {
  const input = document.getElementById('searchInput');
  const resultsEl = document.getElementById('searchResults');
  const q = (input?.value || '').trim();

  if (q.length < 2) {
    resultsEl.innerHTML = emptyStateHTML();
    return;
  }

  if (!pfReady) {
    resultsEl.innerHTML = `
      <div class="text-center py-4">
        <div class="spinner-border text-primary" role="status" aria-hidden="true"></div>
        <div class="mt-2 text-secondary">Loading search…</div>
      </div>`;
    await ensurePagefind();
  }

  const search = await pf.debouncedSearch(q, {}, 300);
  if (search === null) return;

  // Pull a larger set before re-ranking
  const raw = await Promise.all(search.results.slice(0, 50).map(r => r.data()));

  // Title-first ranking
  const qn = norm(q);
  const terms = qn.split(/\s+/).filter(Boolean);

  function scoreResult(r, idx) {
    const title = norm(r.meta?.title || "");
    const desc  = norm(r.meta?.description || "");
    const text  = norm((r.excerpt || "").replace(/<[^>]*>/g, ""));

    const exactTitle     = title === qn;
    const startsWith     = title.startsWith(qn);
    const allTermsTitle  = terms.length > 0 && terms.every(t => title.includes(t));
    const anyTermTitle   = terms.length > 0 && terms.some(t => title.includes(t));

    const anyTermDesc    = terms.length > 0 && terms.some(t => desc.includes(t));
    const anyTermExcerpt = terms.length > 0 && terms.some(t => text.includes(t));

    let s = 0;

    // Strong boosts for title matches
    if (exactTitle)    s += 1000;
    if (startsWith)    s += 700;
    if (allTermsTitle) s += 600;
    if (anyTermTitle)  s += 300;

    // Gentle boosts for non-title matches so they remain visible but lower
    if (anyTermDesc)    s += 30;
    if (anyTermExcerpt) s += 10;

    // Tie-breakers: prefer shorter titles, preserve a bit of original order
    s += Math.max(0, 100 - (title.length || 0));
    s += Math.max(0, 50  - idx);

    return s;
  }

  const ranked = raw
    .map((r, i) => ({ r, i, s: scoreResult(r, i) }))
    .sort((a, b) => b.s - a.s)
    .map(x => x.r);

  const top = ranked.slice(0, 10);

  if (!top.length) {
    resultsEl.innerHTML = `
      <div class="alert alert-warning mb-0" role="alert">
        No results for "<strong>${esc(q)}</strong>"
      </div>`;
    return;
  }

  let html = '<div class="list-group">';
  for (const r of top) {
    const url   = r.url;
    const title = r.meta?.title ? esc(r.meta.title) : 'Untitled';

    // Prefer meta description; fallback to Pagefind excerpt (HTML stripped)
    const desc  = r.meta?.description || '';
    const excerpt = r.excerpt ? r.excerpt.replace(/<[^>]*>/g, '') : '';
    const preview = esc(truncate(desc || excerpt || '', 140));

    const tags  = extractTags(r.meta, r.filters);
    const previewImg = r.meta?.preview_image || null;

    const badges = tags.length
      ? tags.map(t => `<span class="badge rounded-pill text-bg-primary me-2 mb-2">${esc(t)}</span>`).join('')
      : '';

    const rightCol = previewImg ? `
      <div class="d-flex flex-column align-items-end ms-sm-3 mt-3 mt-sm-0">
        <!-- mobile -->
        <img src="${esc(previewImg)}" alt="${title}"
             class="img-fluid rounded-3 d-sm-none"
             style="width:140px;height:auto;">
        <!-- sm+ -->
        <img src="${esc(previewImg)}" alt="${title}"
             class="img-fluid rounded-3 d-none d-sm-block"
             style="width:180px;height:auto;">
        <i class="bi bi-arrow-right fs-4 text-primary mt-2 d-none d-sm-block"></i>
      </div>
    ` : `
      <div class="text-primary d-none d-sm-flex align-items-center ms-sm-3 mt-sm-0 mt-3">
        <i class="bi bi-arrow-right fs-4"></i>
      </div>
    `;

    html += `
      <a href="${url}" class="list-group-item list-group-item-action hover-border-primary card bg-body-tertiary rounded-3 shadow-sm border border-primary border-opacity-25 overflow-hidden position-relative p-3 mb-3">
        <div class="d-flex flex-column flex-sm-row align-items-start">
          <div class="flex-grow-1 pe-0 pe-sm-2">
            <div class="mb-2 d-flex flex-wrap align-items-center">${badges}</div>
            <h6 class="mb-1 text-primary">${title}</h6>
            <p class="mb-0 small text-secondary">${preview}</p>
          </div>
          ${rightCol}
        </div>
      </a>`;
  }
  html += '</div>';
  resultsEl.innerHTML = html;
}

window.openSearch = openSearch;
window.performSearch = performSearch;
