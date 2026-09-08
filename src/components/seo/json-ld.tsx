import { jsonLd } from "@/lib/seo";

/**
 * Structured data is data, not executable code, so a plain script tag is the
 * right element here — `next/script` would only add loading machinery.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const payload = Array.isArray(data) ? data : [data];

  return (
    <>
      {payload.map((entry, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(entry) }}
        />
      ))}
    </>
  );
}
