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
  assert.match(dlaText, /conversation_attachment/);
  assert.match(dlaText, /distinct analogous case|procedure-only modelling|focal evidence provider/i);
  assert.match(dlaText, /Referencing or recording evidence|ordinary response scaffold|combined_evidence_workspace only when/i);
  assert.match(dlaText, /Known boundary|source-bound|conversation_attachment/i);
  assert.match(dlaText, /complete activity contract|language, form, structure|summary packs/i);
  assert.match(dlaText, /Source preference|Provider-role closure|Resource-level consistency/i);
  assert.match(dlaText, /PRE-DESIGN|Evidence-decision planning order|FINAL PRE-EMIT AUDIT|learner_evidence_attachments/i);
  assert.match(
    dlaText,
    /Inventory the source units actually available|Do not invent related but unattached works|Allocate only those units|only inventoried/i
  );
  assert.match(
    dlaText,
    /activity_preamble|later activities|current learner-production obligations|separate conversation_attachment and system_generated_simulation providers/i
  );
  assert.match(gamText, /required_materials\[\]\.evidence_requirement/i);
  assert.match(gamText, /Never fabricate exact source-bound evidence/i);
  assert.match(gamText, /conversation_attachment/);
  assert.match(gamText, /focal evidence provider|distinct analogous case/i);
  assert.match(gamText, /Simulated Entry Evidence Table|title contains "Simulated"/i);
  assert.match(gamText, /do not add a simulation label/i);
  assert.match(gamText, /SOURCE_BOUND_UNFULFILLED|source-bound requirement could not be fulfilled/i);
});

function buildSourceBoundOwenDlaPage() {
  const page = buildMinimalPage({
    activity_id: "A1",
    title: "Close-read Owen war poems",
    grouping: "individual",
    duration_minutes: 20,
    learning_outcome_ids: ["LO1"],
    learner_task:
      "Compare how two Owen poems present the cost of war using attributed quotations from the attached texts.",
    expected_output: "A short comparison that cites exact lines from both poems.",
    activity_preamble: "Work from the attached poem excerpts before stating an interpretation.",
    evidence_decision: {
      required: true,
      reason: "Learner must reason from attached Owen poem excerpts.",
      provider_material_ids: ["A1-ME1"]
    },
    required_materials: [
      {
        material_id: "A1-ME1",
        material_type: "scenario",
        purpose: "Provide inspectable excerpts from Dulce et Decorum Est and Anthem for Doomed Youth.",
        specification:
          "Attributed quotations from the attached poems; preserve lineation; do not supply the preferred interpretation.",
        evidence_requirement: {
          kind: "learner_evidence",
          purpose:
            "Provide attributed excerpts from Dulce et Decorum Est and Anthem for Doomed Youth for close reading.",
          learner_action:
            "Select and cite exact lines from each poem before comparing how each presents the cost of war.",
          observable_features: [
            "exact wording and lineation of selected quotations",
            "contrastive imagery across the two poem excerpts"
          ],
          minimum_suitable_form: "short attributed quotation blocks from each poem",
          processing_notes:
            "Select a duration-proportionate excerpt from each attached poem; preserve wording and lineation; do not replace with thematic summary.",
          provenance: "conversation_attachment",
          disclosure_constraint:
            "Do not state the preferred interpretation of either poem before learner response."
        }
      },
      {
        material_id: "A1-M2",
        material_type: "analysis_table",
        purpose: "Learner comparison workspace.",
        specification: "Blank learner columns for quotation and comparison notes."
      }
    ],
    materials: [],
    episode_plan: {
      archetype: "analyse",
      beats: [{ function: "guided_reasoning" }, { function: "comparison" }]
    }
  });
  page.assembly_state = { current_stage: "dla", enriched_by: ["episode_plan", "dla"] };
  return page;
}

test("S72: source-bound DLA plans remain valid without fabricating attachments", () => {
  const page = buildSourceBoundOwenDlaPage();
  const check = dlaEnrich.validateDlaEnrichedPage(page, null);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
  assert.ok(Array.isArray(check.warnings));
  assert.equal(
    check.warnings.some((w) => w.code === "SOURCE_BOUND_SOURCE_UNIT_UNSPECIFIED"),
    false
  );
  const provider = page.activities[0].required_materials.find((r) => r.material_id === "A1-ME1");
  const scaffold = page.activities[0].required_materials.find((r) => r.material_id === "A1-M2");
  assert.equal(provider.evidence_requirement.provenance, "conversation_attachment");
  assert.equal(Object.prototype.hasOwnProperty.call(scaffold, "evidence_requirement"), false);
  assert.deepEqual(page.activities[0].evidence_decision.provider_material_ids, ["A1-ME1"]);
});

test("S72: no-source workflows retain system-generated evidence behaviour", () => {
  const page = buildMinimalPage({
    activity_id: "A1",
    title: "Interpret residual pattern",
    grouping: "individual",
    duration_minutes: 15,
    learning_outcome_ids: ["LO1"],
    learner_task: "Inspect the residual table and justify whether variance looks constant.",
    expected_output: "A short evidence-based justification.",
    activity_preamble: "Use the supplied table.",
    evidence_decision: {
      required: true,
      reason: "Learner must inspect residual observations.",
      provider_material_ids: ["A1-M1"]
    },
    required_materials: [
      {
        material_id: "A1-M1",
        material_type: "analysis_table",
        purpose: "Residual observations.",
        specification: "Compact residual table.",
        evidence_requirement: {
          kind: "learner_evidence",
          purpose: "Provide inspectable residual observations.",
          learner_action: "Compare residual spread before concluding.",
          observable_features: ["residual spread at low fitted values", "residual spread at high fitted values"],
          provenance: "system_generated_simulation",
          evidence_layout: "combined_evidence_workspace",
          fixed_observation_fields: ["Fitted region", "Observed residual spread"],
          learner_response_fields: ["Interpretation"]
        }
      }
    ],
    materials: [],
    episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
  });
  page.assembly_state = { current_stage: "dla", enriched_by: ["episode_plan", "dla"] };
  const gamPage = gamEnrich.enrichPageWithGam(page);
  const material = gamPage.activities[0].materials[0];
  assert.match(material.body, /Simulated results created for this learning activity/i);
  assert.match(material.title, /\bSimulated\b/i);
  const check = gamEnrich.validateGamEnrichedPage(gamPage, page);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
});

test("S72: source-bound provenance does not receive a simulation label", () => {
  const dlaPage = buildSourceBoundOwenDlaPage();
  const gamPage = gamEnrich.enrichPageWithGam(dlaPage);
  const provider = gamPage.activities[0].materials.find((m) => m.material_id === "A1-ME1");
  assert.ok(provider);
  assert.doesNotMatch(String(provider.title || ""), /\bSimulated\b/i);
  assert.doesNotMatch(String(provider.body || ""), /Simulated results created for this learning activity/i);
});

test("S72: source-bound providers remain distinct from response scaffolds", () => {
  const page = buildSourceBoundOwenDlaPage();
  const check = dlaEnrich.validateDlaEnrichedPage(page, null);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
  const scaffoldWithEvidence = {
    ...page,
    activities: [
      {
        ...page.activities[0],
        required_materials: [
          page.activities[0].required_materials[0],
          {
            material_id: "A1-M2",
            material_type: "analysis_table",
            purpose: "Learner comparison workspace.",
            specification: "Blank learner columns.",
            evidence_requirement: {
              kind: "learner_evidence",
              purpose: "Should not live on scaffold.",
              learner_action: "Write comparison notes.",
              observable_features: ["learner notes"],
              provenance: "conversation_attachment"
            }
          }
        ]
      }
    ]
  };
  const bad = dlaEnrich.validateDlaEnrichedPage(scaffoldWithEvidence, null);
  assert.equal(bad.ok, false);
  assert.ok(
    bad.errors.some((e) => /provider\/scaffold closure|not listed in .*provider_material_ids/i.test(e)),
    bad.errors.join("; ")
  );
});

test("S72: source identity and attribution requirements reach GAM diagnostics", () => {
  const page = buildSourceBoundOwenDlaPage();
  page.assembly_state = { current_stage: "gam", enriched_by: ["episode_plan", "dla", "gam"] };
  page.activities[0].materials = [
    {
      material_id: "A1-ME1",
      material_type: "scenario",
      title: "Poem themes",
      body:
        "In summary the poems present war as futile. The overall message and imagery emphasise suffering without quoting any lines.",
      body_format: "markdown"
    },
    {
      material_id: "A1-M2",
      material_type: "analysis_table",
      title: "Comparison table",
      body: "| Poem | Quotation | Comparison |\n| --- | --- | --- |\n|  |  | *Learner completes* |",
      body_format: "markdown"
    }
  ];
  const merged = gamEnrich.normalizeGamCaptureToPage(page, { activities: page.activities });
  const diagnostics =
    (merged &&
      merged.generation_notes &&
      merged.generation_notes.validation &&
      merged.generation_notes.validation.quality_diagnostics) ||
    [];
  assert.ok(diagnostics.some((d) => d.code === "SOURCE_BOUND_ATTRIBUTION_MISSING"));
  assert.ok(diagnostics.some((d) => d.code === "SOURCE_BOUND_SUMMARY_ONLY"));
});

test("S72: source-bound fulfilment must not carry a Simulated label", () => {
  const page = buildSourceBoundOwenDlaPage();
  page.assembly_state = { current_stage: "gam", enriched_by: ["episode_plan", "dla", "gam"] };
  page.activities[0].materials = [
    {
      material_id: "A1-ME1",
      material_type: "scenario",
      title: "Simulated Owen excerpts",
      body:
        "Source: Dulce et Decorum Est (attachment).\n\n\"Bent double, like old beggars under sacks,\"\n\nSource: Anthem for Doomed Youth (attachment).\n\n\"What passing-bells for these who die as cattle?\"",
      body_format: "markdown"
    },
    {
      material_id: "A1-M2",
      material_type: "analysis_table",
      title: "Comparison table",
      body: "| Poem | Quotation | Comparison |\n| --- | --- | --- |\n|  |  | *Learner completes* |",
      body_format: "markdown"
    }
  ];
  const merged = gamEnrich.normalizeGamCaptureToPage(page, { activities: page.activities });
  const diagnostics =
    (merged &&
      merged.generation_notes &&
      merged.generation_notes.validation &&
      merged.generation_notes.validation.quality_diagnostics) ||
    [];
  assert.ok(diagnostics.some((d) => d.code === "SOURCE_BOUND_SIMULATION_LABEL"));
});

test("S72: Owen-route attributed excerpts pass soft diagnostics without pre-task disclosure", () => {
  const page = buildSourceBoundOwenDlaPage();
  page.assembly_state = { current_stage: "gam", enriched_by: ["episode_plan", "dla", "gam"] };
  page.activities[0].materials = [
    {
      material_id: "A1-ME1",
      material_type: "scenario",
      title: "Owen poem excerpts",
      body:
        "## Learner evidence\n\nSource: Dulce et Decorum Est (conversation attachment).\n\n\"Bent double, like old beggars under sacks,\nKnock-kneed, coughing like hags, we cursed through sludge,\"\n\nSource: Anthem for Doomed Youth (conversation attachment).\n\n\"What passing-bells for these who die as cattle?\nOnly the monstrous anger of the guns.\"\n\nUse these excerpts to compare how each poem presents the cost of war.",
      body_format: "markdown"
    },
    {
      material_id: "A1-M2",
      material_type: "analysis_table",
      title: "Comparison workspace",
      body:
        "| Poem | Exact quotation | How it presents the cost of war |\n| --- | --- | --- |\n| Dulce et Decorum Est |  | *Learner completes* |\n| Anthem for Doomed Youth |  | *Learner completes* |",
      body_format: "markdown"
    }
  ];
  const merged = gamEnrich.normalizeGamCaptureToPage(page, { activities: page.activities });
  const diagnostics =
    (merged &&
      merged.generation_notes &&
      merged.generation_notes.validation &&
      merged.generation_notes.validation.quality_diagnostics) ||
    [];
  assert.equal(
    diagnostics.some((d) =>
      /SOURCE_BOUND_|EVIDENCE_PRETASK_DISCLOSURE|RESPONSE_SCAFFOLD_DISCLOSURE/.test(d.code)
    ),
    false,
    JSON.stringify(diagnostics)
  );
  const check = gamEnrich.validateGamEnrichedPage(merged, page);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
});

test("S72: pre-task disclosure protections still apply with source-bound evidence", () => {
  const page = buildSourceBoundOwenDlaPage();
  page.activities[0].required_materials.unshift({
    material_id: "A1-M0",
    material_type: "worked_example",
    purpose: "Model close reading.",
    specification: "Procedure-only modelling preferred."
  });
  page.assembly_state = { current_stage: "gam", enriched_by: ["episode_plan", "dla", "gam"] };
  page.activities[0].materials = [
    {
      material_id: "A1-M0",
      material_type: "worked_example",
      title: "Worked reading",
      body:
        "Using Dulce et Decorum Est, a reasonable provisional judgement is that Owen presents war as futile and therefore the preferred interpretation is condemnation of patriotic ideals.",
      body_format: "markdown"
    },
    {
      material_id: "A1-ME1",
      material_type: "scenario",
      title: "Owen poem excerpts",
      body:
        "Source: Dulce et Decorum Est (attachment).\n\n\"Bent double, like old beggars under sacks,\"\n\nSource: Anthem for Doomed Youth (attachment).\n\n\"What passing-bells for these who die as cattle?\"",
      body_format: "markdown"
    },
    {
      material_id: "A1-M2",
      material_type: "analysis_table",
      title: "Comparison workspace",
      body: "| Poem | Quotation | Comparison |\n| --- | --- | --- |\n|  |  | *Learner completes* |",
      body_format: "markdown"
    }
  ];
  const merged = gamEnrich.normalizeGamCaptureToPage(page, { activities: page.activities });
  const diagnostics =
    (merged &&
      merged.generation_notes &&
      merged.generation_notes.validation &&
      merged.generation_notes.validation.quality_diagnostics) ||
    [];
  assert.ok(diagnostics.some((d) => d.code === "EVIDENCE_PRETASK_DISCLOSURE"));
});

test("S72: missing attachment never hard-fails ordinary or source-bound DLA validation", () => {
  const ordinary = buildMinimalPage({
    activity_id: "A1",
    title: "Explain core terms",
    grouping: "individual",
    duration_minutes: 10,
    learning_outcome_ids: ["LO1"],
    learner_task: "Explain the key terms.",
    expected_output: "A short explanation.",
    activity_preamble: "Read the exposition.",
    evidence_decision: {
      required: false,
      reason: "Explanatory activity does not require learner evidence.",
      provider_material_ids: []
    },
    required_materials: [
      {
        material_id: "A1-M1",
        material_type: "text",
        purpose: "Explain terms.",
        specification: "Short exposition."
      }
    ],
    materials: [],
    episode_plan: { archetype: "understand", beats: [{ function: "explanation" }] }
  });
  ordinary.assembly_state = { current_stage: "dla", enriched_by: ["episode_plan", "dla"] };
  assert.equal(dlaEnrich.validateDlaEnrichedPage(ordinary, null).ok, true);

  const sourceBound = buildSourceBoundOwenDlaPage();
  const check = dlaEnrich.validateDlaEnrichedPage(sourceBound, null);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
});

test("S72: no Episode Plan schema or source-manifest fields are introduced", () => {
  const fs = require("node:fs");
  const epValidation = fs.readFileSync(
    path.join(repoRoot, "lib", "episode-plan-v1-validation.js"),
    "utf8"
  );
  const epGrammar = fs.readFileSync(
    path.join(repoRoot, "lib", "episode-plan-v1-archetype-grammar.js"),
    "utf8"
  );
  assert.doesNotMatch(epValidation, /conversation_attachment|workflow_sources|author_supplied_source/);
  assert.doesNotMatch(epGrammar, /conversation_attachment|workflow_sources|author_supplied_source/);
  const page = buildSourceBoundOwenDlaPage();
  assert.equal(Object.prototype.hasOwnProperty.call(page.activities[0].episode_plan, "sources"), false);
  assert.deepEqual(Object.keys(page.activities[0].episode_plan).sort(), ["archetype", "beats"]);
});

test("S72: DLA runner Instructions guide optional Copilot attachment without implying Prism storage", () => {
  const fs = require("node:fs");
  const patterns = fs.readFileSync(
    path.join(repoRoot, "domains", "learning-design", "domain-learning-design-step-patterns.md"),
    "utf8"
  );
  assert.match(
    patterns,
    /Optional: Upload subject-specific evidence with this prompt/i
  );
  assert.match(patterns, /clearly identified simulated examples \(default\)/i);
  assert.match(patterns, /conversation_attachment/);
});

test("S72: literary form/structure analysis requires evidence even without analyse-evidence phrasing", () => {
  const page = buildMinimalPage({
    activity_id: "A3",
    title: "Form and Perspective",
    grouping: "individual",
    duration_minutes: 20,
    learning_outcome_ids: ["LO1"],
    learner_task:
      "Complete a comparison of formal features across the poems and explain how formal features shape meaning.",
    expected_output: "A comparison that supports interpretations with evidence.",
    activity_preamble: "Use the form guide and poem materials.",
    evidence_use_prompt: "Support each interpretation with evidence from the poems.",
    evidence_decision: {
      required: false,
      reason: "Incorrectly treated as guide-only.",
      provider_material_ids: []
    },
    required_materials: [
      {
        material_id: "A3-M1",
        material_type: "text",
        purpose: "Explanatory guide to form and perspective.",
        specification: "Teach formal features conceptually."
      },
      {
        material_id: "A3-M2",
        material_type: "comparison_table",
        purpose: "Learner comparison workspace.",
        specification: "Blank formal-feature comparison rows."
      },
      {
        material_id: "A3-M3",
        material_type: "checklist",
        purpose: "Self-check",
        specification:
          "Check that interpretations are supported with evidence and formal features are compared."
      }
    ],
    materials: [],
    episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
  });
  page.assembly_state = { current_stage: "dla", enriched_by: ["episode_plan", "dla"] };
  const check = dlaEnrich.validateDlaEnrichedPage(page, null);
  assert.equal(check.ok, false);
  assert.ok(
    check.errors.some((e) => /contradicts evidence-dependent|evidence_decision required/i.test(e)),
    check.errors.join("; ")
  );
});

test("S72: conceptual teaching about form does not automatically require evidence", () => {
  const page = buildMinimalPage({
    activity_id: "A1",
    title: "How poetic form works",
    grouping: "individual",
    duration_minutes: 12,
    learning_outcome_ids: ["LO1"],
    learner_task:
      "Study the explanatory guide and explain how poetic form and perspective typically work, using brief illustrative examples in the teaching text.",
    expected_output: "A short conceptual explanation of form and perspective.",
    activity_preamble: "Use the teaching overview.",
    evidence_decision: {
      required: false,
      reason: "Conceptual teaching about form from explanatory material.",
      provider_material_ids: []
    },
    required_materials: [
      {
        material_id: "A1-M1",
        material_type: "text",
        purpose: "Explanatory guide to poetic form.",
        specification: "Introduce form and perspective with illustrative examples."
      },
      {
        material_id: "A1-M2",
        material_type: "checklist",
        purpose: "Self-check",
        specification: "Check that the explanation covers form and perspective concepts."
      }
    ],
    materials: [],
    episode_plan: { archetype: "understand", beats: [{ function: "explanation" }] }
  });
  page.assembly_state = { current_stage: "dla", enriched_by: ["episode_plan", "dla"] };
  const check = dlaEnrich.validateDlaEnrichedPage(page, null);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
});

test("S72: source-bound evaluation warns on summary/reference-only providers", () => {
  const page = buildMinimalPage({
    activity_id: "A5",
    title: "Evaluate war poetry presentations",
    grouping: "individual",
    duration_minutes: 25,
    learning_outcome_ids: ["LO1"],
    learner_task: "Evaluate how the poems present the cost of war using evidence from the attached texts.",
    expected_output: "A justified evaluative judgement supported with evidence.",
    activity_preamble: "Reuse earlier poem evidence; do not invent a preferred conclusion.",
    evidence_decision: {
      required: true,
      reason: "Learner must evaluate from source-bound poem evidence.",
      provider_material_ids: ["A5-ME1"]
    },
    required_materials: [
      {
        material_id: "A5-ME1",
        material_type: "scenario",
        purpose: "Evidence summary pack for evaluation.",
        specification:
          "Provide an evidence summary pack containing representative observations and extract references.",
        evidence_requirement: {
          kind: "learner_evidence",
          purpose: "Evidence summary pack of representative observations and extract references.",
          learner_action: "Use the summary pack to support an evaluative judgement.",
          observable_features: ["representative observations", "extract references"],
          minimum_suitable_form: "evidence summary pack",
          processing_notes: "Summarise earlier poem evidence with extract references.",
          provenance: "conversation_attachment",
          disclosure_constraint: "Do not state the preferred conclusion before learner response."
        }
      },
      {
        material_id: "A5-M2",
        material_type: "decision_table",
        purpose: "Learner judgement workspace.",
        specification: "Blank evaluative rows."
      }
    ],
    materials: [],
    episode_plan: { archetype: "evaluate", beats: [{ function: "evaluative_judgement" }] }
  });
  page.assembly_state = { current_stage: "dla", enriched_by: ["episode_plan", "dla"] };
  const check = dlaEnrich.validateDlaEnrichedPage(page, null);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
  assert.ok(
    (check.warnings || []).some((w) => w.code === "SOURCE_BOUND_SUMMARY_REFERENCE_ONLY"),
    JSON.stringify(check.warnings)
  );
});

test("S72: source-bound evaluation accepts multiple exact attributed excerpts", () => {
  const page = buildMinimalPage({
    activity_id: "A5",
    title: "Evaluate war poetry presentations",
    grouping: "individual",
    duration_minutes: 25,
    learning_outcome_ids: ["LO1"],
    learner_task: "Evaluate how the poems present the cost of war using attributed quotations.",
    expected_output: "A justified evaluative judgement citing exact lines.",
    activity_preamble: "Reuse a bounded set of exact excerpts encountered earlier.",
    evidence_decision: {
      required: true,
      reason: "Learner must evaluate from exact attributed poem excerpts.",
      provider_material_ids: ["A5-ME1"]
    },
    required_materials: [
      {
        material_id: "A5-ME1",
        material_type: "scenario",
        purpose: "Provide attributed excerpts from Dulce et Decorum Est and Anthem for Doomed Youth.",
        specification:
          "Reuse a bounded set of exact attributed quotations; preserve wording and lineation; do not supply a completed interpretation.",
        evidence_requirement: {
          kind: "learner_evidence",
          purpose:
            "Provide exact attributed excerpts from Dulce et Decorum Est and Anthem for Doomed Youth for evaluative comparison.",
          learner_action:
            "Cite exact wording from each poem before making an evaluative judgement.",
          observable_features: [
            "exact wording and lineation of selected quotations",
            "contrastive formal and lexical features across excerpts"
          ],
          minimum_suitable_form: "short attributed quotation blocks from each poem",
          processing_notes:
            "Select duration-proportionate exact excerpts; preserve wording and lineation; do not replace with thematic summary or preferred conclusion.",
          provenance: "conversation_attachment",
          disclosure_constraint: "Do not state the preferred conclusion before learner response."
        }
      },
      {
        material_id: "A5-M2",
        material_type: "decision_table",
        purpose: "Learner judgement workspace.",
        specification: "Blank evaluative rows."
      }
    ],
    materials: [],
    episode_plan: { archetype: "evaluate", beats: [{ function: "evaluative_judgement" }] }
  });
  page.assembly_state = { current_stage: "dla", enriched_by: ["episode_plan", "dla"] };
  const check = dlaEnrich.validateDlaEnrichedPage(page, null);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
  assert.equal(
    (check.warnings || []).some(
      (w) =>
        w.code === "SOURCE_BOUND_SUMMARY_REFERENCE_ONLY" ||
        w.code === "SOURCE_BOUND_SOURCE_UNIT_UNSPECIFIED"
    ),
    false,
    JSON.stringify(check.warnings)
  );
});

test("S72: RNA and heteroscedasticity evidence decisions remain valid after form/source-bound fix", () => {
  const rna = buildMinimalPage({
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
  rna.assembly_state = { current_stage: "dla", enriched_by: ["episode_plan", "dla"] };
  assert.equal(dlaEnrich.validateDlaEnrichedPage(rna, null).ok, true);

  const hetero = buildMinimalPage({
    activity_id: "A2",
    title: "Interpret residual plot evidence",
    grouping: "individual",
    duration_minutes: 20,
    learning_outcome_ids: ["LO1"],
    learner_task: "Inspect the residual observations and justify whether variance looks constant.",
    expected_output: "A short justification citing residual-spread observations.",
    activity_preamble: "Use the supplied residual evidence.",
    evidence_decision: {
      required: true,
      reason: "Learner must inspect residual observations.",
      provider_material_ids: ["A2-M1"]
    },
    required_materials: [
      {
        material_id: "A2-M1",
        material_type: "scenario",
        purpose: "Residual observation cases.",
        specification: "Observed residual-spread contrasts.",
        evidence_requirement: {
          kind: "learner_evidence",
          purpose: "Provide inspectable residual-spread observations.",
          learner_action: "Compare residual spread before concluding.",
          observable_features: ["residual spread at low fitted values", "residual spread at high fitted values"],
          provenance: "system_generated_simulation"
        }
      },
      {
        material_id: "A2-M2",
        material_type: "analysis_table",
        purpose: "Learner analysis scaffold.",
        specification: "Blank interpretation rows."
      }
    ],
    materials: [],
    episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
  });
  hetero.assembly_state = { current_stage: "dla", enriched_by: ["episode_plan", "dla"] };
  assert.equal(dlaEnrich.validateDlaEnrichedPage(hetero, null).ok, true);
});

test("S72: formal analysis receives separate teaching and source-evidence materials", () => {
  const page = buildMinimalPage({
    activity_id: "A3",
    title: "Form and Perspective",
    grouping: "individual",
    duration_minutes: 20,
    learning_outcome_ids: ["LO1"],
    learner_task:
      "Complete a comparison of formal features across the poems and explain how formal features shape meaning.",
    expected_output: "A comparison that supports interpretations with evidence.",
    activity_preamble: "Use the form guide and poem excerpts.",
    evidence_decision: {
      required: true,
      reason: "Learner must inspect poem form from attributed source excerpts.",
      provider_material_ids: ["A3-ME1"]
    },
    required_materials: [
      {
        material_id: "A3-M1",
        material_type: "text",
        purpose: "Introduce key concepts in form and perspective.",
        specification: "Explanatory teaching guide only."
      },
      {
        material_id: "A3-ME1",
        material_type: "scenario",
        purpose: "Provide attributed poem text with lineation preserved.",
        specification:
          "Attributed excerpts from Dulce et Decorum Est and Anthem for Doomed Youth; preserve wording and lineation.",
        evidence_requirement: {
          kind: "learner_evidence",
          purpose:
            "Provide attributed excerpts from Dulce et Decorum Est and Anthem for Doomed Youth for formal-feature inspection.",
          learner_action: "Observe perspective, repetition, rhythm and structural shifts in the excerpts.",
          observable_features: [
            "exact wording and lineation",
            "perspective and structural shifts across excerpts"
          ],
          minimum_suitable_form: "short attributed quotation blocks with lineation preserved",
          processing_notes: "Preserve wording and lineation; do not replace with thematic summary.",
          provenance: "conversation_attachment",
          disclosure_constraint: "Do not state the preferred interpretation before learner response."
        }
      },
      {
        material_id: "A3-M2",
        material_type: "comparison_table",
        purpose: "Learner comparison workspace.",
        specification: "Blank formal-feature comparison rows."
      }
    ],
    materials: [],
    episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
  });
  page.assembly_state = { current_stage: "dla", enriched_by: ["episode_plan", "dla"] };
  const check = dlaEnrich.validateDlaEnrichedPage(page, null);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
  assert.equal(
    Object.prototype.hasOwnProperty.call(page.activities[0].required_materials[0], "evidence_requirement"),
    false
  );
  assert.equal(
    page.activities[0].required_materials[1].evidence_requirement.provenance,
    "conversation_attachment"
  );
});

test("S72: teaching explanation alone fails as evidence provider", () => {
  const page = buildMinimalPage({
    activity_id: "A3",
    title: "Form and Perspective",
    grouping: "individual",
    duration_minutes: 20,
    learning_outcome_ids: ["LO1"],
    learner_task:
      "Complete a comparison of formal features and support interpretations with evidence.",
    expected_output: "A comparison supported with evidence from the poems.",
    activity_preamble: "Use the form guide.",
    evidence_decision: {
      required: true,
      reason: "Incorrectly uses teaching text as sole provider.",
      provider_material_ids: ["A3-M1"]
    },
    required_materials: [
      {
        material_id: "A3-M1",
        material_type: "text",
        purpose: "Introduce key concepts in form and perspective.",
        specification: "Explanatory teaching guide only.",
        evidence_requirement: {
          kind: "learner_evidence",
          purpose: "Provide directly inspectable evidence learners must use.",
          learner_action: "Inspect and justify.",
          observable_features: ["form", "perspective"],
          provenance: "system_generated_simulation",
          evidence_layout: "separate_provider"
        }
      },
      {
        material_id: "A3-M2",
        material_type: "comparison_table",
        purpose: "Learner workspace.",
        specification: "Blank rows."
      }
    ],
    materials: [],
    episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
  });
  page.assembly_state = { current_stage: "dla", enriched_by: ["episode_plan", "dla"] };
  const check = dlaEnrich.validateDlaEnrichedPage(page, null);
  assert.equal(check.ok, false);
  assert.ok(
    check.errors.some((e) => /provider-role closure|teaching\/explanatory/i.test(e)),
    check.errors.join("; ")
  );
});

test("S72: later evaluation should continue established source-bound evidence", () => {
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "War poetry resource",
    audience: "Learners",
    page_profile: { profile_type: "learner" },
    learning_outcomes: [{ outcome_id: "LO1", statement: "Evaluate poetic presentations of war." }],
    episode_plans: [
      {
        activity_id: "A2",
        mapped_learning_outcome_ids: ["LO1"],
        episode_plan_id: "EP-A2",
        episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
      },
      {
        activity_id: "A5",
        mapped_learning_outcome_ids: ["LO1"],
        episode_plan_id: "EP-A5",
        episode_plan: { archetype: "evaluate", beats: [{ function: "evaluative_judgement" }] }
      }
    ],
    assembly_state: { current_stage: "dla", enriched_by: ["episode_plan", "dla"] },
    page_synthesis: {},
    source_artefacts: [],
    generation_notes: {},
    activities: [
      {
        activity_id: "A2",
        title: "Close-read war poems",
        grouping: "individual",
        duration_minutes: 20,
        learning_outcome_ids: ["LO1"],
        learner_task: "Compare attributed quotations from the attached poems.",
        expected_output: "A comparison citing exact lines.",
        activity_preamble: "Use the attached poems.",
        evidence_decision: {
          required: true,
          reason: "Learner must inspect attached poem excerpts.",
          provider_material_ids: ["A2-ME1"]
        },
        required_materials: [
          {
            material_id: "A2-ME1",
            material_type: "scenario",
            purpose: "Attributed excerpts from Dulce et Decorum Est and Anthem for Doomed Youth.",
            specification: "Preserve wording and lineation.",
            evidence_requirement: {
              kind: "learner_evidence",
              purpose:
                "Provide attributed excerpts from Dulce et Decorum Est and Anthem for Doomed Youth.",
              learner_action: "Cite exact lines before comparing.",
              observable_features: ["exact wording and lineation"],
              provenance: "conversation_attachment"
            }
          }
        ],
        materials: [],
        episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
      },
      {
        activity_id: "A5",
        title: "Evaluate war poetry presentations",
        grouping: "individual",
        duration_minutes: 25,
        learning_outcome_ids: ["LO1"],
        learner_task:
          "Evaluate how Dulce et Decorum Est and Anthem for Doomed Youth present the cost of war using earlier poem evidence.",
        expected_output: "A justified evaluative judgement citing exact lines.",
        activity_preamble: "Reuse earlier excerpts from the same poems.",
        evidence_decision: {
          required: true,
          reason: "Incorrectly switches to simulation for the same poems.",
          provider_material_ids: ["A5-ME1"]
        },
        required_materials: [
          {
            material_id: "A5-ME1",
            material_type: "scenario",
            purpose: "Evidence portfolio presenting multiple observations about the poems.",
            specification: "System-generated observations portfolio.",
            evidence_requirement: {
              kind: "learner_evidence",
              purpose:
                "Evidence portfolio presenting multiple observations about Dulce et Decorum Est and Anthem for Doomed Youth.",
              learner_action: "Use the portfolio observations to evaluate the poems.",
              observable_features: ["representative observations"],
              provenance: "system_generated_simulation"
            }
          }
        ],
        materials: [],
        episode_plan: { archetype: "evaluate", beats: [{ function: "evaluative_judgement" }] }
      }
    ]
  };
  const check = dlaEnrich.validateDlaEnrichedPage(page, null);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
  assert.ok(
    (check.warnings || []).some((w) => w.code === "SOURCE_BOUND_REPLACED_BY_SIMULATION"),
    JSON.stringify(check.warnings)
  );
});

test("S72: legitimate RNA/statistics simulation evidence remains valid with source preference rules", () => {
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
  assert.equal(
    (check.warnings || []).some(
      (w) =>
        w.code === "SOURCE_BOUND_REPLACED_BY_SIMULATION" ||
        w.code === "SIMULATION_DESCRIBES_AUTHORITATIVE_SOURCE"
    ),
    false,
    JSON.stringify(check.warnings)
  );
});

test("S72: mixed resource may use source-bound and simulated evidence for different needs", () => {
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Mixed evidence resource",
    audience: "Learners",
    page_profile: { profile_type: "learner" },
    learning_outcomes: [
      { outcome_id: "LO1", statement: "Interpret literary form." },
      { outcome_id: "LO2", statement: "Interpret residual spread." }
    ],
    episode_plans: [
      {
        activity_id: "A1",
        mapped_learning_outcome_ids: ["LO1"],
        episode_plan_id: "EP-A1",
        episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
      },
      {
        activity_id: "A2",
        mapped_learning_outcome_ids: ["LO2"],
        episode_plan_id: "EP-A2",
        episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
      }
    ],
    assembly_state: { current_stage: "dla", enriched_by: ["episode_plan", "dla"] },
    page_synthesis: {},
    source_artefacts: [],
    generation_notes: {},
    activities: [
      {
        activity_id: "A1",
        title: "Inspect poem form",
        grouping: "individual",
        duration_minutes: 15,
        learning_outcome_ids: ["LO1"],
        learner_task: "Compare formal features using attributed poem excerpts.",
        expected_output: "A comparison citing exact lines.",
        activity_preamble: "Use the attached poems.",
        evidence_decision: {
          required: true,
          reason: "Source-bound poem evidence.",
          provider_material_ids: ["A1-ME1"]
        },
        required_materials: [
          {
            material_id: "A1-ME1",
            material_type: "scenario",
            purpose: "Attributed excerpts from Dulce et Decorum Est.",
            specification: "Preserve wording and lineation.",
            evidence_requirement: {
              kind: "learner_evidence",
              purpose: "Provide attributed excerpts from Dulce et Decorum Est.",
              learner_action: "Cite exact lines.",
              observable_features: ["exact wording and lineation"],
              provenance: "conversation_attachment"
            }
          }
        ],
        materials: [],
        episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
      },
      {
        activity_id: "A2",
        title: "Interpret residual evidence",
        grouping: "individual",
        duration_minutes: 15,
        learning_outcome_ids: ["LO2"],
        learner_task: "Inspect the residual observations and justify whether variance looks constant.",
        expected_output: "A short justification citing residual-spread observations.",
        activity_preamble: "Use the simulated residual cases.",
        evidence_decision: {
          required: true,
          reason: "Legitimately generated residual evidence.",
          provider_material_ids: ["A2-ME1"]
        },
        required_materials: [
          {
            material_id: "A2-ME1",
            material_type: "scenario",
            purpose: "Residual-plot evidence cases.",
            specification: "Contrastive residual-spread observations.",
            evidence_requirement: {
              kind: "learner_evidence",
              purpose: "Provide inspectable residual-spread observations.",
              learner_action: "Compare residual spread before concluding.",
              observable_features: ["residual spread at low fitted values", "residual spread at high fitted values"],
              provenance: "system_generated_simulation"
            }
          }
        ],
        materials: [],
        episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
      }
    ]
  };
  const check = dlaEnrich.validateDlaEnrichedPage(page, null);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
  assert.equal(
    (check.warnings || []).some((w) => w.code === "SOURCE_BOUND_REPLACED_BY_SIMULATION"),
    false,
    JSON.stringify(check.warnings)
  );
});

test("S72: simulation purporting to describe a named authoritative source soft-warns", () => {
  const page = buildMinimalPage({
    activity_id: "A1",
    title: "Analyse attached policy wording",
    grouping: "individual",
    duration_minutes: 20,
    learning_outcome_ids: ["LO1"],
    learner_task: "Analyse claims in the attached policy using exact wording.",
    expected_output: "A justified analysis citing exact policy wording.",
    activity_preamble: "Use the attached policy.",
    evidence_decision: {
      required: true,
      reason: "Needs inspectable policy wording.",
      provider_material_ids: ["A1-ME1"]
    },
    required_materials: [
      {
        material_id: "A1-ME1",
        material_type: "scenario",
        purpose: "Provide wording from the attached policy titled Budget Integrity Framework.",
        specification: "From the attached authoritative source.",
        evidence_requirement: {
          kind: "learner_evidence",
          purpose: "Provide wording from the attached policy titled Budget Integrity Framework.",
          learner_action: "Cite exact wording before judging claims.",
          observable_features: ["exact policy wording", "named claims"],
          provenance: "system_generated_simulation"
        }
      }
    ],
    materials: [],
    episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
  });
  page.assembly_state = { current_stage: "dla", enriched_by: ["episode_plan", "dla"] };
  const check = dlaEnrich.validateDlaEnrichedPage(page, null);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
  assert.ok(
    (check.warnings || []).some((w) => w.code === "SIMULATION_DESCRIBES_AUTHORITATIVE_SOURCE"),
    JSON.stringify(check.warnings)
  );
});

test("S72: A1 poem evidence/examples/quotation classification requires evidence_decision", () => {
  const page = buildMinimalPage({
    activity_id: "A1",
    title: "Classify poetic techniques",
    grouping: "individual",
    duration_minutes: 15,
    learning_outcome_ids: ["LO1"],
    learner_task:
      "Identify examples from the poems; classify quotation details; support ideas with relevant evidence from Owen's poems.",
    expected_output:
      "A classification that uses textual evidence and quotations from the poems to support each idea.",
    activity_preamble: "Work from Owen's poems.",
    evidence_decision: {
      required: false,
      reason: "Incorrectly marked non-evidence.",
      provider_material_ids: []
    },
    required_materials: [
      {
        material_id: "A1-M1",
        material_type: "text",
        purpose: "Technique overview.",
        specification: "Explain common poetic techniques."
      },
      {
        material_id: "A1-M2",
        material_type: "analysis_table",
        purpose: "Classification workspace.",
        specification:
          "Learner classifies quotation details and records textual evidence from the poems."
      },
      {
        material_id: "A1-M3",
        material_type: "checklist",
        purpose: "Self-check",
        specification: "Check that ideas are supported with relevant evidence and quotations."
      }
    ],
    materials: [],
    episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
  });
  page.assembly_state = { current_stage: "dla", enriched_by: ["episode_plan", "dla"] };
  const check = dlaEnrich.validateDlaEnrichedPage(page, null);
  assert.equal(check.ok, false);
  assert.ok(
    check.errors.some((e) => /contradicts evidence-dependent|evidence_decision required/i.test(e)),
    check.errors.join("; ")
  );
});

test("S72: conceptual classification without required source use remains required:false", () => {
  const page = buildMinimalPage({
    activity_id: "A1",
    title: "Classify poetic technique concepts",
    grouping: "individual",
    duration_minutes: 12,
    learning_outcome_ids: ["LO1"],
    learner_task:
      "Study the explanatory overview and classification example; classify the four technique categories from the teaching text.",
    expected_output: "A clear classification of technique concepts with brief explanations.",
    activity_preamble: "Use the teaching overview and classification example.",
    evidence_decision: {
      required: false,
      reason: "Conceptual classification from explanatory teaching.",
      provider_material_ids: []
    },
    required_materials: [
      {
        material_id: "A1-M1",
        material_type: "text",
        purpose: "Explanatory overview of technique categories.",
        specification: "Teach concepts with brief illustrative examples."
      },
      {
        material_id: "A1-M2",
        material_type: "analysis_table",
        purpose: "Classification table.",
        specification: "Learner completes concept classification rows."
      }
    ],
    materials: [],
    episode_plan: { archetype: "understand", beats: [{ function: "explanation" }] }
  });
  page.assembly_state = { current_stage: "dla", enriched_by: ["episode_plan", "dla"] };
  const check = dlaEnrich.validateDlaEnrichedPage(page, null);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
});

test("S72: two inventoried source units must not expand into an unattached third unit", () => {
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "War poetry resource",
    audience: "Learners",
    page_profile: { profile_type: "learner" },
    learning_outcomes: [{ outcome_id: "LO1", statement: "Compare war poems." }],
    episode_plans: [
      {
        activity_id: "A2",
        mapped_learning_outcome_ids: ["LO1"],
        episode_plan_id: "EP-A2",
        episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
      },
      {
        activity_id: "A4",
        mapped_learning_outcome_ids: ["LO1"],
        episode_plan_id: "EP-A4",
        episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
      }
    ],
    assembly_state: { current_stage: "dla", enriched_by: ["episode_plan", "dla"] },
    page_synthesis: {},
    source_artefacts: [],
    generation_notes: {},
    activities: [
      {
        activity_id: "A2",
        title: "Close-read available poems",
        grouping: "individual",
        duration_minutes: 20,
        learning_outcome_ids: ["LO1"],
        learner_task: "Compare attributed quotations from the attached poems.",
        expected_output: "A comparison citing exact lines.",
        activity_preamble: "Use the attached poems.",
        evidence_decision: {
          required: true,
          reason: "Learner must inspect attached poem excerpts.",
          provider_material_ids: ["A2-ME1"]
        },
        required_materials: [
          {
            material_id: "A2-ME1",
            material_type: "scenario",
            purpose: "Attributed excerpts from Dulce et Decorum Est and Anthem for Doomed Youth.",
            specification: "Preserve wording and lineation from the available attached poems.",
            evidence_requirement: {
              kind: "learner_evidence",
              purpose:
                "Provide attributed excerpts from Dulce et Decorum Est and Anthem for Doomed Youth.",
              learner_action: "Cite exact lines before comparing.",
              observable_features: ["exact wording and lineation"],
              processing_notes:
                "Use only Dulce et Decorum Est and Anthem for Doomed Youth from the available attachment.",
              provenance: "conversation_attachment"
            }
          }
        ],
        materials: [],
        episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
      },
      {
        activity_id: "A4",
        title: "Compare weather imagery",
        grouping: "individual",
        duration_minutes: 20,
        learning_outcome_ids: ["LO1"],
        learner_task: "Compare weather imagery using Exposure and the earlier poems.",
        expected_output: "A comparison citing exact lines.",
        activity_preamble: "Use attached poem evidence.",
        evidence_decision: {
          required: true,
          reason: "Incorrectly expands inventory to Exposure.",
          provider_material_ids: ["A4-ME1"]
        },
        required_materials: [
          {
            material_id: "A4-ME1",
            material_type: "scenario",
            purpose: "Attributed excerpts from Exposure.",
            specification: "Provide Exposure with lineation preserved.",
            evidence_requirement: {
              kind: "learner_evidence",
              purpose: "Provide attributed excerpts from Exposure for weather-imagery comparison.",
              learner_action: "Cite exact lines from Exposure.",
              observable_features: ["exact wording and lineation", "weather imagery"],
              processing_notes: "Source unit: Exposure.",
              provenance: "conversation_attachment"
            }
          }
        ],
        materials: [],
        episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
      }
    ]
  };
  const check = dlaEnrich.validateDlaEnrichedPage(page, null);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
  assert.ok(
    (check.warnings || []).some((w) => w.code === "SOURCE_BOUND_UNIT_NOT_IN_INVENTORY"),
    JSON.stringify(check.warnings)
  );
});

test("S72: source-bound comparison using only inventoried units passes without inventory warning", () => {
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "War poetry resource",
    audience: "Learners",
    page_profile: { profile_type: "learner" },
    learning_outcomes: [{ outcome_id: "LO1", statement: "Compare war poems." }],
    episode_plans: [
      {
        activity_id: "A2",
        mapped_learning_outcome_ids: ["LO1"],
        episode_plan_id: "EP-A2",
        episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
      },
      {
        activity_id: "A4",
        mapped_learning_outcome_ids: ["LO1"],
        episode_plan_id: "EP-A4",
        episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
      }
    ],
    assembly_state: { current_stage: "dla", enriched_by: ["episode_plan", "dla"] },
    page_synthesis: {},
    source_artefacts: [],
    generation_notes: {},
    activities: [
      {
        activity_id: "A2",
        title: "Close-read available poems",
        grouping: "individual",
        duration_minutes: 20,
        learning_outcome_ids: ["LO1"],
        learner_task: "Compare attributed quotations from the attached poems.",
        expected_output: "A comparison citing exact lines.",
        activity_preamble: "Use the attached poems.",
        evidence_decision: {
          required: true,
          reason: "Learner must inspect attached poem excerpts.",
          provider_material_ids: ["A2-ME1"]
        },
        required_materials: [
          {
            material_id: "A2-ME1",
            material_type: "scenario",
            purpose: "Attributed excerpts from Dulce et Decorum Est and Anthem for Doomed Youth.",
            specification: "Preserve wording and lineation.",
            evidence_requirement: {
              kind: "learner_evidence",
              purpose:
                "Provide attributed excerpts from Dulce et Decorum Est and Anthem for Doomed Youth.",
              learner_action: "Cite exact lines before comparing.",
              observable_features: ["exact wording and lineation"],
              processing_notes:
                "Available source units: Dulce et Decorum Est; Anthem for Doomed Youth.",
              provenance: "conversation_attachment"
            }
          }
        ],
        materials: [],
        episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
      },
      {
        activity_id: "A4",
        title: "Compare perspective shifts",
        grouping: "individual",
        duration_minutes: 20,
        learning_outcome_ids: ["LO1"],
        learner_task:
          "Compare perspective shifts in Dulce et Decorum Est and Anthem for Doomed Youth.",
        expected_output: "A comparison citing exact lines from both poems.",
        activity_preamble: "Reuse the inventoried attached poems.",
        evidence_decision: {
          required: true,
          reason: "Continue with inventoried poem evidence.",
          provider_material_ids: ["A4-ME1"]
        },
        required_materials: [
          {
            material_id: "A4-ME1",
            material_type: "scenario",
            purpose:
              "Attributed excerpts from Dulce et Decorum Est and Anthem for Doomed Youth.",
            specification: "Reuse bounded exact excerpts; preserve lineation.",
            evidence_requirement: {
              kind: "learner_evidence",
              purpose:
                "Provide attributed excerpts from Dulce et Decorum Est and Anthem for Doomed Youth.",
              learner_action: "Cite exact lines before comparing perspective shifts.",
              observable_features: ["exact wording and lineation", "perspective shifts"],
              processing_notes:
                "Allocate only Dulce et Decorum Est and Anthem for Doomed Youth from the available inventory.",
              provenance: "conversation_attachment"
            }
          }
        ],
        materials: [],
        episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
      }
    ]
  };
  const check = dlaEnrich.validateDlaEnrichedPage(page, null);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
  assert.equal(
    (check.warnings || []).some((w) => w.code === "SOURCE_BOUND_UNIT_NOT_IN_INVENTORY"),
    false,
    JSON.stringify(check.warnings)
  );
});

test("S72: mixed source-bound and simulated evidence remains valid after inventory rules", () => {
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Mixed evidence resource",
    audience: "Learners",
    page_profile: { profile_type: "learner" },
    learning_outcomes: [
      { outcome_id: "LO1", statement: "Interpret literary form." },
      { outcome_id: "LO2", statement: "Interpret residual spread." }
    ],
    episode_plans: [
      {
        activity_id: "A1",
        mapped_learning_outcome_ids: ["LO1"],
        episode_plan_id: "EP-A1",
        episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
      },
      {
        activity_id: "A2",
        mapped_learning_outcome_ids: ["LO2"],
        episode_plan_id: "EP-A2",
        episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
      }
    ],
    assembly_state: { current_stage: "dla", enriched_by: ["episode_plan", "dla"] },
    page_synthesis: {},
    source_artefacts: [],
    generation_notes: {},
    activities: [
      {
        activity_id: "A1",
        title: "Inspect poem form",
        grouping: "individual",
        duration_minutes: 15,
        learning_outcome_ids: ["LO1"],
        learner_task: "Compare formal features using attributed poem excerpts.",
        expected_output: "A comparison citing exact lines.",
        activity_preamble: "Use the attached poems.",
        evidence_decision: {
          required: true,
          reason: "Source-bound poem evidence.",
          provider_material_ids: ["A1-ME1"]
        },
        required_materials: [
          {
            material_id: "A1-ME1",
            material_type: "scenario",
            purpose: "Attributed excerpts from Dulce et Decorum Est.",
            specification: "Preserve wording and lineation.",
            evidence_requirement: {
              kind: "learner_evidence",
              purpose: "Provide attributed excerpts from Dulce et Decorum Est.",
              learner_action: "Cite exact lines.",
              observable_features: ["exact wording and lineation"],
              processing_notes: "Available source unit: Dulce et Decorum Est.",
              provenance: "conversation_attachment"
            }
          }
        ],
        materials: [],
        episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
      },
      {
        activity_id: "A2",
        title: "Interpret residual evidence",
        grouping: "individual",
        duration_minutes: 15,
        learning_outcome_ids: ["LO2"],
        learner_task: "Inspect the residual observations and justify whether variance looks constant.",
        expected_output: "A short justification citing residual-spread observations.",
        activity_preamble: "Use the simulated residual cases.",
        evidence_decision: {
          required: true,
          reason: "Legitimately generated residual evidence.",
          provider_material_ids: ["A2-ME1"]
        },
        required_materials: [
          {
            material_id: "A2-ME1",
            material_type: "scenario",
            purpose: "Residual-plot evidence cases.",
            specification: "Contrastive residual-spread observations.",
            evidence_requirement: {
              kind: "learner_evidence",
              purpose: "Provide inspectable residual-spread observations.",
              learner_action: "Compare residual spread before concluding.",
              observable_features: [
                "residual spread at low fitted values",
                "residual spread at high fitted values"
              ],
              provenance: "system_generated_simulation"
            }
          }
        ],
        materials: [],
        episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
      }
    ]
  };
  const check = dlaEnrich.validateDlaEnrichedPage(page, null);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
  assert.equal(
    (check.warnings || []).some(
      (w) =>
        w.code === "SOURCE_BOUND_UNIT_NOT_IN_INVENTORY" ||
        w.code === "SOURCE_BOUND_REPLACED_BY_SIMULATION"
    ),
    false,
    JSON.stringify(check.warnings)
  );
});

test("S72: GAM guidance requires SOURCE_BOUND_UNFULFILLED when named attachment is unavailable", () => {
  const gamText = gamContract.buildGamPageEnrichContractBlock();
  assert.match(gamText, /SOURCE_BOUND_UNFULFILLED/);
  assert.match(gamText, /do not reconstruct/i);
});

test("S72: later-evidence preamble alone does not make conceptual A1 evidence-dependent", () => {
  const page = buildMinimalPage({
    activity_id: "A1",
    title: "War context foundation",
    grouping: "individual",
    duration_minutes: 12,
    learning_outcome_ids: ["LO1"],
    learner_task:
      "Explain the wartime context and key terms that shape how readers approach the poems.",
    expected_output:
      "A short contextual explanation of setting, audience expectations, and key terms.",
    activity_preamble:
      "This foundation will help you interpret later textual evidence more effectively.",
    intellectual_coherence_bridge:
      "Later activities will ask you to use poem evidence; this step prepares that reading.",
    evidence_decision: {
      required: false,
      reason: "Conceptual/contextual preparation without current source inspection.",
      provider_material_ids: []
    },
    required_materials: [
      {
        material_id: "A1-M1",
        material_type: "text",
        purpose: "Contextual teaching overview.",
        specification: "Explain wartime context and key terms with brief illustrative examples."
      },
      {
        material_id: "A1-M2",
        material_type: "checklist",
        purpose: "Self-check",
        specification: "Check that the explanation covers context and key terms."
      }
    ],
    materials: [],
    episode_plan: { archetype: "understand", beats: [{ function: "explanation" }] }
  });
  page.assembly_state = { current_stage: "dla", enriched_by: ["episode_plan", "dla"] };
  const check = dlaEnrich.validateDlaEnrichedPage(page, null);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
});

test("S72: current learner output requiring quotations still requires evidence", () => {
  const page = buildMinimalPage({
    activity_id: "A2",
    title: "Support claims with quotations",
    grouping: "individual",
    duration_minutes: 18,
    learning_outcome_ids: ["LO1"],
    learner_task: "Support each claim with relevant quotations from the attached poems.",
    expected_output: "Claims supported by textual evidence and quotations.",
    activity_preamble: "Use the poem excerpts beside the task.",
    evidence_decision: {
      required: false,
      reason: "Incorrectly marked non-evidence.",
      provider_material_ids: []
    },
    required_materials: [
      {
        material_id: "A2-M1",
        material_type: "text",
        purpose: "Brief claim-writing guide.",
        specification: "Explain how to structure a supported claim."
      },
      {
        material_id: "A2-M2",
        material_type: "analysis_table",
        purpose: "Claim workspace.",
        specification: "Learner records claims with supporting quotations."
      }
    ],
    materials: [],
    episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
  });
  page.assembly_state = { current_stage: "dla", enriched_by: ["episode_plan", "dla"] };
  const check = dlaEnrich.validateDlaEnrichedPage(page, null);
  assert.equal(check.ok, false);
  assert.ok(
    check.errors.some((e) => /contradicts evidence-dependent|evidence_decision required/i.test(e)),
    check.errors.join("; ")
  );
});

test("S72: conceptual contextual detail remains distinct from learner evidence", () => {
  const page = buildMinimalPage({
    activity_id: "A1",
    title: "Audience and purpose context",
    grouping: "individual",
    duration_minutes: 10,
    learning_outcome_ids: ["LO1"],
    learner_task: "Describe audience expectations and purpose using the teaching overview.",
    expected_output: "A concise contextual description of audience and purpose.",
    activity_preamble:
      "This foundation will help you interpret later textual evidence more effectively.",
    evidence_use_prompt: "Focus on contextual detail from the teaching text, not poem quotations.",
    evidence_decision: {
      required: false,
      reason: "Contextual detail from teaching material only.",
      provider_material_ids: []
    },
    required_materials: [
      {
        material_id: "A1-M1",
        material_type: "text",
        purpose: "Teaching overview of audience and purpose.",
        specification: "Conceptual explanation with illustrative examples."
      }
    ],
    materials: [],
    episode_plan: { archetype: "understand", beats: [{ function: "explanation" }] }
  });
  page.assembly_state = { current_stage: "dla", enriched_by: ["episode_plan", "dla"] };
  const check = dlaEnrich.validateDlaEnrichedPage(page, null);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
});

test("S72: simulated provider claiming poem extracts and quotations soft-warns for mixed provenance", () => {
  const page = buildMinimalPage({
    activity_id: "A5",
    title: "Evaluate contrasting readings",
    grouping: "individual",
    duration_minutes: 25,
    learning_outcome_ids: ["LO1"],
    learner_task:
      "Compare poem extracts from supplied texts with contrasting generated interpretations.",
    expected_output: "An evaluative judgement supported by quotations and considered alternatives.",
    activity_preamble: "Keep source extracts and generated viewpoints distinct.",
    evidence_decision: {
      required: true,
      reason: "Needs source extracts and generated contrasting viewpoints.",
      provider_material_ids: ["A5-ME1"]
    },
    required_materials: [
      {
        material_id: "A5-ME1",
        material_type: "scenario",
        purpose: "Evidence pack combining source and generated material.",
        specification:
          "Include poem extracts from supplied texts, supporting quotations, and contrasting generated interpretations.",
        evidence_requirement: {
          kind: "learner_evidence",
          purpose:
            "Provide poem extracts from supplied texts with supporting quotations and contrasting generated interpretations.",
          learner_action: "Compare quotations with generated viewpoints before judging.",
          observable_features: [
            "supporting quotations from supplied poems",
            "contrasting generated interpretations"
          ],
          provenance: "system_generated_simulation",
          evidence_layout: "separate_provider"
        }
      },
      {
        material_id: "A5-M2",
        material_type: "decision_table",
        purpose: "Learner comparison workspace.",
        specification: "Blank rows bringing extracts and viewpoints together."
      }
    ],
    materials: [],
    episode_plan: { archetype: "evaluate", beats: [{ function: "evaluative_judgement" }] }
  });
  page.assembly_state = { current_stage: "dla", enriched_by: ["episode_plan", "dla"] };
  const check = dlaEnrich.validateDlaEnrichedPage(page, null);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
  assert.ok(
    (check.warnings || []).some((w) => w.code === "MIXED_PROVENANCE_SINGLE_PROVIDER"),
    JSON.stringify(check.warnings)
  );
});

test("S72: honest separate source-bound and simulated providers remain valid together", () => {
  const page = buildMinimalPage({
    activity_id: "A5",
    title: "Evaluate contrasting readings",
    grouping: "individual",
    duration_minutes: 25,
    learning_outcome_ids: ["LO1"],
    learner_task:
      "Compare attributed poem excerpts with contrasting generated viewpoints before judging.",
    expected_output: "An evaluative judgement citing quotations and considering alternatives.",
    activity_preamble: "Use both providers; keep provenance honest.",
    evidence_decision: {
      required: true,
      reason: "Needs source extracts and generated contrasting viewpoints.",
      provider_material_ids: ["A5-ME1", "A5-ME2"]
    },
    required_materials: [
      {
        material_id: "A5-ME1",
        material_type: "scenario",
        purpose: "Attributed excerpts from Dulce et Decorum Est and Anthem for Doomed Youth.",
        specification: "Preserve wording and lineation from available attached poems.",
        evidence_requirement: {
          kind: "learner_evidence",
          purpose:
            "Provide attributed excerpts from Dulce et Decorum Est and Anthem for Doomed Youth.",
          learner_action: "Cite exact lines before comparing viewpoints.",
          observable_features: ["exact wording and lineation"],
          processing_notes:
            "Available source units: Dulce et Decorum Est; Anthem for Doomed Youth.",
          provenance: "conversation_attachment",
          evidence_layout: "separate_provider"
        }
      },
      {
        material_id: "A5-ME2",
        material_type: "scenario",
        purpose: "Contrasting generated interpretations for comparison.",
        specification: "Two brief generated viewpoints that do not replace source quotations.",
        evidence_requirement: {
          kind: "learner_evidence",
          purpose: "Provide contrasting generated interpretations for evaluative comparison.",
          learner_action: "Weigh generated viewpoints against the source excerpts.",
          observable_features: ["contrasting generated interpretations"],
          provenance: "system_generated_simulation",
          evidence_layout: "separate_provider"
        }
      },
      {
        material_id: "A5-M3",
        material_type: "decision_table",
        purpose: "Learner comparison workspace.",
        specification: "Blank rows bringing extracts and viewpoints together."
      }
    ],
    materials: [],
    episode_plan: { archetype: "evaluate", beats: [{ function: "evaluative_judgement" }] }
  });
  page.assembly_state = { current_stage: "dla", enriched_by: ["episode_plan", "dla"] };
  const check = dlaEnrich.validateDlaEnrichedPage(page, null);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
  assert.equal(
    (check.warnings || []).some((w) => w.code === "MIXED_PROVENANCE_SINGLE_PROVIDER"),
    false,
    JSON.stringify(check.warnings)
  );
});

test("S72: A3 imagery/tone/structure using provided examples fails when required:false", () => {
  const page = buildMinimalPage({
    activity_id: "A3",
    title: "Analyse imagery tone and structure",
    grouping: "individual",
    duration_minutes: 20,
    learning_outcome_ids: ["LO1"],
    learner_task:
      "Analyse imagery, tone and structure using the provided examples and explain how they shape meaning.",
    expected_output: "An analysis that refers to imagery, tone and structure in the provided examples.",
    activity_preamble: "Use the examples supplied for this activity.",
    evidence_decision: {
      required: false,
      reason: "Incorrectly marked non-evidence.",
      provider_material_ids: []
    },
    required_materials: [
      {
        material_id: "A3-M1",
        material_type: "text",
        purpose: "Teaching overview of imagery and tone.",
        specification: "Explanatory guide."
      },
      {
        material_id: "A3-M2",
        material_type: "analysis_table",
        purpose: "Learner analysis workspace.",
        specification: "Blank rows for imagery, tone and structure notes."
      }
    ],
    materials: [],
    episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
  });
  page.assembly_state = { current_stage: "dla", enriched_by: ["episode_plan", "dla"] };
  const check = dlaEnrich.validateDlaEnrichedPage(page, null);
  assert.equal(check.ok, false);
  assert.ok(
    check.errors.some((e) => /contradicts evidence-dependent|evidence_decision required/i.test(e)),
    check.errors.join("; ")
  );
});

test("S72: A3 imagery/tone/structure with genuine source provider passes", () => {
  const page = buildMinimalPage({
    activity_id: "A3",
    title: "Analyse imagery tone and structure",
    grouping: "individual",
    duration_minutes: 20,
    learning_outcome_ids: ["LO1"],
    learner_task:
      "Analyse imagery, tone and structure using the provided examples and explain how they shape meaning.",
    expected_output: "An analysis that refers to imagery, tone and structure in the provided examples.",
    activity_preamble: "Use the poem excerpts beside the task.",
    evidence_decision: {
      required: true,
      reason: "Learner must inspect poem excerpts for imagery, tone and structure.",
      provider_material_ids: ["A3-ME1"]
    },
    required_materials: [
      {
        material_id: "A3-M1",
        material_type: "text",
        purpose: "Teaching overview of imagery and tone.",
        specification: "Explanatory guide."
      },
      {
        material_id: "A3-ME1",
        material_type: "scenario",
        purpose: "Attributed excerpts from Dulce et Decorum Est and Anthem for Doomed Youth.",
        specification: "Preserve wording and lineation for imagery/tone/structure inspection.",
        evidence_requirement: {
          kind: "learner_evidence",
          purpose:
            "Provide attributed excerpts from Dulce et Decorum Est and Anthem for Doomed Youth.",
          learner_action: "Inspect imagery, tone and structure in the excerpts before concluding.",
          observable_features: ["imagery", "tone", "structural shifts", "exact wording and lineation"],
          processing_notes:
            "Available units: Dulce et Decorum Est; Anthem for Doomed Youth.",
          provenance: "conversation_attachment",
          evidence_layout: "separate_provider"
        }
      },
      {
        material_id: "A3-M2",
        material_type: "analysis_table",
        purpose: "Learner analysis workspace.",
        specification: "Blank rows for imagery, tone and structure notes."
      }
    ],
    materials: [],
    episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
  });
  page.assembly_state = { current_stage: "dla", enriched_by: ["episode_plan", "dla"] };
  const check = dlaEnrich.validateDlaEnrichedPage(page, null);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
});

test("S72: Owen-like resource with learner-evidence declaration requires conversation_attachment on analytical activities", () => {
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Owen war poems",
    audience: "Learners",
    page_profile: { profile_type: "learner" },
    learning_outcomes: [{ outcome_id: "LO1", statement: "Analyse and evaluate war poems." }],
    episode_plans: [
      {
        activity_id: "A1",
        mapped_learning_outcome_ids: ["LO1"],
        episode_plan_id: "EP-A1",
        episode_plan: { archetype: "understand", beats: [{ function: "explanation" }] }
      },
      {
        activity_id: "A2",
        mapped_learning_outcome_ids: ["LO1"],
        episode_plan_id: "EP-A2",
        episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
      },
      {
        activity_id: "A4",
        mapped_learning_outcome_ids: ["LO1"],
        episode_plan_id: "EP-A4",
        episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
      },
      {
        activity_id: "A5",
        mapped_learning_outcome_ids: ["LO1"],
        episode_plan_id: "EP-A5",
        episode_plan: { archetype: "evaluate", beats: [{ function: "evaluative_judgement" }] }
      }
    ],
    assembly_state: { current_stage: "dla", enriched_by: ["episode_plan", "dla"] },
    page_synthesis: {},
    source_artefacts: [],
    generation_notes: {
      learner_evidence_attachments: {
        present: true,
        role: "learner_evidence",
        inventoried_units: ["Dulce et Decorum Est", "Anthem for Doomed Youth"]
      }
    },
    activities: [
      {
        activity_id: "A1",
        title: "War context foundation",
        grouping: "individual",
        duration_minutes: 10,
        learning_outcome_ids: ["LO1"],
        learner_task: "Explain wartime context using the teaching overview.",
        expected_output: "A short contextual explanation.",
        activity_preamble: "This foundation will help you interpret later textual evidence more effectively.",
        evidence_decision: {
          required: false,
          reason: "Orientation only.",
          provider_material_ids: []
        },
        required_materials: [
          {
            material_id: "A1-M1",
            material_type: "text",
            purpose: "Contextual teaching overview.",
            specification: "Explain wartime context with illustrative examples."
          }
        ],
        materials: [],
        episode_plan: { archetype: "understand", beats: [{ function: "explanation" }] }
      },
      {
        activity_id: "A2",
        title: "Inspect wartime cases",
        grouping: "individual",
        duration_minutes: 20,
        learning_outcome_ids: ["LO1"],
        learner_task: "Analyse imagery and tone in the supplied poem examples.",
        expected_output: "An analysis citing imagery and tone from the examples.",
        activity_preamble: "Use inspectable evidence.",
        evidence_decision: {
          required: true,
          reason: "Incorrectly uses simulation instead of poems.",
          provider_material_ids: ["A2-ME1"]
        },
        required_materials: [
          {
            material_id: "A2-ME1",
            material_type: "scenario",
            purpose: "Simulated wartime cases.",
            specification: "Generic simulated wartime observation cases.",
            evidence_requirement: {
              kind: "learner_evidence",
              purpose: "Provide simulated wartime cases for analysis.",
              learner_action: "Compare cases before concluding.",
              observable_features: ["simulated case contrasts"],
              provenance: "system_generated_simulation"
            }
          }
        ],
        materials: [],
        episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
      },
      {
        activity_id: "A4",
        title: "Compare thematic summaries",
        grouping: "individual",
        duration_minutes: 20,
        learning_outcome_ids: ["LO1"],
        learner_task: "Compare thematic summaries of the poems rather than quoting them.",
        expected_output: "A comparison of thematic summaries.",
        activity_preamble: "Avoid direct poem inspection.",
        evidence_decision: {
          required: true,
          reason: "Incorrect summary substitution.",
          provider_material_ids: ["A4-ME1"]
        },
        required_materials: [
          {
            material_id: "A4-ME1",
            material_type: "scenario",
            purpose: "Thematic summary pack of the poems.",
            specification: "Evidence summary pack with extract references only.",
            evidence_requirement: {
              kind: "learner_evidence",
              purpose: "Thematic summary pack with extract references.",
              learner_action: "Compare thematic summaries.",
              observable_features: ["thematic summary points"],
              minimum_suitable_form: "summary pack",
              provenance: "system_generated_simulation"
            }
          }
        ],
        materials: [],
        episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
      },
      {
        activity_id: "A5",
        title: "Evaluate generated viewpoints",
        grouping: "individual",
        duration_minutes: 25,
        learning_outcome_ids: ["LO1"],
        learner_task: "Evaluate generated viewpoints about the poems without reading the poems.",
        expected_output: "An evaluative judgement from generated viewpoints alone.",
        activity_preamble: "Use generated viewpoints only.",
        evidence_decision: {
          required: true,
          reason: "Missing underlying source excerpts.",
          provider_material_ids: ["A5-ME1"]
        },
        required_materials: [
          {
            material_id: "A5-ME1",
            material_type: "scenario",
            purpose: "Contrasting generated interpretations only.",
            specification: "Generated viewpoints with no poem extracts.",
            evidence_requirement: {
              kind: "learner_evidence",
              purpose: "Provide contrasting generated interpretations about the poems.",
              learner_action: "Evaluate the generated viewpoints.",
              observable_features: ["contrasting generated interpretations"],
              provenance: "system_generated_simulation"
            }
          }
        ],
        materials: [],
        episode_plan: { archetype: "evaluate", beats: [{ function: "evaluative_judgement" }] }
      }
    ]
  };
  const check = dlaEnrich.validateDlaEnrichedPage(page, null);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
  assert.ok(
    (check.warnings || []).some((w) => w.code === "SOURCE_INTENDED_WITHOUT_ATTACHMENT_PROVIDERS"),
    JSON.stringify(check.warnings)
  );
  assert.ok(
    (check.warnings || []).some((w) => w.code === "SOURCE_RELATED_ACTIVITY_AVOIDS_ATTACHMENT"),
    JSON.stringify(check.warnings)
  );
});

test("S72: Owen-like resource with conversation_attachment on analytical activities passes quietly", () => {
  const page = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Owen war poems",
    audience: "Learners",
    page_profile: { profile_type: "learner" },
    learning_outcomes: [{ outcome_id: "LO1", statement: "Analyse and evaluate war poems." }],
    episode_plans: [
      {
        activity_id: "A1",
        mapped_learning_outcome_ids: ["LO1"],
        episode_plan_id: "EP-A1",
        episode_plan: { archetype: "understand", beats: [{ function: "explanation" }] }
      },
      {
        activity_id: "A2",
        mapped_learning_outcome_ids: ["LO1"],
        episode_plan_id: "EP-A2",
        episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
      },
      {
        activity_id: "A5",
        mapped_learning_outcome_ids: ["LO1"],
        episode_plan_id: "EP-A5",
        episode_plan: { archetype: "evaluate", beats: [{ function: "evaluative_judgement" }] }
      }
    ],
    assembly_state: { current_stage: "dla", enriched_by: ["episode_plan", "dla"] },
    page_synthesis: {},
    source_artefacts: [],
    generation_notes: {
      learner_evidence_attachments: {
        present: true,
        role: "learner_evidence",
        inventoried_units: ["Dulce et Decorum Est", "Anthem for Doomed Youth"]
      }
    },
    activities: [
      {
        activity_id: "A1",
        title: "War context foundation",
        grouping: "individual",
        duration_minutes: 10,
        learning_outcome_ids: ["LO1"],
        learner_task: "Explain wartime context using the teaching overview.",
        expected_output: "A short contextual explanation.",
        activity_preamble: "This foundation will help you interpret later textual evidence more effectively.",
        evidence_decision: {
          required: false,
          reason: "Orientation only.",
          provider_material_ids: []
        },
        required_materials: [
          {
            material_id: "A1-M1",
            material_type: "text",
            purpose: "Contextual teaching overview.",
            specification: "Explain wartime context with illustrative examples."
          }
        ],
        materials: [],
        episode_plan: { archetype: "understand", beats: [{ function: "explanation" }] }
      },
      {
        activity_id: "A2",
        title: "Close-read poem imagery",
        grouping: "individual",
        duration_minutes: 20,
        learning_outcome_ids: ["LO1"],
        learner_task: "Analyse imagery and tone using attributed poem excerpts.",
        expected_output: "An analysis citing imagery and tone from the excerpts.",
        activity_preamble: "Use the attached poems.",
        evidence_decision: {
          required: true,
          reason: "Source-bound poem evidence.",
          provider_material_ids: ["A2-ME1"]
        },
        required_materials: [
          {
            material_id: "A2-ME1",
            material_type: "scenario",
            purpose: "Attributed excerpts from Dulce et Decorum Est and Anthem for Doomed Youth.",
            specification: "Preserve wording and lineation.",
            evidence_requirement: {
              kind: "learner_evidence",
              purpose:
                "Provide attributed excerpts from Dulce et Decorum Est and Anthem for Doomed Youth.",
              learner_action: "Inspect imagery and tone in the excerpts.",
              observable_features: ["imagery", "tone", "exact wording and lineation"],
              processing_notes:
                "Inventoried units: Dulce et Decorum Est; Anthem for Doomed Youth.",
              provenance: "conversation_attachment"
            }
          }
        ],
        materials: [],
        episode_plan: { archetype: "analyse", beats: [{ function: "guided_reasoning" }] }
      },
      {
        activity_id: "A5",
        title: "Evaluate readings with viewpoints",
        grouping: "individual",
        duration_minutes: 25,
        learning_outcome_ids: ["LO1"],
        learner_task:
          "Evaluate how the poems present war using attributed excerpts and contrasting generated viewpoints.",
        expected_output: "An evaluative judgement citing quotations and weighing viewpoints.",
        activity_preamble: "Keep source extracts and generated viewpoints separate.",
        evidence_decision: {
          required: true,
          reason: "Needs source extracts and generated viewpoints.",
          provider_material_ids: ["A5-ME1", "A5-ME2"]
        },
        required_materials: [
          {
            material_id: "A5-ME1",
            material_type: "scenario",
            purpose: "Attributed excerpts from Dulce et Decorum Est and Anthem for Doomed Youth.",
            specification: "Preserve wording and lineation.",
            evidence_requirement: {
              kind: "learner_evidence",
              purpose:
                "Provide attributed excerpts from Dulce et Decorum Est and Anthem for Doomed Youth.",
              learner_action: "Cite exact lines before judging.",
              observable_features: ["exact wording and lineation"],
              processing_notes:
                "Inventoried units: Dulce et Decorum Est; Anthem for Doomed Youth.",
              provenance: "conversation_attachment"
            }
          },
          {
            material_id: "A5-ME2",
            material_type: "scenario",
            purpose: "Contrasting generated interpretations.",
            specification: "Two brief generated viewpoints.",
            evidence_requirement: {
              kind: "learner_evidence",
              purpose: "Provide contrasting generated interpretations.",
              learner_action: "Weigh generated viewpoints against the excerpts.",
              observable_features: ["contrasting generated interpretations"],
              provenance: "system_generated_simulation"
            }
          }
        ],
        materials: [],
        episode_plan: { archetype: "evaluate", beats: [{ function: "evaluative_judgement" }] }
      }
    ]
  };
  const check = dlaEnrich.validateDlaEnrichedPage(page, null);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
  assert.equal(
    (check.warnings || []).some((w) =>
      /SOURCE_INTENDED_WITHOUT_ATTACHMENT_PROVIDERS|SOURCE_RELATED_ACTIVITY_AVOIDS_ATTACHMENT|SOURCE_BOUND_UNIT_NOT_IN_INVENTORY|MIXED_PROVENANCE_SINGLE_PROVIDER/.test(
        w.code
      )
    ),
    false,
    JSON.stringify(check.warnings)
  );
});

test("S72: no attachment declaration continues normally for automation", () => {
  const page = buildMinimalPage({
    activity_id: "A1",
    title: "Explain core terms",
    grouping: "individual",
    duration_minutes: 10,
    learning_outcome_ids: ["LO1"],
    learner_task: "Explain the key terms from the teaching overview.",
    expected_output: "A short explanation of key terms.",
    activity_preamble: "Use the teaching material.",
    evidence_decision: {
      required: false,
      reason: "Conceptual teaching.",
      provider_material_ids: []
    },
    required_materials: [
      {
        material_id: "A1-M1",
        material_type: "text",
        purpose: "Explanatory overview.",
        specification: "Explain key terms."
      }
    ],
    materials: [],
    episode_plan: { archetype: "understand", beats: [{ function: "explanation" }] }
  });
  page.assembly_state = { current_stage: "dla", enriched_by: ["episode_plan", "dla"] };
  const check = dlaEnrich.validateDlaEnrichedPage(page, null);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
  assert.equal(
    (check.warnings || []).some((w) => w.code === "SOURCE_INTENDED_WITHOUT_ATTACHMENT_PROVIDERS"),
    false
  );
});

test("S72: irrelevant supporting-knowledge declaration is not forced into activities", () => {
  const page = buildMinimalPage({
    activity_id: "A1",
    title: "Explain core terms",
    grouping: "individual",
    duration_minutes: 10,
    learning_outcome_ids: ["LO1"],
    learner_task: "Explain the key terms from the teaching overview.",
    expected_output: "A short explanation of key terms.",
    activity_preamble: "Use the teaching material.",
    evidence_decision: {
      required: false,
      reason: "Conceptual teaching; attachment is supporting knowledge only.",
      provider_material_ids: []
    },
    required_materials: [
      {
        material_id: "A1-M1",
        material_type: "text",
        purpose: "Explanatory overview.",
        specification: "Explain key terms."
      }
    ],
    materials: [],
    episode_plan: { archetype: "understand", beats: [{ function: "explanation" }] }
  });
  page.generation_notes = {
    learner_evidence_attachments: {
      present: true,
      role: "supporting_knowledge",
      inventoried_units: ["Background glossary"]
    }
  };
  page.assembly_state = { current_stage: "dla", enriched_by: ["episode_plan", "dla"] };
  const check = dlaEnrich.validateDlaEnrichedPage(page, null);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
  assert.equal(
    (check.warnings || []).some((w) => w.code === "SOURCE_INTENDED_WITHOUT_ATTACHMENT_PROVIDERS"),
    false,
    JSON.stringify(check.warnings)
  );
});

function diagnosticsFromGamCapture(page, materials) {
  page.assembly_state = { current_stage: "gam", enriched_by: ["episode_plan", "dla", "gam"] };
  page.activities[0].materials = materials;
  const merged = gamEnrich.normalizeGamCaptureToPage(page, { activities: page.activities });
  return (
    (merged &&
      merged.generation_notes &&
      merged.generation_notes.validation &&
      merged.generation_notes.validation.quality_diagnostics) ||
    []
  );
}

test("S72: source-bound direct excerpts without interpretation pass fulfilment diagnostics", () => {
  const page = buildSourceBoundOwenDlaPage();
  const diagnostics = diagnosticsFromGamCapture(page, [
    {
      material_id: "A1-ME1",
      material_type: "scenario",
      title: "Owen poem excerpts",
      body:
        "Source: Dulce et Decorum Est (conversation attachment).\n\n\"Bent double, like old beggars under sacks,\"\n\nSource: Anthem for Doomed Youth (conversation attachment).\n\n\"What passing-bells for these who die as cattle?\"",
      body_format: "markdown"
    },
    {
      material_id: "A1-M2",
      material_type: "analysis_table",
      title: "Comparison workspace",
      body: "| Poem | Quotation | Comparison |\n| --- | --- | --- |\n|  |  | *Learner completes* |",
      body_format: "markdown"
    }
  ]);
  assert.equal(
    diagnostics.some((d) =>
      /SOURCE_BOUND_SUMMARY_ONLY|SOURCE_BOUND_MIXED_SUMMARY_EVIDENCE|SOURCE_BOUND_INTERPRETATION_AS_EVIDENCE|EVIDENCE_PRETASK_DISCLOSURE/.test(
        d.code
      )
    ),
    false,
    JSON.stringify(diagnostics)
  );
});

test("S72: pre-task interpretation phrases trigger disclosure diagnostics", () => {
  const page = buildSourceBoundOwenDlaPage();
  const diagnostics = diagnosticsFromGamCapture(page, [
    {
      material_id: "A1-ME1",
      material_type: "scenario",
      title: "Evidence for Evaluation",
      body:
        "Source: Dulce et Decorum Est (attachment).\n\n1. strips away ceremonial dignity\n2. presents death as industrial and impersonal\n3. suggesting warfare has displaced traditional values\n4. undermining heroic expectations\n5. directly attacks patriotic ideas",
      body_format: "markdown"
    },
    {
      material_id: "A1-M2",
      material_type: "analysis_table",
      title: "Comparison workspace",
      body: "| Poem | Quotation | Comparison |\n| --- | --- | --- |\n|  |  | *Learner completes* |",
      body_format: "markdown"
    }
  ]);
  assert.ok(
    diagnostics.some((d) => d.code === "EVIDENCE_PRETASK_DISCLOSURE"),
    JSON.stringify(diagnostics)
  );
  assert.ok(
    diagnostics.some((d) => d.code === "SOURCE_BOUND_INTERPRETATION_AS_EVIDENCE"),
    JSON.stringify(diagnostics)
  );
  assert.ok(
    Array.isArray(diagnostics) && diagnostics.length > 0,
    "quality_diagnostics must be persisted on GAM capture finalisation"
  );
});

test("S72: mixed quotation and thematic-summary evidence rows warn", () => {
  const page = buildSourceBoundOwenDlaPage();
  const mixedDiagnostics = diagnosticsFromGamCapture(page, [
    {
      material_id: "A1-ME1",
      material_type: "scenario",
      title: "Mixed evidence pack",
      body:
        "Source: Owen poems (attachment).\n\n1. \"Bent double, like old beggars under sacks,\"\n2. \"What passing-bells for these who die as cattle?\"\n3. Focus on soldiers' deaths rather than public celebration\n4. Emphasis on mourning and loss",
      body_format: "markdown"
    },
    {
      material_id: "A1-M2",
      material_type: "analysis_table",
      title: "Comparison workspace",
      body: "| Poem | Quotation | Comparison |\n| --- | --- | --- |\n|  |  | *Learner completes* |",
      body_format: "markdown"
    }
  ]);
  assert.ok(
    mixedDiagnostics.some((d) => d.code === "SOURCE_BOUND_MIXED_SUMMARY_EVIDENCE"),
    JSON.stringify(mixedDiagnostics)
  );

  const pagePass = buildSourceBoundOwenDlaPage();
  const passDiagnostics = diagnosticsFromGamCapture(pagePass, [
    {
      material_id: "A1-ME1",
      material_type: "scenario",
      title: "Inspectable excerpts",
      body:
        "Source: Owen poems (attachment).\n\n1. \"Bent double, like old beggars under sacks,\"\n2. \"Knock-kneed, coughing like hags, we cursed through sludge,\"\n3. \"What passing-bells for these who die as cattle?\"\n4. \"Only the monstrous anger of the guns.\"",
      body_format: "markdown"
    },
    {
      material_id: "A1-M2",
      material_type: "analysis_table",
      title: "Comparison workspace",
      body: "| Poem | Quotation | Comparison |\n| --- | --- | --- |\n|  |  | *Learner completes* |",
      body_format: "markdown"
    }
  ]);
  assert.equal(
    passDiagnostics.some((d) => d.code === "SOURCE_BOUND_MIXED_SUMMARY_EVIDENCE"),
    false,
    JSON.stringify(passDiagnostics)
  );
});

test("S72: combined source-bound workspace without evidence content field warns", () => {
  const page = buildSourceBoundOwenDlaPage();
  page.activities[0].required_materials[0].evidence_requirement = {
    ...page.activities[0].required_materials[0].evidence_requirement,
    evidence_layout: "combined_evidence_workspace",
    fixed_observation_fields: ["poem", "evidence category"],
    learner_response_fields: ["interpretation"]
  };
  page.activities[0].required_materials = [page.activities[0].required_materials[0]];
  page.activities[0].evidence_decision.provider_material_ids = ["A1-ME1"];
  const diagnostics = diagnosticsFromGamCapture(page, [
    {
      material_id: "A1-ME1",
      material_type: "analysis_table",
      title: "Evidence workspace",
      body:
        "| poem | evidence category | interpretation |\n| --- | --- | --- |\n| Dulce et Decorum Est | imagery | *Learner completes* |\n| Anthem for Doomed Youth | tone | *Learner completes* |",
      body_format: "markdown"
    }
  ]);
  assert.ok(
    diagnostics.some((d) => d.code === "SOURCE_BOUND_COMBINED_WITHOUT_EVIDENCE_FIELD"),
    JSON.stringify(diagnostics)
  );
});

test("S72: combined workspace with fixed source evidence and blank learner fields passes", () => {
  const page = buildSourceBoundOwenDlaPage();
  page.activities[0].required_materials[0].evidence_requirement = {
    ...page.activities[0].required_materials[0].evidence_requirement,
    evidence_layout: "combined_evidence_workspace",
    fixed_observation_fields: ["poem", "quotation", "evidence category"],
    learner_response_fields: ["interpretation"]
  };
  page.activities[0].required_materials = [page.activities[0].required_materials[0]];
  page.activities[0].evidence_decision.provider_material_ids = ["A1-ME1"];
  const materials = [
    {
      material_id: "A1-ME1",
      material_type: "analysis_table",
      title: "Evidence workspace",
      body:
        "| poem | quotation | evidence category | interpretation |\n| --- | --- | --- | --- |\n| Dulce et Decorum Est | \"Bent double, like old beggars under sacks,\" | imagery | *Learner completes* |\n| Anthem for Doomed Youth | \"What passing-bells for these who die as cattle?\" | tone | *Learner completes* |",
      body_format: "markdown"
    }
  ];
  const diagnostics = diagnosticsFromGamCapture(page, materials);
  assert.equal(
    diagnostics.some((d) =>
      /SOURCE_BOUND_COMBINED_WITHOUT_EVIDENCE_FIELD|SOURCE_BOUND_MIXED_SUMMARY_EVIDENCE|SOURCE_BOUND_INTERPRETATION_AS_EVIDENCE|EVIDENCE_PRETASK_DISCLOSURE/.test(
        d.code
      )
    ),
    false,
    JSON.stringify(diagnostics)
  );
  const merged = gamEnrich.normalizeGamCaptureToPage(page, { activities: page.activities });
  const check = gamEnrich.validateGamEnrichedPage(merged, page);
  assert.equal(check.ok, true, check.errors && check.errors.join("; "));
  assert.ok(Array.isArray(check.warnings));
  assert.ok(
    merged.generation_notes.validation.quality_diagnostics,
    "validate must preserve quality_diagnostics"
  );
});

test("S72: partial textual excerpts without honest omission marking warn", () => {
  const page = buildSourceBoundOwenDlaPage();
  const diagnostics = diagnosticsFromGamCapture(page, [
    {
      material_id: "A1-ME1",
      material_type: "scenario",
      title: "Fragmented excerpts",
      body:
        "Source: Dulce et Decorum Est (attachment).\n\n\"Bent double, like old\"\n\nSource: Anthem for Doomed Youth (attachment).\n\n\"What passing-bells for these who\"",
      body_format: "markdown"
    },
    {
      material_id: "A1-M2",
      material_type: "analysis_table",
      title: "Comparison workspace",
      body: "| Poem | Quotation | Comparison |\n| --- | --- | --- |\n|  |  | *Learner completes* |",
      body_format: "markdown"
    }
  ]);
  assert.ok(
    diagnostics.some((d) => d.code === "SOURCE_BOUND_SILENT_EXCERPT_OMISSION"),
    JSON.stringify(diagnostics)
  );

  const pageHonest = buildSourceBoundOwenDlaPage();
  const honest = diagnosticsFromGamCapture(pageHonest, [
    {
      material_id: "A1-ME1",
      material_type: "scenario",
      title: "Honest excerpts",
      body:
        "Source: Dulce et Decorum Est (attachment).\n\n\"Bent double, like old … under sacks,\"\n\nSource: Anthem for Doomed Youth (attachment).\n\n\"What passing-bells for these who … cattle?\"",
      body_format: "markdown"
    },
    {
      material_id: "A1-M2",
      material_type: "analysis_table",
      title: "Comparison workspace",
      body: "| Poem | Quotation | Comparison |\n| --- | --- | --- |\n|  |  | *Learner completes* |",
      body_format: "markdown"
    }
  ]);
  assert.equal(
    honest.some((d) => d.code === "SOURCE_BOUND_SILENT_EXCERPT_OMISSION"),
    false,
    JSON.stringify(honest)
  );
});

test("S72: DLA contract requires source-native field on combined source-bound workspaces", () => {
  const dlaText = dlaContract.buildDlaPageEnrichContractBlock();
  assert.match(
    dlaText,
    /fixed_observation_fields must name the source-native evidence field|quotation, extract, value, observation/i
  );
});
