// netlify/functions/form-notify.js
//
// Receives Netlify Form submission webhooks and forwards a summary to Telegram.
//
// Each form can optionally route to its own chat/topic by adding env vars named:
//   TELEGRAM_FORMS_<FORM_NAME>_CHAT_ID    (e.g. TELEGRAM_FORMS_CONTACTFORM_CHAT_ID)
//   TELEGRAM_FORMS_<FORM_NAME>_THREAD_ID
// Otherwise falls back to the global TELEGRAM_FORMS_CHAT_ID / TELEGRAM_FORMS_THREAD_ID.
//
// Required env vars (global fallbacks):
//   TELEGRAM_BOT_TOKEN
//   TELEGRAM_FORMS_CHAT_ID
//   TELEGRAM_FORMS_THREAD_ID   (optional – omit if your group has no topics)

// Field names that Netlify injects automatically – not useful to show in the message
const NETLIFY_INTERNAL_FIELDS = new Set(["ip", "user_agent", "referrer", "netlify-bot-field"]);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  const formName = (payload.form_name || payload.form_id || "unknown form").trim();
  const siteUrl  = payload.site_url || "";
  const submittedAt = payload.created_at
    ? new Date(payload.created_at).toUTCString()
    : new Date().toUTCString();

  // Prefer human_fields (Netlify-formatted labels) over raw data
  const rawFields = payload.human_fields || payload.data || {};

  // Build a readable field list, skipping internal Netlify fields
  const lines = Object.entries(rawFields)
    .filter(([key]) => !NETLIFY_INTERNAL_FIELDS.has(key.toLowerCase()))
    .filter(([, val]) => val !== null && val !== undefined && String(val).trim() !== "")
    .map(([key, val]) => {
      const label = key.replace(/_/g, " ");
      const value = Array.isArray(val) ? val.join(", ") : String(val);
      return `• *${label}*: ${value}`;
    });

  const fieldsText = lines.length ? lines.join("\n") : "_No fields submitted_";

  const text =
    `📋 *Form submission* — \`${formName}\`\n` +
    `🕐 ${submittedAt}\n` +
    (siteUrl ? `🔗 ${siteUrl}/netlify/forms\n` : "") +
    `\n${fieldsText}`;

  // ── Resolve Telegram target ──────────────────────────────────────────────────
  // Check for a form-specific override first, then fall back to global defaults.
  // Env key uses the uppercased form name with non-alphanumeric chars replaced by _.
  const envKey = formName.toUpperCase().replace(/[^A-Z0-9]/g, "_");

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId   =
    process.env[`TELEGRAM_FORMS_${envKey}_CHAT_ID`] ||
    process.env.TELEGRAM_FORMS_CHAT_ID;
  const threadId =
    process.env[`TELEGRAM_FORMS_${envKey}_THREAD_ID`] ||
    process.env.TELEGRAM_FORMS_THREAD_ID ||
    null;

  if (!botToken || !chatId) {
    console.error("form-notify: missing TELEGRAM_BOT_TOKEN or TELEGRAM_FORMS_CHAT_ID");
    // Return 200 so Netlify doesn't retry endlessly
    return { statusCode: 200, body: "Notification skipped – missing config" };
  }

  // ── Send to Telegram ─────────────────────────────────────────────────────────
  const body = new URLSearchParams({
    chat_id: chatId,
    text,
    parse_mode: "Markdown",
    disable_web_page_preview: "true",
  });
  if (threadId) body.set("message_thread_id", threadId);

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      { method: "POST", body }
    );
    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("form-notify: Telegram error", JSON.stringify(json));
      return { statusCode: 500, body: "Telegram error" };
    }

    console.log("form-notify: sent for form", formName, "→ message_id", json?.result?.message_id);
    return { statusCode: 200, body: "OK" };
  } catch (err) {
    console.error("form-notify: fetch error", err);
    return { statusCode: 500, body: "Network error" };
  }
};
