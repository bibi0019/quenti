import type { JSONContent } from "@tiptap/react";
import React from "react";
import { FilterXSS, escapeAttrValue, getDefaultWhiteList } from "xss";

import { richTextToHtml } from "@quenti/lib/editor";
import { hasLatexDelimiters, renderLatexSegments } from "@quenti/lib/latex";
import type { Prisma } from "@quenti/prisma/client";

import { ScriptFormatter } from "./script-formatter";

const whitelist = getDefaultWhiteList();
// Style attribute should still be safe from xss, just saves compute time on other elements
whitelist.mark?.push("style");
whitelist.span?.push("class");

const xss = new FilterXSS({
  whiteList: whitelist,
  onIgnoreTagAttr: function (_tag, name, value) {
    if (name.substring(0, 5) === "data-") {
      return `${name}="${escapeAttrValue(value)}"`;
    }
  },
});

export const Display: React.FC<{
  text: string;
  richText?: Prisma.JsonValue | JSON | JSONContent;
}> = ({ text, richText }) => {
  if (richText) {
    const rendered = renderLatexSegments(
      richTextToHtml(richText as JSONContent, true),
    );

    return (
      <p
        dangerouslySetInnerHTML={{
          __html: xss.process(rendered),
        }}
      />
    );
  }

  if (!hasLatexDelimiters(text)) {
    return <ScriptFormatter>{text}</ScriptFormatter>;
  }

  return (
    <span
      dangerouslySetInnerHTML={{
        __html: xss.process(
          renderLatexSegments(text, {
            escapeNonMath: true,
          }),
        ),
      }}
    />
  );
};
