import { Fragment } from "react";
import Link from "next/link";

/**
 * Renders a paragraph of text that may contain inline markdown-style links.
 * Internal links (starting with "/") render as Next.js <Link> for fast,
 * prefetched client navigation; anything else falls back to a styled <a>.
 *
 * Syntax: "Plan your [backyard party](/blog/planning-catering-backyard-party)."
 */
const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;

const linkClass =
  "font-semibold text-[#E67E00] underline decoration-[#FF8C00]/40 underline-offset-2 transition hover:decoration-[#FF8C00] hover:text-[#FF8C00]";

export function RichText({ text }: { text: string }) {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  LINK_PATTERN.lastIndex = 0;
  while ((match = LINK_PATTERN.exec(text)) !== null) {
    const [full, label, href] = match;

    if (match.index > lastIndex) {
      nodes.push(
        <Fragment key={`t-${lastIndex}`}>{text.slice(lastIndex, match.index)}</Fragment>,
      );
    }

    if (href.startsWith("/")) {
      nodes.push(
        <Link key={`l-${match.index}`} href={href} className={linkClass}>
          {label}
        </Link>,
      );
    } else {
      nodes.push(
        <a
          key={`l-${match.index}`}
          href={href}
          className={linkClass}
          rel="noopener noreferrer"
        >
          {label}
        </a>,
      );
    }

    lastIndex = match.index + full.length;
  }

  if (lastIndex < text.length) {
    nodes.push(<Fragment key={`t-${lastIndex}`}>{text.slice(lastIndex)}</Fragment>);
  }

  return <>{nodes}</>;
}
