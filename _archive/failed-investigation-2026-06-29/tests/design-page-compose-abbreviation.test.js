/**
 * Design Page compose — abbreviated/truncated material body rejection (prompt + self-check).
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const compose = require("../lib/ld-design-page-compose-contract.js");
const fidelity = require("../lib/design-page-materials-fidelity.js");

const abbreviatedFixturePath = path.join(
  __dirname,
  "fixtures",
  "design-page-compose",
  "rna-abbreviated-materials-page.json"
);

const FULL_M4 =
  "### Key RNA Genome Types\n\n" +
  "RNA viruses differ fundamentally in how their genomes relate to protein production. " +
  "Positive-sense RNA can be translated directly by host ribosomes. Negative-sense RNA requires an RNA-dependent RNA polymerase to produce mRNA. " +
  "Retroviruses reverse-transcribe RNA into DNA before integration. Double-stranded RNA viruses package polymerase in the virion.";

const FULL_M6 =
  "### Evaluation checklist\n\n" +
  "- [ ] I classified each genome type using the table criteria.\n" +
  "- [ ] I cited replication steps for positive- and negative-sense viruses.\n" +
  "- [ ] I explained why HCV requires a host microRNA for stability.";

const FULL_M7 =
  "### Worked Example: Applying the Replication Cycle\n\n" +
  "1. Attachment and entry via receptor-mediated endocytosis.\n" +
  "2. Uncoating releases genomic RNA into the cytoplasm.\n" +
  "3. Translation produces replicase and structural proteins.\n" +
  "4. Replication generates complementary RNA strands.\n" +
  "5. Assembly and budding release new virions.";

const upstreamByActivity = {
  A2: [
    { material_id: "M4", type: "text", content: FULL_M4 },
    { material_id: "M6", type: "checklist", content: FULL_M6 },
    { material_id: "M7", type: "worked_example", content: FULL_M7 }
  ]
};

test("LD-DESIGN-PAGE-COMPOSE-CONTRACT: no abbreviated inlined bodies rule in prompt", () => {
  const text = compose.buildLdDesignPageComposePromptBlock();
  assert.match(text, /NO ABBREVIATED INLINED BODIES \(hard\)/i);
  assert.match(text, /trailing ellipsis/i);
  assert.match(text, /\[truncated\].*\[continued\].*\[content omitted\]/i);
  assert.match(text, /Use this to evaluate your table: \.\.\./i);
  assert.match(text, /Worked Example: Applying the Replication Cycle\.\.\./i);
  assert.match(text, /Normal punctuation inside complete authored prose is allowed/i);
});

test("LD-DESIGN-PAGE-COMPOSE-CONTRACT: pre-return self-check in prompt", () => {
  const text = compose.buildLdDesignPageComposePromptBlock();
  assert.match(text, /PRE-RETURN SELF-CHECK/i);
  assert.match(text, /resolves to a full body inside this artefact/i);
  assert.match(text, /do not emit a partial learner page/i);
  assert.match(text, /defective_material_ids/i);
  assert.match(text, /inline_material_body_defect/i);
});

test("abbreviation detector flags observed RNA defect bodies", () => {
  assert.equal(
    fidelity.materialBodyLooksAbbreviated(
      "### Key RNA Genome Types\n\nRNA viruses differ fundamentally in how their genomes relate to protein production..."
    ),
    true
  );
  assert.equal(fidelity.materialBodyLooksAbbreviated("Use this to evaluate your table: ..."), true);
  assert.equal(
    fidelity.materialBodyLooksAbbreviated("### Worked Example: Applying the Replication Cycle..."),
    true
  );
});

test("abbreviation detector accepts legitimate full prose punctuation", () => {
  const fullProse =
    "RNA viruses may be positive-sense, negative-sense, or double-stranded. " +
    "Learners should compare replication strategies, e.g. direct translation versus transcription-first pathways, " +
    "and justify classifications using evidence from the table and scenarios.";
  assert.equal(fidelity.materialBodyLooksAbbreviated(fullProse), false);
  assert.equal(fidelity.materialBodyLooksAbbreviated(FULL_M4), false);
  assert.equal(fidelity.materialBodyLooksAbbreviated(FULL_M6), false);
  assert.equal(fidelity.materialBodyLooksAbbreviated(FULL_M7), false);
  assert.equal(
    fidelity.materialBodyIncompleteRelativeToUpstream(FULL_M4, FULL_M4),
    false
  );
});

test("validateDesignPageComposeMaterialBodies rejects abbreviated page fixture", () => {
  const page = JSON.parse(fs.readFileSync(abbreviatedFixturePath, "utf8"));
  const result = compose.validateDesignPageComposeMaterialBodies(page, upstreamByActivity);
  assert.equal(result.ok, false);
  assert.ok(Array.isArray(result.issues));
  const ids = result.issues.map((issue) => issue.material_id).sort();
  assert.deepEqual(ids, ["M4", "M6", "M7"]);
  assert.equal(result.failure.artifact_type, "page_generation_failure");
  assert.equal(result.failure.reason, "inline_material_body_defect");
  assert.ok(result.failure.details);
  assert.equal(result.failure.details.defective_material_ids.length, 3);
});

test("validateDesignPageComposeMaterialBodies accepts full upstream-equivalent bodies", () => {
  const page = {
    artifact_type: "page",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning activities",
        content: [
          {
            activity_id: "A2",
            materials: {
              M4: { material_id: "M4", type: "text", content: FULL_M4 },
              M6: { material_id: "M6", type: "checklist", content: FULL_M6 },
              M7: { material_id: "M7", type: "worked_example", content: FULL_M7 }
            }
          }
        ]
      }
    ]
  };
  const result = compose.validateDesignPageComposeMaterialBodies(page, upstreamByActivity);
  assert.equal(result.ok, true);
  assert.equal(result.issues.length, 0);
});

test("validateDesignPageComposeMaterialBodies rejects abbreviated bodies in material_bank via content_ref", () => {
  const page = {
    artifact_type: "page",
    material_bank: {
      A2: {
        M7: {
          material_id: "M7",
          type: "worked_example",
          content: "### Worked Example: Applying the Replication Cycle..."
        }
      }
    },
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning activities",
        content: [
          {
            activity_id: "A2",
            materials: {
              M7: {
                material_id: "M7",
                type: "worked_example",
                content_ref: "material_bank.A2.M7"
              }
            }
          }
        ]
      }
    ]
  };
  const result = compose.validateDesignPageComposeMaterialBodies(page, {
    A2: [{ material_id: "M7", type: "worked_example", content: FULL_M7 }]
  });
  assert.equal(result.ok, false);
  assert.equal(result.failure.reason, "inline_material_body_defect");
  assert.equal(result.issues[0].material_id, "M7");
});

test("buildPageGenerationFailureForTruncatedMaterials uses inline_material_body_defect reason", () => {
  const failure = compose.buildPageGenerationFailureForTruncatedMaterials(
    [{ activity_id: "A2", material_id: "M4", defect: "abbreviated" }],
    "ellipsis truncation detected"
  );
  assert.equal(failure.artifact_type, "page_generation_failure");
  assert.equal(failure.reason, "inline_material_body_defect");
  assert.equal(failure.details.defective_material_ids[0].material_id, "M4");
  assert.match(failure.details.explanation, /ellipsis truncation detected/i);
});
