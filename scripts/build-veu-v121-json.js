/**
 * One-off builder: visual-enhancement-utility-v1.2.1.json from v1.2 + Sprint 38 prompt patch.
 * Run: node scripts/build-veu-v121-json.js
 */
"use strict";

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const srcPath = path.join(root, "utilities", "visual-enhancement-utility", "visual-enhancement-utility-v1.2.json");
const outPath = path.join(root, "utilities", "visual-enhancement-utility", "visual-enhancement-utility-v1.2.1.json");

const S38_BLOCK = `SPRINT 38 VISUAL AFFORDANCE HANDOVER (optional second input)

Authors may attach page compose JSON (or visual_affordances extract) alongside the HTML file.
The JSON may include: visual_affordance_schema_version, activities_visual_review[], visual_affordances[].

Detect and report handover_mode in Step 1 JSON response: legacy | hybrid | authoritative.

HANDOVER MODES

LEGACY — visual_affordances[] missing or empty:
- Apply all v1.2 rules below unchanged (PEDAGOGICAL SIGNIFICANCE, hook inference, topic avoidance heuristics).
- Do not require handover JSON.

HYBRID — visual_affordances[] present but incomplete handover:
- For each hook, if a matching affordance record exists (same activity_id + visual_slot, or data-affordance-id match), JSON controls pedagogy.
- Unmatched hooks: legacy inference only if activities_visual_review for that activity_id does not have activity_visual_value.decision: none.
- Never override visual_decision: reject or defer with inference-generated figures.

AUTHORITATIVE — full Sprint 38 handover (visual_affordance_schema_version 38.4, activities_visual_review[], visual_affordances[]):
- HTML locates slots only; JSON controls generate / defer / reject.
- Do not create additional opportunities from data-visual-subject, headings, or activity title alone.
- Do not promote visual_decision: reject to generate. Do not promote defer to generate without explicit author override in selection_notes.

HOOK MATCHING (when JSON present)

Match .util-visual-affordance hooks using:
- data-visual-slot (must equal affordance visual_slot for generate)
- data-visual-activity-id or data-activity-id (must equal affordance activity_id)
- data-affordance-id when present (must equal affordance affordance_id)

VISUAL_DECISION: generate

Insert figure and queue image only when a generate record matches the hook.
Do not infer purpose, representation, claim boundaries, or tier when the generate record supplies them — consume:
purpose, preferred_representation, pedagogical_added_value, reasoning_supported, representation_avoid, allowed_claims, disallowed_claims, must_show, must_not_show, source_basis, requires_exact_data_match, anti_spoiler, spoiler_boundary, learner_stage, canonical_discipline_note, caption_intent, discipline_risk_level, tier, affordance_id, visual_slot.

Build each image_queue prompt from those fields (not "illustrate the topic").
Include representation_avoid and disallowed_claims as hard negatives in the image prompt.

PEDAGOGICAL ADDED VALUE (Sprint 38-6 — when present on generate records)

When pedagogical_added_value is supplied, treat it as the primary statement of what new cognitive support the image must provide beyond surrounding materials.
Generate the pedagogical support, not merely the visual structure matching preferred_representation.
Reject queueing when the brief would only duplicate a blank worksheet, duplicate a table, duplicate answer structure, topic poster, illustrated summary, or generic infographic shell.
For classification_matrix: image must add discriminating cues and category distinctions — not an empty grid mirroring the learner worksheet.
For comparison_framework: add comparison dimensions and confusable features — not decorative columns duplicating the table.
For causal_model: show mechanism visibility and directionality — not isolated topic labels.
For evidence_t_chart: add evaluation criteria scaffolding — not a copied evidence list.
For number_line_segments: depict exact source endpoints only — never invented intervals.
Use must_show / must_not_show / reasoning_supported / pedagogical_added_value together; preferred_representation names layout family only.

QUANTITATIVE FIDELITY — when requires_exact_data_match is true:
- No invented values, trends, interval endpoints, or unsupported quantitative relationships.
- Numbers and labels in image prompt and figure may come only from source_basis and allowed_claims.

VISUAL_DECISION: defer

- No figure, no image_queue entry for that affordance_id.
- Copy affordance_id, defer_reason, rationale to deferred_affordances[] in Step 1 JSON.

VISUAL_DECISION: reject

- No figure, no image_queue entry; do not invent a substitute opportunity for the same slot.
- Copy affordance_id, rejection_reason, rationale to rejected_affordances[] in Step 1 JSON.
- Never reclassify reject to generate.

ACCESSIBILITY (generate rows)

- figcaption: use caption_intent (visible text).
- alt: same instructional support as caption_intent for non-sighted learners; respect must_not_show and spoiler_boundary (hide answers, classification keys, model solution when flagged).
- Do not use alt_text_intent; do not state numbers in alt unless requires_exact_data_match is false OR numbers are in source_basis.

FIGURE STRUCTURE (generate)

Use data-affordance-id on figure when affordance_id is known:

<figure class="util-figure util-figure--pedagogic" data-visual-opportunity="VO1" data-affordance-id="[affordance_id]">
  <img src="images/VO1-example.png" alt="[alt from caption_intent + boundaries]">
  <figcaption>[caption_intent]</figcaption>
</figure>

`;

const STEP2_S38_BLOCK = `SPRINT 38 QUEUE CONSUMPTION

When the Step 1 queue entry includes affordance_id, requires_exact_data_match, or an expanded prompt from Sprint 38 fields:
- Treat the queue entry prompt as authoritative.
- Honour representation_avoid and disallowed_claims as hard negatives.
- Do not depict must_not_show items.
- When requires_exact_data_match is true, do not add numbers, trends, or interval boundaries not stated in the prompt.
- Honour spoiler_boundary omissions in the image.
- Do not illustrate activity title or topic alone.

`;

const bundle = JSON.parse(fs.readFileSync(srcPath, "utf8"));
const wf = bundle.workflows[0];

wf.name = "Visual Enhancement Utility v1.2.1";
wf.notes =
  "v1.2.1 adds Sprint 38 authoritative visual_affordances[] consumption (legacy/hybrid/authoritative modes); v1.2 hook topology unchanged.";
wf.updatedAt = Date.now();

const step1 = wf.steps.find((s) => s.canonical_step_id === "step_create_html_package");
let body1 = step1.override_prompt_body;
body1 = body1.replace(
  "Treat these hooks as the candidate opportunity set.\n\nDo NOT independently",
  "Treat these hooks as the candidate opportunity set.\n\nHooks may include data-affordance-id, data-activity-id, and data-visual-activity-id for Sprint 38 matching.\n\n" +
    S38_BLOCK +
    "\nDo NOT independently"
);

body1 = body1.replace(
  '<figure class="util-figure util-figure--pedagogic" data-visual-opportunity="VO1">\n  <img src="images/VO1-example.png" alt="[meaningful alt text]">\n  <figcaption>[short visible caption]</figcaption>\n</figure>',
  '<figure class="util-figure util-figure--pedagogic" data-visual-opportunity="VO1" data-affordance-id="[affordance_id when known]">\n  <img src="images/VO1-example.png" alt="[alt from caption_intent + must_show/must_not_show/spoiler_boundary]">\n  <figcaption>[caption_intent]</figcaption>\n</figure>'
);

body1 = body1.replace(
  'Each queue entry must contain only:\n- id\n- filename\n- prompt',
  "Each queue entry must contain:\n- id\n- filename\n- prompt\n- affordance_id (when from Sprint 38 generate)\n- requires_exact_data_match (boolean when applicable)"
);

body1 = body1.replace(
  'Return concise JSON only:\n\n{\n  "html_file": "enhanced-learner-page.html",\n  "file_status": "downloadable file created",\n  "hooks_found": 0,\n  "figures_inserted": 0,\n  "images_required": 0,\n  "image_queue": [\n    {\n      "id": "VO1",\n      "filename": "VO1-example.png",\n      "prompt": "Create a polished educational PNG diagram..."\n    }\n  ],\n  "rename_checklist": [\n    "VO1-example.png"\n  ],\n  "selection_notes": [\n    "Briefly explain why each selected figure has pedagogical value and does not pre-empt the learner task."\n  ]\n}',
  'Return concise JSON only:\n\n{\n  "handover_mode": "legacy | hybrid | authoritative",\n  "html_file": "enhanced-learner-page.html",\n  "file_status": "downloadable file created",\n  "hooks_found": 0,\n  "figures_inserted": 0,\n  "images_required": 0,\n  "rejected_affordances": [\n    { "affordance_id": "...", "rejection_reason": "...", "rationale": "..." }\n  ],\n  "deferred_affordances": [\n    { "affordance_id": "...", "defer_reason": "...", "rationale": "..." }\n  ],\n  "image_queue": [\n    {\n      "id": "VO1",\n      "affordance_id": "va-...",\n      "filename": "VO1-example.png",\n      "prompt": "Structured brief from Sprint 38 generate fields...",\n      "requires_exact_data_match": false\n    }\n  ],\n  "rename_checklist": [\n    "VO1-example.png"\n  ],\n  "selection_notes": [\n    "Per figure: affordance_id, purpose, and why it does not pre-empt the learner task."\n  ]\n}'
);

step1.override_prompt_body = body1;
step1.notes =
  "1. Upload PRISM HTML + optional visual_affordances JSON.\n2. Run Step 1 (Sprint 38 authoritative/hybrid/legacy modes).\n3. Save enhanced-learner-page.html and images/ folder.\n4. Run Step 2 per queue item.";

const step2 = wf.steps.find((s) => s.canonical_step_id === "step_generate_image");
step2.override_prompt_body =
  step2.override_prompt_body.replace(
    "TASK\n\nGenerate the next image",
    "TASK\n\n" + STEP2_S38_BLOCK + "\nGenerate the next image"
  );

fs.writeFileSync(outPath, JSON.stringify(bundle, null, 2) + "\n", "utf8");
console.log("Wrote", outPath);
