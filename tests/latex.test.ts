import { renderLatexSegments } from "../packages/lib/latex";

describe("renderLatexSegments", () => {
  test("renders inline math delimited by $...$", () => {
    const out = renderLatexSegments("Area is $\\pi r^2$.");

    expect(out).toContain("katex");
    expect(out).toContain("Area is ");
  });

  test("renders block math delimited by $$...$$", () => {
    const out = renderLatexSegments("$$\\frac{a}{b}$$");

    expect(out).toContain("katex-display");
  });

  test("keeps escaped dollars as plain text", () => {
    const out = renderLatexSegments("Cost is \\$5");

    expect(out).toContain("Cost is \\$5");
    expect(out).not.toContain("katex");
  });

  test("falls back to original segment for invalid latex", () => {
    const out = renderLatexSegments("Broken: $\\invalidcommand{1}$");

    expect(out).toContain("$\\invalidcommand{1}$");
  });

  test("handles mixed plain text and math", () => {
    const out = renderLatexSegments("H₂O and $x^2$");

    expect(out).toContain("H₂O and ");
    expect(out).toContain("katex");
  });

  test("preserves html wrapper and renders math inside", () => {
    const out = renderLatexSegments("<p>f(x) = $x^2$</p>");

    expect(out).toContain("<p>");
    expect(out).toContain("</p>");
    expect(out).toContain("katex");
  });
});
