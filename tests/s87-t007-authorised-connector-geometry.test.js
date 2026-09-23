/**
 * S87-T-007 final refinement — authorised semantic connectors in image briefs.
 *
 * Failure shape: elements ordered [A,B,C,D] with semantic edges A→C and B→D
 * must not be commissioned as index-zip A→B / C→D merely from positional order.
 */

const test = require("node:test");
const assert = require("node:assert/strict");

const compiler = require("../lib/prism-image-brief-compiler.js");
const workspace = require("../lib/utilities-visual-jobs-workspace.js");

const STRUCTURED_BODY = {
  title: "Natural frequencies correspondence",
  elements: [
    { id: "condition_absent", label: "Condition absent" },
    { id: "prior", label: "Prior probability" },
    { id: "false_positives", label: "False positives" },
    { id: "likelihood", label: "Likelihood" },
    { id: "total_positive", label: "Total positive results" },
    { id: "fpr", label: "False-positive rate" }
  ],
  relationships: [
    {
      from: "condition_absent",
      to: "false_positives",
      meaning: "yields false positives in the frequency table"
    },
    {
      from: "false_positives",
      to: "total_positive",
      meaning: "contribute to total positive results"
    },
    {
      from: "prior",
      to: "likelihood",
      meaning: "combines with likelihood in the update"
    }
  ]
};

const WRONG_INDEX_EDGES = [
  "Condition absent → Prior probability",
  "False positives → Likelihood",
  "Total positive results → False-positive rate"
];

const CORRECT_EDGES = [
  "Condition absent → False positives",
  "False positives → Total positive results",
  "Prior probability → Likelihood"
];

test("extractAuthorisedSemanticEdges resolves ids to labels; ignores index pairing", () => {
  const edges = compiler.extractAuthorisedSemanticEdges(
    [
      {
        anchor: "S5.materials.correspondence",
        content_structured: STRUCTURED_BODY,
        content_text: JSON.stringify(STRUCTURED_BODY)
      }
    ],
    []
  );
  const lines = compiler.formatAuthorisedSemanticEdgeLines(edges);
  CORRECT_EDGES.forEach((edge) => {
    assert.ok(
      lines.some((line) => line.indexOf(edge) === 0 || line.indexOf(edge + " (") === 0),
      "missing authorised edge: " + edge + " in " + JSON.stringify(lines)
    );
  });
  WRONG_INDEX_EDGES.forEach((edge) => {
    assert.ok(
      !lines.some((line) => line.indexOf(edge) === 0),
      "must not invent positional edge: " + edge
    );
  });
});

test("human Relationships section projects authorised edges and forbids positional invention", () => {
  const brief = {
    purpose: "mechanism",
    preferred_representation: "concept_map",
    pedagogical_metadata: { reasoning_supported: "See authorised correspondences." },
    content_requirements: {
      authored: [
        "Condition absent",
        "Prior probability",
        "False positives",
        "Likelihood",
        "Total positive results",
        "False-positive rate"
      ]
    },
    source_evidence: [
      {
        anchor: "S5.materials.correspondence",
        content_structured: STRUCTURED_BODY,
        content_text: JSON.stringify(STRUCTURED_BODY)
      }
    ],
    exclusion_requirements: { authored_must_not_show: [] },
    claim_constraints: { allowed: [], disallowed: [] }
  };
  const prompt = workspace.buildVisualJobHumanPrompt(brief);
  assert.match(prompt, /Relationships:/);
  assert.match(prompt, /Condition absent → False positives/);
  assert.match(prompt, /False positives → Total positive results/);
  assert.match(prompt, /Prior probability → Likelihood/);
  assert.match(prompt, /Connect ONLY the authorised from→to pairs/i);
  assert.match(prompt, /column\/row order|spatial adjacency|index pairing/i);
  WRONG_INDEX_EDGES.forEach((edge) => {
    assert.doesNotMatch(prompt, new RegExp(edge.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  });
});

test("canonical authorised-connectors block projects semantic edges before truncation risk", () => {
  const block = compiler.formatAuthorisedConnectorsBlock(
    [
      {
        content_structured: STRUCTURED_BODY,
        content_text: JSON.stringify(STRUCTURED_BODY)
      }
    ],
    STRUCTURED_BODY.elements.map((el) => el.label)
  );
  assert.match(block, /Authorised|Connect ONLY the authorised/i);
  assert.match(block, /Condition absent → False positives/);
  assert.match(block, /Prior probability → Likelihood/);
  assert.doesNotMatch(block, /Condition absent → Prior probability/);
  assert.doesNotMatch(block, /False positives → Likelihood/);
  assert.doesNotMatch(block, /Total positive results → False-positive rate/);
});

test("must_show A → B phrases are treated as authorised edges", () => {
  const edges = compiler.extractAuthorisedSemanticEdges(
    [],
    [
      "Condition absent → False positives",
      "Prior probability → Likelihood",
      "Total positive results" // bare entity — not an edge
    ]
  );
  const lines = compiler.formatAuthorisedSemanticEdgeLines(edges);
  assert.deepEqual(lines, [
    "Condition absent → False positives",
    "Prior probability → Likelihood"
  ]);
});
