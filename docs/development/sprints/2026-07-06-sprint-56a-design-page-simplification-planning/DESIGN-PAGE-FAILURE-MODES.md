# Design Page — Failure Modes Catalogue

**Sprint:** 56A — Design Page Simplification Planning  
**Status:** Consolidated reference  
**Sources:** Live Copilot investigations, [DESIGN-PAGE-ARCHITECTURE-AUDIT.md](../2026-07-01-sprint-56-prompt-rationalisation-contract-consolidation/DESIGN-PAGE-ARCHITECTURE-AUDIT.md), `docs/development/audits/DESIGN-PAGE-*.md`

---

## A. Summarisation

**Description:** Full GAM `Content:` body is replaced by a shorter paraphrase, synopsis, or key-point line while the correct destination field is populated.

**Example behaviour:**

- LO1 exposition reduced to one definitional sentence
- Worked example reduced to outcome only (`"Year 1 basket = £100; Year 2 = £105"`)
- Consolidation scaffold reduced to synthesis descriptor
- `generation_notes`: "represented in condensed form" / "summarised for brevity"

**Likely cause:**

- Global page optimisation pressure (readable assembly, brevity params, token limits)
- Wrapper authoring modules optimising for coherent narrative at page level
- Competing instructions: substantive overview + full materials without explicit precedence until recent L4 patches

**Architectural implications:**

- Summarisation is a **symptom of author/optimiser responsibilities** on the same step as transport
- Additional "do not summarise" rules fight the step's other mandates
- Fix belongs in **responsibility reduction**, not more negative constraints

---

## B. Metadata substitution

**Description:** `activity.materials.<field>` contains Material name, Purpose, type label, or `required_materials` specification instead of GAM `Content:` body.

**Example behaviour:**

```json
"template": "Leadership Judgement Memo template."
"worked_example": "Model readiness judgement."
"text": "RNA virus genome types and messenger RNA overview."
"comparison_table": "DMV versus cell-to-cell spread table."
```

**Likely cause:**

- Metadata fields are easier to read and route than large Content bodies
- Pack text parsing treats Material/Purpose as descriptive hints
- Model interprets material *type* as instruction to describe rather than transport

**Architectural implications:**

- Requires hard **payload vs metadata** separation (partially addressed by GAM content binding invariants)
- Metadata substitution persists when step also asks for **catalogue-style page assembly**
- Structural fix: transport-only layer with fail-before-emit body comparison

---

## C. Multi-material enumeration failure

**Description:** GAM emits multiple Material blocks per activity; Design Page binds only one field (usually `materials.text`) and drops worked_example, checklist, template, tables, scenarios, transfer prompts, etc.

**Example behaviour:**

- LO2–LO5 have rich GAM packs but page row has `text` only
- `count(activity.materials keys) < count(GAM Material blocks)`
- Secondary materials described in overview or study_tips instead of embedded

**Likely cause:**

- Single-material mental model in assembly instructions
- Token pressure favours one "representative" material per activity
- Enumeration invariant added recently; conflicts with older "structured materials" language

**Architectural implications:**

- Enumeration is **transport logic**, not authoring
- Failure indicates step optimises for **page shape** over **payload completeness**
- Validation: per-activity key count vs GAM block count

---

## D. Truncation

**Description:** Material body starts correctly but omits trailing sections — paragraphs, bullets, table rows, checklist items, worked-example steps.

**Example behaviour:**

- First heading + first paragraph present; rest of Content missing
- Table header row without data rows
- Checklist title without items
- Shorter emitted string than GAM Content (character-level)

**Likely cause:**

- First-line / first-section heuristic under length pressure
- Model treats Content as excerpt source not full copy target
- Output length limits mid-generation

**Architectural implications:**

- Distinct from summarisation (partial copy vs rewrite) but same **optimiser pressure**
- Full-body preservation invariants target this directly
- Architectural fix: compare emitted length/structure to source before emit

---

## E. Placeholder substitution

**Description:** Field value points to upstream content instead of containing it.

**Example behaviour:**

```json
"text": "Full explanatory text from LO1-TEXT."
"worked_example": "Full worked example from LO1-WE."
"checklist": "Full checklist from LO1-CHK."
"scenario": "Full scenario content from LO2-SCN."
```

Also: `"See upstream material"`, `"Content from [material id]"`.

**Likely cause:**

- Page treated as **index or renderer contract** not final output
- Assembler role without **final learner output** invariant
- Downstream recovery assumed (renderer will fetch GAM)

**Architectural implications:**

- Violates self-contained page requirement
- Strong signal of **wrong mental model** for Design Page deliverable
- Fix: page artefact is final output — no dereferenceable learner content

---

## F. Context denial

**Description:** Model claims upstream artefacts unavailable despite GAM existing earlier in Copilot conversation.

**Example behaviour:**

- "activity_materials bodies are not present in current context"
- "Cannot access full GAM output"
- "Current message lacks upstream artefacts"
- Composes from `required_materials` or brief alone

**Likely cause:**

- Current user message does not re-attach prior step outputs
- Model treats only attached message as context
- PRISM runner explicitly does not re-paste captures (by design)

**Architectural implications:**

- Not a generation failure — **context access** failure
- Context access rule addresses symptom
- Architectural clarity: Copilot chat history **is** the upstream store

---

## G. Material elision

**Description:** Upstream GAM contains full bodies and correct binding is possible, but Design Page omits materials entirely, leaves `materials` empty, or fills with catalogue labels while describing resources in wrapper prose.

**Example behaviour:**

- Empty `materials: {}` with resources mentioned in overview
- Label-only values: `"Set of scenarios"`, `"Calculation table"`
- Visual affordance `source_basis` cites paths but materials fields empty
- Activities present with tasks but no embeddable content

**Likely cause:**

- Materials deferred to wrapper or VA metadata
- Activity shell preserved without payload merge
- Elision to manage page size while maintaining activity structure

**Architectural implications:**

- **Membership without transport** — structurally valid JSON, invalid learner page
- Conflicts with "page is final output" and activity membership invariants
- Detectable: populated activity row + empty/thin materials when GAM exists

---

## Common pattern conclusion

> The failure modes appear to be manifestations of a **common responsibility-conflict pattern** rather than independent defects.

**Shared dynamics:**

| Dynamic | Manifestations |
| ------- | -------------- |
| Page-as-optimiser | A, B, C, D |
| Page-as-index | E |
| Page-as-narrator at expense of payload | A, G |
| Page-as-assembler without context model | F |
| Competing success criteria (coherent page vs complete payload) | All |

**Planning implication:** Sprint 56A should prioritise **separating transport from authoring/optimisation** over adding per-failure-mode prompt patches.

---

## Related evidence

| Artefact | Location |
| -------- | -------- |
| Architecture audit §2 | Responsibility conflict table |
| Contract conflict audit C-02 | Wrapper synthesis vs verbatim materials |
| Remediation results | Hygiene improved; failures persisted in live runs |
| Materials fidelity tests | Regression guards, not architectural fix |
