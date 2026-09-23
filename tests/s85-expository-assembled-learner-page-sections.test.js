/**
 * Sprint 85 — Expository assemble→learner-page vertical slice with XD exposition.
 *
 * XD owns explanation_intent (authorial rationale) and exposition (learner-facing
 * prose). Assembly merges exposition; the learner model/renderer uses exposition
 * only — never explanation_intent as fallback prose.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const assemble = require("../lib/page-vnext-assemble.js");
const contracts = require("../lib/expository-contracts.js");
const { buildPageModel } = require("../lib/learner-renderer-vnext/build-page-model.js");
const {
  renderLearnerPageHtml
} = require("../lib/learner-renderer-vnext/render-learner-page.js");

const repoRoot = path.resolve(__dirname, "..");
const fixturesDir = path.join(repoRoot, "tests", "fixtures");

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(fixturesDir, name), "utf8"));
}

function loadLiveExpositoryPartials() {
  const ejp = readJson("s85-expository-live-ejp.json");
  const xd = readJson("s85-expository-live-xd.json");
  const xm = readJson("s85-expository-live-xm.json");
  const dpRaw = readJson("s85-expository-dp-raw-paste.json");
  const design_page = Object.assign({}, dpRaw, {
    artifact_type: "page",
    schema_version: "2.0.0"
  });
  return { ejp, xd, xm, design_page };
}

function assembleLiveExpositoryPage() {
  const { ejp, xd, xm, design_page } = loadLiveExpositoryPartials();
  return assemble.assembleVNextPageFromPartials({
    expository_journey_plan: ejp,
    expository_development: xd,
    expository_materials: xm,
    design_page
  });
}

function extractSectionHtml(pageHtml, sectionId) {
  const parts = pageHtml.split('<section class="util-exposition-section"');
  for (let i = 1; i < parts.length; i += 1) {
    const chunk = '<section class="util-exposition-section"' + parts[i];
    const end = chunk.indexOf("</section>");
    const block = end >= 0 ? chunk.slice(0, end + "</section>".length) : chunk;
    if (
      block.includes('data-section-id="' + sectionId + '"') &&
      block.includes('data-region-item="exposition-section"')
    ) {
      return block;
    }
  }
  return "";
}

test("pre-assembly live artefacts carry six sections, XD intents+exposition, three XM bodies, DP VAs", () => {
  const { ejp, xd, xm, design_page } = loadLiveExpositoryPartials();

  assert.equal(ejp.artifact_type, "expository_journey_plan");
  assert.equal(ejp.sections.length, 6);
  assert.deepEqual(
    ejp.sections.map((s) => s.section_id),
    ["S1", "S2", "S3", "S4", "S5", "S6"]
  );

  assert.equal(xd.artifact_type, "expository_development");
  assert.equal(xd.sections.length, 6);
  assert.ok(xd.sections.every((s) => String(s.explanation_intent || "").trim()));
  assert.ok(xd.sections.every((s) => String(s.exposition || "").trim()));
  assert.equal(
    contracts.validateExpositoryArtefactShape(xd, "expository_development").ok,
    true
  );
  assert.equal(
    xd.sections.reduce((n, s) => n + (s.materials_commission || []).length, 0),
    3
  );

  assert.equal(xm.artifact_type, "expository_materials");
  assert.equal(xm.materials.length, 3);
  assert.ok(xm.materials.every((m) => String(m.body || "").includes("LIVE-XM-")));

  assert.equal(design_page.assembly_state.current_stage, "design_page");
  assert.ok(design_page.page_synthesis.overview);
  assert.equal(design_page.visual_affordances.length, 2);
  assert.equal(design_page.visual_affordances[0].section_id, "S2");
  assert.equal(design_page.visual_affordances[1].section_id, "S6");
});

test("deterministic assembly retains exposition, XM materials, and section VAs", () => {
  const result = assembleLiveExpositoryPage();

  assert.equal(result.ok, true);
  assert.equal(result.mode, "expository");
  assert.equal(result.page.activities.length, 0);
  assert.equal(result.page.sections.length, 6);
  assert.equal(result.page.sections[0].title, "What formative assessment is for");
  assert.match(result.page.sections[1].explanation_intent, /intended learning/i);
  assert.match(result.page.sections[1].exposition, /recurring relationship among four elements/i);
  assert.equal(result.page.sections[1].materials.length, 1);
  assert.match(result.page.sections[1].materials[0].body, /LIVE-XM-S2/);
  assert.equal(result.page.sections[3].materials[0].material_id, "mat-S4-criteria");
  assert.equal(result.page.sections[5].materials[0].material_id, "mat-S6-synthesis");
  assert.equal(result.page.visual_affordances.length, 2);
  assert.equal(result.page.visual_affordances[0].section_id, "S2");
});

test("assembled learner HTML uses exposition, not explanation_intent authorial directives", () => {
  const assembled = assembleLiveExpositoryPage();
  assert.equal(assembled.ok, true);

  const modelResult = buildPageModel(assembled.page);
  assert.equal(modelResult.ok, true, JSON.stringify(modelResult.errors || []));
  assert.equal(modelResult.model.expositionSections.length, 6);
  assert.equal(modelResult.model.activities.length, 0);

  modelResult.model.expositionSections.forEach((section, index) => {
    const source = assembled.page.sections[index];
    assert.equal(section.explanation, source.exposition);
    assert.notEqual(section.explanation, source.explanation_intent);
    assert.doesNotMatch(section.explanation, /^(Open by|Establish|Show that|Develop|Extend|Return to)\b/i);
  });

  const rendered = renderLearnerPageHtml(assembled.page);
  assert.equal(rendered.error, null, rendered.error || "");
  const html = String(rendered.html || "");

  assert.match(html, /data-region="exposition"/);
  assert.doesNotMatch(html, /data-region="orientation"/);
  assert.doesNotMatch(html, /data-orientation-type="overview"/);
  assert.doesNotMatch(html, /Learning purpose/i);
  assert.doesNotMatch(html, /Knowledge summary/i);
  assert.doesNotMatch(html, /data-region="page-closing"/);
  assert.doesNotMatch(html, /data-region="activities"/);
  assert.doesNotMatch(html, /data-workspace-kind=/);
  assert.doesNotMatch(html, /data-guided-review=/);

  const expositionIdx = html.indexOf('data-region="exposition"');
  assert.ok(expositionIdx >= 0);

  let cursor = expositionIdx;
  for (const section of assembled.page.sections) {
    const titleIdx = html.indexOf(section.title, cursor);
    assert.ok(titleIdx > cursor, "missing ordered title " + section.section_id);
    cursor = titleIdx + section.title.length;

    const expositionNeedle = section.exposition.slice(0, 48);
    assert.ok(
      html.includes(expositionNeedle),
      "missing exposition for " + section.section_id
    );

    // Authorial explanation_intent directives must not be the principal learner text.
    const intentNeedle = section.explanation_intent.slice(0, 40);
    if (/^(Open by|Establish|Show that|Develop|Extend|Return to)/i.test(section.explanation_intent)) {
      assert.ok(
        !html.includes(intentNeedle),
        "authorial explanation_intent leaked into HTML for " + section.section_id
      );
    }
  }

  for (const marker of ["LIVE-XM-S2", "LIVE-XM-S4", "LIVE-XM-S6"]) {
    assert.ok(html.includes(marker), "missing XM body " + marker);
  }

  const s2 = extractSectionHtml(html, "S2");
  const s4 = extractSectionHtml(html, "S4");
  const s6 = extractSectionHtml(html, "S6");
  assert.ok(s2.includes("LIVE-XM-S2"));
  assert.ok(s4.includes("LIVE-XM-S4"));
  assert.ok(s6.includes("LIVE-XM-S6"));
  assert.ok(!s2.includes("LIVE-XM-S4") && !s2.includes("LIVE-XM-S6"));
});

test("section-scoped visual affordances resolve only to matching sections", () => {
  const assembled = assembleLiveExpositoryPage();
  const modelResult = buildPageModel(assembled.page);
  assert.equal(modelResult.ok, true);
  const byId = Object.create(null);
  modelResult.model.expositionSections.forEach((section) => {
    byId[section.id] = section;
  });

  assert.equal(byId.S2.visualAffordanceAfterContent.sectionId, "S2");
  assert.equal(byId.S2.visualAffordanceAfterContent.affordanceId, "va-S2-evidence-action-01");
  assert.equal(byId.S6.visualAffordanceAfterContent.sectionId, "S6");
  assert.equal(byId.S6.visualAffordanceAfterContent.affordanceId, "va-S6-synthesis-01");
  assert.equal(byId.S1.visualAffordanceAfterContent, null);

  const html = String(renderLearnerPageHtml(assembled.page).html || "");
  const s2 = extractSectionHtml(html, "S2");
  const s6 = extractSectionHtml(html, "S6");
  assert.match(s2, /data-affordance-id="va-S2-evidence-action-01"/);
  assert.doesNotMatch(s2, /va-S6-synthesis-01/);
  assert.match(s6, /data-affordance-id="va-S6-synthesis-01"/);
  assert.doesNotMatch(s6, /va-S2-evidence-action-01/);
});

test("Interactive fixture without page.sections keeps unchanged learner model/render shape", () => {
  const interactive = readJson("page-render/roman-roads-page.json");
  assert.ok(!Array.isArray(interactive.sections) || interactive.sections.length === 0);

  const modelResult = buildPageModel(interactive);
  assert.equal(modelResult.ok, true, JSON.stringify(modelResult.errors || []));
  assert.deepEqual(modelResult.model.expositionSections, []);
  assert.ok(modelResult.model.activities.length >= 1);

  const rendered = renderLearnerPageHtml(interactive);
  assert.equal(rendered.error, null, rendered.error || "");
  const html = String(rendered.html || "");
  assert.doesNotMatch(html, /data-region="exposition"/);
  assert.match(html, /data-region="activities"/);
  assert.match(html, /Origins and Expansion of the Roman Road Network/);
});

test("legacy XD without exposition fails capture/assembly clearly", () => {
  const incomplete = {
    artifact_type: "expository_development",
    schema_version: "1.0.0",
    sections: [
      {
        section_id: "S1",
        explanation_intent: "Open by contrasting purpose with instruments."
      }
    ]
  };
  const check = contracts.validateExpositoryArtefactShape(incomplete, "expository_development");
  assert.equal(check.ok, false);
  assert.ok(check.errors.some((e) => /exposition required/i.test(String(e))));

  const ejp = readJson("s85-expository-live-ejp.json");
  assert.throws(() => {
    assemble.assembleVNextPageFromPartials({
      expository_journey_plan: ejp,
      expository_development: incomplete
    });
  }, /exposition required/i);
});
