# S81-T-007 — Implement R1 learner Task ↔ Check navigation

**Sprint:** 81 — Learner Workspace Investigation & Surface Architecture  
**Status:** **COMPLETE / ACCEPTED** (operator closeout 2026-08-28)  
**Executed:** 2026-08-28  
**Mode:** Implementation — R1 landmarks / jump links only  
**Authority:** [S81-D02](decisions.md#s81-d02--b-targeted-enhancement-narrowed) (ACCEPTED); operator authorisation to execute T-007  
**Related:** [S81-T-006](S81-T-006-revision-co-access-design-validation-r3-vs-r4.md); [S81-T-008](S81-T-008-implement-r4-revision-criterion-accompaniment.md); [SPRINT-81-CLOSURE.md](SPRINT-81-CLOSURE.md)

---

## 1. What changed

| Area | Change |
| ---- | ------ |
| `lib/learner-renderer-vnext/task-check-navigation.js` | **New** — slugify, landmark ids, nav link HTML, enable gate |
| `lib/learner-renderer-vnext/render-composed-moment.js` | Do/Check sections get stable `id` + `aria-labelledby`; optional in-page nav links |
| `lib/learner-renderer-vnext/render-activity.js` | Enables `taskCheckNav` when composition has both Do and Check with items |
| `app.js` | Light CSS for `.util-composition-moment-nav` (native link, focus outline) |
| Browser bundles | Regenerated via `npm run build:learner-renderer-vnext-browser` |
| `tests/s81-t-007-task-check-navigation.test.js` | **New** focused tests |

**Not changed:** evidence schemas, draft persistence, feedback/diagnosis, R3/R4 behaviour, sticky/floating nav.

---

## 2. Learner-visible behaviour

For each activity that has both a composed **Your task** (Do) and **Check your response** (Check) moment:

- Under **Check your response**: link **Back to your task (‹activity title›)** → jumps to that activity’s Task section.
- Under **Your task**: **no** Check shortcut (linear reading already reaches Check).

Links are ordinary `<a href="#…">`. Linear reading without clicking remains unchanged.

**Manual UX correction (with T-008):** Task → Check was removed after operator testing; landmarks retained for Check→Task and R4.

---

## 3. ID / target pairing strategy

| Target | ID pattern | Example (`activity.id` = `A1`) |
| ------ | ---------- | ------------------------------ |
| Task / Do production region | `learner-task-{slug}` | `learner-task-a1` |
| Check / self-review region | `learner-check-{slug}` | `learner-check-a1` |
| Headings | `{landmark}-heading` | `learner-task-a1-heading` |

Slug = lowercase activity id with non-alphanumerics → `-`. Deterministic for generated/static HTML.

**R4 implication:** `learner-task-{slug}` is the authoritative production landmark a later “Revise with this criterion” action can reuse. No R4 state was added.

---

## 4. Multi-activity behaviour

Pairing is **per activity** via slugified `activity.id`. Activity A Task only links to Activity A Check (and back). Validated on heteroscedasticity (5 activities) and kitchen-sink fixtures.

---

## 5. Accessibility / fallback

- Native anchors; unique accessible names include activity title.  
- Sections expose `aria-labelledby` to moment headings.  
- Keyboard: Tab to links; Enter activates fragment navigation; focus outline styled.  
- No focus trap; no sticky/floating chrome.  
- Without CSS enhancement, links still work as plain in-page anchors.  
- Static export: fragment hrefs remain valid in the exported HTML document.

---

## 6. Tests and first-class gate

| Suite | Result |
| ----- | ------ |
| `node --test tests/s81-t-007-task-check-navigation.test.js` | **4/4 pass** |
| `npm run test:first-class` | **339/339 pass** |

Focused tests cover: deterministic unique IDs; Task→Check and Check→Task pairing on multi-activity hetero page; table-heavy kitchen sink; ordinary-anchor markup; no R4 markers.

---

## 7. Practical manual test route

**Best representative content:** certification fixture  
`tests/fixtures/page-render/heteroscedasticity-beat-assignment-page.json`  
(multiple activities, substantial Learn/Do, tables + text, flat self-review checklists).

### How to experience R1 in the UI

1. In Prism, open a **first-class self-study** workflow that already has an assembled learner page (or assemble after EP→DLA→GAM→… as usual). Prefer a lesson with **several activities** and checklist Check moments — heteroscedasticity-style content is ideal if you have that workflow saved.  
2. Open the **learner page preview / export** (vNext moments composition — default).  
3. Scroll to the first activity’s **Your task**.  
4. Click **Check your response (…)** — page should jump to that same activity’s **Check your response** section (criteria visible).  
5. Click **Back to your task (…)** — return to that activity’s production fields.  
6. Repeat on a later activity (e.g. one with a completion table) and confirm you do **not** land in another activity’s Task/Check.

**Fixture-only (no product feature):** from repo root you can also render HTML for local browser open:

```bash
node -e "const fs=require('fs');const {renderLearnerPageHtml}=require('./lib/learner-renderer-vnext');const p=JSON.parse(fs.readFileSync('tests/fixtures/page-render/heteroscedasticity-beat-assignment-page.json','utf8'));const html=renderLearnerPageHtml(p,{compositionMode:'moments'}).html;fs.writeFileSync('tmp-r1-hetero-preview.html','<!doctype html><meta charset=utf-8><title>R1 preview</title>'+html);"
```

Then open `tmp-r1-hetero-preview.html` in a browser and exercise the same links. Delete the temp file when done.

---

## 8. Implications for R4

- Task landmark `learner-task-{slug}` used by R4 revise handoff ([T-008](S81-T-008-implement-r4-revision-criterion-accompaniment.md) — **ACCEPTED**).  
- Check→Task nav remains complementary to R4 (does not carry guidance).

---

## 9. Acceptance criteria check (T-007)

| Criterion | Met |
| --------- | --- |
| Task → Check nav | **Removed** (manual UX; linear flow) |
| Check → Task nav | Yes |
| Compose + table activities | Yes (hetero + kitchen) |
| Flat self-review | Yes (fixtures) |
| Unique per-activity IDs | Yes |
| Linear fallback / native links | Yes |
| No evidence/feedback model change | Yes |
| `test:first-class` | **339/339** |
| Operator acceptance | **Yes** (Sprint 81 closeout 2026-08-28) |
