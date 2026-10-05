/**
 * Sprint 51 pedagogic salience — PB-S-007 smoke.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  loadUtilityPageRenderTestApi,
  renderPageHtml
} = require("./utility-page-render-test-harness.js");

const { api } = loadUtilityPageRenderTestApi();

test("Sprint 51: inline pedagogic salience page renders without error", () => {
  const page = {
    artifact_type: "page",
    title: "Salience smoke",
    page_profile: "learner",
    sections: [
      {
        section_id: "learning_activities",
        heading: "Learning activities",
        content: [
          {
            activity_id: "A1",
            title: "Pedagogic salience fixture",
            learner_task: "Complete the task using the salient cues.",
            pedagogic_salience: { emphasis: "Focus on mechanism, not memorisation." }
          }
        ]
      }
    ]
  };
  const html = renderPageHtml(api, page);
  assert.match(html, /util-page-export--vnext/);
  assert.match(html, /Pedagogic salience fixture/i);
  assert.doesNotMatch(html, /\[object Object\]/i);
});
