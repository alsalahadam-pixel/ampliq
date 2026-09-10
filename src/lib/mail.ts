/**
 * Email delivery — the one transport the whole site sends through.
 *
 * Two transports, both credential-driven, and one honest no-op:
 *
 * - **Resend** — set `RESEND_API_KEY`. An HTTP API, so no SMTP dependency.
 * - **A generic endpoint** — set `MAIL_ENDPOINT` to anything that accepts
 *   `{ to, subject, html, text }` as JSON. Enough to sit in front of Postmark,
 *   SES, a serverless function, or an internal relay.
 * - **Nothing configured** — `sendEmail` returns `{ sent: false }` and logs the
 *   mail it would have sent. It never reports success. Callers pass that
 *   result to the browser, and the UI says plainly that nothing was delivered
 *   rather than showing a success screen that isn't one.
 */

import { contact } from "@/lib/site";

/** A message, ready to send. Both HTML and text, always. */
export type EmailContent = {
  subject: string;
  html: string;
  text: string;
};

export type SendResult = {
  sent: boolean;
  /** Why not, when `sent` is false. */
  reason?: "not-configured" | "failed";
};

type Transport = {
  id: string;
  send(to: string, content: EmailContent, replyTo?: string): Promise<boolean>;
};

/** `AMPLIQ <project@ampliq.net>` — the address the mail comes from. */
function fromAddress(): string {
  const address =
    process.env.MAIL_FROM_EMAIL || process.env.BOOKING_FROM_EMAIL || contact.info;
  const name = process.env.MAIL_FROM_NAME || process.env.BOOKING_FROM_NAME || "AMPLIQ";

  return address.includes("<") ? address : `${name} <${address}>`;
}

/**
 * Where enquiries and booking notifications land.
 *
 * Both are commercial, so both go to the project address unless the operator
 * points them somewhere else.
 */
export function notificationAddress(): string {
  return (
    process.env.MAIL_NOTIFICATION_EMAIL ||
    process.env.BOOKING_OWNER_EMAIL ||
    contact.project
  );
}

function getTransport(): Transport | null {
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    return {
      id: "resend",
      async send(to, content, replyTo) {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            authorization: `Bearer ${resendKey}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            from: fromAddress(),
            to: [to],
            subject: content.subject,
            html: content.html,
            text: content.text,
            reply_to: replyTo || process.env.MAIL_REPLY_TO || undefined,
          }),
        });

        if (!response.ok) {
          console.error(
            `[mail] Resend rejected the message with ${response.status}`,
          );
          return false;
        }

        return true;
      },
    };
  }

  const endpoint = process.env.MAIL_ENDPOINT || process.env.BOOKING_EMAIL_ENDPOINT;
  if (endpoint) {
    const token = process.env.MAIL_ENDPOINT_TOKEN || process.env.BOOKING_EMAIL_TOKEN;
    return {
      id: "endpoint",
      async send(to, content, replyTo) {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            ...(token ? { authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            from: fromAddress(),
            to,
            replyTo: replyTo || process.env.MAIL_REPLY_TO || undefined,
            subject: content.subject,
            html: content.html,
            text: content.text,
          }),
        });

        if (!response.ok) {
          console.error(
            `[mail] endpoint rejected the message with ${response.status}`,
          );
          return false;
        }

        return true;
      },
    };
  }

  return null;
}

export const mailIsConfigured = (): boolean => getTransport() !== null;

export async function sendEmail(
  to: string,
  content: EmailContent,
  /** Set so a reply goes straight back to the enquirer, not to the mailbox. */
  replyTo?: string,
): Promise<SendResult> {
  const transport = getTransport();

  if (!transport) {
    // Deliberately loud, and deliberately not a success.
    console.info(
      `[mail] no transport configured — not sending "${content.subject}" to ${to}`,
    );
    return { sent: false, reason: "not-configured" };
  }

  try {
    const sent = await transport.send(to, content, replyTo);
    return sent ? { sent: true } : { sent: false, reason: "failed" };
  } catch (error) {
    console.error("[mail] sending threw:", error);
    return { sent: false, reason: "failed" };
  }
}
