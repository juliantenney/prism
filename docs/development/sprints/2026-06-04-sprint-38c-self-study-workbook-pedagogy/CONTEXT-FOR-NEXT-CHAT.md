# Context for next chat — Sprint 38-C

**Paste this pack path first:** `docs/development/sprints/2026-06-04-sprint-38c-self-study-workbook-pedagogy/`

---

## 1. What this sprint is

**Product-design / pedagogy** — improve **self-study workbook quality**, not prompt size or LD module architecture.

**Primary question:** How do we move from **activity sheets + reference notes** to **effective self-study workbooks**?

---

## 2. Sprint 38-B summary (complete)

| Metric | Value |
|--------|------:|
| Four-step augmented sum (self-directed) | **152,782** → **71,960** (**−52.9%**) |
| Design Page augmented (post W3) | **24,771** (5 runtime markers) |
| Tests | **730** passing |

**Canonical modules (do not duplicate bodies in planning prose):**

- `LD-TABLE-FIDELITY`
- `LD-MATERIALS-COPY`
- `LD-MATH-RENDER`
- `LD-SELF-DIRECTED-RHETORIC`
- `LD-DESIGN-PAGE-COMPOSE-CONTRACT`

**Wave status:**

| Wave | Status |
|------|--------|
| Wave 1 (shared modules) | **COMPLETE** |
| Wave 2a (GAM authority) | **COMPLETE** |
| Wave 2b (DLA authority) | **COMPLETE** |
| Wave 3 (Design Page) | **COMPLETE** |
| B4 table regression | **MONITORING** (not formal CLOSE) |

**38-B pack:** `docs/development/sprints/2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/`

---

## 3. Most important discovery (Inflation)

Live Inflation pipeline review ([38C self-study quality](../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/observations/38C-self-study-resource-quality-review.md)):

| Final artefact resembles | Does **not** yet resemble |
|--------------------------|---------------------------|
| Activity sheet | Self-study workbook |
| Revision / reference notes | Guided tutorial |

**Design Page preservation appears to be working** (tables verbatim GAM → page; [38B-W3-4 gate](../2026-06-04-sprint-38b-learning-design-prompt-architecture-consolidation/observations/38B-W3-4-inflation-gate-evidence.md)).

**Primary gap:** **instructional richness** and **workbook pedagogy** — especially scenarios, modelling, worked examples, consolidation — likely **GAM/DLA genre** and brief, not Design Page stripping.

**Working hypothesis:**

- **NOT:** “Design Page is stripping content.”
- **IS:** “The workflow is generating the wrong instructional genre for self-study.”

---

## 4. Sprint 38-C — **CLOSED** (2026-06-04)

| Phase | Observation | Status |
|-------|-------------|--------|
| 38C-1 … 38C-5 | See pack [observations/](observations/) | **COMPLETE** |
| 38C-6 | [38C-6-planning-synthesis-and-execution-recommendation.md](observations/38C-6-planning-synthesis-and-execution-recommendation.md) | **COMPLETE** |

**Synthesis:** [38C-6](observations/38C-6-planning-synthesis-and-execution-recommendation.md)

---

## 5. Recommended next sprint — **38-D**

**Title:** Workbook Authoring Contracts  
**Mission:** Executable DLA + GAM workbook obligations; canonical fixture; quality validation; Inflation before/after.

**Defer:** Composition/renderer-first (38-E), duration-only track, full HTML gates until upstream genres exist.

**Do not:** Reopen 38-B prompt-size or treat B4 as primary workbook fix.

---

## 6. Programme conclusions (one paragraph)

Inflation is an **activity sheet + reference notes**, not a workbook — **wrong genre upstream**, not Design Page stripping. Fix **DLA/GAM authoring contracts** first ([38C-6 §6–7](observations/38C-6-planning-synthesis-and-execution-recommendation.md)). Review renders with [38C-5 §9](observations/38C-5-workbook-experience-rendering.md) (E1–E17) after contracts land.

---

## 6. Non-goals for agents

- Do **not** modify `app.js`, packs, tests, or probes unless a future **execution** charter says so.
- Do **not** reopen 38-B prompt-size work.
- Do **not** conflate B4 pipe-table monitoring with workbook thinness.
