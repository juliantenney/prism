# Marx Self-Study — Journey Preservation Audit

**Date:** 2026-06-11  
**Type:** Composition / preservation analysis only (no workflow runs, no new captures)  
**Artefact set:** Investigation Marx captures only

| Role | Path |
| ---- | ---- |
| **Primary pipeline** (live investigation, clean run) | `captures/sprint-42-exposition/42-4-live-runs/marx-self-study-2026-06-11T16-23-03/` |
| **KM (usable text)** | `knowledge-model-raw-attempt-1.txt` (`knowledge-model.json` is `null`) |
| **Investigation comparator** (page-only, cited in provenance audit) | `tests/fixtures/page-render/marx-self-study-page.json` |
| **Not captured in investigation** | Episode Plans, Learning Sequence |

**Brief-implied journey arc (reference only):** life phases → experience/theory links → Manifesto vs Kapital comparison → factory application.

---

## 1. Signal definitions (Marx brief)

| Signal | What to look for in artefacts |
| ------ | ----------------------------- |
| **Central inquiry** | Marx as subject; intellectual question driving the session (life, theory, texts, application). |
| **Intellectual progression** | Ordered reasoning moves: biography → causation → comparison → transfer/application. |
| **Transition** | Explicit carry-forward between steps (section order, bridges, relationship edges, beat order). |
| **Judgement / evaluation** | Compare-and-defend, misconception reconciliation, checklist verification, reflective justification. |
| **Synthesis / closure** | Integrative capstone, session closure, “what to remember” distinct from task lists. |

---

## 2. Trace table

Legend: **●** strong/present · **◐** partial/transformed · **○** weak/absent · **—** stage not in investigation capture

| Signal | Generate Content | Knowledge Model | Learning Outcomes | Episode Plans | Design Learning Activities | Learning Sequence | Generate Activity Materials | Design Page |
| ------ | ---------------- | --------------- | ----------------- | ------------- | -------------------------- | ----------------- | ----------------------------- | ----------- |
| **Central inquiry** | ● Marx life, theory, texts, factory (`learning-content.json` title + §1–4) | ● Concepts, Major Works, factory process (`knowledge-model-raw-attempt-1.txt`) | ○ SDL meta-skills only; **Marx absent** | — | ○ SDL strategies/plan/assessment; **Marx absent** | — | ○ Goal-Oriented/Reflective/Resource strategies (GAM bodies) | ○ *Self-Directed Undergraduate Learner Guide*; Overview is SDL not Marx |
| **Intellectual progression** | ● Four-section arc: life → cause-effect → compare works → factory | ● `Development of Marx's Theories` process; `contrasts` Manifesto/Kapital; factory `illustrates` chain | ◐ New arc: strategies → plan → self-assessment (**replaces** Marx arc) | — | ◐ A1→A2→A3→A4 SDL arc; **internally coherent, wrong domain** | — | ◐ Materials follow A1–A4 SDL sequence | ◐ SDL arc in Overview + activities; **duplicate activity rows** dilute progression |
| **Transition** | ● Numbered sections; cause-effect phrasing (“fueling”, “leads to”) | ● Relationship edges (`causes`, `enables`, `contrasts`, `illustrates`) | ○ No cross-outcome narrative links | — | ◐ `intellectual_coherence_bridge` on A2–A4 (SDL carry-forward) | — | ○ Section breaks per activity; no session-flow prose | ◐ Bridges preserved on composed rows; **lost on duplicate bare rows** (A1–A4 without materials) |
| **Judgement / evaluation** | ◐ §3 compares purpose/audience/depth; §4 applies concepts | ● Misconceptions (same purpose/audience; life-independent theory) | ◐ LO1 “Evaluate…strategies” (Analyze); LO3 self-assessment | — | ● Comparison table + checklists; A3 reflective memo; A4 justification | — | ● Worked examples, sample outputs, verification checklists per activity | ● Judgement language in materials + `expected_output`; checklists render in HTML |
| **Synthesis / closure** | ● §4 factory capstone; examples array mirrors arc | ● Factory application process (5 steps ending resistance/reform) | ○ No integrative Marx outcome | — | ● A4 `consolidation_summary` + reflective memo; maps all three LOs | — | ● `consolidation_summary` + `prompt_set` bodies in GAM | ◐ Study Tips + A4 materials; **no Marx integrative closure**; wrapper prose synthesizes SDL only |

### Per-signal lifecycle (primary pipeline)

| Signal | First appears | Transformed | Preserved through | Weak / invisible |
| ------ | ------------- | ----------- | ----------------- | ---------------- |
| **Central inquiry (Marx)** | **LC** title + §1–4; **KM** concepts/groupings | **LO** — inquiry replaced by SDL skills domain | — (not carried past LO) | LO onward; DP title/Overview never name Marx |
| **Central inquiry (SDL)** | **LO** | — | LO → DLA → GAM → DP Overview/Learning Purpose | Coexists with loss of Marx inquiry; dominates from LO |
| **Intellectual progression (Marx)** | **LC** section order; **KM** processes/relationships | **LO** — new four-move SDL progression | — | EP/LS absent; no beat-level Marx arc |
| **Intellectual progression (SDL)** | **LO** outcome order | **DLA** activity sequencing + `outcome_alignment` | DLA → GAM → DP activity order | DP duplicates each activity (with/without materials) — progression readable but noisy |
| **Transition** | **LC** headings; **KM** `relationships[]` | **DLA** — `intellectual_coherence_bridge` (SDL wording) | DLA → DP on rows that include bridges | KM→LO link broken (`null` KM); no episode-plan beats; duplicate DP rows omit bridges on half the entries |
| **Judgement / evaluation** | **LC** §3 comparison; **KM** `misconceptions[]` | **LO** — judgement reframed on SDL strategies | DLA specs → GAM bodies → DP `materials.*` | Marx text-comparison judgement gone; SDL comparison/judgement strong from DLA |
| **Synthesis / closure** | **LC** §4 factory; **KM** factory process | **DLA** — A4 memo + `consolidation_summary` | GAM closure materials → DP A4 `materials` + Study Tips | Marx factory synthesis never instantiated; SDL synthesis visible in A4 + Study Tips |

---

## 3. Stage-by-stage composition notes

### Generate Content

Strongest preservation layer for the **Marx** journey. The four sections encode central inquiry and progression without separate transition fields:

```json
"title": "Self-Directed Study on Karl Marx: Life, Theory, and Application"
```

Section 2 explicitly links experience to theory (“cause-effect links”, historical materialism). Section 3 holds the comparative judgement frame (Manifesto vs Kapital purpose/audience/depth). Section 4 is synthesis-through-application (factory scenario). No separate closure section — closure is embedded in application.

### Knowledge Model

Raw capture preserves and **structures** LC signals:

- **Progression:** `Development of Marx's Theories` (3 steps); `Application of Marx's Core Concepts in a Factory Scenario` (5 steps).
- **Transition:** typed `relationships` (`causes`, `contrasts`, `illustrates`).
- **Judgement:** `misconceptions` on Manifesto/Kapital sameness and life-independence.
- **Composition gap:** `knowledge-model.json` is `null` — downstream steps did not receive this structure in the investigation capture chain.

### Learning Outcomes

**Transformation point.** Outcomes are grammatically strong but **domain-shifted**:

```json
"statement": "Evaluate various strategies for self-directed learning and select appropriate methods for different academic contexts."
```

`alignment_notes` explicitly frame SDL, not Marx. Intellectual progression is preserved as a **new** meta-learning arc (evaluate → design → apply self-assessment). All Marx-specific inquiry signals become **invisible** here. No LO maps to KM concepts (Historical Materialism, Manifesto, factory).

### Episode Plans

**Not present** in investigation artefacts. The domain pack positions episode plans as the authoritative beat order for DLA population; in this capture there is **no observable preservation or loss** of Marx journey at this stage—only absence.

### Design Learning Activities

DLA **preserves LO domain faithfully** and adds composition richness:

| Element | Preservation |
| ------- | ------------ |
| Activity order | Matches LO progression (compare → plan → assess → synthesize) |
| `intellectual_coherence_bridge` | A2–A4 carry SDL moves forward |
| `activity_preamble` | Narrative exposition present (42-3 shape); topic is SDL |
| `required_materials` | Obligation specs for worked_example, comparison_table, consolidation_summary |
| Marx journey | **Absent** — no life phases, texts, or factory scenario |

Judgement signals are **strong within SDL** (comparison table, checklists, reflective memo). Synthesis is explicit in A4 + `consolidation_summary` spec.

### Learning Sequence

**Not captured.** No timed facilitation flow, transitions between activities, or session-level closure prose exists in the investigation set. Composition cannot be assessed at this stage.

### Generate Activity Materials

GAM **realises DLA obligations** with full material bodies (worked examples, tables, checklists, consolidation guidance). Preservation is **high fidelity to DLA**:

- A1 comparison strategies example matches DLA `M1` spec.
- A4 `consolidation_summary` and `prompt_set` match DLA `M11`/`M12`.
- No paraphrase collapse observed in pack structure.

Weakness: all content is SDL-themed; Marx inquiry never enters material bodies because DLA never specified it.

### Design Page

Compose behaviour (from `constraints_applied` and section structure):

- **Preserves:** `activity_preamble`, cognition fields, `intellectual_coherence_bridge`, full `materials` objects from upstream (LD-MATERIALS-COPY fidelity).
- **Transforms:** Page-level **authorial wrapper** — `Overview`, `Learning Purpose and Outcomes`, `Study Tips` — written for SDL journey, not LC Marx arc.
- **Weakens progression visibility:** Eight activity entries (four with full `materials`, four duplicate slim rows with `activity_id` only) — bridges and materials attach to the first block; second block repeats titles/tasks without materials.
- **Title drift:** `Self-Directed Undergraduate Learner Guide` vs LC `Self-Directed Study on Karl Marx…`.

Synthesis/closure: Study Tips section provides page-level SDL closure; A4 materials provide activity-level synthesis. **No Marx integrative closure.**

---

## 4. Investigation comparator — `marx-self-study-page.json`

Cited in the investigation as a **hand-edited** page fixture (not from the live capture chain). Included here only to show what **preserved Marx journey** looks like at terminal compose when upstream inquiry survives.

| Signal | Fixture evidence |
| ------ | ---------------- |
| Central inquiry | `Key Knowledge Summary` — Marx, Class Struggle, Historical Materialism, Alienation |
| Progression | A2 model row → A3 compare major works → A4 factory concepts |
| Transition | `intellectual_coherence_bridge`: “Reuse the purpose-and-difference move…”; “Move from comparing texts to applying concepts…” |
| Judgement | Purpose-and-difference table; checklist with closure prompts; “defensible judgement” in `expected_output` |
| Synthesis / closure | Factory `final judgement`; checklist closure lines; Study tips on peer persuasion and transfer |

**Contrast with live capture DP:** The fixture keeps inquiry and progression **inside** `learning_activities` and summary sections; the live capture DP preserves **framing field shapes** (preambles, bridges, materials) but composes **wrapper prose** around a different inquiry (SDL). Preservation mechanics work; **journey content** was already lost before compose.

---

## 5. Narrative analysis

### Where the Marx journey lives

In the investigation artefacts, the **only stages that still carry the brief’s Marx central inquiry and progression** are **Generate Content** and **Knowledge Model (raw)**. LC prose establishes a clear four-move intellectual arc. KM encodes that arc as concepts, contrasting works, biographical process, factory application, and evaluative misconceptions. Together they are a complete journey seed.

### Where the journey breaks (composition, not renderer)

The break occurs at **Learning Outcomes**, before any activity population. LO statements do not reference KM concepts or LC sections. From LO onward, every downstream stage **composes consistently** against the new SDL inquiry:

- DLA maps activities to LO statements verbatim.
- GAM realises DLA material specs without topic recovery.
- Design Page preserves upstream activity fields and materials but **authors new wrapper prose** (Overview, Learning Purpose, Study Tips) aligned to the SDL thread.

This is **faithful downstream composition of a replaced inquiry**, not random field loss. Preambles, bridges, checklists, and consolidation materials **are** preserved through GAM into Design Page on the live capture—the investigation’s 42-3 evidence holds for **form**. The **Marx journey content** does not survive past LO.

### Episode Plans and Learning Sequence

Investigation captures omit both stages. For Marx progression, episode plans would normally freeze beat order and archetype functions between LO and DLA; learning sequence would add timed transitions and session closure. **No trace table cells can be filled** for these columns from existing artefacts. Any Marx beat order implied by LC/KM **never appears** in the captured chain.

### Transition signal — split fate

Two transition systems diverge:

1. **KM graph transitions** (causal/contrast edges) — preserved in raw KM, **never injected** into LO/DLA in this capture.
2. **Activity bridges** (`intellectual_coherence_bridge`) — **absent until DLA**, then preserved through GAM/DP on SDL activities.

So transition **machinery** appears downstream, but it carries **SDL** carry-forward language, not Marx moves (life→texts→factory).

### Judgement and synthesis — shape preserved, subject swapped

From DLA onward, judgement/evaluation signals are **structurally strong**: comparison tables, verification checklists, reflective memos, justification in `expected_output`. Synthesis is explicit (A4, `consolidation_summary`, Study Tips). The **fixture page** shows the same structural slots filled with Marx judgement (purpose-and-difference, factory judgement, peer-oriented closure).

The live capture demonstrates that **judgement and closure composition paths work** when upstream specifies them. In this investigation set, they operate on **self-directed learning skills**, not Marx, because LO/DLA never inherited KM/LC subject matter.

### Design Page composition effects

Design Page is **not** where Marx inquiry is first lost; it is where **wrapper-level authorial exposition** (42-2 surface) is applied to whatever inquiry survived. Overview and Learning Purpose articulate the SDL journey clearly—evidence that authorial compose **does** write journey-facing prose. That prose cannot recover Marx because activity upstream contains no Marx thread.

The **duplicate activity block** (four materialised + four slim duplicates) is a compose artefact that makes intellectual progression **harder to read** on the finished page: bridges appear on some rows only; learners may see repeated titles without materials. This weakens **transition visibility** without erasing preamble text on the primary rows.

### Summary judgement

| Layer | Marx journey | SDL journey (replacement) |
| ----- | ------------ | ------------------------- |
| LC / KM raw | ● Preserved | — |
| LO | ○ Lost | ● Introduced |
| EP / LS | — not captured | — |
| DLA → GAM | ○ Lost | ● Preserved (structure + materials) |
| DP compose | ○ Lost in wrappers; framing fields preserved from DLA | ● Preserved in Overview, activities, Study Tips |

**Preservation story:** Early artefacts hold a coherent Marx intellectual journey. Outcomes transform the journey’s **central inquiry and progression** at LO. Later stages **preserve composition fidelity** to the replaced inquiry—preambles, bridges, judgement scaffolds, and closure materials propagate correctly through GAM to Design Page. **Episode Plans and Learning Sequence** are missing from the investigation record, so beat-level and session-flow preservation cannot be assessed. The hand-edited fixture page shows the same compose slots carrying Marx content when upstream still holds the brief thread.

---

## 6. Artefact index

| Stage | Investigation file | Marx journey in file |
| ----- | ------------------ | -------------------- |
| Generate Content | `…/learning-content.json` | Yes |
| Knowledge Model | `…/knowledge-model-raw-attempt-1.txt` | Yes |
| Knowledge Model (persisted) | `…/knowledge-model.json` | `null` |
| Learning Outcomes | `…/learning-outcomes.json` | No (SDL) |
| Episode Plans | — | Not captured |
| Design Learning Activities | `…/dla-learning-activities.json` | No (SDL) |
| Learning Sequence | — | Not captured |
| Generate Activity Materials | `…/gam-activity-materials.txt` | No (SDL) |
| Design Page | `…/design-page.json` | No (SDL wrappers + preserved SDL activities) |
| Comparator Design Page | `tests/fixtures/page-render/marx-self-study-page.json` | Yes (hand-edited) |
