/**

 * Sprint 85 WP2 — Expository sibling contracts, extent normalisation, capture/assembly spine.

 */



const test = require("node:test");

const assert = require("node:assert/strict");

const contracts = require("../lib/expository-contracts.js");

const assemble = require("../lib/page-vnext-assemble.js");



test("EJP normalizes ordered sections as primary structure", () => {

  const ejp = contracts.normalizeExpositoryJourneyPlan({

    title: "Photosynthesis",

    sections: [

      { title: "Orientation", purpose: "Orient the learner", knowledge_focus: "energy capture" },

      { section_id: "s2", title: "Light reactions", purpose: "Establish mechanism" }

    ]

  });

  assert.equal(ejp.artifact_type, "expository_journey_plan");

  assert.equal(ejp.sections.length, 2);

  assert.equal(ejp.sections[0].section_id, "section_1");

  assert.equal(ejp.sections[1].section_id, "s2");

  assert.equal(ejp.sections[0].order, 1);

});



test("XM commission lock detects invent/missing", () => {

  const xd = {

    sections: [

      {

        section_id: "s1",

        materials_commission: [{ commission_id: "c1", kind: "example", intent: "concrete case" }]

      }

    ]

  };

  const ok = contracts.validateCommissionLock(xd, {

    materials: [{ material_id: "m1", commission_id: "c1", section_id: "s1", body: "..." }]

  });

  assert.equal(ok.ok, true);

  const bad = contracts.validateCommissionLock(xd, {

    materials: [{ material_id: "m2", commission_id: "c99", section_id: "s1", body: "invented" }]

  });

  assert.equal(bad.ok, false);

  assert.ok(bad.warnings.some((w) => /uncommissioned|missing realisation/.test(w)));

});



test("XD keeps a single explanation_intent and does not default commission kind", () => {

  const xd = contracts.normalizeExpositoryDevelopment({

    sections: [

      {

        section_id: "s1",

        explanatory_treatment: "legacy alias field",

        exposition: "Learner-facing explanation of the opening move.",

        materials_commission: [{ commission_id: "c1", intent: "a worked case" }]

      }

    ]

  });

  assert.equal(xd.sections[0].explanation_intent, "legacy alias field");

  assert.equal(xd.sections[0].exposition, "Learner-facing explanation of the opening move.");

  assert.equal(xd.sections[0].explanatory_treatment, undefined);

  assert.equal(xd.sections[0].materials_commission[0].kind, "");

});

test("XD does not silently promote explanation_intent into exposition", () => {
  const xd = contracts.normalizeExpositoryDevelopment({
    sections: [
      {
        section_id: "s1",
        explanation_intent: "Open by contrasting purpose with instruments."
      }
    ]
  });
  assert.equal(xd.sections[0].explanation_intent, "Open by contrasting purpose with instruments.");
  assert.equal(xd.sections[0].exposition, "");
  const check = contracts.validateExpositoryArtefactShape(xd, "expository_development");
  assert.equal(check.ok, false);
  assert.ok(
    check.errors.some((e) => /exposition required/i.test(String(e))),
    check.errors.join(" | ")
  );
});



test("Assembly STAGE_ORDER includes Expository stages additively", () => {

  assert.ok(Array.isArray(assemble.STAGE_ORDER));

  assert.ok(assemble.STAGE_ORDER.indexOf("expository_journey_plan") !== -1);

  assert.ok(assemble.STAGE_ORDER.indexOf("expository_development") !== -1);

  assert.ok(assemble.STAGE_ORDER.indexOf("expository_materials") !== -1);

  assert.ok(

    assemble.STAGE_ORDER.indexOf("expository_materials") <

      assemble.STAGE_ORDER.indexOf("design_page")

  );

  assert.deepEqual(assemble.STAGE_CANONICAL_STEP_IDS.expository_journey_plan, [

    "step_expository_journey_plan"

  ]);

});



test("S85-D05: explicit word-count intent yields approximate words_equivalent", () => {

  const a = contracts.normalizeExpositoryScopeExtent("1,500 words");

  assert.equal(a.scope_text, "1,500 words");

  assert.equal(a.words_equivalent, 1500);

  assert.equal(a.interpretation, "explicit_words");

  assert.equal(a.is_approximate, true);



  const b = contracts.normalizeExpositoryScopeExtent("about 2,000 words");

  assert.equal(b.words_equivalent, 2000);



  const c = contracts.normalizeExpositoryScopeExtent("3,000-word chapter");

  assert.equal(c.words_equivalent, 3000);

});



test("S85-D05: reading-time intent uses 200 wpm planning assumption", () => {

  assert.equal(contracts.EXPOSITORY_PLANNING_WORDS_PER_MINUTE, 200);

  const five = contracts.normalizeExpositoryScopeExtent("5 minutes");

  assert.equal(five.reading_minutes, 5);

  assert.equal(five.words_equivalent, 1000);

  assert.equal(five.interpretation, "reading_time");



  const ten = contracts.normalizeExpositoryScopeExtent("about 10 minutes");

  assert.equal(ten.words_equivalent, 2000);



  const twenty = contracts.normalizeExpositoryScopeExtent("20 min");

  assert.equal(twenty.words_equivalent, 4000);

});



test("S85-D05: qualitative scope preserves text without inventing numbers", () => {

  const q = contracts.normalizeExpositoryScopeExtent("brief overview");

  assert.equal(q.scope_text, "brief overview");

  assert.equal(q.words_equivalent, null);

  assert.equal(q.interpretation, "qualitative");

  assert.equal(q.qualitative_hint, "brief");



  const d = contracts.normalizeExpositoryScopeExtent("detailed treatment");

  assert.equal(d.words_equivalent, null);

  assert.equal(d.qualitative_hint, "substantial");

});



test("EJP contract carries optional extent from scope", () => {

  const ejp = contracts.normalizeExpositoryJourneyPlan({

    title: "X",

    scope_scale: "about 1500 words",

    sections: [{ title: "A", purpose: "start" }]

  });

  assert.ok(ejp.extent);

  assert.equal(ejp.extent.words_equivalent, 1500);

  assert.equal(ejp.extent.scope_text, "about 1500 words");

});



test("Expository assembly merges EJP→XD→XM into section-primary page without activities", () => {

  const ejp = contracts.normalizeExpositoryJourneyPlan({

    title: "Photosynthesis",

    audience: "A-level biology",

    scope_scale: "10 minutes",

    commissioned_purpose: "Explain how light energy is captured and used in the light reactions.",

    epistemic_form: "mechanism and causal sequence",

    sections: [

      {

        section_id: "s1",

        title: "Energy capture",

        purpose: "Orient",

        knowledge_focus: "light energy"

      },

      {

        section_id: "s2",

        title: "Light reactions",

        purpose: "Mechanism",

        knowledge_focus: "electron transport"

      }

    ]

  });

  const xd = contracts.normalizeExpositoryDevelopment({

    sections: [

      {

        section_id: "s1",

        explanation_intent: "open the enquiry",

        exposition: "Learners meet the enquiry as a live question about energy flow.",

        materials_commission: [

          { commission_id: "c1", section_id: "s1", kind: "diagram", intent: "energy flow" }

        ]

      },

      {

        section_id: "s2",

        explanation_intent: "build mechanism",

        exposition: "The mechanism is traced through successive electron transfers.",

        materials_commission: [

          { commission_id: "c2", section_id: "s2", kind: "worked_example", intent: "trace electrons" }

        ]

      }

    ]

  });

  const xm = contracts.normalizeExpositoryMaterials({

    materials: [

      { material_id: "m1", commission_id: "c1", section_id: "s1", kind: "diagram", body: "Figure: energy flow" },

      {

        material_id: "m2",

        commission_id: "c2",

        section_id: "s2",

        kind: "worked_example",

        body: "Step through the chain…"

      }

    ]

  });



  const result = assemble.assembleVNextPageFromPartials({

    expository_journey_plan: ejp,

    expository_development: xd,

    expository_materials: xm

  });



  assert.equal(result.ok, true);

  assert.equal(result.mode, "expository");

  assert.equal(result.page.artifact_type, "page");

  assert.equal(result.page.activities.length, 0);

  assert.equal(result.page.sections.length, 2);

  assert.equal(result.page.sections[0].section_id, "s1");

  assert.equal(result.page.sections[0].explanation_intent, "open the enquiry");

  assert.equal(
    result.page.sections[0].exposition,
    "Learners meet the enquiry as a live question about energy flow."
  );

  assert.equal(result.page.sections[0].materials.length, 1);

  assert.equal(result.page.sections[1].materials[0].commission_id, "c2");

  assert.equal(result.page.expository_extent.words_equivalent, 2000);

  assert.deepEqual(result.page.assembly_state.enriched_by, [

    "expository_journey_plan",

    "expository_development",

    "expository_materials"

  ]);

  assert.equal(assemble.isLearnerReadyAssembledPage(result.page), true);

});



test("Interactive assembly still requires episode_plan (Expository path does not leak)", () => {

  assert.throws(

    () =>

      assemble.assembleVNextPageFromPartials({

        dla: {

          artifact_type: "page",

          schema_version: "2.0.0",

          title: "x",

          activities: [{ activity_id: "a1" }],

          assembly_state: { current_stage: "dla", enriched_by: ["dla"] }

        }

      }),

    /episode_plan or expository_journey_plan/

  );

});


