// Angled photo blocks for the annual reports, in the Linux Victoria polygon style
// (inspired by PTV): flat colour, one shared angle, even gaps, nothing decorative.
//
//   band:    full width, with a solid wedge at each end running off the page.
//            1 to 4 photos make one row, 5 to 10 two, more three.
//   cluster: a smaller block with one solid corner, sits beside the text.
//
// Rows always fill their width, so there are no empty cells. Short rows go first,
// which gives their photos more room. Output is plain static SVG, so it prints.

const SLANT = 0.14; // sideways shift per unit of height, about 8 degrees
const GAP = 6;
const INDIGO = "#4E45CA";
const PURPLE = "#803D99";
const ON_DARK = "rgba(255, 255, 255, 0.16)";
const round = (n) => Math.round(n * 10) / 10;

function escapeAttr(text) {
  return String(text).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function rowCounts(n, layout) {
  let rows;
  if (layout === "cluster") rows = n <= 2 ? 1 : 2;
  else rows = n <= 4 ? 1 : n <= 10 ? 2 : 3;
  const base = Math.floor(n / rows);
  const extra = n % rows;
  return Array.from({ length: rows }, (_, i) => base + (i >= rows - extra ? 1 : 0));
}

function rowHeight(count, rowsInBlock, n, width, isBand) {
  if (isBand) return Math.min(Math.max(width / count / 1.5, 170), 250);
  if (n === 1) return 290;
  return rowsInBlock === 1 ? 210 : 165;
}

function polyMesh({ id, photos, label, layout = "band", tone = "light", start = 1, mirror = false, height, oneRow = false, weights }) {
  const isBand = layout === "band";
  const W = isBand ? 880 : oneRow ? 540 : 420;
  const counts = oneRow ? [photos.length] : rowCounts(photos.length, layout);
  const heights = counts.map((count) => height || rowHeight(count, counts.length, photos.length, W, isBand));
  const H = heights.reduce((a, b) => a + b, 0) + GAP * (counts.length - 1);
  const shift = SLANT * H;

  // The block's left and right edges are one parallel pair of slanted lines.
  const inset = isBand ? 30 : 0;
  const leftAt = (y) => inset + SLANT * (H - y);
  const rightAt = (y) => W - inset - SLANT * y;
  const span = W - inset * 2 - shift;

  // Mirroring swaps the lean, which gives a page some rhythm.
  const flip = (x) => (mirror ? W - x : x);

  const shots = [];
  let top = 0;
  counts.forEach((count, r) => {
    const bottom = top + heights[r];
    // `weights` makes some photos wider than others, for a row with a lead photo.
    const shares = weights || Array(count).fill(1);
    const unit = (span - GAP * (count - 1)) / shares.reduce((a, b) => a + b, 0);
    let offset = -GAP;
    for (let i = 0; i < count; i++) {
      offset += GAP;
      const tileW = unit * shares[i];
      const points = [
        [leftAt(top) + offset, top],
        [leftAt(top) + offset + tileW, top],
        [leftAt(bottom) + offset + tileW, bottom],
        [leftAt(bottom) + offset, bottom],
      ].map(([x, y]) => [round(flip(x)), round(y)]);
      shots.push({ points });
      offset += tileW;
    }
    top = bottom + GAP;
  });

  // Photos and numbers always read left to right, top to bottom, mirrored or not.
  const leftEdge = (s) => Math.min(...s.points.map((p) => p[0]));
  const topEdge = (s) => Math.min(...s.points.map((p) => p[1]));
  shots.sort((a, b) => topEdge(a) - topEdge(b) || leftEdge(a) - leftEdge(b));
  shots.forEach((s, i) => {
    s.photo = photos[i];
  });

  const pointList = (points) => points.map((p) => p.join(",")).join(" ");
  const wedge = (points, fill) => `<polygon points="${pointList(points.map(([x, y]) => [round(flip(x)), round(y)]))}" fill="${fill}"/>`;
  const first = tone === "dark" ? ON_DARK : INDIGO;
  const second = tone === "dark" ? ON_DARK : PURPLE;
  const wedges = isBand
    ? wedge([[0, 0], [leftAt(0) - GAP, 0], [leftAt(H) - GAP, H], [0, H]], first) +
      wedge([[rightAt(0) + GAP, 0], [W, 0], [W, H], [rightAt(H) + GAP, H]], second)
    : wedge([[0, 0], [leftAt(0) - GAP, 0], [0, (leftAt(0) - GAP) / SLANT]], tone === "dark" ? ON_DARK : PURPLE);

  const defs = shots
    .map((s, i) => `<clipPath id="${id}-${i}"><polygon points="${pointList(s.points)}"/></clipPath>`)
    .join("");
  const images = shots
    .map((s, i) => {
      const px = s.points.map((p) => p[0]);
      const py = s.points.map((p) => p[1]);
      const [x, y] = [Math.min(...px), Math.min(...py)];
      const [w, h] = [Math.max(...px) - x, Math.max(...py) - y];
      const align = s.photo.align || "xMidYMid";
      return (
        `<image href="${escapeAttr(s.photo.src)}" x="${round(x)}" y="${round(y)}" width="${round(w)}" height="${round(h)}" ` +
        `preserveAspectRatio="${align} slice" clip-path="url(#${id}-${i})" role="img" aria-label="${escapeAttr(s.photo.alt)}"/>`
      );
    })
    .join("");

  // Reference numbers, so anyone can say "swap photo 14". They run on across the
  // report: `start` is the number of this block's first photo.
  const badges = shots
    .map((s, i) => {
      const [x, y] = [leftEdge(s) + (mirror ? 0 : SLANT * (Math.max(...s.points.map((p) => p[1])) - topEdge(s))), topEdge(s)];
      const text = String(start + i);
      const width = 12 + text.length * 8;
      return (
        `<g class="poly-number" transform="translate(${round(x + 6)} ${round(y + 6)})">` +
        `<rect width="${width}" height="20" rx="3"/><text x="${width / 2}" y="14.5">${text}</text></g>`
      );
    })
    .join("");

  return (
    `<svg class="poly poly-${layout}" viewBox="0 0 ${W} ${round(H)}" role="group" aria-label="${escapeAttr(label)}">` +
    `<defs>${defs}</defs>${wedges}${images}${badges}</svg>`
  );
}

module.exports = polyMesh;
