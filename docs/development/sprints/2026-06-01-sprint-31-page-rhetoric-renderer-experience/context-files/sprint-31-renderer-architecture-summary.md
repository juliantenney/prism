# Sprint 31 renderer architecture summary

**Purpose:** Concise reference for future R-layer work after programme close (2026-06-01).  
**Authority:** `app.js` + [`renderer-hooks.md`](renderer-hooks.md).

---

## Page shell

| Piece | Classes / behaviour |
|-------|---------------------|
| Meta fold | `<details class="util-meta">`, summary **About this page** |
| Learner profile | `page_profile: learner` suppresses prominent **Audience:** in body |
| Production keys | `source_artefacts`, `constraints_applied`, `generation_notes` in fold only |

---

## Activity card (typical order)

1. Header — `.util-activity-header`  
2. **Framing** — `.util-activity-framing` (PEL orientation + reasoning cues)  
3. **Primary task** — `.util-activity-task.util-activity-task--primary`  
4. Cognition — `.util-cognition` (Sprint 29 semantics, softened in 31-2)  
5. **Materials** — `.util-activity-materials` > `.util-materials-stack`  
6. Output / support note as applicable  

### Activity-local dedupe (31-5)

- `createActivityComparableRegistry()` + `normalizeComparableText()`  
- Shared by framing and body render; suppresses exact duplicates only  
- **What to do** is never suppressed  

---

## Knowledge summary (31-3)

| Wrapper | Use |
|---------|-----|
| `.util-knowledge-summary` | Section / block container |
| `.util-definition-list` | Term / definition pairs |
| `.util-concept-group` | Grouped concepts |
| `.util-concept-relationships` | Relationship prose |

---

## Materials (31-4)

| Class | Use |
|-------|-----|
| `.util-materials-stack` | Activity materials container |
| `.util-material-table` | On `.util-table-scroll` for parseable tables |
| `.util-material-template` | Template blocks |
| `.util-material-prompt` | Prompt sets |
| `.util-worked-example` | Example-key materials |
| `.util-material-prose` | Fallback long text |

---

## Assessment section (31-6)

| Class | Use |
|-------|-----|
| `.util-assessment-section` | Section wrapper |
| `.util-assessment-item--formative` | Per-question card |
| `.util-assessment-prompt` | Stem / statement |
| `.util-assessment-choices` | Options wrapper |
| `.util-assessment-options` | MCQ list (not checkbox lists) |

**Frozen:** `feedbackDisplay` modes, answer grid, item order — presentation only in 31-6.

---

## Embedded CSS tranches (Sprint 31)

| Function | Slice |
|----------|-------|
| `getUtilityPagePresentationCssV31_2()` | Framing + primary task hierarchy |
| `getUtilityPagePresentationCssV31_3()` | Knowledge summary |
| `getUtilityPagePresentationCssV31_4()` | Materials stack / tables |
| `getUtilityPagePresentationCssV31_5()` | Activity pacing + dedupe spacing |
| `getUtilityPagePresentationCssV31_6()` | Assessment prompt/options rhythm |

All composed in `getUtilityPagePresentationCss()` after V26.x / cognition CSS.

---

## Test entry

`__PRISM_TEST_API.buildUtilityStructuredHtmlForTest` — same render path as export.

**Floor at close:** **502** pass — [`../baseline-test-floor.md`](../baseline-test-floor.md).
