import katex from "katex";

export interface RenderLatexSegmentsOptions {
  escapeNonMath?: boolean;
}

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const isEscaped = (input: string, index: number): boolean => {
  let count = 0;
  let i = index - 1;

  while (i >= 0 && input[i] === "\\") {
    count += 1;
    i -= 1;
  }

  return count % 2 === 1;
};

const pushText = (
  target: string[],
  text: string,
  { escapeNonMath = false }: RenderLatexSegmentsOptions,
) => {
  if (!text) return;
  target.push(escapeNonMath ? escapeHtml(text) : text);
};

const renderMath = (latex: string, displayMode: boolean): string => {
  return katex.renderToString(latex, {
    throwOnError: true,
    strict: "warn",
    trust: false,
    output: "html",
    displayMode,
  });
};

const findInlineClose = (input: string, start: number): number => {
  for (let i = start; i < input.length; i += 1) {
    if (input[i] !== "$") continue;
    if (isEscaped(input, i)) continue;
    if (input[i + 1] === "$") continue;
    return i;
  }

  return -1;
};

const findBlockClose = (input: string, start: number): number => {
  for (let i = start; i < input.length - 1; i += 1) {
    if (input[i] !== "$" || input[i + 1] !== "$") continue;
    if (isEscaped(input, i)) continue;
    return i;
  }

  return -1;
};

export const renderLatexSegments = (
  input: string,
  options: RenderLatexSegmentsOptions = {},
): string => {
  const out: string[] = [];
  let cursor = 0;

  while (cursor < input.length) {
    let open = -1;

    for (let i = cursor; i < input.length; i += 1) {
      if (input[i] !== "$") continue;
      if (isEscaped(input, i)) continue;
      open = i;
      break;
    }

    if (open < 0) {
      pushText(out, input.slice(cursor), options);
      break;
    }

    pushText(out, input.slice(cursor, open), options);

    const block = input[open + 1] === "$";
    const openLen = block ? 2 : 1;
    const mathStart = open + openLen;
    const close = block
      ? findBlockClose(input, mathStart)
      : findInlineClose(input, mathStart);

    if (close < 0) {
      pushText(out, input.slice(open), options);
      break;
    }

    const latex = input.slice(mathStart, close);
    const full = input.slice(open, close + openLen);

    try {
      out.push(renderMath(latex, block));
    } catch (_error) {
      pushText(out, full, options);
    }

    cursor = close + openLen;
  }

  return out.join("");
};

export const hasLatexDelimiters = (value: string): boolean => {
  for (let i = 0; i < value.length; i += 1) {
    if (value[i] !== "$") continue;
    if (isEscaped(value, i)) continue;
    return true;
  }

  return false;
};
