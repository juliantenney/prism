## PRISM – Help Guide

PRISM (Prompt Refinery: Intelligent Systems Mapping) is a browser-only app for creating, refining, saving, and running AI prompts and workflows.

It is designed for two styles of use:

- **API-powered refinement** (in-app, via OpenAI Responses API)
- **Manual refinement** (copy into Copilot/ChatGPT, then paste back)

Everything runs client-side from static files. No backend, no server. Your data stays in your browser until you explicitly export it.

**Project files:**
- `index.html` – Structure and UI
- `style.css` – Styling
- `app.js` – Main application logic, workflows, API calls
- `library.js` – Prompt storage (IndexedDB/localStorage)
- `utils.js` – Helpers (e.g. UUID, debounce, date formatting)

### Contents

- [What PRISM Does](#what-prism-does)
- [Tabs and Main Areas](#tabs-and-main-areas)
- [OpenAI API Setup](#openai-api-setup)
- [Prompt Factory: How to Use](#prompt-factory-how-to-use)
- [Manual (No API) Workflow](#manual-no-api-workflow)
- [Prompt Library: How to Use](#prompt-library-how-to-use)
- [Template Variables](#template-variables)
- [Workflow Factory: How to Use](#workflow-factory-how-to-use)
- [Workflows Tab: Edit vs Run](#workflows-tab-edit-vs-run)
- [Copy Behavior in Workflows](#copy-behavior-in-workflows)
- [Token Usage and Approx Cost](#token-usage-and-approx-cost)
- [Export, Import, and Sync](#export-import-and-sync)
- [Troubleshooting](#troubleshooting)
- [Privacy and Data](#privacy-and-data)
- [Recommended Working Pattern](#recommended-working-pattern)
- [Utilities HTML Export Renderer](#utilities-html-export-renderer)

---

## What PRISM Does

PRISM helps you:

- Build better prompts from a structured brief
- Refine prompts with an assistant conversation
- Save reusable prompts in a local library
- Design workflows (step-based prompt chains)
- Run workflows in a focused “runner” mode
- Use template variables like `{{Word Count}}`
- **Sync and backup** all prompts and workflows via Export/Import

---

## Tabs and Main Areas

PRISM has four top tabs:

1. **Prompt Factory**
2. **Prompt Library**
3. **Workflow Factory**
4. **Workflows**

### 1) Prompt Factory

This tab has three panels:

- **Define the Brief**
- **Refine the Brief**
- **Final Prompt**

Use it to turn rough intent into a polished prompt.

### 2) Prompt Library

Use this to store and manage prompts.

- Search and tag filter
- Sort list (by updated, created, title, usage)
- Edit prompt metadata/body
- Version history
- **Export selected** (one prompt as JSON)
- **Export all** (all prompts and workflows – same as Workflows tab)
- **Import** (prompts, workflows, or full backup – same as Workflows tab)

### 3) Workflow Factory

Use this to quickly generate workflow structures from:

- Workflow name
- Description
- Inputs/artifacts
- Scope and constraints (e.g. 5-minute video vs full module, expected student time, accessibility, target level)

You can review suggestions, switch between **Draft** and **Refined**, edit step titles/roles, delete steps, then save to Workflows.

### 4) Workflows

Use this to maintain and run saved workflows.

- Left list: all workflows
- Right panel: selected workflow details
- **Export selected** (one workflow and its prompts as JSON)
- **Export all** (all prompts and workflows – same as Prompt Library tab)
- **Import** (prompts, workflows, or full backup – same as Prompt Library tab)
- Two modes:
  - **Edit** (build/change workflow)
  - **Run** (focused, read-only execution view)

In Run mode:

- Summary context is shown at top (read-only)
- One step is shown at a time
- **Step 1 copy** prepends workflow summary context
- Next steps copy only step-specific instructions/prompt content

---

## OpenAI API Setup

The header contains an **OPENAI API** panel.

### Load key

1. Create a text file containing only your API key
2. Choose it in the file picker
3. Status changes to loaded and tuning controls appear

### Important behavior

- Key is kept in memory only (not saved to local storage)
- **Start refinement** is disabled until key is loaded

### Tuning controls

PRISM now standardises on one model for simplicity and predictable cost:

- **Model (fixed):** `gpt-4.1-mini`
- **Creativity:** `Focused`, `Balanced`, `Exploratory`
- **Response detail:** `Short`, `Standard`, `Detailed`

These two dropdowns replace technical controls like "temperature" and "max tokens".

---

## Prompt Factory: How to Use

### Define the Brief

Fill what you know:

- **Output type** – Text, Code, Image, or Structured (JSON/table)
- **Audience** – Who will read or use the output
- **Act as** – The role the AI should adopt (e.g. "senior copywriter", "strict code reviewer")
- **Task description** – The main request
- **Goal / outcome** – What success looks like
- **Context / background** – Relevant information the AI needs
- **Tone / voice** – How the output should sound
- **Reading level** – For text outputs (e.g. non-technical, beginner)
- **Desired output format** – Content and structure; can mention formats (CSV, PDF, markdown) if relevant
- **Length / depth** – How long or detailed the output should be
- **Constraints and must-haves** – Rules, exclusions, requirements

Type-specific fields appear depending on output type.

### Refine the Brief

- Click **Start refinement**
- Answer assistant questions one by one
- You’ll see status updates:
  - Waiting for assistant
  - Awaiting your answer
  - Reviewer is thinking
  - etc.

The app supports a review stage that may ask extra high-value questions before finalizing.

### Final Prompt

The final prompt text appears in the textarea after refinement.

You can also paste a manually refined prompt here (from Copilot/ChatGPT) without using the API – useful if you prefer to refine in another tool.

If the field has text, **Save to library** is enabled. Use it to add the prompt to your library for reuse.

---

## Manual (No API) Workflow

If you prefer not to use API:

1. Fill the brief in Prompt Factory
2. Click **Refine manually**
3. Paste the copied brief into Copilot/ChatGPT
4. Refine there
5. Paste final prompt back into **Final Prompt**
6. Save to library

---

## Prompt Library: How to Use

### Header actions

- **New prompt** – Create an empty prompt to edit
- **Import** – Load prompts and/or workflows from a JSON file. Works with full backups, prompt-only exports, or workflow exports. See [Export, Import, and Sync](#export-import-and-sync).
- **Export selected** – Download the currently selected prompt as JSON (requires a prompt to be selected)
- **Export all** – Download all prompts and all workflows as a single backup file (`prism-export.json`)

### List panel

Each tile shows:

- Prompt title
- Last updated date
- Usage count (how many times it has been used as a template or in workflows)
- Tags (if any)

Selected tile highlights in blue. Click a tile to view and edit its details.

### Detail panel

When a prompt is selected, you can:

- **Save changes** – Persist edits to title, body, tags, notes
- **Use as template** – Insert the prompt into the Prompt Factory brief for further refinement
- **Copy prompt body** – Copy the raw prompt text to the clipboard
- **Duplicate** – Create a copy with a new ID
- **Rename** – Quick way to update the title
- **Delete** – Remove from the library (cannot be undone)
- **Edit tags and notes** – Tags for filtering; notes for your own reference
- **Review version history** – See previous versions of the prompt body (snapshots on save)

### Storage

Prompts are stored locally in your browser:

- **IndexedDB** (primary) – Persistent, survives browser restarts
- **localStorage** fallback if IndexedDB is unavailable

---

## Template Variables (`{{...}}`)

PRISM supports simple placeholders in prompt bodies:

- Example: `Create a summary in {{Word Count}} words`

When copying from:

- Prompt Library
- Workflow steps

…PRISM asks for variable values and substitutes them before copying.

In Prompt Factory, placeholders remain untouched while authoring.

---

## Workflow Factory: How to Use

1. Enter workflow basics (name + description required; optionally add inputs and scope/constraints)
2. Click **Design workflow**
3. Review assistant suggestions
4. Optionally run review suggestions flow
5. Switch Draft/Refined versions
6. Edit step titles/roles, delete unwanted steps
7. **Save as workflow**

---

## Workflows Tab: Edit vs Run

### Edit mode

- Edit workflow name, description, inputs/artifacts, and scope and constraints
- Add, remove, or reorder steps
- Link steps to library prompts (each step can use a saved prompt)
- Set input type per step: `Text`, `File`, `URL`, or `None`
- Define primary input source from an earlier step (chain outputs)
- Edit **Step instructions** – Per-step notes describing inputs, how to use them, any conditional logic, and anything else useful to the person running the workflow

### Export and Import in Workflows

- **Export selected** – Downloads the current workflow and all prompts it references
- **Export all** – Same as in Prompt Library: downloads everything (all prompts + all workflows)
- **Import** – Same as in Prompt Library: accepts full backups, prompt arrays, or workflow arrays

### Run mode

- Read-only summary header
- One step at a time
- `Previous` / `Next` navigation with status (`Step X of Y`)
- Step copy button for execution in external AI tools

---

## Copy Behavior in Workflows

When copying in Run mode:

- **Step 1 copy** includes workflow summary/context (name, description, inputs, scope and constraints) + step instructions
- Later steps copy step-specific instructions only
- If a step is linked to a library prompt, copied text uses that prompt body
- Variables are resolved via `{{...}}` prompts before copy

---

## Token Usage and Approx Cost

The API panel shows session totals:

- Input tokens
- Output tokens
- Total tokens
- Approx cost

Usage updates for:

- Prompt refinement calls
- Prompt review calls
- Workflow Factory design/review calls

For the fixed `gpt-4.1-mini` model, PRISM uses phase-tuned budgets based on **Response detail**:

- **Short**
  - Refinement Q&A: 160
  - Refinement review: 256
  - Final prompt: 900
  - Workflow design: 700
  - Workflow review: 320
- **Standard** (default)
  - Refinement Q&A: 256
  - Refinement review: 384
  - Final prompt: 1600
  - Workflow design: 1024
  - Workflow review: 512
- **Detailed**
  - Refinement Q&A: 384
  - Refinement review: 640
  - Final prompt: 2400
  - Workflow design: 1536
  - Workflow review: 768

Creativity maps to temperature internally:

- Focused: 0.2
- Balanced: 0.7
- Exploratory: 1.0

---

## Export, Import, and Sync

PRISM stores prompts and workflows locally in your browser. To back up, move to a new machine, or sync between devices, you use **Export all** and **Import**.

### Export all and Import – Same in Both Tabs

The **Export all** and **Import** buttons work identically whether you are in **Prompt Library** or **Workflows**. You can trigger them from whichever tab you happen to be in.

### Export All

- **What it does:** Exports *everything* – all prompts and all workflows – into a single JSON file.
- **File name:** `prism-export.json` (or similar)
- **Format:** A bundle object with `version`, `prompts`, and `workflows` arrays.
- **Use it for:** Full backup, sync between machines, migrating to a new browser or device.

### Export Selected

- **Prompt Library:** Exports only the currently selected prompt as a JSON array of one item.
- **Workflows:** Exports only the currently selected workflow, plus the prompts it references, as a bundle.
- **Use it for:** Sharing a single prompt or a single workflow (and its prompts) with someone else.

### Import – Smart Format Detection

The Import button accepts several JSON formats and handles them automatically:

| Format | What happens |
|--------|--------------|
| **Full bundle** (`{ version, prompts, workflows }`) | Sync merge: imports prompts and workflows. Newer wins where IDs match. |
| **Array of prompts** (objects with `title`, `body`) | Imports prompts only. Newer wins. |
| **Array of workflows** (objects with `steps`) | Imports workflows only. Newer wins. |

You do not need to choose a format – point Import at any valid PRISM export file and it will figure out what to do.

### Newer Wins (Merge Semantics)

When you import and an item (prompt or workflow) already exists locally with the same ID:

- **Newer wins:** If the imported item has a more recent `updatedAt` timestamp, it overwrites the local one.
- **Local kept:** If the local item is newer (or has no timestamp), the import skips it. Your local changes are preserved.

This prevents older exports from overwriting newer local work when syncing between machines.

### Typical Use Cases

1. **Share one prompt:** Export selected (in Prompt Library) → send file → recipient imports.
2. **Share several prompts:** Create a dummy workflow that references them, export that workflow (or export all), share the file.
3. **Share a workflow:** Export selected (in Workflows) → send file → recipient imports. Prompts used by the workflow are included.
4. **Sync two machines or migrate:** On Machine A, Export all. On Machine B, Import. Machine B now has everything. If you later make changes on B, Export all there, then Import on A to sync back.
5. **Backup:** Export all periodically and save the file somewhere safe (USB, cloud folder, etc.).

### File Format (Technical)

The full export bundle looks like:

```json
{
  "version": 1,
  "prompts": [ { "id", "title", "body", "tags", "createdAt", "updatedAt", ... } ],
  "workflows": [ { "id", "name", "description", "steps", "createdAt", "updatedAt", ... } ]
}
```

Prompts and workflows include `createdAt` and `updatedAt` timestamps (Unix milliseconds) for merge logic.

---

## Troubleshooting

### Start refinement is disabled

- Load API key first
- Ensure file contains only the key

### Save to library disabled in Final Prompt

- Ensure Final Prompt textarea has text

### Workflow copy output looks wrong

- Confirm step has linked library prompt if you expect prompt body
- In Run mode, Step 1 intentionally includes workflow summary context

### API usage stays at 0

- Confirm call returned `usage` object
- Hard refresh to ensure latest JS loaded

### Import says "Nothing to import"

- Ensure the JSON file has the expected structure (bundle with `prompts`/`workflows`, or array of prompt/workflow objects)
- Check the file is valid JSON (no syntax errors)

### Import says "Format not recognized"

- The file may be an array of objects that lack `title`/`body` (prompts) or `steps` (workflows)
- Try re-exporting from PRISM to see the correct format

### Exported file does not open in another app

- PRISM exports standard JSON. Any JSON viewer or text editor can open it
- Some apps expect CSV or other formats; PRISM uses JSON only

---

## Privacy and Data

- **API key:** Kept in memory only, not persisted. Reload the page and you must load it again.
- **Prompts and workflows:** Stored locally in your browser:
  - Prompts: IndexedDB (with localStorage fallback if IndexedDB is unavailable)
  - Workflows: localStorage
- **No analytics or tracking:** No backend collects your data
- **Data is sent only to OpenAI** when you trigger API actions (refinement, workflow design, review)

Export creates a file on your machine. Where you store that file (USB drive, cloud folder, etc.) is entirely under your control. A future option could support direct sync to cloud storage.

---

## Recommended Working Pattern

For most users:

1. Draft in **Prompt Factory**
2. Save to **Prompt Library**
3. Build process in **Workflow Factory** / **Workflows**
4. Run in **Workflows (Run mode)** with step-by-step copy
5. **Backup and sync:** Use Export all periodically. When moving machines or syncing, Import the file.

This gives reusable, maintainable prompt systems instead of one-off prompts, with safe backup and sync between devices.

---

## Utilities HTML Export Renderer

PRISM includes a Utilities HTML export/preview path for renderable artifacts such as `page`.

Current active path:

- `handleUtilitiesGenerate()` resolves render metadata and renders HTML
- `buildUtilityStructuredHtml(...)` builds page HTML for document/page variants
- `utilityRenderPageSections(...)` handles section-level rendering (activities, assessment, support notes, etc.)
- `sanitizeUtilityHtmlOutput(...)` applies a conservative cleanup pass before the final HTML is stored and downloaded

Important behavior:

- `handleUtilitiesDownloadHtml()` downloads `state.utilitiesLastHtml` and does **not** re-render.
- If output seems stale, regenerate first, then download.
- The workflow-step button label in the Workflows editor is now **Settings**.

For detailed renderer behavior and regression checks, see:

- `docs/architecture/renderer-export-behavior.md`

---

## Development status (Sprint 41 closed)

**Sprint 41 — Educational Framework Integration** is implementation-complete.

- EQF prompt integration, evaluator, and diagnostics tooling are in place
- PEL/learner framing applies to all learner-facing pages (workshop handouts and self-study)
- Design Page composition preserves and repairs learner-framing fields

**Closure report:** [`docs/development/sprints/2026-06-11-sprint-41-educational-framework-integration/sprint-41-closure-report.md`](docs/development/sprints/2026-06-11-sprint-41-educational-framework-integration/sprint-41-closure-report.md)

**Sprint 42 handover:** [`handover-from-sprint-41.md`](docs/development/sprints/2026-06-11-sprint-41-educational-framework-integration/handover-from-sprint-41.md)

**Recommended next focus:** Authorial quality / educational exposition (richer learner-facing prose, narrative flow, publication-ready instructional writing) — not further framework architecture work.

**EQF diagnostic (manual):**

```bash
node tools/evaluate-educational-quality-framework.js tests/fixtures/page-render/marx-self-study-page.json
```
