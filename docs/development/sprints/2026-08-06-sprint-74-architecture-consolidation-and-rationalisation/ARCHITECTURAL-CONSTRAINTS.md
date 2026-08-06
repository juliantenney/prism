# Sprint 74 — Binding Architectural Constraints

**Authority:** This document is the **expanded statement** of binding constraints for Sprint 74 and all later **74A / 74B / 74C** rationalisation work.  
**Decision bindings:** [S74-D03](decisions.md#s74-d03-browser-only-runtime-and-static-deployment) · [S74-D04](decisions.md#s74-d04-one-supported-path-per-major-product-responsibility) · [S74-D05](decisions.md#s74-d05-appjs-rationalised-by-ownership-not-size)  
**Status:** Binding (2026-08-06)  
**Mode:** Documentation — governs planning and future implementation; does not open Sprint 74A

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

## Constraint 2 — One supported path

Every major product responsibility should have **one clearly identifiable supported implementation**.

Compatibility, historical, and experimental paths may remain temporarily, but:

- one implementation must be **authoritative**;  
- future development must target the authoritative path;  
- compatibility paths must be **labelled clearly**;  
- rationalisation should **reduce ambiguity**;  
- removal must follow **evidence and verification**.  

Sprint 74’s purpose is **not** line-count reduction.

Success means the supported architecture is unmistakable to maintainers, future contributors, and coding agents — fewer plausible-but-wrong paths; clearer module, documentation, and schema authority; clearer browser-loading behaviour; easier identification of where a change belongs.

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

- the authoritative implementation;  
- the ownership boundary;  
- where future changes belong;  
- which paths are compatibility only.  

The objective of Sprint 74 is to **reduce architectural ambiguity** rather than simply reduce line count.

This note supports Constraints 2–3; it is programme guidance, not a separate decision ID.

---

## Programme note

These constraints **do not invalidate** the recommended order **74A → 74B → 74C** from [S74-T-010](S74-T-010-rationalisation-domain-refinement.md). They sharpen how 74A “export path integrity” must be framed: verify the **production browser path** and **generated browser artefact** loading — not “Node/browser runtime parity.”

Sprint 74A remains **unopened** until operator approval.
