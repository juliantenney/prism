# line 7993 role=assistant

Pre-implementation findings:

1. **A** — Not a learner SVG bug. Diagram `relationships[]` are caption-only; image briefs use generic “Relationships” layout text, so the model invents positional connectors. Owner: visual-jobs / image-brief projection.
2. **B** — Owner: XD template in `expository-sibling-prompts.js`.
3. **C** — Owner: XD `materials_commission` + DP visual planning (same file).
4. **Files** — `utilities-visual-jobs-workspace.js`, `prism-image-brief-compiler.js` (A); `expository-sibling-prompts.js` (B/C); focused tests + T-007 docs.
5. **None blocked** — A is a shared image-brief fix (correct for any diagram with `from`/`to`); B/C stay Expository-sibling-only.

Implementing all three.

[tool_use Read]
{
  "limit": 120,
  "offset": 400,
  "path": "c:\\xampp\\htdocs\\prism\\lib\\utilities-visual-jobs-workspace.js"
}
[tool_use Read]
{
  "limit": 100,
  "offset": 560,
  "path": "c:\\xampp\\htdocs\\prism\\lib\\utilities-visual-jobs-workspace.js"
}
[tool_use Grep]
{
  "path": "c:\\xampp\\htdocs\\prism\\lib\\prism-image-brief-compiler.js",
  "pattern": "Relationships|relationship|generation_instruction|content_structured|evidence"
}
[tool_use Grep]
{
  "path": "c:\\xampp\\htdocs\\prism\\tests",
  "pattern": "buildRelationshipItems|Relationships:|image.?brief|compilePrismImageBriefs|visual-jobs",
  "glob": "**/*.{js,md}",
  "head_limit": 40
}
[tool_use Read]
{
  "limit": 80,
  "offset": 260,
  "path": "c:\\xampp\\htdocs\\prism\\lib\\expository-sibling-prompts.js"
}