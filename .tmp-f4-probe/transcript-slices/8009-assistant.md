# line 8009 role=assistant

## Pre-impl (done) → implementation complete

### Root causes / owners
| | Owner | Cause |
|---|---|---|
| **A** | Image-brief seam (`prism-image-brief-compiler` + `utilities-visual-jobs-workspace`) | Not SVG/index layout. `relationships[]` never projected; generic “Relationships” + truncated JSON → model invents positional connectors |
| **B** | XD `expository_development` | Mild EQ6 register drift; no prior restrained guidance |
| **C** | XD `materials_commission` + DP visual planning | Warrant existed but weak; no “distinct function / a11y ≠ redundancy” |

None blocked as framed. A is shared image-brief (independently correct). B/C Expository-sibling only.

---

### Behaviour changed
**A:** Authorised `from→to` edges (id→label) → human `Relationships:` + canonical `5c. Authorised connectors`; anti-positional rule; `must_show` `A → B` phrases; DP asks for explicit connector pairs when figures show relationships.

**B:** XD `Expository register (EQ6)` — importance via explanation; no phrase blacklist.

**C:** XD/DP: distinct explanatory/perceptual function; do not commission mere restatement; accessibility equivalence ≠ redundancy.

### Files
`lib/prism-image-brief-compiler.js`, `lib/utilities-visual-jobs-workspace.js`, `lib/expository-sibling-prompts.js`, `tests/s87-t007-authorised-connector-geometry.test.js`, `tests/s85-wp3-expository-sibling-prompts.test.js`, T-007 docs (S87-D12 / AD-012).

### Tests / gates
- Connector + sibling: **19/19**
- Focused S87 + Sprint 70 human-prompt: **107/107**
- First-class: **339/339**
- Interactive pack templates: unchanged (asserted)

### Deliberately not done
Phrase blacklists; semantic dedupe / caps / T-009 Option B; SVG diagram engine; score-chasing.

### Limitations
- **A** affects new image generation (re-run visual jobs for Fig. 3).
- **B/C** need XD/DP re-generation to show in prose/commissions.
- Existing PNGs unchanged until regenerated.

### Bayes ready for single QA rerun?
**Yes** — after regenerating the correspondence figure (and preferably refreshing XD/DP Copy). Compare to baseline **88/100 Validated**; do not tune for >90.

**T-007 and Sprint 87 remain open. No commit.**
