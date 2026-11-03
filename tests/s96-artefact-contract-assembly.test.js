/**
 * Sprint 96 — unified Learning Journey artefact-contract assembly.
 * DUU-shaped: C5 produces c5.E1 once; C6 references it; C4 must not.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const fflate = require("fflate");

const ljPackage = require("../lib/learning-journey-learner-package.js");
const learnerPackage = require("../lib/learner-package.js");
const {
  proposeArtefactContractFromLearningJourney,
  normalizeArtefactContract,
  renderLearnerPageHtml
} = require("../lib/learner-renderer-vnext");

function assessmentPage(elicitationId, title) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "assessment_pack",
    page_kind: "assessment",
    title: title || "Assessment",
    activities: [],
    assessment_evidence: {
      purpose: {
        role: "R2",
        visibility_claim: "Judgement quality.",
        stop_rationale: "Formative stop.",
        forward_intent: "Carry the judgement forward."
      },
      learner_context: { depends_on_prior_work: false },
      pack_forward_orientation: "Use the result in the next block.",
      elicitations: [
        {
          elicitation_id: elicitationId,
          order: 1,
          evidence_ask: "Write the independent judgement.",
          epistemic_class: "non_determinate",
          delivery: {
            kind: "constructed_performance",
            prompt: "Write your independent judgement.",
            response_workspace: { intention: "sustained_written_judgement" }
          },
          formative_return: {
            materials: [{ material_id: "look", body: "Look again." }],
            forward_orientation: "Carry the writing forward."
          }
        }
      ]
    }
  };
}

function interactivePage(title) {
  return {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "interactive",
    title: title || "Interactive",
    activities: []
  };
}

function duuShapedPage(overrides) {
  const src = overrides && typeof overrides === "object" ? overrides : {};
  return {
    artifact_type: "page",
    product_id: "learning_journey",
    title: "Deciding Under Uncertainty",
    commissions: [
      {
        commission_id: "c1",
        order: 1,
        product_id: "expository",
        title: "Recognising Evidence",
        dependencies: ""
      },
      {
        commission_id: "c2",
        order: 2,
        product_id: "interactive",
        title: "Evaluating Evidence",
        dependencies: "c1"
      },
      {
        commission_id: "c3",
        order: 3,
        product_id: "interactive",
        title: "From Evidence to Action",
        dependencies: "c2"
      },
      {
        commission_id: "c4",
        order: 4,
        product_id: "interactive",
        title: "Reconsidering a Provisional Decision",
        // Defect specimen: earlier C4 metadata named c5 even though c5 follows c4.
        dependencies:
          src.c4Dependencies != null
            ? src.c4Dependencies
            : "Builds on c3; may also refer ahead to c5 in legacy wording."
      },
      {
        commission_id: "c5",
        order: 5,
        product_id: "assessment_pack",
        title: "Independent Evidence-Informed Judgement",
        dependencies: ""
      },
      {
        commission_id: "c6",
        order: 6,
        product_id: "assessment_pack",
        title: "Evaluating the Quality of Independent Judgement",
        dependencies: "Requires the learner's completed response from c5."
      }
    ]
  };
}

function duuConstituents() {
  return [
    { commissionId: "c1", productId: "expository", sourcePage: { product_id: "expository", title: "C1" } },
    { commissionId: "c2", productId: "interactive", sourcePage: interactivePage("C2") },
    { commissionId: "c3", productId: "interactive", sourcePage: interactivePage("C3") },
    { commissionId: "c4", productId: "interactive", sourcePage: interactivePage("C4") },
    {
      commissionId: "c5",
      productId: "assessment_pack",
      sourcePage: assessmentPage("E1", "Independent Evidence-Informed Judgement")
    },
    {
      commissionId: "c6",
      productId: "assessment_pack",
      sourcePage: assessmentPage("review", "Evaluating Judgement")
    }
  ];
}

function readExportedArtefactContract(zipBytes) {
  const files = fflate.unzipSync(zipBytes);
  const indexName = Object.keys(files).find(function (name) {
    return /(^|\/)index\.html$/i.test(name);
  });
  assert.ok(indexName, "index.html missing from ZIP");
  const html = Buffer.from(files[indexName]).toString("utf8");
  const match = html.match(
    /id="lj-shell-artefact-contract"[^>]*>(\{[\s\S]*?\})<\/script>/
  );
  assert.ok(match, "artefact contract script missing");
  return JSON.parse(match[1]);
}

test("DUU-shaped proposal: C5 produces once, C6 references once, C4 does not reference c5.E1", () => {
  const proposal = proposeArtefactContractFromLearningJourney({
    page: duuShapedPage(),
    constituents: duuConstituents()
  });
  assert.equal(proposal.ok, true, JSON.stringify(proposal.gaps));
  const contract = normalizeArtefactContract(proposal.contract);
  assert.equal(contract.produces.length, 1);
  assert.equal(contract.produces[0].artefactId, "c5.E1");
  assert.equal(contract.produces[0].commissionId, "c5");
  assert.equal(contract.produces[0].workspaceId, "assessment-constructed-E1");
  assert.equal(contract.references.length, 1);
  assert.equal(contract.references[0].artefactId, "c5.E1");
  assert.equal(contract.references[0].commissionId, "c6");
  assert.equal(
    contract.references.some(function (row) {
      return row.commissionId === "c4";
    }),
    false
  );
  assert.ok(
    proposal.gaps.some(function (gap) {
      return gap.code === "producer_does_not_precede_consumer" && gap.consumerId === "c4";
    }),
    JSON.stringify(proposal.gaps)
  );
});

test("normalizeArtefactContract dedupes identical produces/references and reports workspace conflicts", () => {
  const once = normalizeArtefactContract({
    produces: [
      {
        artefactId: "c5.E1",
        commissionId: "c5",
        workspaceId: "assessment-constructed-E1",
        label: "Judgement"
      },
      {
        artefactId: "c5.E1",
        commissionId: "c5",
        workspaceId: "assessment-constructed-E1",
        label: "Judgement duplicate"
      }
    ],
    references: [
      { artefactId: "c5.E1", commissionId: "c6", usage: "reference" },
      { artefactId: "c5.E1", commissionId: "c6", usage: "reference" },
      { artefactId: "c5.E1", commissionId: "c4", usage: "reference" }
    ]
  });
  assert.equal(once.produces.length, 1);
  assert.equal(once.references.length, 2);
  assert.equal(once.conflicts.length, 0);

  const conflicted = normalizeArtefactContract({
    produces: [
      {
        artefactId: "c5.E1",
        commissionId: "c5",
        workspaceId: "assessment-constructed-E1"
      },
      {
        artefactId: "c5.E1",
        commissionId: "c5",
        workspaceId: "assessment-constructed-OTHER"
      }
    ],
    references: []
  });
  assert.equal(conflicted.produces.length, 1);
  assert.equal(conflicted.produces[0].workspaceId, "assessment-constructed-E1");
  assert.equal(conflicted.conflicts.length, 1);
  assert.equal(conflicted.conflicts[0].code, "conflicting_produce_workspace");
});

test("journey with no explicit artefact relationships acquires none", () => {
  const page = duuShapedPage({ c4Dependencies: "Builds on c3 only." });
  page.commissions = page.commissions.map(function (row) {
    if (row.commission_id === "c6") return Object.assign({}, row, { dependencies: "" });
    return row;
  });
  const empty = proposeArtefactContractFromLearningJourney({
    page: page,
    constituents: duuConstituents()
  });
  assert.equal(empty.ok, false);
  assert.equal(empty.contract.produces.length, 0);
  assert.equal(empty.contract.references.length, 0);
});

test("legitimate later Interactive consumer of earlier Assessment Pack remains intact", () => {
  const proposal = proposeArtefactContractFromLearningJourney({
    page: {
      product_id: "learning_journey",
      commissions: [
        { commission_id: "c5", order: 5, product_id: "assessment_pack", dependencies: "" },
        {
          commission_id: "c6",
          order: 6,
          product_id: "interactive",
          dependencies: "c5 — learner's completed independent judgement"
        }
      ]
    },
    constituents: [
      {
        commissionId: "c5",
        productId: "assessment_pack",
        sourcePage: assessmentPage("independent_judgement")
      },
      {
        commissionId: "c6",
        productId: "interactive",
        sourcePage: interactivePage("Reflect")
      }
    ]
  });
  assert.equal(proposal.ok, true, JSON.stringify(proposal.gaps));
  assert.equal(proposal.contract.produces.length, 1);
  assert.equal(proposal.contract.references[0].commissionId, "c6");
});

test("exported unified manifest keeps single C5 produce and C6 reference after repeated assembly", () => {
  const page = duuShapedPage();
  const c5Page = assessmentPage("E1", "Independent Evidence-Informed Judgement");
  const c6Page = assessmentPage("review", "Evaluating Judgement");
  const renderedC5 = renderLearnerPageHtml(c5Page);
  const renderedC6 = renderLearnerPageHtml(c6Page);
  assert.equal(renderedC5.error, null, renderedC5.error);
  assert.equal(renderedC6.error, null, renderedC6.error);
  const packC5 = learnerPackage.buildLearnerPackage({ html: renderedC5.html, title: c5Page.title });
  const packC6 = learnerPackage.buildLearnerPackage({ html: renderedC6.html, title: c6Page.title });
  assert.equal(packC5.ok, true);
  assert.equal(packC6.ok, true);

  const constituents = duuConstituents().map(function (row) {
    if (row.commissionId === "c5") {
      return Object.assign({}, row, { sourcePage: c5Page, learnerPackage: packC5.package });
    }
    if (row.commissionId === "c6") {
      return Object.assign({}, row, { sourcePage: c6Page, learnerPackage: packC6.package });
    }
    const html =
      "<article data-renderer=\"vnext\"><h1>" + row.title + "</h1><p>Body</p></article>";
    const pack = learnerPackage.buildLearnerPackage({ html: html, title: row.title || row.commissionId });
    assert.equal(pack.ok, true);
    return Object.assign({}, row, { learnerPackage: pack.package });
  });

  const proposal = proposeArtefactContractFromLearningJourney({ page: page, constituents: constituents });
  assert.equal(proposal.ok, true, JSON.stringify(proposal.gaps));

  const runtimeScript = fs.readFileSync(
    path.join(__dirname, "..", "lib", "learner-renderer-vnext-browser.js"),
    "utf8"
  );
  const assembleOnce = ljPackage.assembleLearningJourneyUnifiedShellPackage({
    page: page,
    constituents: constituents,
    artefactContract: proposal.contract,
    fflate: fflate,
    runtimeScript: runtimeScript
  });
  assert.equal(assembleOnce.ok, true, assembleOnce.error && assembleOnce.error.message);
  const assembleTwice = ljPackage.assembleLearningJourneyUnifiedShellPackage({
    page: page,
    constituents: constituents,
    artefactContract: proposal.contract,
    fflate: fflate,
    runtimeScript: runtimeScript
  });
  assert.equal(assembleTwice.ok, true);

  const first = normalizeArtefactContract(readExportedArtefactContract(assembleOnce.bytes));
  const second = normalizeArtefactContract(readExportedArtefactContract(assembleTwice.bytes));
  assert.equal(first.produces.length, 1);
  assert.equal(first.produces[0].artefactId, "c5.E1");
  assert.equal(first.references.length, 1);
  assert.equal(first.references[0].commissionId, "c6");
  assert.deepEqual(first.produces, second.produces);
  assert.deepEqual(first.references, second.references);

  // Even if a duplicate contract is supplied, assembly enrichment/normalize collapses it.
  const duplicated = {
    produces: proposal.contract.produces.concat(proposal.contract.produces),
    references: proposal.contract.references.concat(proposal.contract.references)
  };
  const assembleDup = ljPackage.assembleLearningJourneyUnifiedShellPackage({
    page: page,
    constituents: constituents,
    artefactContract: duplicated,
    fflate: fflate,
    runtimeScript: runtimeScript
  });
  assert.equal(assembleDup.ok, true);
  const fromDup = normalizeArtefactContract(readExportedArtefactContract(assembleDup.bytes));
  assert.equal(fromDup.produces.length, 1);
  assert.equal(fromDup.references.length, 1);
});
