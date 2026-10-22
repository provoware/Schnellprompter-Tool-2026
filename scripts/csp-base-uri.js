// Zentraler, ohne Browser-Abhaengigkeiten pruefbarer CSP-Vertrag.
export function hasStrictBaseUri(html) {
  const metaTags = [...html.matchAll(/<meta\b[^>]*>/gi)].map((match) => match[0]);
  const policies = metaTags.filter((tag) =>
    /\bhttp-equiv\s*=\s*(?:"Content-Security-Policy"|'Content-Security-Policy')/i.test(tag)
  );
  if (policies.length !== 1) return false;

  const content = policies[0].match(/\bcontent\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
  if (!content) return false;

  const directives = (content[1] ?? content[2]).split(";")
    .map((entry) => entry.trim().split(/\s+/))
    .filter(([name]) => name.toLowerCase() === "base-uri");
  return directives.length === 1
    && directives[0].length === 2
    && directives[0][1] === "'none'";
}
