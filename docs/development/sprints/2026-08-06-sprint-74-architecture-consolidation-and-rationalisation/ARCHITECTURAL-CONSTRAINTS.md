# Sprint 74 — Binding Architectural Constraints

**Authority:** This document is the **expanded statement** of binding constraints for Sprint 74 and all later **74A / 74B / 74C** rationalisation work.  
**Decision bindings:** [S74-D03](decisions.md#s74-d03-browser-only-runtime-and-static-deployment) · [S74-D04](decisions.md#s74-d04-one-supported-path-per-major-product-responsibility) · [S74-D05](decisions.md#s74-d05-appjs-rationalised-by-ownership-not-size) · [S74-D07](decisions.md#s74-d07--one-definitive-codebase-around-established-functionality)  
**Status:** Binding (2026-08-06)  
**Mode:** Documentation — governs planning and future implementation  
**How to work:** [ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md) — Architectural constraints define what Prism must remain; Engineering Disciplines define how consolidation work is carried out safely.

Other Sprint 74 docs **link here**; do not duplicate the full text.

---

## Preferred terminology

| Use | Avoid |
| --- | ----- |
| browser runtime | Node runtime |
| production browser path | Node production path; backend path; server implementation |
| browser-loaded implementation | browser/Node runtime parity |
| development/test tooling | implying Node is available to deployed code |
| Node-based test evidence | treating Node tests as deployment proof |
| generated browser artefact | mandatory end-user build step |
| definitive implementation · sole learner renderer · one definitive codebase | presenting obsolete parallel renderers as ongoing choices |
| obsolete / superseded renderer (when referring to code scheduled for removal) | calling superseded code “Compatibility” without a current product requirement |

---

## Constraint 1 — Browser-only runtime

Prism is a **standalone browser application**.

The supported production environment consists only of:

- HTML  
- JavaScript  
- CSS  
- browser-provided APIs  

There is:

- **no** backend;  
- **no** runtime Node.js;  
- **no** server-side workflow execution;  
- **no** runtime filesystem;  
- **no** runtime package-manager requirement.  

Node.js exists **only** for development purposes, including:

- automated tests;  
- repository scripts;  
- browser-bundle generation;  
- development serving;  
- maintenance and verification tooling.  

The presence of any of the following must **not** be interpreted as evidence that Node.js is available at runtime:

- `module.exports`;  
- `require(...)` in tests or scripts;  
- Node test suites;  
- npm scripts;  
- generated browser-bundle tooling;  
- development-server code;  
- filesystem fixtures;  
- VM bootstraps;  
- CommonJS test adapters.  

Every supported production feature must execute through **browser-loaded scripts** referenced by `index.html`.

Rationalisation must **not** introduce:

- server dependencies;  
- server-side execution;  
- runtime Node APIs;  
- filesystem assumptions in production code;  
- mandatory build tooling for end users;  
- deployment requirements beyond serving/opening static application files.  

**Node-based test evidence** informs shared logic. It is **not** proof that the deployed application works. The **production browser path** remains authoritative for deployment confidence.

---

## Constraint 2 — One definitive implementation per established responsibility

Every major product responsibility should converge on **one definitive implementation** in the active codebase.

**Interpretation (binding — `S74-D07`):**

Sprint 74 rationalisation exists to establish **one stable, definitive codebase around Prism’s existing functionality**. “One supported path” is **not** satisfied by documenting an authoritative path while leaving unused, superseded, or redundant alternative implementations available in the tree.

Therefore:

- Established product responsibilities must converge onto **one definitive implementation**.  
- Obsolete, superseded, and redundant implementation paths should be **removed** once their responsibilities are verified as covered by the definitive implementation.  
- **Compatibility** code is retained **only** where there is a **current, explicit product requirement** for compatibility.  
- **Historical existence is not a compatibility requirement.**  
- Rationalisation success includes **removal of plausible-but-wrong code paths** that confuse maintainers and coding agents.  
- Removal remains **evidence-led** and must preserve current required functionality (identify responsibility → confirm coverage → verify production browser path → remove obsolete surfaces → focused regression).  
- Evidence must **not** become a rationale for retaining obsolete parallel implementations indefinitely.  
- Line-count reduction is **not** the purpose, but **code removal is expected** where it eliminates obsolete architectural alternatives.

While a superseded path still exists in the tree (during inventory or before verified removal), it must not be presented as an ongoing product choice. Prefer terms such as **obsolete**, **superseded**, or **scheduled for removal** over **Compatibility**, unless Compatibility is an explicit current product requirement.

Sprint 74 success means the supported architecture is unmistakable: fewer plausible-but-wrong paths; clearer module, documentation, and schema authority; clearer browser-loading behaviour; easier identification of where a change belongs.

---

## Constraint 3 — `app.js` ownership

`app.js` is **not** a rationalisation target merely because it is large.

Do **not** plan a size-driven “split `app.js`” sprint.

Instead:

- identify coherent responsibilities currently implemented in `app.js`;  
- move a responsibility only when another domain is the clearer architectural owner;  
- extract code as part of the **relevant** rationalisation domain;  
- preserve high-level application-shell responsibilities in `app.js`.  

Responsibilities that may legitimately remain in `app.js` include:

- application bootstrap;  
- top-level navigation;  
- dependency wiring;  
- application lifecycle;  
- high-level workflow orchestration;  
- routing between domain modules;  
- browser-only integration seams;  
- approved test hooks where still necessary.  

Extraction decisions must be based on **ownership, cohesion, testability, browser loading, and risk** — not line count.

See also: [S74-T-010 § app.js responsibility allocation](S74-T-010-rationalisation-domain-refinement.md#4-appjs-responsibility-allocation).

---

## Constraint 4 — Static deployment preservation

Every Sprint 74 implementation slice must preserve:

- static deployment;  
- direct browser loading;  
- current `index.html`-driven script bootstrap;  
- browser-compatible globals **or** an equally static browser-compatible replacement;  
- no backend requirement;  
- no runtime compilation requirement.  

**Generated browser artefacts** may still be produced during development, but **deployment must remain static**.

---

## Repository comprehension

Every rationalisation slice should leave the repository easier for a new maintainer—or a fresh Cursor session—to understand.

After any rationalisation work it should be easier to identify:

- the authoritative / definitive implementation;  
- the ownership boundary;  
- where future changes belong;  
- which paths are obsolete/superseded and scheduled for evidence-led removal (or Compatibility only when a current product requirement exists).  

The objective of Sprint 74 is to **reduce architectural ambiguity** and converge on **one definitive codebase** rather than simply reduce line count.

This note supports Constraints 2–3 and `S74-D07`; it is programme guidance, not a separate decision ID.

---

## Programme note

These constraints **do not invalidate** the recommended order **74A → 74B → 74C** from [S74-T-010](S74-T-010-rationalisation-domain-refinement.md). They sharpened how 74A was framed: establish **one definitive learner-renderer implementation**, verify the **production browser path** and **generated browser artefact**, then remove the obsolete renderer — not “Node/browser runtime parity,” and not indefinite Compatibility retention without a product requirement.

**Sprint 74A is COMPLETE / Closed** — [SPRINT-74A-FINAL-REPORT.md](../2026-08-06-sprint-74a-authoring-learner-export-path-integrity/SPRINT-74A-FINAL-REPORT.md). Sprint 74B / 74C remain **Not opened**. Current programme action: review / readiness for 74B — do not open automatically.

Architectural constraints define what Prism must remain; [Engineering Disciplines](../../ENGINEERING-DISCIPLINES.md) define how consolidation work is carried out safely.
