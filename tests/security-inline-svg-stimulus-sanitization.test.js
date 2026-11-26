const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const svgSecurity = require(path.join(root, "lib", "svg-stimulus-security.js"));
const visualAssets = require(path.join(root, "lib", "prism-visual-assets.js"));
const assessmentInteractive = require(
  path.join(root, "lib", "learner-renderer-vnext", "assessment-interactive.js")
);
const { renderLearnerPageHtml } = require(
  path.join(root, "lib", "learner-renderer-vnext", "render-learner-page.js")
);
const assessmentPackPublish = require(path.join(root, "lib", "assessment-pack-publish.js"));

const MALICIOUS_AND_MALFORMED_SVGS = [
  ["uppercase <SCRIPT>", '<svg xmlns="http://www.w3.org/2000/svg"><SCRIPT>alert(1)</SCRIPT></svg>'],
  ["onload event handler", '<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"><rect width="10" height="10"/></svg>'],
  ["nested onerror handler", '<svg xmlns="http://www.w3.org/2000/svg"><rect onerror="alert(1)" width="10" height="10"/></svg>'],
  ["foreignObject element", '<svg xmlns="http://www.w3.org/2000/svg"><foreignObject><body><img src=x onerror=alert(1)></body></foreignObject></svg>'],
  ["anchor with javascript URI", '<svg xmlns="http://www.w3.org/2000/svg"><a href="javascript:alert(1)"><rect width="10" height="10"/></a></svg>'],
  ["external image href", '<svg xmlns="http://www.w3.org/2000/svg"><image href="https://evil.example/a.png" width="10" height="10"/></svg>'],
  ["external url() in fill", '<svg xmlns="http://www.w3.org/2000/svg"><rect fill="url(https://evil.example/x#g)" width="10" height="10"/></svg>'],
  ["entity-encoded javascript URI", '<svg xmlns="http://www.w3.org/2000/svg"><rect fill="&#106;&#97;vascript:alert(1)" width="10" height="10"/></svg>'],
  ["figure breakout after </svg>", '<svg xmlns="http://www.w3.org/2000/svg"><rect width="10" height="10"/></svg></figure><img src=x onerror=alert(1)>'],
  ["leading HTML before <svg>", '<img src=x onerror=alert(1)><svg xmlns="http://www.w3.org/2000/svg"></svg>'],
  ["DOCTYPE / XXE declaration", '<!DOCTYPE svg [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><svg xmlns="http://www.w3.org/2000/svg"><text>&xxe;</text></svg>'],
  ["inline <style> element", '<svg xmlns="http://www.w3.org/2000/svg"><style>@import url(https://evil.example/x.css);</style></svg>'],
  ["SMIL <animate> element", '<svg xmlns="http://www.w3.org/2000/svg"><animate attributeName="x" onbegin="alert(1)"/></svg>'],
  ["nested <svg> element", '<svg xmlns="http://www.w3.org/2000/svg"><svg><rect width="5" height="5"/></svg></svg>'],
  ["invalid xmlns", '<svg xmlns="http://www.w3.org/1999/xhtml"><rect width="10" height="10"/></svg>'],
  ["unquoted attribute", '<svg xmlns="http://www.w3.org/2000/svg"><rect width=10 height="10"/></svg>'],
  ["mismatched closing tag", '<svg xmlns="http://www.w3.org/2000/svg"><g><rect width="10" height="10"/></svg></g>'],
  ["unclosed tag", '<svg xmlns="http://www.w3.org/2000/svg"><rect width="10" height="10"']
];

test("validateSafeInlineSvgStimulus and PRISM_VISUAL_ASSETS reject all active, external, breakout, and malformed SVG payloads", () => {
  for (const [label, payload] of MALICIOUS_AND_MALFORMED_SVGS) {
    const direct = svgSecurity.validateSafeInlineSvgStimulus(payload);
    assert.equal(direct.ok, false, `Expected direct validator to reject: ${label}`);
    assert.equal(direct.code, "unsafe_svg_stimulus");

    const viaAssets = visualAssets.validateSafeInlineSvgStimulus(payload);
    assert.equal(viaAssets.ok, false, `Expected PRISM_VISUAL_ASSETS to reject: ${label}`);
  }
});

test("renderAssessmentItem defense-in-depth fails closed on unsafe inline SVG stimulus", () => {
  for (const [label, payload] of MALICIOUS_AND_MALFORMED_SVGS) {
    const html = assessmentInteractive.renderAssessmentItem(
      {
        id: "q1",
        type: "short_response",
        stem: "Inspect the chart.",
        representation: {
          component_id: "q1",
          media: { format: "svg", markup: payload },
          alt_text: "Chart"
        }
      },
      0
    );
    assert.equal(
      html.indexOf("data-assessment-stimulus"),
      -1,
      `Unsafe SVG must not render stimulus figure (${label})`
    );
    assert.equal(html.indexOf("alert(1)"), -1, `XSS payload must never appear in HTML (${label})`);
    assert.equal(html.indexOf("evil.example"), -1, `External URL must never appear in HTML (${label})`);
  }
});

test("renderLearnerPageHtml fails closed with explicit unsafe_svg_stimulus diagnostic across Canonical Assessment Pack and Activity pages", () => {
  const maliciousSvg = '<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"><rect width="10" height="10"/></svg>';

  // 1. Canonical Assessment Pack determinate item path
  const canonicalApPage = {
    artifact_type: "page",
    schema_version: "2.0.0",
    product_id: "assessment_pack",
    page_kind: "assessment",
    title: "Unsafe SVG AP Check",
    activities: [],
    assessment_evidence: {
      purpose: {
        role: "R1",
        visibility_claim: "Check understanding.",
        stop_rationale: "Short check.",
        forward_intent: "Inform next step."
      },
      learner_context: { depends_on_prior_work: false },
      elicitations: [
        {
          elicitation_id: "e1",
          order: 1,
          evidence_ask: "Read the chart.",
          epistemic_class: "determinate",
          delivery: {
            kind: "auto_checkable_items",
            items: [
              {
                item_id: "q1",
                order: 1,
                form: "single_answer_mcq",
                prompt: {
                  stem: "Which bar is tallest?",
                  options: [
                    { key: "A", text: "Alpha" },
                    { key: "B", text: "Beta" }
                  ]
                },
                judgement: { correct_answer: "A", auto_checkable: true },
                representation: {
                  component_id: "q1",
                  media: { format: "svg", markup: maliciousSvg },
                  alt_text: "Bar chart"
                }
              }
            ]
          },
          formative_return: {
            materials: [{ material_id: "m1", body: "Alpha is tallest." }],
            forward_orientation: "Continue to the next section."
          }
        }
      ],
      pack_forward_orientation: "Continue to the next section."
    }
  };

  const apRes = renderLearnerPageHtml(canonicalApPage);
  assert.equal(apRes.html, null, "Canonical AP page with unsafe inline SVG must fail closed");
  assert.match(String(apRes.error || ""), /event handler|not permitted|allowlist/i);
  assert.ok(
    Array.isArray(apRes.modelResult && apRes.modelResult.diagnostics) &&
      apRes.modelResult.diagnostics.some((d) => d.code === "unsafe_svg_stimulus"),
    "Expected explicit unsafe_svg_stimulus diagnostic"
  );

  // 2. Activity-based page (Practice / Interactive / Legacy)
  const activityPage = {
    artifact_type: "page",
    schema_version: "2.0.0",
    title: "Unsafe SVG Activity Page",
    activities: [
      {
        activity_id: "a1",
        title: "Check",
        assessment_items: [
          {
            id: "i1",
            type: "short_response",
            stem: "Explain the figure.",
            representation: {
              component_id: "i1",
              media: { format: "svg", markup: maliciousSvg },
              alt_text: "Figure"
            }
          }
        ]
      }
    ]
  };

  const actRes = renderLearnerPageHtml(activityPage);
  assert.equal(actRes.html, null, "Activity page with unsafe inline SVG must fail closed");
  assert.match(String(actRes.error || ""), /activities\[0\]\.assessment_items\[0\]\.representation\.media/);
  assert.ok(
    Array.isArray(actRes.modelResult && actRes.modelResult.diagnostics) &&
      actRes.modelResult.diagnostics.some((d) => d.code === "unsafe_svg_stimulus")
  );
});

test("Benign deterministic legacy Assessment Pack bar-chart SVG passes validation and renders cleanly", () => {
  const published = assessmentPackPublish.resolveAssessmentPackPublishPage({
    designPage: {
      artifact_type: "page",
      schema_version: "2.0.0",
      title: "Legacy Bar Chart Check",
      framing: "Inspect the bar chart and answer the question.",
      activities: []
    },
    assessmentPack: {
      schema_version: "1.0.0",
      artifact_type: "assessment_pack",
      components: [
        {
          id: "bar_1",
          form: "short_constructed_response",
          prompt: "Which region recorded the highest output?",
          representation: {
            required: true,
            kind: "data_figure",
            alt_text: "Regional output bar chart",
            authoritative_data: {
              unit: "units",
              points: [
                { label: "North", value: 12 },
                { label: "South", value: 24 }
              ]
            }
          },
          model_answer: "South"
        }
      ]
    }
  });
  assert.equal(published.ok, true, published.message);
  const item = published.page.assessment_check.items[0];
  assert.equal(item.representation.media.format, "svg");

  const svgCheck = svgSecurity.validateSafeInlineSvgStimulus(item.representation.media.markup);
  assert.equal(svgCheck.ok, true, svgCheck.message);

  const rendered = renderLearnerPageHtml(published.page);
  assert.ok(!rendered.error, `Expected benign legacy bar-chart SVG to render cleanly: ${rendered.error}`);
  assert.ok(rendered.html, "Expected rendered HTML");
  assert.match(rendered.html, /data-assessment-stimulus="bar_1"/);
  assert.match(rendered.html, /<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
  assert.match(rendered.html, /Regional output bar chart/);

  // Tampering with legacy assessment_check item SVG MUST fail closed with explicit diagnostic
  const tampered = JSON.parse(JSON.stringify(published.page));
  tampered.assessment_check.items[0].representation.media.markup =
    '<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"><rect width="10" height="10"/></svg>';
  const tamperedRender = renderLearnerPageHtml(tampered);
  assert.equal(tamperedRender.html, null);
  assert.match(String(tamperedRender.error || ""), /assessment_check\.items\[0\]\.representation\.media/);
});
