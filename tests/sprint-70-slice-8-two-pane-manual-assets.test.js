const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const workspace = require("../lib/utilities-visual-jobs-workspace.js");
const visualAssets = require("../lib/prism-visual-assets.js");
const renderHook = require("../lib/learner-renderer-vnext/render-visual-affordance.js");

const romanRoadsPath = path.join(
  __dirname,
  "fixtures",
  "page-assemble",
  "roman-roads-visual-jobs-valid.json"
);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

const page = JSON.parse(fs.readFileSync(romanRoadsPath, "utf8"));


test("Slice 8: successful visual-jobs state uses two-pane workspace", () => {
  const ws = workspace.buildVisualJobsWorkspaceState(page, { activeView: "visual_jobs" });
  const html = workspace.renderVisualJobsWorkspaceHtml(ws);
  assert.match(html, /util-vj-two-pane/);
  assert.match(html, /Images to create/);
  assert.match(html, /Selected image job/);
  assert.match(html, /data-brief-select-id=/);
  assert.match(html, /data-image-dropzone-brief-id=/);
});

test("Slice 8: first visual job is selected by default", () => {
  const ws = workspace.buildVisualJobsWorkspaceState(page, { activeView: "visual_jobs" });
  const ordered = workspace.buildVisualJobsOrderedList(ws);
  assert.equal(ws.selectedBriefId, ordered[0].brief_id);
  const vm = workspace.buildVisualJobsWorkspaceViewModel(ws);
  assert.equal(vm.selectedBriefId, ordered[0].brief_id);
});

test("Slice 8: selecting a visual job updates selected pane model", () => {
  const ws = workspace.buildVisualJobsWorkspaceState(page, { activeView: "visual_jobs" });
  const ordered = workspace.buildVisualJobsOrderedList(ws);
  workspace.selectVisualJob(ws, ordered[1].brief_id);
  const vm = workspace.buildVisualJobsWorkspaceViewModel(ws);
  assert.equal(vm.selectedBriefId, ordered[1].brief_id);
  assert.equal(vm.selectedBrief.brief_id, ordered[1].brief_id);
});

test("Slice 8: prompt visibility toggles per selected brief", () => {
  const ws = workspace.buildVisualJobsWorkspaceState(page, { activeView: "visual_jobs" });
  const id = ws.selectedBriefId;
  let html = workspace.renderVisualJobsWorkspaceHtml(ws);
  assert.doesNotMatch(html, /Hide Prompt/);
  workspace.toggleVisualJobPromptVisibility(ws, id);
  html = workspace.renderVisualJobsWorkspaceHtml(ws);
  assert.match(html, /Hide Prompt/);
  assert.match(html, /util-vj-human-prompt/);
});

test("Slice 8: image validation accepts png/jpeg/webp and rejects unsupported", () => {
  const ok = workspace.validateVisualImageInput({
    filename: "a.png",
    mime_type: "image/png",
    byte_size: 100,
    width: 10,
    height: 20,
    render_source: { kind: "object_url", value: "blob:test" }
  });
  assert.equal(ok.ok, true);
  const bad = workspace.validateVisualImageInput({
    filename: "a.svg",
    mime_type: "image/svg+xml",
    byte_size: 100,
    width: 10,
    height: 20,
    render_source: { kind: "object_url", value: "blob:test" }
  });
  assert.equal(bad.ok, false);
  assert.equal(bad.code, "unsupported_mime_type");
});

test("Slice 8: attach image creates deterministic asset association + status", () => {
  const ws = workspace.buildVisualJobsWorkspaceState(page, { activeView: "visual_jobs" });
  const brief = workspace.buildVisualJobsOrderedList(ws)[0];
  const before = clone(brief);
  const attached = workspace.attachVisualAssetToWorkspace(
    ws,
    brief.brief_id,
    {
      filename: "roman-roads-a1.png",
      mime_type: "image/png",
      byte_size: 12345,
      width: 800,
      height: 600,
      render_source: { kind: "object_url", value: "blob:demo-a1" }
    },
    { intakeMethod: "drag" }
  );
  assert.equal(attached.ok, true);
  assert.equal(attached.asset.brief_id, brief.brief_id);
  assert.equal(attached.asset.job_id, brief.job_id);
  assert.equal(attached.asset.affordance_id, brief.affordance_id);
  assert.equal(attached.asset.visual_slot, brief.visual_slot);
  assert.equal(attached.asset.intake_method, "drag");
  assert.match(attached.asset.asset_id, new RegExp("^asset-" + brief.brief_id.replace(/[^a-z0-9]+/gi, "-").toLowerCase()));
  assert.deepEqual(brief, before);
  const vm = workspace.buildVisualJobsWorkspaceViewModel(ws);
  assert.equal(vm.attachedCount, 1);
});

test("Slice 8: remove image restores needs-image status + manifest missing list", () => {
  const ws = workspace.buildVisualJobsWorkspaceState(page, { activeView: "visual_jobs" });
  const brief = workspace.buildVisualJobsOrderedList(ws)[0];
  workspace.attachVisualAssetToWorkspace(
    ws,
    brief.brief_id,
    {
      filename: "roman-roads-a1.png",
      mime_type: "image/png",
      byte_size: 12345,
      width: 800,
      height: 600,
      render_source: { kind: "object_url", value: "blob:demo-a1" }
    },
    { intakeMethod: "file_picker" }
  );
  const removed = workspace.removeVisualAssetFromWorkspace(ws, brief.brief_id);
  assert.equal(removed.ok, true);
  const manifest = workspace.getVisualAssetManifest(ws);
  assert.equal(manifest.assets.length, 0);
  assert.ok(manifest.missing_brief_ids.includes(brief.brief_id));
});

test("Slice 8: manifest is ordered in learner-resource brief order", () => {
  const ws = workspace.buildVisualJobsWorkspaceState(page, { activeView: "visual_jobs" });
  const ordered = workspace.buildVisualJobsOrderedList(ws);
  ordered.forEach((brief, idx) => {
    workspace.attachVisualAssetToWorkspace(
      ws,
      brief.brief_id,
      {
        filename: "img-" + idx + ".png",
        mime_type: "image/png",
        byte_size: 1000 + idx,
        width: 300,
        height: 200,
        render_source: { kind: "object_url", value: "blob:" + idx }
      },
      { intakeMethod: "file_picker" }
    );
  });
  const manifest = workspace.getVisualAssetManifest(ws);
  assert.equal(manifest.assets.length, ordered.length);
  manifest.assets.forEach((asset, idx) => {
    assert.equal(asset.brief_id, ordered[idx].brief_id);
  });
});

test("Slice 8: visual-affordance hook renders attached image when resolver matches", () => {
  const ws = workspace.buildVisualJobsWorkspaceState(page, { activeView: "visual_jobs" });
  const a1 = ws.compilerResult.briefs.find((b) => b.affordance_id === "va-a1-concept-map-01");
  const attached = workspace.attachVisualAssetToWorkspace(
    ws,
    a1.brief_id,
    {
      filename: "a1.png",
      mime_type: "image/png",
      byte_size: 2000,
      width: 640,
      height: 480,
      render_source: { kind: "object_url", value: "blob:a1" }
    },
    { intakeMethod: "file_picker" }
  );
  assert.equal(attached.ok, true);
  const asset = ws.assetsByBriefId[a1.brief_id];
  const hook = {
    slot: a1.visual_slot,
    activityId: a1.activity_id,
    affordanceId: a1.affordance_id,
    subject: a1.subject
  };
  const html = renderHook.renderVisualAffordanceHook(hook, {
    resolveVisualAsset: function () {
      return asset;
    }
  });
  assert.match(html, /class="util-visual-asset/);
  assert.match(html, /src="blob:a1"/);
  assert.match(html, /alt=/);
});

test("Slice 8: visual-assets module keeps deterministic asset id on replacement", () => {
  const ws = workspace.buildVisualJobsWorkspaceState(page, { activeView: "visual_jobs" });
  const brief = workspace.buildVisualJobsOrderedList(ws)[0];
  const first = workspace.attachVisualAssetToWorkspace(
    ws,
    brief.brief_id,
    {
      filename: "one.png",
      mime_type: "image/png",
      byte_size: 1200,
      width: 100,
      height: 100,
      render_source: { kind: "object_url", value: "blob:one" }
    },
    { intakeMethod: "file_picker" }
  );
  assert.equal(first.ok, true);
  const second = workspace.attachVisualAssetToWorkspace(
    ws,
    brief.brief_id,
    {
      filename: "two.png",
      mime_type: "image/png",
      byte_size: 2200,
      width: 200,
      height: 120,
      render_source: { kind: "object_url", value: "blob:two" }
    },
    { intakeMethod: "paste" }
  );
  assert.equal(second.ok, true);
  assert.equal(second.asset.asset_id, first.asset.asset_id);
  assert.equal(second.asset.intake_method, "paste");
  assert.equal(second.asset.filename, "two.png");
});

test("Slice 8: standalone manifest helper reports deterministic diagnostics", () => {
  const ws = workspace.buildVisualJobsWorkspaceState(page, { activeView: "visual_jobs" });
  const brief = workspace.buildVisualJobsOrderedList(ws)[0];
  const attach = workspace.attachVisualAssetToWorkspace(
    ws,
    brief.brief_id,
    {
      filename: "one.png",
      mime_type: "image/png",
      byte_size: 1200,
      width: 100,
      height: 100,
      render_source: { kind: "object_url", value: "blob:one" }
    },
    { intakeMethod: "file_picker" }
  );
  assert.equal(attach.ok, true);
  const manifest = visualAssets.buildVisualAssetManifest(ws.compilerResult, ws.assetsByBriefId);
  assert.equal(manifest.manifest_version, "70.8");
  assert.equal(manifest.diagnostics.briefs_received, ws.compilerResult.briefs.length);
  assert.equal(manifest.diagnostics.assets_attached, 1);
});

test("Slice 8A: attach keeps selected brief and rebuilds manifest deterministically", () => {
  const ws = workspace.buildVisualJobsWorkspaceState(page, { activeView: "visual_jobs" });
  const selected = ws.selectedBriefId;
  const beforeSnapshot = clone(ws.assembledPageSnapshot);
  const attached = workspace.attachVisualAssetToWorkspace(
    ws,
    selected,
    {
      filename: "a1.png",
      mime_type: "image/png",
      byte_size: 1024,
      width: 100,
      height: 100,
      render_source: { kind: "data_url", value: "data:image/png;base64,AAA" },
      preview_source: { kind: "object_url", value: "blob:test-a1" }
    },
    { intakeMethod: "file_picker" }
  );
  assert.equal(attached.ok, true);
  assert.equal(ws.selectedBriefId, selected);
  assert.equal(ws.assetsByBriefId[selected].brief_id, selected);
  assert.ok(ws.visualAssetManifest.assets.some((a) => a.brief_id === selected));
  assert.deepEqual(ws.assembledPageSnapshot, beforeSnapshot);
});

test("Slice 8A: knowledge-summary-after-content page asset renders after knowledge summary region", () => {
  const placements = require("../lib/learner-renderer-vnext/build-visual-affordance-placements.js");
  const model = {
    title: "Roman Roads",
    orientationSections: [{ type: "knowledge_summary", title: "Knowledge summary", content: "x" }],
    activities: [],
    assessment: { items: [] }
  };
  const minimalPage = {};
  placements.attachVisualAffordancePlacements(minimalPage, model);
  assert.ok(model.visualAffordanceAfterKnowledgeSummary);
  assert.equal(model.visualAffordanceAfterKnowledgeSummary.slot, "knowledge-summary-after-content");
});

test("Slice 8A: authoritative page-scope knowledge-summary asset emits figure in learner HTML", () => {
  const fs = require("fs");
  const path = require("path");
  const renderLearnerPageHtml =
    require("../lib/learner-renderer-vnext/render-learner-page.js").renderLearnerPageHtml;
  const workspace = require("../lib/utilities-visual-jobs-workspace.js");
  const hetero = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "fixtures/page-render/heteroscedasticity-beat-assignment-page.json"),
      "utf8"
    )
  );
  const roman = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "fixtures/page-assemble/roman-roads-visual-jobs-valid.json"),
      "utf8"
    )
  );
  const pageVa = JSON.parse(
    JSON.stringify(roman.visual_affordances.find((row) => row.scope === "page"))
  );
  hetero.visual_affordance_schema_version = "38.4";
  hetero.visual_affordances = [pageVa];

  const ws = workspace.buildVisualJobsWorkspaceState(hetero, { activeView: "visual_jobs" });
  const pageBrief = ws.compilerResult.briefs.find((row) => row.scope === "page");
  assert.ok(pageBrief, "expected page knowledge-summary brief");

  const attached = workspace.attachVisualAssetToWorkspace(
    ws,
    pageBrief.brief_id,
    {
      filename: "ks.png",
      mime_type: "image/png",
      byte_size: 68,
      width: 1,
      height: 1,
      render_source: {
        kind: "data_url",
        value:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
      },
      preview_source: { kind: "object_url", value: "blob:ks" }
    },
    { intakeMethod: "file_picker" }
  );
  assert.equal(attached.ok, true, attached.message || "attach failed");

  const rendered = renderLearnerPageHtml(hetero, {
    compositionMode: "beats",
    visualAssets: ws.visualAssetManifest
  });
  assert.equal(rendered.error, null, rendered.error || "");
  assert.match(rendered.html, /util-visual-asset/);
  assert.match(rendered.html, /data:image\/png;base64,/);
  assert.match(rendered.html, /data-visual-slot="knowledge-summary-after-content"/);
});
