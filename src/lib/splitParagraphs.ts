// CMS text fields on the redesigned pages ask editors to separate paragraphs
// with an empty line (plain `text` fields, no Portable Text). Split on blank
// lines and drop empty leftovers.
export function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}
