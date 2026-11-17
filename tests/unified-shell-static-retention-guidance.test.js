/**
 * Unified Learning Journey assembly bakes accurate assessment-output retention
 * help into static HTML when an artefact contract applies. Standalone packs and
 * authored educational prose stay unchanged; runtime rewrite remains a fallback.
 */
"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const fs = require("node:fs");
const path = require("node:path");
const fflate = require("fflate");

const assessmentOutput = require("../lib/learner-renderer-vnext/assessment-output.js");
const artefact = require("../lib/learner-renderer-vnext/learner-artefact-contract.js");
const ljDesign = require("../lib/learning-journey-design-page.js");
const ljPackage = require("../lib/learning-journey-learner-package.js");
const unifiedShell = require("../lib/learning-journey-unified-shell.js");

function standaloneHelpHtml(extraAuthored) {
  const help = assessmentOutput.buildAssessmentOutputRetentionHelp({
    deliveryContext: "standalone"
  });
  return (
    '<article data-renderer="vnext" data-persistence-page-key="page-key">' +
    (extraAuthored
      ? "<p>" + extraAuthored + "</p>"
      : "") +
    '<section class="util-assessment-output" data-assessment-output-region="true">' +
    '<p class="util-assessment-output-help" data-assessment-output-help="true" data-assessment-output-delivery="standalone">' +
    help +
    "</p>" +
    '<button type="button" data-assessment-output-copy="true">Keep a copy</button>' +
    "</section></article>"
  );
}

function journeyWithCommissions(commissionIds) {
  const sections = [
    { section_id: "journey_intro", title: "About", order: 1, exposition: "Intro." },
    { section_id: "exp_1", title: "Experiences", order: 2, exposition: "Body." }
  ];
  const commissions = commissionIds.map(function (id, index) {
    return {
      commission_id: id,
      section_id: "exp_1",
      order: index + 1,
      title: "Resource " + id,
      product_id: "assessment_pack",
      status: "supported",
      specification_text: id
    };
  });
  return ljDesign.buildLearningJourneyDesignPageFixture({
    title: "Static retention journey",
    sections: sections,
    commissions: commissions
  });
}

test("HTML helper rewrites producer help with downstream references", () => {
  const source = standaloneHelpHtml("Keep your original explanation for later diagnosis.");
  const result = artefact.applyContextualHandoffGuidanceToHtml(source, {
    deliveryContext: "unified",
    commissionId: "C02",
    contract: {
      produces: [
        {
          artefactId: "C02.E1",
          commissionId: "C02",
          workspaceId: "assessment-constructed-E1"
        }
      ],
      references: [
        { artefactId: "C02.E1", commissionId: "C04", usage: "reference" }
      ]
    }
  });
  assert.equal(result.ok, true);
  assert.ok(result.rewritten >= 1);
  assert.equal(result.producer, true);
  assert.match(result.html, /data-assessment-output-delivery="unified"/);
  assert.match(result.html, /Learning Journey/i);
  assert.match(result.html, /do not paste it into later answer fields/i);
  assert.doesNotMatch(result.html, /kept on this page only/i);
  assert.doesNotMatch(result.html, /will not retrieve it automatically/i);
  assert.match(result.html, /Keep your original explanation for later diagnosis/);
});

test("HTML helper adds Learning Journal wording for journal-listed producers", () => {
  const source = standaloneHelpHtml();
  const result = artefact.applyContextualHandoffGuidanceToHtml(source, {
    deliveryContext: "unified",
    commissionId: "C02",
    contract: {
      produces: [
        {
          artefactId: "C02.E1",
          commissionId: "C02",
          workspaceId: "assessment-constructed-E1"
        }
      ],
      references: [
        { artefactId: "C02.E1", commissionId: "C04", usage: "reference" }
      ]
    },
    journalSpec: {
      enabled: true,
      entries: [{ artefact_id: "C02.E1", title: "Your first explanation" }]
    }
  });
  assert.equal(result.journalListed, true);
  assert.match(result.html, /Learning Journal/i);
  assert.match(result.html, /do not paste it into their answer fields/i);
  assert.doesNotMatch(result.html, /kept on this page only/i);
});

test("standalone Assessment Pack help remains page-only without unified rewrite", () => {
  const help = assessmentOutput.buildAssessmentOutputRetentionHelp({
    deliveryContext: "standalone"
  });
  assert.match(help, /kept on this page only/i);
  assert.match(help, /will not retrieve it automatically/i);

  const html = assessmentOutput.renderAssessmentOutputRegion({
    specification_id: "retain_original",
    artefact_title: "Your first explanation",
    action_label: "Copy my first explanation",
    sections: [
      {
        section_id: "original",
        order: 1,
        heading: "Original",
        contributions: [
          {
            contribution_id: "c1",
            label: "Explanation",
            elicitation_id: "E1",
            response_part: "response_text"
          }
        ]
      }
    ]
  });
  assert.match(html, /data-assessment-output-delivery="standalone"/);
  assert.match(html, /kept on this page only/i);

  const untouched = artefact.applyContextualHandoffGuidanceToHtml(html, {
    deliveryContext: "standalone",
    commissionId: "C02",
    contract: {
      produces: [{ artefactId: "C02.E1", commissionId: "C02", workspaceId: "w1" }],
      references: []
    }
  });
  assert.equal(untouched.skipped, "not-unified");
  assert.match(untouched.html, /kept on this page only/i);
});

test("unified shell static HTML bakes producer and Journal retention help", () => {
  const journey = journeyWithCommissions(["C02", "C04"]);
  const authored = "Keep your original explanation unchanged for later diagnosis.";
  const producerHtml = standaloneHelpHtml(authored);
  const consumerHtml =
    '<div data-renderer="vnext"><p>Diagnose using your earlier work.</p></div>';

  const assembled = unifiedShell.buildLearningJourneyUnifiedShellHtml(
    journey.page,
    [
      {
        commissionId: "C02",
        title: "Write your first explanation",
        productId: "assessment_pack",
        html: producerHtml
      },
      {
        commissionId: "C04",
        title: "Diagnose your explanation",
        productId: "assessment_pack",
        html: consumerHtml
      }
    ],
    {
      artefactContract: {
        produces: [
          {
            artefactId: "C02.E1",
            commissionId: "C02",
            workspaceId: "assessment-constructed-E1"
          }
        ],
        references: [
          { artefactId: "C02.E1", commissionId: "C04", usage: "reference" }
        ]
      },
      journalSpec: {
        enabled: true,
        title: "Your Learning Journal",
        entries: [
          {
            entry_id: "initial_explanation",
            order: 1,
            title: "Your first explanation",
            framing: "Revisit your first explanation.",
            artefact_id: "C02.E1"
          }
        ]
      },
      runtimeScript: "window.PRISM_LEARNER_RENDERER_VNEXT=window.PRISM_LEARNER_RENDERER_VNEXT||{};"
    }
  );

  assert.equal(assembled.ok, true, assembled.code || "assemble failed");
  const c02 = assembled.html.match(
    /<template id="lj-resource-C02">([\s\S]*?)<\/template>/i
  );
  assert.ok(c02, "C02 template missing");
  assert.match(c02[1], /data-assessment-output-delivery="unified"/);
  assert.match(c02[1], /Learning Journey/i);
  assert.match(c02[1], /Learning Journal/i);
  assert.match(c02[1], /do not paste it into their answer fields/i);
  assert.doesNotMatch(c02[1], /kept on this page only/i);
  assert.doesNotMatch(c02[1], /will not retrieve it automatically/i);
  assert.match(c02[1], /Keep your original explanation unchanged for later diagnosis/);
});

test("runtime contextual guidance remains compatible with assembled unified help", () => {
  const source = standaloneHelpHtml();
  const baked = artefact.applyContextualHandoffGuidanceToHtml(source, {
    deliveryContext: "unified",
    commissionId: "C02",
    contract: {
      produces: [
        {
          artefactId: "C02.E1",
          commissionId: "C02",
          workspaceId: "assessment-constructed-E1"
        }
      ],
      references: [
        { artefactId: "C02.E1", commissionId: "C04", usage: "reference" }
      ]
    },
    journalSpec: {
      entries: [{ artefact_id: "C02.E1", title: "Your first explanation" }]
    }
  });
  assert.ok(baked.rewritten >= 1);

  const helpNode = {
    textContent: baked.html.match(
      /data-assessment-output-help="true"[^>]*>([\s\S]*?)<\//i
    )[1],
    attrs: Object.create(null),
    setAttribute(name, value) {
      this.attrs[name] = String(value);
    }
  };
  // Decode basic entities from static bake for textContent comparison.
  helpNode.textContent = helpNode.textContent
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  const root = {
    querySelectorAll(selector) {
      return selector === "[data-assessment-output-help]" ? [helpNode] : [];
    }
  };
  const runtime = artefact.applyContextualHandoffGuidance(root, {
    deliveryContext: "unified",
    commissionId: "C02",
    contract: {
      produces: [
        {
          artefactId: "C02.E1",
          commissionId: "C02",
          workspaceId: "assessment-constructed-E1"
        }
      ],
      references: [
        { artefactId: "C02.E1", commissionId: "C04", usage: "reference" }
      ]
    },
    journalSpec: {
      entries: [{ artefact_id: "C02.E1", title: "Your first explanation" }]
    }
  });
  assert.equal(runtime.ok, true);
  // Already accurate: runtime may skip rewrite count when text matches.
  assert.match(helpNode.textContent, /Learning Journal/i);
  assert.doesNotMatch(helpNode.textContent, /kept on this page only/i);
});

test("browser-like API without ToHtml still bakes via applyContextualHandoffGuidance", () => {
  const source = standaloneHelpHtml();
  const browserLikeApi = {
    applyContextualHandoffGuidance: artefact.applyContextualHandoffGuidance
    // intentionally omit applyContextualHandoffGuidanceToHtml
  };
  const baked = unifiedShell.bakeUnifiedRetentionHelpIntoHtml(
    source,
    {
      deliveryContext: "unified",
      commissionId: "C02",
      contract: {
        produces: [
          {
            artefactId: "C02.E1",
            commissionId: "C02",
            workspaceId: "assessment-constructed-E1"
          }
        ],
        references: [
          { artefactId: "C02.E1", commissionId: "C04", usage: "reference" }
        ]
      },
      journalSpec: {
        enabled: true,
        entries: [{ artefact_id: "C02.E1", title: "Your first explanation" }]
      }
    },
    browserLikeApi
  );
  assert.equal(baked.via, "applyContextualHandoffGuidance");
  assert.ok(baked.rewritten >= 1);
  assert.match(baked.html, /data-assessment-output-delivery="unified"/);
  assert.match(baked.html, /Learning Journal/i);
  assert.doesNotMatch(baked.html, /kept on this page only/i);
  assert.doesNotMatch(baked.html, /will not retrieve it automatically/i);
});

test("assembleLearningJourneyUnifiedShellPackage export path bakes static retention help", () => {
  const journey = journeyWithCommissions(["C02", "C05"]);
  journey.page.learning_journey.journal = {
    enabled: true,
    title: "Your Learning Journal",
    entries: [
      {
        entry_id: "initial_explanation",
        order: 1,
        title: "Your first explanation",
        framing: "Revisit your first explanation.",
        artefact_id: "C02.E1"
      },
      {
        entry_id: "revised_explanation",
        order: 2,
        title: "Your revised explanation",
        framing: "Revisit your revision.",
        artefact_id: "C05.E1"
      }
    ]
  };

  const wrapFullPage = (fragment) =>
    '<!DOCTYPE html><html><body data-persistence-page-key="page-key">' +
    fragment +
    "</body></html>";

  // Same package assembler app.js uses for unified Learning Journey download.
  const assembled = ljPackage.assembleLearningJourneyUnifiedShellPackage({
    page: journey.page,
    constituents: [
      {
        commissionId: "C02",
        title: "Write your first explanation",
        productId: "assessment_pack",
        learnerPackage: {
          html: wrapFullPage(
            standaloneHelpHtml(
              "Keep your original explanation unchanged for later diagnosis."
            )
          ),
          assets: []
        }
      },
      {
        commissionId: "C05",
        title: "Revise your explanation",
        productId: "assessment_pack",
        learnerPackage: {
          html: wrapFullPage(standaloneHelpHtml()),
          assets: []
        }
      }
    ],
    artefactContract: {
      produces: [
        {
          artefactId: "C02.E1",
          commissionId: "C02",
          workspaceId: "assessment-constructed-E1"
        },
        {
          artefactId: "C05.E1",
          commissionId: "C05",
          workspaceId: "assessment-constructed-E1"
        }
      ],
      references: [
        { artefactId: "C02.E1", commissionId: "C05", usage: "reference" }
      ]
    },
    fflate: fflate,
    runtimeScript: fs.readFileSync(
      path.join(__dirname, "..", "lib", "learner-renderer-vnext-browser.js"),
      "utf8"
    )
  });

  assert.equal(assembled.ok, true, assembled.error && assembled.error.message);
  const files = fflate.unzipSync(assembled.bytes);
  const indexHtml = Buffer.from(files["index.html"]).toString("utf8");

  const c02 = indexHtml.match(/<template id="lj-resource-C02">([\s\S]*?)<\/template>/i);
  const c05 = indexHtml.match(/<template id="lj-resource-C05">([\s\S]*?)<\/template>/i);
  assert.ok(c02, "C02 template missing");
  assert.ok(c05, "C05 template missing");

  assert.match(c02[1], /data-assessment-output-delivery="unified"/);
  assert.match(c02[1], /Learning Journal/i);
  assert.doesNotMatch(c02[1], /kept on this page only/i);
  assert.doesNotMatch(c02[1], /will not retrieve it automatically/i);
  assert.match(c02[1], /Keep your original explanation unchanged for later diagnosis/);

  assert.match(c05[1], /data-assessment-output-delivery="unified"/);
  assert.match(c05[1], /Learning Journal/i);
  assert.doesNotMatch(c05[1], /kept on this page only/i);

  assert.match(indexHtml, /C02\.E1/);
  assert.match(indexHtml, /C05\.E1/);
});
