const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const dlaEnrich = require(path.join(repoRoot, "lib", "page-dla-enrich.js"));
const gamEnrich = require(path.join(repoRoot, "lib", "page-gam-enrich.js"));
const dlaContract = require(path.join(repoRoot, "lib", "ld-dla-page-enrich-contract.js"));
const gamContract = require(path.join(repoRoot, "lib", "ld-gam-page-enrich-contract.js"));

function buildMinimalPage(activity) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Test page",
    audience: "Learners",
    page_profile: { profile_type: "learner" },
    learning_outcomes: [{ outcome_id: "LO1", statement: "Interpret evidence." }],
    episode_plans: [
      {
        activity_id: "A1",
        mapped_learning_outcome_ids: ["LO1"],
        episode_plan_id: "EP-A1",
        episode_plan: activity.episode_plan
      }
    ],
    assembly_state: { current_stage: "episode_plan", enriched_by: ["episode_plan"] },
    page_synthesis: {},
    activities: [activity],
    source_artefacts: [],
    generation_notes: {}
  };
}

test("S72: explanatory activity does not auto-add evidence requirement", () => {
  const page = buildMinimalPage({
    activity_id: "A1",
    title: "Explain core terms",
    grouping: "individual",
    duration_minutes: 10,
    learning_outcome_ids: ["LO1"],
    episode_plan: {
      archetype: "understand",
      beats: [{ function: "explanation" }]
    }
  });
  const enriched = dlaEnrich.enrichPageWithDla(page);
  const required = enriched.activities[0].required_materials || [];
  assert.ok(required.length > 0);
  assert.equal(Object.prototype.hasOwnProperty.call(required[0], "evidence_requirement"), false);
  assert.ok(enriched.activities[0].evidence_decision);
  assert.equal(enriched.activities[0].evidence_decision.required, false);
});

test("S72: every newly generated DLA activity includes explicit evidence_decision", () => {
  const page = buildMinimalPage({
    activity_id: "A1",
    title: "Analyse observed differences",
    grouping: "individual",
    duration_minutes: 20,
    learning_outcome_ids: ["LO1"],
    episode_plan: {
      archetype: "analyse",
      beats: [{ function: "guided_reasoning" }]
    }
  });
  const enriched = dlaEnrich.enrichPageWithDla(page);
  const decision = enriched.activities[0].evidence_decision;
  assert.equal(typeof decision.required, "boolean");
  assert.ok(String(decision.reason || "").trim().length > 0);
  assert.ok(Array.isArray(decision.provider_material_ids));
});

test("S72: A5-like separation attaches evidence requirement to evidence provider, not response scaffold", () => {
  const page = buildMinimalPage({
    activity_id: "A1",
    title: "Evaluate mechanism persistence",
    grouping: "individual",
    duration_minutes: 20,
    learning_outcome_ids: ["LO1"],
    episode_plan: {
      archetype: "evaluate",
      beats: [{ function: "evaluative_judgement" }]
    }
  });
  const enriched = dlaEnrich.enrichPageWithDla(page);
  const required = enriched.activities[0].required_materials;
  const evidenceRows = required.filter((row) => row && row.evidence_requirement);
  assert.ok(evidenceRows.length >= 1);
  assert.ok(evidenceRows.some((row) => String(row.material_type).toLowerCase() === "scenario"));
  assert.ok(
    evidenceRows.every(
      (row) => !/decision_table|analysis_table|template/i.test(String(row.material_type || ""))
    )
  );
});

test("S72: malformed evidence requirement hard-fails DLA validation", () => {
  const page = buildMinimalPage({
    activity_id: "A1",
    title: "Diagnose pattern",
    grouping: "individual",
    duration_minutes: 15,
    learning_outcome_ids: ["LO1"],
    learner_task: "Inspect the evidence and diagnose the likely mechanism.",
    expected_output: "A justified diagnosis.",
    activity_preamble: "Use the provided observations.",
    required_materials: [
      {
        material_id: "A1-M1",
        material_type: "analysis_table",
        purpose: "Evidence table",
        specification: "Compact table",
        evidence_requirement: { kind: "learner_evidence", purpose: "", learner_action: "" }
      }
    ],
    materials: [],
    episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
  });
  page.assembly_state = { current_stage: "dla", enriched_by: ["episode_plan", "dla"] };
  const check = dlaEnrich.validateDlaEnrichedPage(page, null);
  assert.equal(check.ok, false);
  assert.ok(check.errors.some((e) => /evidence_requirement/.test(e)));
});

test("S72: A2/A5-style contradiction fails when task is evidence-dependent but evidence_decision/provider is missing", () => {
  const page = buildMinimalPage({
    activity_id: "A1",
    title: "Analyse provided replication scenarios",
    grouping: "individual",
    duration_minutes: 20,
    learning_outcome_ids: ["LO1"],
    learner_task: "Analyse the provided replication scenarios.",
    expected_output: "Provide an evidence-supported causal analysis.",
    activity_preamble: "Use scenario evidence for your conclusions.",
    required_materials: [
      { material_id: "A1-M1", material_type: "text", purpose: "Teaching content", specification: "Explain core mechanisms." },
      { material_id: "A1-M2", material_type: "worked_example", purpose: "Model reasoning", specification: "Show how to structure causal reasoning." },
      { material_id: "A1-M3", material_type: "analysis_table", purpose: "Learner response table", specification: "Complete table fields." },
      { material_id: "A1-M4", material_type: "checklist", purpose: "Self-check", specification: "Check response quality." }
    ],
    materials: [],
    episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
  });
  page.assembly_state = { current_stage: "dla", enriched_by: ["episode_plan", "dla"] };
  const check = dlaEnrich.validateDlaEnrichedPage(page, null);
  assert.equal(check.ok, false);
  assert.ok(check.errors.some((e) => /evidence_decision required/i.test(e)));
});

test("S72: RNA A1 conceptual classification with required:false must pass (no false positive)", () => {
  const page = buildMinimalPage({
    activity_id: "A1",
    title: "Classify RNA genome classes",
    grouping: "individual",
    duration_minutes: 15,
    learning_outcome_ids: ["LO1"],
    learner_task:
      "Study an explanatory overview; work through a classification example; compare four RNA genome classes; complete a classification table.",
    expected_output:
      "Distinguish genome classes and explain mRNA-generation routes for each class.",
    activity_preamble: "Use the teaching overview and classification example.",
    evidence_decision: {
      required: false,
      reason: "Conceptual classification activity based on explanatory material.",
      provider_material_ids: []
    },
    required_materials: [
      { material_id: "A1-M1", material_type: "text", purpose: "Explanatory overview", specification: "Explain RNA genome classes." },
      { material_id: "A1-M2", material_type: "worked_example", purpose: "Classification example", specification: "Model one classification." },
      { material_id: "A1-M3", material_type: "analysis_table", purpose: "Classification table", specification: "Learner completes classification rows." }
    ],
    materials: [],
    episode_plan: { archetype: "understand", beats: [{ function: "explanation" }] }
  });
  page.assembly_state = { current_stage: "dla", enriched_by: ["episode_plan", "dla"] };
  const check = dlaEnrich.validateDlaEnrichedPage(page, null);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
  assert.equal(
    check.errors.some((e) => /contradicts evidence-dependent/i.test(e)),
    false
  );
});

test("S72: A3 wording Analyse the supplied entry pathway evidence with no provider must fail", () => {
  const page = buildMinimalPage({
    activity_id: "A3",
    title: "Interpret entry pathway evidence",
    grouping: "individual",
    duration_minutes: 20,
    learning_outcome_ids: ["LO1"],
    learner_task: "Analyse the supplied entry pathway evidence.",
    expected_output: "Identify which entry step is disrupted.",
    activity_preamble: "Inspect the supplied evidence before concluding.",
    evidence_decision: {
      required: false,
      reason: "Incorrectly marked non-evidence.",
      provider_material_ids: []
    },
    required_materials: [
      { material_id: "A3-M1", material_type: "text", purpose: "Teaching", specification: "Explain entry." },
      { material_id: "A3-M2", material_type: "analysis_table", purpose: "Workspace", specification: "Learner rows." }
    ],
    materials: [],
    episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
  });
  page.assembly_state = { current_stage: "dla", enriched_by: ["episode_plan", "dla"] };
  const check = dlaEnrich.validateDlaEnrichedPage(page, null);
  assert.equal(check.ok, false);
  assert.ok(check.errors.some((e) => /contradicts evidence-dependent/i.test(e)));
});

test("S72: A5 wording Analyse the evidence from the HCV persistence scenario with no provider must fail", () => {
  const page = buildMinimalPage({
    activity_id: "A5",
    title: "Evaluate HCV persistence evidence",
    grouping: "individual",
    duration_minutes: 20,
    learning_outcome_ids: ["LO1"],
    learner_task: "Analyse the evidence from the HCV persistence scenario.",
    expected_output: "Justify which persistence mechanism is most important.",
    activity_preamble: "Use the scenario evidence.",
    evidence_decision: {
      required: false,
      reason: "Incorrectly marked non-evidence.",
      provider_material_ids: []
    },
    required_materials: [
      { material_id: "A5-M1", material_type: "text", purpose: "Teaching", specification: "Explain persistence." },
      { material_id: "A5-M2", material_type: "decision_table", purpose: "Judgement workspace", specification: "Blank learner table." }
    ],
    materials: [],
    episode_plan: { archetype: "evaluate", beats: [{ function: "evaluative_judgement" }] }
  });
  page.assembly_state = { current_stage: "dla", enriched_by: ["episode_plan", "dla"] };
  const check = dlaEnrich.validateDlaEnrichedPage(page, null);
  assert.equal(check.ok, false);
  assert.ok(check.errors.some((e) => /contradicts evidence-dependent/i.test(e)));
});

test("S72: generic compare/classify/explain wording passes with required:false", () => {
  const page = buildMinimalPage({
    activity_id: "A1",
    title: "Compare and classify concepts",
    grouping: "individual",
    duration_minutes: 12,
    learning_outcome_ids: ["LO1"],
    learner_task:
      "Compare the four classes, classify each genome type, explain the distinctions, and complete the analysis table.",
    expected_output: "A clear comparison and classification with brief explanations.",
    activity_preamble: "Use the teaching material.",
    evidence_decision: {
      required: false,
      reason: "Conceptual comparison and classification from teaching content.",
      provider_material_ids: []
    },
    required_materials: [
      { material_id: "A1-M1", material_type: "text", purpose: "Teaching", specification: "Explain concepts." },
      { material_id: "A1-M2", material_type: "analysis_table", purpose: "Classification table", specification: "Learner completes." }
    ],
    materials: [],
    episode_plan: { archetype: "understand", beats: [{ function: "explanation" }] }
  });
  page.assembly_state = { current_stage: "dla", enriched_by: ["episode_plan", "dla"] };
  const check = dlaEnrich.validateDlaEnrichedPage(page, null);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
});

test("S72: evidence_decision required=true must reference provider rows with evidence_requirement", () => {
  const page = buildMinimalPage({
    activity_id: "A1",
    title: "Evaluate immune-evasion evidence",
    grouping: "individual",
    duration_minutes: 20,
    learning_outcome_ids: ["LO1"],
    learner_task: "Analyse the evidence comparing different immune-evasion mechanisms.",
    expected_output: "Conclude with evidence-based comparisons.",
    activity_preamble: "Inspect observations before judging.",
    evidence_decision: {
      required: true,
      reason: "Evidence-dependent comparison",
      provider_material_ids: ["A1-M2"]
    },
    required_materials: [
      { material_id: "A1-M1", material_type: "scenario", purpose: "Case observations", specification: "Observed outcomes by mechanism." },
      { material_id: "A1-M2", material_type: "decision_table", purpose: "Learner judgement table", specification: "Blank learner table." }
    ],
    materials: [],
    episode_plan: { archetype: "evaluate", beats: [{ function: "evaluative_judgement" }] }
  });
  page.assembly_state = { current_stage: "dla", enriched_by: ["episode_plan", "dla"] };
  const check = dlaEnrich.validateDlaEnrichedPage(page, null);
  assert.equal(check.ok, false);
  assert.ok(check.errors.some((e) => /must include evidence_requirement/i.test(e)));
});

test("S72: GAM fulfils evidence requirement with inspectable learner evidence body", () => {
  const dlaPage = buildMinimalPage({
    activity_id: "A1",
    title: "Interpret heteroscedasticity evidence",
    grouping: "individual",
    duration_minutes: 20,
    learning_outcome_ids: ["LO1"],
    learner_task: "Inspect the compact results table and justify whether variance is constant.",
    expected_output: "A short justification using table observations.",
    activity_preamble: "Work from supplied evidence, not prior assumptions.",
    evidence_use_prompt: "Cite the observed spread pattern.",
    required_materials: [
      {
        material_id: "A1-M1",
        material_type: "analysis_table",
        purpose: "Interpret residual spread against fitted values.",
        specification: "Compact processed result/observation table.",
        evidence_requirement: {
          kind: "learner_evidence",
          purpose: "Provide inspectable residual spread observations.",
          learner_action: "Compare low and high fitted-value regions before concluding.",
          observable_features: ["widening residual spread", "contrast between lower and upper fitted ranges"],
          minimum_suitable_form: "compact processed table",
          provenance: "simulated instructional evidence",
          disclosure_constraint: "Do not pre-state whether heteroscedasticity is present."
        }
      }
    ],
    materials: [],
    episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
  });
  dlaPage.assembly_state = { current_stage: "dla", enriched_by: ["episode_plan", "dla"] };
  const gamPage = gamEnrich.enrichPageWithGam(dlaPage);
  const material = gamPage.activities[0].materials[0];
  assert.match(material.body, /Learner evidence/i);
  assert.match(material.body, /Simulated results created for this learning activity/i);
  assert.match(material.body, /observable features/i);
  assert.doesNotMatch(material.body, /Vega|Vega-Lite|plot library/i);
  assert.doesNotMatch(material.body, /correct answer is|therefore the answer/i);
  assert.ok(Array.isArray(gamPage.generation_notes.validation.quality_diagnostics));
});

test("S72: A2-like combined evidence/workspace table keeps learner interpretation fields blank", () => {
  const dlaPage = buildMinimalPage({
    activity_id: "A1",
    title: "Interpret viral variation pattern",
    grouping: "individual",
    duration_minutes: 20,
    learning_outcome_ids: ["LO1"],
    learner_task: "Use fixed observations to infer replication pattern.",
    expected_output: "A justified interpretation from observed particulars.",
    activity_preamble: "Inspect observations before concluding.",
    required_materials: [
      {
        material_id: "A1-M1",
        material_type: "analysis_table",
        purpose: "Provide observed sequence-change results with learner interpretation fields.",
        specification: "Fixed evidence columns plus learner interpretation columns.",
        evidence_requirement: {
          kind: "learner_evidence",
          purpose: "Provide observed particulars for interpretation.",
          learner_action: "Compare observations before inferring pattern.",
          observable_features: [
            "counts of observed variants under control and disruption conditions",
            "reported change between control and disruption"
          ],
          provenance: "system_generated_simulation",
          evidence_layout: "combined_evidence_workspace",
          fixed_observation_fields: ["Population", "Observed sequence count", "Reported change"],
          learner_response_fields: ["Interpretation", "Consequence"]
        }
      }
    ],
    materials: [],
    episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
  });
  dlaPage.assembly_state = { current_stage: "dla", enriched_by: ["episode_plan", "dla"] };
  const gamPage = gamEnrich.enrichPageWithGam(dlaPage);
  const body = gamPage.activities[0].materials[0].body;
  assert.match(body, /\*Learner completes\*/i);
  assert.match(body, /Fixed evidence columns contain observations/i);
  assert.doesNotMatch(body, /quasi-species|therefore .* most important|overall judgement/i);
});

test("S72: combined evidence/workspace simulation provenance yields Simulated title-level label", () => {
  const dlaPage = buildMinimalPage({
    activity_id: "A3",
    title: "Analyse entry pathway evidence",
    grouping: "individual",
    duration_minutes: 20,
    learning_outcome_ids: ["LO1"],
    learner_task: "Analyse the supplied entry pathway evidence.",
    expected_output: "A justified interpretation of entry pathway observations.",
    activity_preamble: "Inspect the evidence table before concluding.",
    evidence_decision: {
      required: true,
      reason: "Learner must inspect entry pathway evidence.",
      provider_material_ids: ["A3-M3"]
    },
    required_materials: [
      {
        material_id: "A3-M3",
        material_type: "analysis_table",
        purpose: "Entry Evidence Table",
        specification: "Combined evidence and learner workspace.",
        evidence_requirement: {
          kind: "learner_evidence",
          purpose: "Provide entry pathway observations with learner interpretation fields.",
          learner_action: "Compare entry observations before judging pathway contribution.",
          observable_features: [
            "receptor engagement under control and disruption",
            "reported entry outcome change"
          ],
          provenance: "system_generated_simulation",
          evidence_layout: "combined_evidence_workspace",
          fixed_observation_fields: ["Condition", "Observed entry signal", "Change"],
          learner_response_fields: ["Interpretation", "Judgement"]
        }
      }
    ],
    materials: [],
    episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
  });
  dlaPage.assembly_state = { current_stage: "dla", enriched_by: ["episode_plan", "dla"] };
  const gamPage = gamEnrich.enrichPageWithGam(dlaPage);
  const material = gamPage.activities[0].materials[0];
  assert.match(material.title, /\bSimulated\b/i);
  assert.match(material.title, /Entry Evidence Table/i);

  const capturePage = buildMinimalPage({
    activity_id: "A3",
    title: "Analyse entry pathway evidence",
    grouping: "individual",
    duration_minutes: 20,
    learning_outcome_ids: ["LO1"],
    learner_task: "Analyse the supplied entry pathway evidence.",
    expected_output: "A justified interpretation of entry pathway observations.",
    activity_preamble: "Inspect the evidence table before concluding.",
    evidence_decision: {
      required: true,
      reason: "Learner must inspect entry pathway evidence.",
      provider_material_ids: ["A3-M3"]
    },
    required_materials: [
      {
        material_id: "A3-M3",
        material_type: "analysis_table",
        purpose: "Entry Evidence Table",
        specification: "Combined evidence and learner workspace.",
        evidence_requirement: {
          kind: "learner_evidence",
          purpose: "Provide entry pathway observations with learner interpretation fields.",
          learner_action: "Compare entry observations before judging pathway contribution.",
          observable_features: [
            "receptor engagement under control and disruption",
            "reported entry outcome change"
          ],
          provenance: "system_generated_simulation",
          evidence_layout: "combined_evidence_workspace",
          fixed_observation_fields: ["Condition", "Observed entry signal", "Change"],
          learner_response_fields: ["Interpretation", "Judgement"]
        }
      }
    ],
    materials: [
      {
        material_id: "A3-M3",
        material_type: "analysis_table",
        title: "Entry Evidence Table",
        body:
          "### Simulated Evidence\n\n| Condition | Observed entry signal | Change | Interpretation | Judgement |\n| --- | --- | --- | --- | --- |\n| Control | High | Baseline |  |  |\n| Disruption | Low | Decrease |  |  |",
        body_format: "markdown"
      }
    ],
    episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
  });
  capturePage.assembly_state = { current_stage: "dla", enriched_by: ["episode_plan", "dla"] };
  const merged = gamEnrich.normalizeGamCaptureToPage(capturePage, {
    activities: capturePage.activities
  });
  const capturedTitle = merged.activities[0].materials[0].title;
  assert.match(capturedTitle, /\bSimulated\b/i);
  assert.match(capturedTitle, /Entry Evidence Table/i);

  const tableWorkspace = require(path.join(
    repoRoot,
    "lib",
    "learner-renderer-vnext",
    "render-table-workspace.js"
  ));
  const html = tableWorkspace.renderTableWorkspace(
    {
      id: "A3-M3",
      type: "analysis_table",
      title: capturedTitle,
      body: merged.activities[0].materials[0].body,
      bodyFormat: "markdown"
    },
    "A3"
  );
  assert.match(html, /Simulated Entry Evidence Table/i);
});

test("S72: GAM hard-fails malformed evidence requirement shape at boundary", () => {
  const bad = buildMinimalPage({
    activity_id: "A1",
    title: "RNA/HCV perturbation interpretation",
    grouping: "individual",
    duration_minutes: 20,
    learning_outcome_ids: ["LO1"],
    learner_task: "Interpret perturbation results.",
    expected_output: "A mechanistic interpretation.",
    activity_preamble: "Use the provided perturbation table.",
    required_materials: [
      {
        material_id: "A1-M1",
        material_type: "data_table",
        purpose: "Perturbation result table",
        specification: "Simulated perturbation-results observations",
        evidence_requirement: {
          kind: "learner_evidence",
          purpose: "Interpret perturbation outputs",
          learner_action: "Compare component disruptions",
          observable_features: []
        }
      }
    ],
    materials: [
      {
        material_id: "A1-M1",
        material_type: "data_table",
        title: "Perturbation results",
        body: "placeholder",
        body_format: "markdown"
      }
    ],
    episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
  });
  bad.assembly_state = { current_stage: "gam", enriched_by: ["episode_plan", "dla", "gam"] };
  const check = gamEnrich.validateGamEnrichedPage(bad, null);
  assert.equal(check.ok, false);
  assert.ok(check.errors.some((e) => /evidence_requirement/.test(e)));
});

test("S72: legacy required_material rows remain compatible", () => {
  const page = buildMinimalPage({
    activity_id: "A1",
    title: "Legacy row compatibility",
    grouping: "individual",
    duration_minutes: 10,
    learning_outcome_ids: ["LO1"],
    learner_task: "Summarise core ideas.",
    expected_output: "A concise summary.",
    activity_preamble: "Use the explanatory material.",
    required_materials: [
      {
        material_id: "A1-M1",
        material_type: "text",
        purpose: "Explain the concept.",
        specification: "Concept explanation."
      }
    ],
    materials: [],
    episode_plan: { archetype: "understand", beats: [{ function: "explanation" }] }
  });
  page.assembly_state = { current_stage: "dla", enriched_by: ["episode_plan", "dla"] };
  const gamPage = gamEnrich.enrichPageWithGam(page);
  const check = gamEnrich.validateGamEnrichedPage(gamPage, page);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
});

test("S72: delayed disclosure diagnostics catch observed A5-like failure wording", () => {
  const page = buildMinimalPage({
    activity_id: "A1",
    title: "Evaluate persistence mechanisms",
    grouping: "individual",
    duration_minutes: 20,
    learning_outcome_ids: ["LO1"],
    learner_task: "Evaluate which mechanism is most important from the evidence.",
    expected_output: "A justified judgement.",
    activity_preamble: "Inspect evidence before judging.",
    evidence_decision: {
      required: true,
      reason: "Learner must inspect persistence evidence before judging.",
      provider_material_ids: ["A1-M1"]
    },
    required_materials: [
      {
        material_id: "A1-M1",
        material_type: "scenario",
        purpose: "Evidence scenarios.",
        specification: "Case observations only.",
        evidence_requirement: {
          kind: "learner_evidence",
          purpose: "Provide observations for evaluation.",
          learner_action: "Compare cases and justify judgement.",
          observable_features: ["observed change under disruption", "contrast between cases"],
          provenance: "system_generated_simulation"
        }
      },
      {
        material_id: "A1-M2",
        material_type: "decision_table",
        purpose: "Learner judgement workspace.",
        specification: "Blank learner workspace."
      }
    ],
    materials: [
      {
        material_id: "A1-M1",
        material_type: "scenario",
        title: "Scenarios",
        body:
          "A reasonable provisional judgement is that membrane protection make the strongest contribution. The overall judgement is that this mechanism dominates; therefore membrane protection is most important.",
        body_format: "markdown"
      },
      {
        material_id: "A1-M2",
        material_type: "decision_table",
        title: "Decision table",
        body: "| Mechanism | Evidence | Judgement |\n| --- | --- | --- |\n| A | ... | ... |",
        body_format: "markdown"
      }
    ],
    episode_plan: { archetype: "evaluate", beats: [{ function: "evaluative_judgement" }] }
  });
  page.assembly_state = { current_stage: "gam", enriched_by: ["episode_plan", "dla", "gam"] };
  const merged = gamEnrich.normalizeGamCaptureToPage(page, { activities: page.activities });
  const diagnostics =
    (merged &&
      merged.generation_notes &&
      merged.generation_notes.validation &&
      merged.generation_notes.validation.quality_diagnostics) ||
    [];
  assert.ok(diagnostics.some((d) => d.code === "EVIDENCE_PRETASK_DISCLOSURE"));
});

test("S72: RNA A5 focal worked example must not conclude preferred mechanism", () => {
  const page = buildMinimalPage({
    activity_id: "A5",
    title: "Judge HCV persistence support",
    grouping: "individual",
    duration_minutes: 25,
    learning_outcome_ids: ["LO1"],
    learner_task:
      "Analyse the evidence from the HCV persistence scenario and judge which mechanism contributes most strongly.",
    expected_output: "A justified ranking of persistence mechanisms from the focal evidence.",
    activity_preamble: "Inspect the supplied persistence evidence before judging.",
    evidence_decision: {
      required: true,
      reason: "Learner must inspect HCV persistence evidence before judging.",
      provider_material_ids: ["A5-M2"]
    },
    required_materials: [
      {
        material_id: "A5-M1",
        material_type: "worked_example",
        purpose: "Worked Judgement Example",
        specification: "Model reasoning procedure only."
      },
      {
        material_id: "A5-M2",
        material_type: "scenario",
        purpose: "HCV persistence evidence provider.",
        specification: "Focal persistence observations.",
        evidence_requirement: {
          kind: "learner_evidence",
          purpose: "Provide HCV persistence observations for judgement.",
          learner_action: "Compare mechanisms and justify which contributes most strongly.",
          observable_features: [
            "lipoviral particles abundance under disruption",
            "DMVs formation pattern",
            "cell-to-cell spread persistence signal"
          ],
          provenance: "system_generated_simulation",
          disclosure_constraint: "Do not state the preferred mechanism before learner response."
        }
      },
      {
        material_id: "A5-M3",
        material_type: "decision_table",
        purpose: "Learner judgement workspace.",
        specification: "Blank learner workspace."
      }
    ],
    materials: [
      {
        material_id: "A5-M1",
        material_type: "worked_example",
        title: "Worked Judgement Example",
        body:
          "Using the HCV persistence evidence on lipoviral particles, DMVs, and cell-to-cell spread, a reasonable provisional judgement is that replication compartments provide the broadest support and contribute most strongly.",
        body_format: "markdown"
      },
      {
        material_id: "A5-M2",
        material_type: "scenario",
        title: "HCV persistence evidence",
        body:
          "### Observations\n\n1. Lipoviral particles remain detectable after antibody exposure.\n2. DMVs increase under interferon pressure.\n3. Cell-to-cell spread continues when free-virus entry is blocked.",
        body_format: "markdown"
      },
      {
        material_id: "A5-M3",
        material_type: "decision_table",
        title: "Judgement table",
        body: "| Mechanism | Evidence | Judgement |\n| --- | --- | --- |\n| Lipoviral particles |  |  |\n| DMVs |  |  |\n| Cell-to-cell spread |  |  |",
        body_format: "markdown"
      }
    ],
    episode_plan: { archetype: "evaluate", beats: [{ function: "evaluative_judgement" }] }
  });
  page.assembly_state = { current_stage: "gam", enriched_by: ["episode_plan", "dla", "gam"] };
  const merged = gamEnrich.normalizeGamCaptureToPage(page, { activities: page.activities });
  const diagnostics =
    (merged &&
      merged.generation_notes &&
      merged.generation_notes.validation &&
      merged.generation_notes.validation.quality_diagnostics) ||
    [];
  assert.ok(
    diagnostics.some(
      (d) =>
        d.code === "EVIDENCE_PRETASK_DISCLOSURE" &&
        /A5-M1|pre-task|focal evidence|preferred judgement/i.test(d.message || "")
    ),
    diagnostics.map((d) => d.code + ": " + d.message).join("; ")
  );
});

test("S72: analogous worked example with distinct evidence remains valid", () => {
  const page = buildMinimalPage({
    activity_id: "A5",
    title: "Judge HCV persistence support",
    grouping: "individual",
    duration_minutes: 25,
    learning_outcome_ids: ["LO1"],
    learner_task:
      "Analyse the evidence from the HCV persistence scenario and judge which mechanism contributes most strongly.",
    expected_output: "A justified ranking of persistence mechanisms from the focal evidence.",
    activity_preamble: "Inspect the supplied persistence evidence before judging.",
    evidence_decision: {
      required: true,
      reason: "Learner must inspect HCV persistence evidence before judging.",
      provider_material_ids: ["A5-M2"]
    },
    required_materials: [
      {
        material_id: "A5-M1",
        material_type: "worked_example",
        purpose: "Analogous Worked Judgement Example",
        specification: "Distinct analogous case modelling the procedure only."
      },
      {
        material_id: "A5-M2",
        material_type: "scenario",
        purpose: "HCV persistence evidence provider.",
        specification: "Focal persistence observations.",
        evidence_requirement: {
          kind: "learner_evidence",
          purpose: "Provide HCV persistence observations for judgement.",
          learner_action: "Compare mechanisms and justify which contributes most strongly.",
          observable_features: [
            "lipoviral particles abundance under disruption",
            "DMVs formation pattern",
            "cell-to-cell spread persistence signal"
          ],
          provenance: "system_generated_simulation"
        }
      }
    ],
    materials: [
      {
        material_id: "A5-M1",
        material_type: "worked_example",
        title: "Analogous Worked Judgement Example",
        body:
          "In a distinct influenza immune-evasion case, compare mucus barrier thickness, alveolar macrophage clearance, and antigenic drift signals. Step 1: list each observation. Step 2: weigh breadth of support. Do not transfer the influenza conclusion to the HCV task.",
        body_format: "markdown"
      },
      {
        material_id: "A5-M2",
        material_type: "scenario",
        title: "HCV persistence evidence",
        body:
          "### Observations\n\n1. Lipoviral particles remain detectable after antibody exposure.\n2. DMVs increase under interferon pressure.\n3. Cell-to-cell spread continues when free-virus entry is blocked.",
        body_format: "markdown"
      }
    ],
    episode_plan: { archetype: "evaluate", beats: [{ function: "evaluative_judgement" }] }
  });
  page.assembly_state = { current_stage: "gam", enriched_by: ["episode_plan", "dla", "gam"] };
  const merged = gamEnrich.normalizeGamCaptureToPage(page, { activities: page.activities });
  const diagnostics =
    (merged &&
      merged.generation_notes &&
      merged.generation_notes.validation &&
      merged.generation_notes.validation.quality_diagnostics) ||
    [];
  assert.equal(
    diagnostics.some((d) => d.code === "EVIDENCE_PRETASK_DISCLOSURE"),
    false,
    diagnostics.map((d) => d.code + ": " + d.message).join("; ")
  );
});

test("S72: neutral evidence observations do not trigger delayed-disclosure warning", () => {
  const page = buildMinimalPage({
    activity_id: "A1",
    title: "Neutral evidence",
    grouping: "individual",
    duration_minutes: 20,
    learning_outcome_ids: ["LO1"],
    learner_task: "Interpret the observations.",
    expected_output: "A justified interpretation.",
    activity_preamble: "Use observations only.",
    required_materials: [
      {
        material_id: "A1-M1",
        material_type: "scenario",
        purpose: "Evidence scenario.",
        specification: "Neutral observations.",
        evidence_requirement: {
          kind: "learner_evidence",
          purpose: "Provide observations.",
          learner_action: "Compare cases.",
          observable_features: ["observed values by condition"],
          provenance: "system_generated_simulation"
        }
      }
    ],
    materials: [
      {
        material_id: "A1-M1",
        material_type: "scenario",
        title: "Observed cases",
        body:
          "Case A reports lower intracellular RNA under disruption. Case B reports unchanged receptor availability with reduced entry outcome.",
        body_format: "markdown"
      }
    ],
    episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
  });
  page.assembly_state = { current_stage: "gam", enriched_by: ["episode_plan", "dla", "gam"] };
  const merged = gamEnrich.normalizeGamCaptureToPage(page, { activities: page.activities });
  const diagnostics =
    (merged &&
      merged.generation_notes &&
      merged.generation_notes.validation &&
      merged.generation_notes.validation.quality_diagnostics) ||
    [];
  assert.equal(diagnostics.some((d) => d.code === "EVIDENCE_PRETASK_DISCLOSURE"), false);
});

test("S72: simulation honesty uses explicit learner-facing label", () => {
  const page = buildMinimalPage({
    activity_id: "A1",
    title: "Simulated evidence labelling",
    grouping: "individual",
    duration_minutes: 20,
    learning_outcome_ids: ["LO1"],
    learner_task: "Use the simulated evidence.",
    expected_output: "A justified response.",
    activity_preamble: "Inspect evidence first.",
    required_materials: [
      {
        material_id: "A1-M1",
        material_type: "scenario",
        purpose: "Simulated evidence case set.",
        specification: "Case observations.",
        evidence_requirement: {
          kind: "learner_evidence",
          purpose: "Provide inspectable evidence.",
          learner_action: "Compare observations.",
          observable_features: ["reported outcomes under two conditions"],
          provenance: "system_generated_simulation"
        }
      }
    ],
    materials: [],
    episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
  });
  page.assembly_state = { current_stage: "dla", enriched_by: ["episode_plan", "dla"] };
  const gamPage = gamEnrich.enrichPageWithGam(page);
  assert.match(gamPage.activities[0].materials[0].body, /Simulated results created for this learning activity/i);
});

test("S72: selectivity preserves prediction activity as non-evidence by default", () => {
  const page = buildMinimalPage({
    activity_id: "A1",
    title: "Predict from taught model",
    grouping: "individual",
    duration_minutes: 12,
    learning_outcome_ids: ["LO1"],
    episode_plan: {
      archetype: "apply",
      beats: [{ function: "guided_practice" }]
    }
  });
  const enriched = dlaEnrich.enrichPageWithDla(page);
  const required = enriched.activities[0].required_materials || [];
  assert.equal(required.some((row) => !!row.evidence_requirement), false);
});

test("S72: heteroscedasticity A2 separate provider + analysis scaffold passes", () => {
  const page = buildMinimalPage({
    activity_id: "A2",
    title: "Interpret residual-plot evidence",
    grouping: "individual",
    duration_minutes: 20,
    learning_outcome_ids: ["LO1"],
    learner_task: "Analyse the supplied residual-plot evidence and decide whether variance is constant.",
    expected_output: "A justified heteroscedasticity judgement citing observed residual patterns.",
    activity_preamble: "Inspect the scenario evidence before completing the analysis table.",
    evidence_decision: {
      required: true,
      reason: "Learner must inspect residual-plot evidence before judging.",
      provider_material_ids: ["A2-M2"]
    },
    required_materials: [
      {
        material_id: "A2-M1",
        material_type: "text",
        purpose: "Explain residual-plot reading.",
        specification: "Teaching exposition."
      },
      {
        material_id: "A2-M2",
        material_type: "scenario",
        purpose: "Residual-plot evidence cases.",
        specification: "Contrastive residual-spread observations.",
        evidence_requirement: {
          kind: "learner_evidence",
          purpose: "Provide inspectable residual-spread observations.",
          learner_action: "Compare residual spread across fitted-value regions.",
          observable_features: [
            "widening residual spread at higher fitted values",
            "contrast between lower and upper fitted ranges"
          ],
          evidence_layout: "separate_provider",
          provenance: "system_generated_simulation"
        }
      },
      {
        material_id: "A2-M3",
        material_type: "analysis_table",
        purpose: "Structure learner interpretation of residual evidence.",
        specification: "Blank learner response scaffold for residual judgements."
      }
    ],
    materials: [],
    episode_plan: {
      archetype: "analyse",
      beats: [{ function: "guided_reasoning" }, { function: "guided_inquiry" }]
    }
  });
  page.assembly_state = { current_stage: "dla", enriched_by: ["episode_plan", "dla"] };
  const check = dlaEnrich.validateDlaEnrichedPage(page, null);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
  const required = page.activities[0].required_materials;
  const providers = required.filter((row) => row && row.evidence_requirement);
  assert.equal(providers.length, 1);
  assert.equal(providers[0].material_id, "A2-M2");
  assert.equal(Object.prototype.hasOwnProperty.call(required[2], "evidence_requirement"), false);
});

test("S72: heteroscedasticity A2 invalid scaffold evidence_requirement fails provider/scaffold closure", () => {
  const page = buildMinimalPage({
    activity_id: "A2",
    title: "Interpret residual-plot evidence",
    grouping: "individual",
    duration_minutes: 20,
    learning_outcome_ids: ["LO1"],
    learner_task: "Analyse the supplied residual-plot evidence and decide whether variance is constant.",
    expected_output: "A justified heteroscedasticity judgement citing observed residual patterns.",
    activity_preamble: "Inspect the scenario evidence before completing the analysis table.",
    evidence_decision: {
      required: true,
      reason: "Learner must inspect residual-plot evidence before judging.",
      provider_material_ids: ["A2-M2"]
    },
    required_materials: [
      {
        material_id: "A2-M1",
        material_type: "text",
        purpose: "Explain residual-plot reading.",
        specification: "Teaching exposition."
      },
      {
        material_id: "A2-M2",
        material_type: "scenario",
        purpose: "Residual-plot evidence cases.",
        specification: "Contrastive residual-spread observations.",
        evidence_requirement: {
          kind: "learner_evidence",
          purpose: "Provide inspectable residual-spread observations.",
          learner_action: "Compare residual spread across fitted-value regions.",
          observable_features: [
            "widening residual spread at higher fitted values",
            "contrast between lower and upper fitted ranges"
          ],
          evidence_layout: "separate_provider",
          provenance: "system_generated_simulation"
        }
      },
      {
        material_id: "A2-M3",
        material_type: "analysis_table",
        purpose: "Enable systematic inspection of evidence.",
        specification: "Combined evidence workspace.",
        evidence_requirement: {
          kind: "learner_evidence",
          purpose: "Enable systematic inspection of evidence.",
          learner_action: "Record observations before deciding on an interpretation.",
          observable_features: [
            "residual spread pattern",
            "fitted-value region contrast"
          ],
          evidence_layout: "combined_evidence_workspace",
          fixed_observation_fields: ["Case", "Observed Pattern", "Variance Behaviour"],
          learner_response_fields: ["Heteroscedasticity Judgement", "Hint"]
        }
      }
    ],
    materials: [],
    episode_plan: {
      archetype: "analyse",
      beats: [{ function: "guided_reasoning" }]
    }
  });
  page.assembly_state = { current_stage: "dla", enriched_by: ["episode_plan", "dla"] };
  const check = dlaEnrich.validateDlaEnrichedPage(page, null);
  assert.equal(check.ok, false);
  assert.ok(
    check.errors.some((e) => /provider\/scaffold closure/i.test(e)),
    check.errors.join("; ")
  );
  assert.ok(
    check.errors.some((e) => /A2-M3|required_materials\[2\]/i.test(e)),
    check.errors.join("; ")
  );
});

test("S72: valid combined evidence/workspace table listed as provider passes", () => {
  const page = buildMinimalPage({
    activity_id: "A3",
    title: "Analyse entry pathway evidence",
    grouping: "individual",
    duration_minutes: 20,
    learning_outcome_ids: ["LO1"],
    learner_task: "Analyse the supplied entry pathway evidence in the combined table.",
    expected_output: "A justified interpretation using fixed observations.",
    activity_preamble: "Use the combined evidence/workspace table.",
    evidence_decision: {
      required: true,
      reason: "The combined table supplies fixed observations for learner interpretation.",
      provider_material_ids: ["A3-M3"]
    },
    required_materials: [
      {
        material_id: "A3-M3",
        material_type: "analysis_table",
        purpose: "Entry Evidence Table",
        specification: "Combined evidence and learner workspace.",
        evidence_requirement: {
          kind: "learner_evidence",
          purpose: "Provide entry pathway observations with learner interpretation fields.",
          learner_action: "Compare entry observations before judging pathway contribution.",
          observable_features: [
            "receptor engagement under control and disruption",
            "reported entry outcome change"
          ],
          provenance: "system_generated_simulation",
          evidence_layout: "combined_evidence_workspace",
          fixed_observation_fields: ["Condition", "Observed entry signal", "Change"],
          learner_response_fields: ["Interpretation", "Judgement"]
        }
      }
    ],
    materials: [],
    episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
  });
  page.assembly_state = { current_stage: "dla", enriched_by: ["episode_plan", "dla"] };
  const check = dlaEnrich.validateDlaEnrichedPage(page, null);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
});

test("S72: combined mode with empty learner_response_fields hard-fails shape", () => {
  const page = buildMinimalPage({
    activity_id: "A2",
    title: "Interpret residual-plot evidence",
    grouping: "individual",
    duration_minutes: 20,
    learning_outcome_ids: ["LO1"],
    learner_task: "Analyse the supplied residual-plot evidence.",
    expected_output: "A justified judgement.",
    activity_preamble: "Inspect evidence first.",
    evidence_decision: {
      required: true,
      reason: "Combined table is the evidence provider.",
      provider_material_ids: ["A2-M3"]
    },
    required_materials: [
      {
        material_id: "A2-M3",
        material_type: "analysis_table",
        purpose: "Enable systematic inspection of evidence.",
        specification: "Combined evidence workspace.",
        evidence_requirement: {
          kind: "learner_evidence",
          purpose: "Enable systematic inspection of evidence.",
          learner_action: "Record observations before deciding on an interpretation.",
          observable_features: ["residual spread pattern", "fitted-value region contrast"],
          evidence_layout: "combined_evidence_workspace",
          fixed_observation_fields: ["Case", "Observed Pattern", "Variance Behaviour"],
          learner_response_fields: []
        }
      }
    ],
    materials: [],
    episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
  });
  page.assembly_state = { current_stage: "dla", enriched_by: ["episode_plan", "dla"] };
  const check = dlaEnrich.validateDlaEnrichedPage(page, null);
  assert.equal(check.ok, false);
  assert.ok(
    check.errors.some((e) =>
      /learner_response_fields must be a non-empty string array/i.test(e)
    ),
    check.errors.join("; ")
  );
});

test("S72: combined mode with empty fixed_observation_fields hard-fails shape", () => {
  const page = buildMinimalPage({
    activity_id: "A3",
    title: "Analyse entry pathway evidence",
    grouping: "individual",
    duration_minutes: 20,
    learning_outcome_ids: ["LO1"],
    learner_task: "Analyse the supplied entry pathway evidence.",
    expected_output: "A justified judgement.",
    activity_preamble: "Inspect evidence first.",
    evidence_decision: {
      required: true,
      reason: "Combined table is the evidence provider.",
      provider_material_ids: ["A3-M3"]
    },
    required_materials: [
      {
        material_id: "A3-M3",
        material_type: "analysis_table",
        purpose: "Entry Evidence Table",
        specification: "Combined evidence workspace.",
        evidence_requirement: {
          kind: "learner_evidence",
          purpose: "Provide entry pathway observations with learner interpretation fields.",
          learner_action: "Compare entry observations before judging.",
          observable_features: ["receptor engagement", "entry outcome change"],
          evidence_layout: "combined_evidence_workspace",
          fixed_observation_fields: [],
          learner_response_fields: ["Interpretation", "Judgement"]
        }
      }
    ],
    materials: [],
    episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
  });
  page.assembly_state = { current_stage: "dla", enriched_by: ["episode_plan", "dla"] };
  const check = dlaEnrich.validateDlaEnrichedPage(page, null);
  assert.equal(check.ok, false);
  assert.ok(
    check.errors.some((e) =>
      /fixed_observation_fields must be a non-empty string array/i.test(e)
    ),
    check.errors.join("; ")
  );
});

test("S72: DLA and GAM contracts include evidence-centred guidance and source-bound boundary", () => {
  const dlaText = dlaContract.buildDlaPageEnrichContractBlock();
  const gamText = gamContract.buildGamPageEnrichContractBlock();
  assert.match(dlaText, /evidence_requirement/i);
  assert.match(dlaText, /observable_features/i);
  assert.match(dlaText, /system_generated_simulation/i);
  assert.match(dlaText, /distinct analogous case|procedure-only modelling|focal evidence provider/i);
  assert.match(dlaText, /Referencing or recording evidence|ordinary response scaffold|combined_evidence_workspace only when/i);
  assert.match(dlaText, /Known boundary|uploaded primary evidence|source-bound/i);
  assert.match(gamText, /required_materials\[\]\.evidence_requirement/i);
  assert.match(gamText, /Never fabricate exact source-bound evidence/i);
  assert.match(gamText, /focal evidence provider|distinct analogous case/i);
  assert.match(gamText, /Simulated Entry Evidence Table|title contains "Simulated"/i);
});
