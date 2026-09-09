/**
 * Email delivery.
 *
 * Two transports, both credential-driven, and one honest no-op:
 *
 * - **Resend** — set `RESEND_API_KEY`. An HTTP API, so no SMTP dependency.
 * - **A generic endpoint** — set `BOOKING_EMAIL_ENDPOINT` to anything that
 *   accepts `{ to, subject, html, text }` as JSON. Enough to sit in front of
 *   Postmark, SES, a serverless function, or an internal relay.
 * - **Nothing configured** — `sendEmail` returns `{ sent: false }` and logs the
 *   mail it would have sent. It never reports success. The booking API passes
 *   that result to the browser, and the confirmation screen tells the visitor
 *   that no email went out, so the owner's inbox is the only thing missing
 *   rather than the visitor's trust.
 */

import type { EmailContent } from "@/lib/booking/email/templates";

export type SendResult = {
  sent: boolean;
  /** Why not, when `sent` is false. */
  reason?: "not-configured" | "failed";
};

type Transport = {
  id: string;
  send(to: string, content: EmailContent): Promise<boolean>;
};

/** `AMPLIQ <hello@ampliq.de>` — the address the mail comes from. */
function fromAddress(): string {
  const address =
    process.env.BOOKING_FROM_EMAIL ||
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
    "hello@ampliq.de";
  const name = process.env.BOOKING_FROM_NAME || "AMPLIQ";

  return address.includes("<") ? address : `${name} <${address}>`;
}

/** Where booking notifications land. */
export function ownerAddress(): string | null {
  return (
    process.env.BOOKING_OWNER_EMAIL ||
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
    null
  );
}

function getTransport(): Transport | null {
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    return {
      id: "resend",
      async send(to, content) {
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
            reply_to: process.env.BOOKING_REPLY_TO || undefined,
          }),
        });

        if (!response.ok) {
          console.error(
            `[booking] Resend rejected the message with ${response.status}`,
          );
          return false;
        }

        return true;
      },
    };
  }

  const endpoint = process.env.BOOKING_EMAIL_ENDPOINT;
  if (endpoint) {
    const token = process.env.BOOKING_EMAIL_TOKEN;
    return {
      id: "endpoint",
      async send(to, content) {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            ...(token ? { authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            from: fromAddress(),
            to,
            subject: content.subject,
            html: content.html,
            text: content.text,
          }),
        });

        if (!response.ok) {
          console.error(
            `[booking] mail endpoint rejected the message with ${response.status}`,
          );
          return false;
        }

        return true;
      },
    };
  }

  return null;
}

export const emailIsConfigured = (): boolean => getTransport() !== null;

export async function sendEmail(
  to: string,
  content: EmailContent,
): Promise<SendResult> {
  const transport = getTransport();

  if (!transport) {
    // Deliberately loud, and deliberately not a success.
    console.info(
      `[booking] no mail transport configured — not sending "${content.subject}" to ${to}`,
    );
    return { sent: false, reason: "not-configured" };
  }

  try {
    const sent = await transport.send(to, content);
    return sent ? { sent: true } : { sent: false, reason: "failed" };
  } catch (error) {
    console.error("[booking] sending mail threw:", error);
    return { sent: false, reason: "failed" };
  }
}
