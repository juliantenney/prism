/**
 * Sprint 73 T-011 — Workflow Resources persistence (generated-image slice).
 */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const resources = require("../lib/prism-workflow-resources.js");
const assetsMod = require("../lib/prism-visual-assets.js");
const workspaceMod = require("../lib/utilities-visual-jobs-workspace.js");
const pageFixture = JSON.parse(
  fs.readFileSync(
    path.join(repoRoot, "tests/fixtures/page-assemble/roman-roads-visual-jobs-valid.json"),
    "utf8"
  )
);

const TINY_PNG_BYTES = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64"
);

function makeBlob() {
  if (typeof Blob !== "undefined") {
    return new Blob([TINY_PNG_BYTES], { type: "image/png" });
  }
  return TINY_PNG_BYTES;
}

test.beforeEach(function () {
  resources.resetStorageBackendForTests();
});

test("putBinaryResource persists metadata and payload", async function () {
  const blob = makeBlob();
  const put = await resources.putBinaryResource({
    workflow_id: "wf-test-1",
    affordance_id: "va-a1-materials-entry-01",
    brief_id: "vb-test",
    mime_type: "image/png",
    payload_blob: blob,
    byte_size: TINY_PNG_BYTES.length
  });
  assert.equal(put.ok, true);
  assert.match(put.resource_id, /^wr-/);
  const meta = await resources.getResourceMetadata(put.resource_id);
  assert.equal(meta.resource_type, "binary");
  assert.equal(meta.lifecycle_state, "active");
  const payload = await resources.getResourcePayload(put.resource_id);
  assert.ok(payload);
  const buf =
    payload instanceof Buffer
      ? payload
      : Buffer.from(await payload.arrayBuffer());
  assert.equal(buf.compare(TINY_PNG_BYTES), 0);
});

test("replace on same affordance updates payload in place", async function () {
  const blob1 = makeBlob();
  const first = await resources.putBinaryResource({
    workflow_id: "wf-test-2",
    affordance_id: "va-a1",
    brief_id: "vb-1",
    mime_type: "image/png",
    payload_blob: blob1,
    byte_size: TINY_PNG_BYTES.length
  });
  const blob2 = makeBlob();
  const second = await resources.putBinaryResource({
    workflow_id: "wf-test-2",
    affordance_id: "va-a1",
    brief_id: "vb-1",
    mime_type: "image/png",
    payload_blob: blob2,
    byte_size: TINY_PNG_BYTES.length
  });
  assert.equal(second.ok, true);
  assert.equal(second.resource_id, first.resource_id);
  const rows = await resources.listActiveResources("wf-test-2");
  assert.equal(rows.length, 1);
});

test("hydrateVisualAssetsIntoWorkspace rebuilds manifest without generation_instruction", async function () {
  const ws = workspaceMod.buildVisualJobsWorkspaceState(pageFixture, { activeView: "visual_jobs" });
  const brief = ws.compilerResult.briefs[0];
  const blob = makeBlob();
  await resources.putBinaryResource({
    workflow_id: "wf-hydrate",
    affordance_id: brief.affordance_id,
    brief_id: brief.brief_id,
    mime_type: "image/png",
    payload_blob: blob,
    byte_size: TINY_PNG_BYTES.length
  });
  const hydrated = await resources.hydrateVisualAssetsIntoWorkspace({
    workflowId: "wf-hydrate",
    workspace: ws,
    assetsMod: assetsMod,
    workspaceMod: workspaceMod
  });
  assert.equal(hydrated.ok, true);
  assert.equal(hydrated.hydrated, 1);
  assert.equal(ws.visualAssetManifest.assets.length, 1);
  assert.equal(ws.assetsByBriefId[brief.brief_id].resource_id != null, true);
  assert.match(
    ws.assetsByBriefId[brief.brief_id].render_source.value,
    /^data:image\/png;base64,/
  );
});

test("hydrate reports missing payload explicitly", async function () {
  const ws = workspaceMod.buildVisualJobsWorkspaceState(pageFixture, { activeView: "visual_jobs" });
  const brief = ws.compilerResult.briefs[0];
  const put = await resources.putBinaryResource({
    workflow_id: "wf-missing-payload",
    affordance_id: brief.affordance_id,
    brief_id: brief.brief_id,
    mime_type: "image/png",
    payload_blob: makeBlob(),
    byte_size: TINY_PNG_BYTES.length
  });
  const backend = await resources.getStorageBackend();
  await backend.deletePayload(put.resource_id);
  const hydrated = await resources.hydrateVisualAssetsIntoWorkspace({
    workflowId: "wf-missing-payload",
    workspace: ws,
    assetsMod: assetsMod,
    workspaceMod: workspaceMod
  });
  assert.equal(hydrated.ok, true);
  assert.equal(hydrated.hydrated, 0);
  assert.ok(hydrated.diagnostics.some(function (d) { return d.code === "missing_payload"; }));
});

test("index.html loads workflow resources module before workspace", function () {
  const html = fs.readFileSync(path.join(repoRoot, "index.html"), "utf8");
  const resourcesIdx = html.indexOf("lib/prism-workflow-resources.js");
  const workspaceIdx = html.indexOf("lib/utilities-visual-jobs-workspace.js");
  assert.ok(resourcesIdx > 0);
  assert.ok(workspaceIdx > resourcesIdx);
});

test("putTextResource stores embed payload and replaces slot in place", async function () {
  const first = await resources.putTextResource({
    workflow_id: "wf-video",
    slot_key: "page_video_embed",
    text_payload: '<div class="video-wrap"><iframe src="https://example.com/embed/1"></iframe></div>'
  });
  assert.equal(first.ok, true);
  const second = await resources.putTextResource({
    workflow_id: "wf-video",
    slot_key: "page_video_embed",
    text_payload: '<figure><iframe src="https://example.com/embed/2"></iframe></figure>'
  });
  assert.equal(second.ok, true);
  assert.equal(second.resource_id, first.resource_id);
  const text = await resources.getTextResourcePayload(second.resource_id);
  assert.match(text, /embed\/2/);
});

test("putBinaryFileResource persists downloadable file metadata and payload", async function () {
  const blob = new Blob([Buffer.from("sample,payload\n1,2", "utf8")], { type: "text/csv" });
  const put = await resources.putBinaryFileResource({
    workflow_id: "wf-file",
    filename: "table.csv",
    mime_type: "text/csv",
    payload_blob: blob,
    byte_size: blob.size
  });
  assert.equal(put.ok, true);
  const meta = await resources.getResourceMetadata(put.resource_id);
  assert.equal(meta.original_filename, "table.csv");
  assert.equal(meta.mime_type, "text/csv");
  const payload = await resources.getResourcePayload(put.resource_id);
  const text = await payload.text();
  assert.match(text, /sample,payload/);
});

test("hydrateVisualAssetsIntoWorkspace ignores non-image resources", async function () {
  const ws = workspaceMod.buildVisualJobsWorkspaceState(pageFixture, { activeView: "visual_jobs" });
  const brief = ws.compilerResult.briefs[0];
  await resources.putBinaryResource({
    workflow_id: "wf-mixed",
    affordance_id: brief.affordance_id,
    brief_id: brief.brief_id,
    mime_type: "image/png",
    payload_blob: makeBlob(),
    byte_size: TINY_PNG_BYTES.length
  });
  await resources.putTextResource({
    workflow_id: "wf-mixed",
    slot_key: "page_video_embed",
    text_payload: "<iframe src='https://example.com'></iframe>"
  });
  const hydrated = await resources.hydrateVisualAssetsIntoWorkspace({
    workflowId: "wf-mixed",
    workspace: ws,
    assetsMod: assetsMod,
    workspaceMod: workspaceMod
  });
  assert.equal(hydrated.ok, true);
  assert.equal(hydrated.hydrated, 1);
  assert.equal(ws.visualAssetManifest.assets.length, 1);
});

test("deleteResourcesForWorkflow removes only owned records", async function () {
  await resources.putTextResource({
    workflow_id: "wf-del-a",
    slot_key: "run_capture:step-a:final",
    text_payload: "{\"ok\":true}",
    mime_type: "application/json"
  });
  await resources.putBinaryFileResource({
    workflow_id: "wf-del-a",
    filename: "asset-a.csv",
    mime_type: "text/csv",
    payload_blob: new Blob([Buffer.from("a", "utf8")], { type: "text/csv" }),
    byte_size: 1
  });
  await resources.putTextResource({
    workflow_id: "wf-del-b",
    slot_key: "run_capture:step-b:final",
    text_payload: "{\"ok\":false}",
    mime_type: "application/json"
  });

  const res = await resources.deleteResourcesForWorkflow("wf-del-a");
  assert.equal(res.ok, true);
  assert.equal((await resources.listActiveResources("wf-del-a")).length, 0);
  assert.equal((await resources.listActiveResources("wf-del-b")).length >= 1, true);
});

test("deleteGeneratedVisualJobImagesForWorkflow targets only current-workflow generated images", async function () {
  const blob = makeBlob();
  const a1 = await resources.putBinaryResource({
    workflow_id: "wf-purge-a",
    affordance_id: "va-a-1",
    brief_id: "vb-a-1",
    mime_type: "image/png",
    payload_blob: blob,
    byte_size: TINY_PNG_BYTES.length
  });
  const a2 = await resources.putBinaryResource({
    workflow_id: "wf-purge-a",
    affordance_id: "va-a-2",
    brief_id: "vb-a-2",
    mime_type: "image/png",
    payload_blob: blob,
    byte_size: TINY_PNG_BYTES.length
  });
  const extra = await resources.putBinaryFileResource({
    workflow_id: "wf-purge-a",
    filename: "handout.png",
    mime_type: "image/png",
    payload_blob: blob,
    byte_size: TINY_PNG_BYTES.length
  });
  const video = await resources.putTextResource({
    workflow_id: "wf-purge-a",
    slot_key: "page_video_embed",
    mime_type: "text/html",
    text_payload: "<iframe></iframe>"
  });
  const other = await resources.putBinaryResource({
    workflow_id: "wf-purge-b",
    affordance_id: "va-b-1",
    brief_id: "vb-b-1",
    mime_type: "image/png",
    payload_blob: blob,
    byte_size: TINY_PNG_BYTES.length
  });

  assert.equal(resources.isRunGeneratedVisualJobImageRecord(a1.record, "wf-purge-a"), true);
  assert.equal(resources.isRunGeneratedVisualJobImageRecord(extra.record, "wf-purge-a"), false);

  const res = await resources.deleteGeneratedVisualJobImagesForWorkflow("wf-purge-a");
  assert.equal(res.ok, true);
  assert.equal(res.deleted_count, 2);

  const remainingA = await resources.listActiveResources("wf-purge-a");
  const ids = remainingA.map((row) => row.resource_id);
  assert.equal(ids.includes(a1.resource_id), false);
  assert.equal(ids.includes(a2.resource_id), false);
  assert.equal(ids.includes(extra.resource_id), true);
  assert.equal(ids.includes(video.resource_id), true);
  const remainingB = await resources.listActiveResources("wf-purge-b");
  assert.equal(remainingB.some((row) => row.resource_id === other.resource_id), true);
});

