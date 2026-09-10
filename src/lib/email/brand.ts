/**
 * The AMPLIQ email shell.
 *
 * Every message the site sends — booking confirmations, owner notifications,
 * enquiry acknowledgements — is built from these pieces, so they cannot drift
 * apart visually.
 *
 * Written as tables with inline styles because that is what mail clients
 * actually render: Outlook has no flexbox and Gmail strips `<style>` blocks.
 * The mark is a letterspaced wordmark rather than an image — SVG does not
 * render in Gmail, and a remote PNG stays blocked until the reader chooses to
 * load images, which would leave the header empty for most people.
 */

import { type Locale } from "@/lib/i18n";
import { contact, siteUrl } from "@/lib/site";

export const INK = "#0f0f0e";
export const PAPER = "#f7f5f2";
export const GRAPHITE = "#6b6862";
export const ACCENT = "#1b4dff";
export const RULE = "#e3ded6";

export const FONT =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";

/** BCP-47 tags for the date and time formatters. */
export const INTL_TAG: Record<Locale, string> = { en: "en-GB", de: "de-DE" };

const TAGLINE: Record<Locale, string> = {
  en: "Marketing, amplified.",
  de: "Marketing, verstärkt.",
};

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Preserves the paragraph breaks the sender typed. */
export function paragraphs(value: string): string {
  return escapeHtml(value)
    .split(/\n{2,}/)
    .map(
      (block) =>
        `<p style="margin:0 0 14px;font-family:${FONT};font-size:15px;line-height:1.6;color:${INK}">${block.replace(
          /\n/g,
          "<br>",
        )}</p>`,
    )
    .join("");
}

/** One label/value line in a details table. */
export function row(label: string, value: string): string {
  return `<tr>
  <td style="padding:10px 0;border-bottom:1px solid ${RULE};font-family:${FONT};font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:${GRAPHITE};width:38%;vertical-align:top;">${escapeHtml(label)}</td>
  <td style="padding:10px 0;border-bottom:1px solid ${RULE};font-family:${FONT};font-size:15px;line-height:1.5;color:${INK};vertical-align:top;">${escapeHtml(value)}</td>
</tr>`;
}

/** Section label above a block of copy. */
export function eyebrow(text: string): string {
  return `<h2 style="margin:28px 0 10px;font-family:${FONT};font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:${GRAPHITE};">${escapeHtml(text)}</h2>`;
}

export function heading(text: string): string {
  return `<h1 style="margin:0 0 14px;font-family:${FONT};font-size:26px;line-height:1.2;font-weight:700;letter-spacing:-0.02em;color:${INK};">${escapeHtml(text)}</h1>`;
}

export function lead(text: string): string {
  return `<p style="margin:0 0 26px;font-family:${FONT};font-size:15px;line-height:1.6;color:${GRAPHITE};">${escapeHtml(text)}</p>`;
}

export function detailsTable(rows: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${RULE};">${rows}</table>`;
}

/** Wraps a body in the branded frame. */
/**
 * The shell every message is built in.
 *
 * `replyTo` is the address printed in the footer: the project address on
 * anything to do with a project, so a reply lands in the same conversation,
 * and the general one otherwise. It defaults to the general address because
 * that is the safe answer for a message whose subject is not a project.
 */
export function emailShell(
  bodyHtml: string,
  locale: Locale,
  replyTo: string = contact.info,
): string {
  return `<!doctype html>
<html lang="${locale}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>AMPLIQ</title>
</head>
<body style="margin:0;padding:0;background-color:${PAPER};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${PAPER};">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background-color:#ffffff;border:1px solid ${RULE};">

<tr><td style="padding:28px 32px 24px;border-bottom:1px solid ${RULE};">
  <span style="font-family:${FONT};font-size:17px;font-weight:700;letter-spacing:0.22em;color:${INK};">AMPLIQ</span>
</td></tr>

<tr><td style="padding:32px;">
${bodyHtml}
</td></tr>

<tr><td style="padding:24px 32px 28px;border-top:1px solid ${RULE};background-color:${PAPER};">
  <p style="margin:0 0 6px;font-family:${FONT};font-size:13px;line-height:1.5;color:${GRAPHITE};">
    AMPLIQ — ${TAGLINE[locale]}
  </p>
  <p style="margin:0;font-family:${FONT};font-size:13px;line-height:1.5;color:${GRAPHITE};">
    <a href="${siteUrl}" style="color:${ACCENT};text-decoration:none;">${siteUrl.replace(/^https?:\/\//, "")}</a>
    &nbsp;·&nbsp;
    <a href="mailto:${replyTo}" style="color:${ACCENT};text-decoration:none;">${replyTo}</a>
  </p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

/** Plain-text footer, matching the HTML one. */
export function textFooter(
  locale: Locale,
  replyTo: string = contact.info,
): string[] {
  return ["", `AMPLIQ — ${TAGLINE[locale]}`, siteUrl, replyTo];
}
