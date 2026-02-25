import { ReactNode } from "react";
import { PortableTextBlock } from "@/types/sanity";

function applyMarks(text: string, marks: string[] | undefined, keyBase: string) {
  if (!marks || marks.length === 0) return text;

  return marks.reduce<ReactNode>((node, mark, index) => {
    if (mark === "strong") {
      return <strong key={`${keyBase}-strong-${index}`}>{node}</strong>;
    }

    if (mark === "em") {
      return <em key={`${keyBase}-em-${index}`}>{node}</em>;
    }

    return node;
  }, text);
}

export function renderProjectTitle(
  title: string,
  formattedTitle?: PortableTextBlock[],
) {
  if (!formattedTitle || formattedTitle.length === 0) return title;

  const blocks = formattedTitle.filter((block) => block._type === "block");
  if (blocks.length === 0) return title;

  return blocks.map((block, blockIndex) => (
    <span key={block._key ?? `block-${blockIndex}`}>
      {block.children?.map((span, spanIndex) => (
        <span key={`${block._key ?? blockIndex}-span-${spanIndex}`}>
          {applyMarks(
            span.text ?? "",
            span.marks,
            `${block._key ?? blockIndex}-${spanIndex}`,
          )}
        </span>
      ))}
      {blockIndex < blocks.length - 1 ? <br /> : null}
    </span>
  ));
}
