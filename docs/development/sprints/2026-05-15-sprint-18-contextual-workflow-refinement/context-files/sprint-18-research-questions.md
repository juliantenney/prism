# Sprint 18 — research questions

**Date:** 2026-05-15  
**Path:** `docs/exploration/sprint-18-research-questions.md`  
**Status:** Exploration only — **questions and framing**; no implementation charter.

**Related:**

- [`docs/audits/existing-refinement-infrastructure-audit.md`](../audits/existing-refinement-infrastructure-audit.md) — what exists today
- [`docs/exploration/workflow-aware-refinement-concepts.md`](workflow-aware-refinement-concepts.md) — candidate mechanism names
- [`docs/development/sprints/2026-05-15-sprint-18-contextual-workflow-refinement/sprint-18-bootstrap.md`](../development/sprints/2026-05-15-sprint-18-contextual-workflow-refinement/sprint-18-bootstrap.md) — Sprint 18 thesis
- Sprint 17 fixtures: `tests/fixtures/workflow-brief-research-sparse/S1`–`S6.json`

---

## How to use this document

Each section poses **open research questions** for Sprint 18 design. Concrete examples come from **Sprint 17 sparse-brief fixtures (S1–S6)** and the **post-closeout manual smoke test** (topic sufficiency). Answers should inform pack policy and generic runtime interpreters — not ad hoc `app.js` branches per scenario.

---

## 1. When should refinement happen?

Sprint 17 established a mostly linear path: **essentials → design → (LD) post-gen factor queue → optional AI review**. Refinement timing is unsettled for Research.

### Open questions

| # | Question |
|---|----------|
| 1.1 | Should **adequacy refinement** run only **after** a draft workflow exists, or can some prompts fire **between** essentials resolution and generation (e.g. scope check when `input_strategy = generate_from_topic`)? |
| 1.2 | If refinement runs post-design, should the user **always** see the step list first, or may recommendations appear in the **Planning** panel while essentials are still open? |
| 1.3 | Should refinement be **re-entrant** (user edits brief → re-design → new recommendations) or **one pass** per design session unless the user clicks “Review again”? |
| 1.4 | How does timing interact with **proceed gates** (Sprint 17)? Gates withhold GRC/Design Page until essentials resolve — should adequacy prompts **also** gate generation, or only **suggest** after a partial plan is visible? |

### Examples to ground discussion

| Case | What happened (Sprint 17) | Timing question |
|------|---------------------------|-----------------|
| **S1** — “Need research on AI policy for universities” | Essentials missing; heuristics show analysis chain **without** GRC/Design Page (gated). Topic extracted but `input_strategy` unset. | If we add topic-scope refinement, is it **pre-design** (before any chain) or **post-design** (user sees 7 steps first)? |
| **S3** — inputs + audience explicit | Essentials nearly complete; **Design Page** appears once briefing path allowed. | Post-gen page refinement (LD pattern) vs workflow-level “is this chain right for faculty leaders?” — which comes first? |
| **Smoke test** — “Analyse the evidence… executive briefing on **AI governance risks**” | All required factors resolved; full analysis chain generated; **no scope question**. | Strong signal that **post-essentials, post-design** adequacy is needed — but is **one** targeted question enough **before** first generation? |

---

## 2. What should remain blocking vs optional?

Sprint 17 drew a line: **validation / conflict / missing essentials = blocking**; planning disclosures and gates = **transparent but not always blocking**.

### Open questions

| # | Question |
|---|----------|
| 2.1 | Which failures are **hard stops** vs **dismissible recommendations**? Is “upload language without inputs” (S2) the right model for all unsafe states? |
| 2.2 | Should **topic scope** for `generate_from_topic` ever **block** save/run, or only **warn** with a default “proceed with broad scope”? |
| 2.3 | Can a single brief trigger **both** a blocking validation (S4 conflict) **and** non-blocking adequacy notices in the same session? How do we order them in UX? |
| 2.4 | Should “dismiss” on a recommendation be **remembered per workflow**, per factor, or per session? |
| 2.5 | When LD **post-gen required tiers** ask assessment type, is that blocking by product intent — and should Research **avoid** copying that pattern for adequacy? |

### Examples

| Case | Blocking today | Research question |
|------|----------------|-----------------|
| **S2** — “Summarise **uploaded PDFs**…” empty `inputs` | `upload_language_without_inputs` blocks unsafe `input_strategy`; user must attach inputs or rephrase. | Correct blocking. Should **topic scope** for generate-from-topic rise to the **same tier**, or stay assistive? |
| **S4** — “**analysis briefing** on digital inclusion” | `objective_type_mixed_signals` — conflict disclosure; cannot proceed on inferred briefing alone. | Blocking for **factor conflict**. Is “analysis + briefing” also an **adequacy** issue after resolve (too many synthesis steps)? |
| **S6** — “Research help” | Essentials missing; gated chain, no Design Page. | Blocking essentials is clear. Should **S6** ever get **only** soft prompts (“Your goal is very short — add audience or sources?”) without extra required factors? |
| **Smoke test** | Nothing blocked — plan generated. | Defines the **optional adequacy** gap: safe but thin. |

---

## 3. How should workflows expose refinement opportunities?

Today: Factory **chat log**, **Planning** panel (Sprint 17), **Review & suggest improvements** button, LD post-gen Q&A, Settings per step.

### Open questions

| # | Question |
|---|----------|
| 3.1 | Should recommendations live in **Planning**, **chat**, a dedicated **“Suggestions”** strip, or **inline on step cards** (e.g. badge on Thematic Analysis)? |
| 3.2 | Should the **workflow step list** be annotated (“included because briefing + no sources”) or keep annotations in Planning only? |
| 3.3 | Is **one entry point** (“Improve this plan”) better than many (review button + post-gen queue + chat yes/no)? |
| 3.4 | How do we expose opportunities **without** duplicating Sprint 17 disclosure categories (missing, blocked, conflict, rejected, gated)? |
| 3.5 | Should dismissed recommendations remain **visible but collapsed** for auditability? |

### Examples

| Case | Exposure question |
|------|-------------------|
| **S5** — “HTML-ready structured page”, `session_materials: page`, gates suppress Design Page until essentials resolved | User may not see **why** Design Page is absent until essentials done. Should refinement say: “You asked for a page — Design Page will attach once input strategy is set”? |
| **S1** | Seven-step chain visible in fixtures while essentials open (gated model). | If user sees steps early, should steps show **“provisional”** state vs final? |
| **Smoke test** | User sees analysis steps; no hint that “AI governance risks” is underspecified. | Ideal: recommendation tied to **Conduct Thematic Analysis** + **generate_from_topic**, not abstract factor ID. |

---

## 4. How can refinement avoid feeling bureaucratic?

Sprint 17 capped default questions (`maxDefaultQuestions: 4` Research). LD allows up to **8 refinement factors** and post-gen assessment tiers — higher fatigue risk.

### Open questions

| # | Question |
|---|----------|
| 4.1 | What is the **maximum assistive prompts per session** before users perceive Factory as a form wizard? |
| 4.2 | Should recommendations be **bundled** (“2 scope questions”) vs **one at a time**? |
| 4.3 | When can PRISM **infer and disclose** instead of ask (Sprint 17 planning assumptions idea)? |
| 4.4 | Should “use defaults / yes to recommendation” count as **one interaction** for the whole bundle? |
| 4.5 | How do we phrase prompts as **improvements** (“Sharpen topic scope”) vs **corrections** (“You failed to specify…”)? |

### Examples

| Case | Bureaucracy risk |
|------|------------------|
| **S1** | Four missing essentials + potential future scope question + seven visible steps — easy to feel like interrogation. |
| **S3** | Only `output_depth` missing after strong brief — low friction; post-gen page questions (LD) could still feel heavy if ported blindly. |
| **S6** | Minimal intent — essentials questions necessary; adding many adequacy prompts would be punishing. |
| **LD contrast** | `refinementFactors` with `askWhen*` predicates — useful but scales with pack size. Research should prefer **few, high-impact** prompts. |

---

## 5. How should recommendation confidence work?

No confidence model exists today; `isRecommendIntent` accepts defaults when factors expose `default` or profile `recommendEnabled`.

### Open questions

| # | Question |
|---|----------|
| 5.1 | Should confidence be **deterministic** (rule matched / signal count) or **model-estimated** (AI reviewer)? |
| 5.2 | Do we show confidence to users (“likely”, “worth checking”) or only use it for **ordering** and suppression? |
| 5.3 | Below what confidence should a prompt be **hidden** vs shown as low-priority? |
| 5.4 | Can high-confidence **inference** (S5 `objective_type: briefing` from text) coexist with low-confidence **adequacy** on the same brief? |
| 5.5 | Should accepting a **recommended** value write `resolvedSources: recommended` distinct from `explicit` / `inferred`? |

### Examples

| Case | Confidence nuance |
|------|-------------------|
| **S2** | High confidence that user **meant** upload; high confidence that plan is **unsafe** without inputs — blocking justified. |
| **S4** | Low confidence on primary objective — conflict rule correctly refuses to pick winner. |
| **S1** | Medium confidence on `topic` from goal; low confidence on `input_strategy` — ask essentials, don’t guess upload vs generate. |
| **Smoke test** | High confidence on `generate_from_topic`; **low** confidence that topic scope supports thematic analysis — adequacy signal, not factor default. |

---

## 6. Should refinement be conversational or structured?

Current Factory: **structured** select/boolean essentials + **semi-structured** chat (`handleWorkflowAnswer`) + **unstructured** AI workflow review JSON.

### Open questions

| # | Question |
|---|----------|
| 6.1 | Are adequacy prompts **fixed select lists** (region, sector, horizon) or **free-text** follow-ups in chat? |
| 6.2 | Should structured answers **map to pack factors** (`topic_scope_region`) or ephemeral **workflow annotations** not in the brief schema? |
| 6.3 | When user replies in natural language, is **AI parse** required (like elicitation today) or only for optional refinement? |
| 6.4 | Should the same thread handle **blocking essentials** and **optional refinement**, or separate modes to reduce parse errors? |
| 6.5 | Is Prompt Studio’s **draft/refined** metaphor appropriate for **workflow** plans, or only for prompts? |

### Examples

| Case | Mode fit |
|------|----------|
| **S4** | Structured single-select for `objective_type` conflict is appropriate — research whether analysis-vs-briefing needs **one** controlled question, not open chat. |
| **Smoke test** | Scope of “AI governance risks” might need **structured facets** (jurisdiction, sector) **or** one open “What aspect should this focus on?” — which reduces rework? |
| **S2** | Structured: attach files **or** choose topic-only — already aligned with validation `action` text. |

---

## 7. How should refinement interact with step settings?

Post-gen refinement (LD) maps factor answers → **`stepParams`** via `mappingRules`. Settings tab edits the same params later.

### Open questions

| # | Question |
|---|----------|
| 7.1 | Is workflow-level adequacy (**topic scope**) ever a **step setting**, or always brief/workflow metadata? |
| 7.2 | If refinement changes **graph-affecting** factors (`input_strategy`, `design_scope`), when is **one regeneration** enough vs full re-elicitation? |
| 7.3 | Should recommendations **deep-link** to Settings (“Open Design Page tone”) vs ask in chat? |
| 7.4 | If user ignores chat refinement but fills Settings, do recommendations **auto-clear**? |
| 7.5 | For Research without `stepRefinementProfiles`, is Settings **only** for run-time, not planning-time refinement? |

### Examples

| Case | Interaction |
|------|-------------|
| **S5** | Page delivery cues → future Design Page; page profile/tone are **step settings** in LD. | Should S5 adequacy mention **page settings** pre-design, or only after Design Page exists? |
| **S3** | Provided sources — step chain assumes normalize/extract. | Refinement might target **source coverage** (brief) not **runner chunk size** (settings). |
| **Smoke test** | Thematic analysis step present — refinement about **scope** might change **whether** that step belongs, not runner params. |

---

## 8. How should refinement opportunities be prioritised?

Multiple signals can fire: missing essentials, validation, conflict, gates, future adequacy rules, AI review suggestions.

### Open questions

| # | Question |
|---|----------|
| 8.1 | What is the **global priority order** (blockers → conflicts → missing → adequacy → nice-to-have)? |
| 8.2 | Should the same trigger appear **once** or in both Planning and chat? |
| 8.3 | How do we **dedupe** “input_strategy missing” (essential) vs “upload language without inputs” (validation) vs “no sources in plan” (adequacy)? |
| 8.4 | Cap on concurrent **non-blocking** recommendations (top 3)? |
| 8.5 | Should user **pin** a recommendation to address later after save? |

### Examples

| Case | Prioritisation puzzle |
|------|------------------------|
| **S2** | Three missing essentials **and** upload validation — user sees overlapping Planning categories. | Which message appears first in chat? |
| **S4** | Conflict on `objective_type` should dominate over scope/audience prompts. | Confirm ordering rules before adding adequacy rules. |
| **S1** | `topic` partially explicit; `audience` weak (“universities” in goal). | Essential `audience` vs assistive “stakeholder role in goal text” — which wins? |

---

## 9. How should Research and LD differ?

Sprint 18 is **Research-first**; LD has `refinementFactors`, `stepRefinementProfiles`, and richer post-gen.

### Open questions

| # | Question |
|---|----------|
| 9.1 | Should Research adopt **`refinementFactors`** at all, or only **`recommendedRefinementPrompts` / adequacy checks**? |
| 9.2 | Can LD keep **long refinement enumerations** while Research uses **short high-impact** rules? |
| 9.3 | Should **post-gen profiles** (`assessment_pack`, `design_page`) stay LD-only until Research declares parallel step params? |
| 9.4 | Do LD **workshop** fields (`duration_minutes`, `delivery_mode`) need workflow-aware refinement, or stay factor-only? |
| 9.5 | Is the **smoke test gap** Research-specific, or does LD topic-only course design have the same adequacy hole? |

### Examples

| Dimension | Research (S1–S6) | LD (audit) |
|-----------|-------------------|------------|
| Pre-design refinement list | Empty | Many conditional factors |
| Post-gen queue | Only if shared patterns match generated steps | Assessment + page profiles |
| Primary risk | Unsafe inference, thin topic plans | Assessment/page param gaps |
| Sprint 17 investment | validation, conflict, gates, disclosures | Shared extract still LD-heavy (deferred `explicitExtract`) |

---

## 10. What belongs in packs vs AI reasoning?

Architectural rule: **packs declare policy; runtime interprets; AI phrases or suggests within policy.**

### Open questions

| # | Question |
|---|----------|
| 10.1 | Which adequacy triggers must be **deterministic** for regression tests (e.g. `generate_from_topic` + analysis step + short topic string)? |
| 10.2 | What may AI **rephrase** (message tone) vs must AI **not decide** (whether to block, which step to remove)? |
| 10.3 | Should `callOpenAIForWorkflowReview` move to **pack-authored review policy**, or stay a separate generic reviewer? |
| 10.4 | Can AI **propose** a step patch that runtime **validates** against pack allowlists (canonical steps only)? |
| 10.5 | How do we prevent pack drift when AI invents new factor IDs not in `mappingRules`? |

### Examples

| Belongs in pack (candidate) | Belongs in AI (candidate) |
|-----------------------------|---------------------------|
| S2: `upload_language_requires_inputs` rule | Natural-language paraphrase of validation message |
| S4: `objective_type_mixed_signals` conflict | — (must not pick winner) |
| Smoke: trigger when `input_strategy = generate_from_topic` and step list includes thematic analysis without scope facet | Wording of scope question |
| S5: `pageDeliveryTextSignals` → Design Page append policy | — (append is deterministic heuristic today) |

---

## 11. What should be regression tested?

Sprint 17 pinned **S1–S6** for extract, resolve, validation, conflict, heuristics — not adequacy or refinement UX.

### Open questions

| # | Question |
|---|----------|
| 11.1 | Do we add **S7+ fixtures** for adequacy (topic scope, post-design signals) without changing S1–S6 semantics? |
| 11.2 | Which behaviours are **golden JSON** vs **manual** UX checks? |
| 11.3 | Should tests assert **presence/absence of recommendation IDs**, or only deterministic planning outputs? |
| 11.4 | How do we test **non-blocking** prompts (dismiss does not change resolve map)? |
| 11.5 | Is AI review (`callOpenAIForWorkflowReview`) out of scope for CI (mock-only)? |

### Candidate regression surfaces

| Surface | Example assertion (illustrative) |
|---------|----------------------------------|
| Deterministic triggers | Smoke-test brief → `planningAdequacyChecks` includes `topic_scope_unspecified` when steps contain Thematic Analysis + `generate_from_topic` |
| No regression S2 | Upload language + empty inputs → still `upload_language_without_inputs`, still blocks provided_source without inputs |
| No regression S4 | Mixed analysis/briefing → still `objective_type_mixed_signals`, no silent resolve to briefing |
| No regression S6 | “Research help” → still missing all four essentials, still no Design Page / GRC |
| S3 stability | Provided source + audience → Design Page still appended when gates pass |
| Priority | When S4 conflict active, adequacy recommendations **suppressed** until conflict cleared |
| LD isolation | Research tests do not require LD `refinementFactors` length or assessment post-gen |

---

## 12. Cross-cutting decision log (to fill during Sprint 18)

Use this table during reviews; leave blank until decided.

| ID | Question area | Decision | Rationale |
|----|---------------|----------|-----------|
| RQ-T1 | Timing | | |
| RQ-B1 | Blocking vs optional | | |
| RQ-UX1 | Surfacing | | |
| RQ-LD1 | Research vs LD split | | |
| RQ-P1 | Pack vs AI | | |
| RQ-TEST1 | Regression scope | | |

---

## 13. Suggested next exploration artefacts (not in scope here)

- Implementation charter translating answered questions into pack schema stubs
- **S7** golden fixture for topic sufficiency (smoke test encoded)
- UX wireframes for Planning vs chat vs step annotations
- Alignment pass with [`existing-refinement-infrastructure-audit.md`](../audits/existing-refinement-infrastructure-audit.md) reuse list

**No code, pack JSON, or test changes in this document.**
