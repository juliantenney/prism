# Sprint 83 — Charter

**Sprint:** 83 — Expository Resource Investigation  
**Status:** **OPEN** (2026-09-21)  
**Type:** Investigation — not implementation  
**Predecessor:** Sprint 82 — CLOSED; Alpha development complete ([S82-D04](../2026-09-01-sprint-82-maths-entry-and-alpha-completion/decisions.md#s82-d04--alpha-development-complete))  
**Backlog item:** [PB-FA-011 — Expository Resource](../../../backlog/PRODUCT-BACKLOG.md#pb-fa-011--expository-resource)  
**Start here:** [SPRINT-83-START-HERE.md](SPRINT-83-START-HERE.md)  
**Opening decision:** [S83-D01](decisions.md#s83-d01--open-sprint-83--expository-resource-investigation)

---

## Mission

Investigate whether PRISM's existing subsystem architecture can support a high-quality first-class **Expository Resource**, what **product-specific prompt behaviour** would be required, and whether any **subsystem contracts** need adaptation.

This is the **first deliberately opened post-alpha product investigation**. It is **not** an implementation sprint.

---

## Working hypothesis (not decided)

The established subsystem progression remains **broadly sound**. Expository Resource likely warrants its **own tailored prompt family** rather than reusing Interactive Learning Resource prompts.

Sprint 83 exists to investigate that hypothesis — not to ratify it.

---

## Scope (in) — investigation posture only

- Establish and maintain the sprint pack and decisions for this investigation.  
- When the separate investigation brief is accepted: investigate architecture fit, prompt-family need, and contract adaptation questions **as defined by that brief**.  
- Record evidence, open questions, and recommendations for a later planning sprint.  
- Keep Research Synthesis as an **open relationship question** within PB-FA-011 — do not decide it here unless the brief explicitly requires a finding.

**Detailed investigation plan:** to be supplied and agreed separately. This charter does **not** authorise a task list beyond pack establishment.

---

## Non-goals (binding at open)

Sprint 83 does **not** initially authorise:

- implementation of Expository Resource;
- production prompt changes;
- schema or contract changes;
- Create UI changes;
- renderer changes;
- Expository → Interactive transformation;
- Podcast or Presentation implementation;
- generic extensibility / output-framework work;
- broad technical-debt discovery unrelated to the investigation;
- reopening settled alpha architecture without evidence;
- treating historical sprint debt or pruned backlog residue as active work.

---

## Intended programme sequence (intentions, not commitments)

```text
1. Sprint 83 — Expository Resource Investigation   ← OPEN
2. separate Expository Resource Planning sprint    (intention)
3. separate implementation sprint                  (intention)
```

Later sprints are **intentions**. They do not commit to a particular architecture, product catalogue entry, or scope.

---

## Settled programme inputs (do not reopen casually)

| Input | Authority |
| ----- | --------- |
| Alpha development complete | [S82-D04](../2026-09-01-sprint-82-maths-entry-and-alpha-completion/decisions.md#s82-d04--alpha-development-complete) |
| First-class gate at alpha close | `npm run test:first-class` → **339/339** |
| Canonical post-alpha backlog (pruned) | [PRODUCT-BACKLOG.md](../../../backlog/PRODUCT-BACKLOG.md) |
| Expository Resource backlog item | **PB-FA-011** |
| QA | Operating process (Part 1 Benchmark + Part 2 Validation as custom workflow) — **not** an active product-development theme |
| Accessibility | Strong automated **alpha baseline**; **no formal WCAG conformance** claimed |
| Interactive / Workshop first-class paths | Settled alpha architecture — reopen only with evidence |

---

## Expected evidence (when investigation proceeds)

Evidence expected from the (yet-to-be-accepted) investigation brief will typically include: architecture-fit findings; prompt-family recommendation with rationale; contract-adaptation inventory (if any); explicit non-claims; and handoff inputs for a planning sprint.

Exact evidence criteria belong in the investigation brief, not invented here.

---

## Exit posture (high level)

Sprint 83 may close when the accepted investigation brief's exit criteria are met and a clear recommendation exists for whether (and how) to open a planning sprint — **without** having implemented the product.
