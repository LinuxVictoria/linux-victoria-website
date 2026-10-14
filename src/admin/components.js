// Editor components: lets editors drop the site's Nunjucks partials into a page body
// from the "+" menu (rich text mode) and edit their settings in a small form.

const esc = (s) => String(s ?? "").replace(/\\/g, "\\\\").replace(/"/g, '\\"');

// Nunjucks accepts JSON-style literals, so blocks are written as JSON. Hand-written
// blocks use bare keys, single quotes and trailing commas, which are rewritten as
// JSON before parsing.
function parseNunjucksList(src) {
  let out = "";
  for (let i = 0; i < src.length; ) {
    const ch = src[i];
    if (ch === '"' || ch === "'") {
      let str = "";
      for (i++; i < src.length && src[i] !== ch; i++) {
        if (src[i] === "\\") i++;
        str += src[i];
      }
      i++;
      out += JSON.stringify(str);
    } else if (/[A-Za-z_]/.test(ch)) {
      const word = /^[A-Za-z_]\w*/.exec(src.slice(i))[0];
      i += word.length;
      out += /^\s*:/.test(src.slice(i)) ? JSON.stringify(word) : word;
    } else {
      out += ch;
      i++;
    }
  }
  return JSON.parse(out.replace(/,(\s*[}\]])/g, "$1"));
}

CMS.registerEditorComponent({
  id: "speakers",
  label: "Speakers",
  fields: [
    {
      name: "speakers",
      label: "Speakers",
      widget: "list",
      fields: [
        { name: "name", label: "Name", widget: "string" },
        { name: "talk", label: "Talk", widget: "string", hint: "Use TBC while the line-up is being settled" },
        { name: "image", label: "Headshot", widget: "image", required: false },
        { name: "bio", label: "Bio", widget: "text", required: false },
        { name: "featured", label: "Featured talk", widget: "boolean", required: false, default: false },
      ],
    },
  ],
  pattern: /^{%-?\s*set speakers = (\[[\s\S]*?\])\s*-?%}\s*{%-?\s*include "partials\/speakers\.njk"\s*-?%}/,
  fromBlock: (match) => ({ speakers: parseNunjucksList(match[1]) }),
  toBlock: ({ speakers = [] }) => {
    const clean = speakers.map((s) =>
      Object.fromEntries(Object.entries(s).filter(([, v]) => v !== "" && v !== false && v != null))
    );
    return `{% set speakers = ${JSON.stringify(clean, null, 2)} %}\n{% include "partials/speakers.njk" %}`;
  },
  toPreview: ({ speakers = [] }) =>
    `<div style="border:1px dashed #803D99;padding:1em"><strong>Speakers</strong><ul>${speakers
      .map((s) => `<li>${s.featured ? "★ " : ""}${s.name}: ${s.talk}</li>`)
      .join("")}</ul></div>`,
});

CMS.registerEditorComponent({
  id: "button",
  label: "Button",
  fields: [
    { name: "text", label: "Text", widget: "string" },
    { name: "href", label: "Link", widget: "string" },
    { name: "style", label: "Style", widget: "select", options: ["primary", "secondary", "outline-primary", "outline-secondary"], default: "primary" },
    { name: "align", label: "Align", widget: "select", options: ["start", "center", "end"], default: "center" },
  ],
  pattern: /^{% set text = "(.*?)" %}{% set href = "(.*?)" %}{% set style = "(.*?)" %}{% set align = "(.*?)" %}{% include "partials\/btn\.njk" %}/,
  fromBlock: (m) => ({ text: m[1], href: m[2], style: m[3], align: m[4] }),
  toBlock: ({ text, href, style = "primary", align = "center" }) =>
    `{% set text = "${esc(text)}" %}{% set href = "${esc(href)}" %}{% set style = "${esc(style)}" %}{% set align = "${esc(align)}" %}{% include "partials/btn.njk" %}`,
  toPreview: ({ text }) => `<p style="text-align:center"><button>${text}</button></p>`,
});

// Partials that take no settings
const simple = [
  ["communityGallery", "Community photo gallery"],
  ["newsletterEngageForm", "Newsletter sign-up"],
];
for (const [file, label] of simple) {
  CMS.registerEditorComponent({
    id: file,
    label,
    fields: [],
    pattern: new RegExp(`^{%-?\\s*include "partials/${file}\\.njk"\\s*-?%}`),
    fromBlock: () => ({}),
    toBlock: () => `{% include "partials/${file}.njk" %}`,
    toPreview: () => `<div style="border:1px dashed #803D99;padding:1em"><strong>${label}</strong></div>`,
  });
}
