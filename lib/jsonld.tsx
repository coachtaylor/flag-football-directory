// lib/jsonld.tsx
export function JsonLd({ data, id }: { data: any; id?: string }) {
  return (
    <script
      id={id}
      type="application/ld+json"
      // JSON-LD must be a string, not an object:
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
