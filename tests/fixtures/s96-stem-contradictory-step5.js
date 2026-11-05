"use strict";
/**
 * Exact STEM Step 5 contradictory fixture (table-format observations + wrong SD).
 * Shared content matches the browser paste that was incorrectly accepted.
 */
const fs = require("node:fs");
const path = require("node:path");

const SHARED_CONTENT = fs.readFileSync(
  path.join(__dirname, "s96-stem-contradictory-shared-content.txt"),
  "utf8"
);

const C3_SPEC =
  "Create a self-contained Interactive Resource serving the application requirements of Learning Elements 2 and 3 within developmental Phase 2, with approximately 15 minutes of learner effort. Educational job: develop accurate calculation, checking and interpretation of descriptive statistics for the canonical experimental dataset. Require consequential learner action: calculate the mean, range and sample standard deviation for each temperature condition, verify results and explain what the values describe. Allocate approximately 5 minutes to mean and range application and 10 minutes to standard-deviation calculation and interpretation. Use the exact canonical observations and sample standard deviation convention. Numerical feedback must be verified against the shared source, including means of approximately 91.67 s and 75.50 s, ranges of 9 s and 11 s, and sample standard deviations of approximately 3.39 s and 4.04 s for Conditions A and B respectively. These values are restricted feedback information and must appear only after relevant learner attempts. Support basic calculator or accessible spreadsheet use without requiring specialist software. Provide procedural reminders and meaningful feedback that distinguishes arithmetic errors from conceptual misunderstandings. Require correct units and sensible precision. Do not reveal the final scientific conclusion. Independent calculation and correction are explicitly part of the experience. Learners should retain their numerical summaries for comparison in c4. An Interactive Resource is appropriate because consequential calculation, checking and interpretation are central to how learning develops.";

function buildStemContradictoryStep5Page() {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "learning_journey",
    title: "Making Sense of Experimental Data",
    shared_authoritative_material: {
      status: "provided",
      content: SHARED_CONTENT
    },
    editorial_opening_image: {
      decision: "skip",
      subject: "",
      context: "",
      caption_intent: "",
      alt_text: "",
      detailed_description: ""
    },
    activities: [],
    sections: [
      {
        section_id: "journey_intro",
        title: "Investigating the evidence",
        order: 1,
        exposition:
          "Experimental measurements can reveal patterns, but deciding what those patterns mean takes more than calculating an average."
      },
      {
        section_id: "exp_1",
        title: "1. Understand the investigation",
        order: 2,
        exposition: "Establish what the experiment is designed to investigate."
      },
      {
        section_id: "exp_2",
        title: "2. Understand the statistics",
        order: 3,
        exposition: "Explore mean, range and sample standard deviation."
      },
      {
        section_id: "exp_3",
        title: "3. Calculate the summaries",
        order: 4,
        exposition: "Calculate summaries for each water-temperature condition."
      }
    ],
    commissions: [
      {
        commission_id: "c1",
        section_id: "exp_1",
        order: 1,
        title: "Understanding the Experimental Evidence",
        product_id: "expository",
        status: "supported",
        specification_text:
          "Establish understanding of the experimental question, variables and repeated measurements using the canonical soluble-tablet investigation.",
        journey_context_text:
          "Established recurring scenario: synthetic soluble-tablet dissolution under Condition A at 20 °C and Condition B at 40 °C. This is the first commission.",
        dependencies: ""
      },
      {
        commission_id: "c2",
        section_id: "exp_2",
        order: 2,
        title: "Understanding Descriptive Statistics",
        product_id: "expository",
        status: "supported",
        specification_text:
          "Create a self-contained Expository Resource serving Learning Elements 2 and 3 within developmental Phase 2. Provide accurate worked examples using only the separate canonical practice dataset of 10 s, 12 s and 14 s, whose mean is 12 s, range is 4 s and sample standard deviation is 2 s. Explain mean, range and sample standard deviation. Do not disclose the main investigation's calculated statistics.",
        journey_context_text:
          "Builds on c1 experimental understanding. The worked-example dataset of 10 s, 12 s and 14 s is separate from the experimental observations and must never be presented as additional experimental evidence. Learners bring forward what the measurements represent before applying statistical methods in c3.",
        dependencies: "c1"
      },
      {
        commission_id: "c3",
        section_id: "exp_3",
        order: 3,
        title: "Calculating and Interpreting Experimental Summaries",
        product_id: "interactive",
        status: "supported",
        specification_text: C3_SPEC,
        journey_context_text:
          "The recurring synthetic investigation compares soluble-tablet dissolution times under Condition A at 20 °C and Condition B at 40 °C. Commission c2 explained calculation procedures. Learners should bring forward those procedures and apply them to the canonical experimental measurements.",
        dependencies: "c1; c2"
      }
    ],
    learning_journey: {
      design_intent:
        "STEM experimental-data journey using one locked synthetic soluble-tablet dataset.",
      continuity:
        "Preserve Condition A/B temperatures, raw observations and progressive disclosure across commissions."
    },
    assembly_state: {
      current_stage: "design_page",
      enriched_by: [
        "learning_requirements",
        "learning_progression",
        "learning_elements",
        "learning_commissions",
        "design_page"
      ],
      calls_model: true
    }
  };
}

function correctConditionAStatistics(text) {
  return String(text || "")
    .replace(/3\.3862/g, "3.3267")
    .replace(/approximately 3\.39/g, "approximately 3.33")
    .replace(/of approximately 3\.39 s and 4\.04 s/g, "of approximately 3.33 s and 4.04 s")
    .replace(/standard deviations of approximately 3\.39 s/g, "standard deviations of approximately 3.33 s");
}

/** Same STEM page with Condition A SD corrected consistently to ~3.3267 / 3.33. */
function buildStemCorrectedStep5Page() {
  const page = buildStemContradictoryStep5Page();
  page.shared_authoritative_material = {
    status: "provided",
    content: correctConditionAStatistics(SHARED_CONTENT)
  };
  page.commissions = page.commissions.map(function (row) {
    return Object.assign({}, row, {
      specification_text: correctConditionAStatistics(row.specification_text),
      journey_context_text: correctConditionAStatistics(row.journey_context_text)
    });
  });
  return page;
}

module.exports = {
  SHARED_CONTENT,
  C3_SPEC,
  buildStemContradictoryStep5Page,
  buildStemCorrectedStep5Page,
  correctConditionAStatistics
};
