"use strict";

/**
 * Measure sequential-nav alignment against the learner reading column.
 */
const path = require("node:path");
const { chromium } = require("./node_modules/playwright");

const FIXTURE = path.resolve(__dirname, "sequential-nav-qa.html");

async function scrollToId(page, id) {
  await page.evaluate((sectionId) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    el.scrollIntoView({ block: "start" });
    window.dispatchEvent(new Event("scroll"));
  }, id);
  await page.waitForTimeout(350);
  await page.evaluate(() => window.dispatchEvent(new Event("scroll")));
  await page.waitForTimeout(150);
}

async function measure(page) {
  return page.evaluate(() => {
    const unit = document.querySelector(".util-journey-sequential");
    const row = document.querySelector(".util-journey-sequential__row");
    const body = document.querySelector(".util-learner-page");
    const current = document.querySelector(".util-journey-current");
    const btn = document.querySelector(".util-journey-all-btn");
    const panel = document.getElementById("util-journey-all-panel");
    const prev = document.querySelector("a.util-journey-adjacent--prev");
    const next = document.querySelector("a.util-journey-adjacent--next");
    const unitR = unit.getBoundingClientRect();
    const rowR = row.getBoundingClientRect();
    const bodyR = body.getBoundingClientRect();
    const curR = current.getBoundingClientRect();
    const btnR = btn.getBoundingClientRect();
    const csUnit = getComputedStyle(unit);
    const csRow = getComputedStyle(row);
    const bodyCenter = (bodyR.left + bodyR.right) / 2;
    const curCenter = (curR.left + curR.right) / 2;
    const unitCenter = (unitR.left + unitR.right) / 2;
    return {
      vw: window.innerWidth,
      unitWidth: Math.round(unitR.width * 10) / 10,
      unitLeft: Math.round(unitR.left * 10) / 10,
      unitRight: Math.round(unitR.right * 10) / 10,
      bodyWidth: Math.round(bodyR.width * 10) / 10,
      bodyLeft: Math.round(bodyR.left * 10) / 10,
      bodyRight: Math.round(bodyR.right * 10) / 10,
      edgeDeltaLeft: Math.round((unitR.left - bodyR.left) * 10) / 10,
      edgeDeltaRight: Math.round((unitR.right - bodyR.right) * 10) / 10,
      dividerWidth: Math.round(unitR.width * 10) / 10,
      borderBottom:
        csUnit.borderBottomWidth + " " + csUnit.borderBottomStyle + " " + csUnit.borderBottomColor,
      currentCenterOffset: Math.round((curCenter - bodyCenter) * 10) / 10,
      unitCenterOffset: Math.round((unitCenter - bodyCenter) * 10) / 10,
      btnWidth: Math.round(btnR.width * 10) / 10,
      hasPrev: !!prev,
      hasNext: !!next,
      panelWidth: panel && !panel.hidden ? Math.round(panel.getBoundingClientRect().width * 10) / 10 : null,
      panelLeft:
        panel && !panel.hidden ? Math.round(panel.getBoundingClientRect().left * 10) / 10 : null,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      columns: csRow.gridTemplateColumns
    };
  });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const target = "file://" + FIXTURE.replace(/\\/g, "/");
  const cases = [
    { name: "desktop", width: 1440, height: 900 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "w390", width: 390, height: 844 },
    { name: "w320", width: 320, height: 568 },
    { name: "zoom200", width: 720, height: 450, deviceScaleFactor: 2 }
  ];
  const results = [];
  const failures = [];

  for (const vp of cases) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.deviceScaleFactor || 1
    });
    const page = await ctx.newPage();
    await page.goto(target, { waitUntil: "domcontentloaded" });

    await scrollToId(page, "activity-A1");
    const mid = await measure(page);

    await scrollToId(page, "journey-orient");
    const first = await measure(page);

    await scrollToId(page, "journey-study-tips");
    const last = await measure(page);

    await scrollToId(page, "activity-A1");
    await page.click(".util-journey-all-btn");
    await page.waitForTimeout(150);
    const panelOpen = await measure(page);

    results.push({ vp: vp.name, mid, first, last, panelOpen });

    const samples = [mid, first, last, panelOpen];
    for (const sample of samples) {
      if (sample.overflow) failures.push(`${vp.name}: horizontal overflow`);
      if (vp.width >= 900) {
        if (Math.abs(sample.edgeDeltaLeft) > 2 || Math.abs(sample.edgeDeltaRight) > 2) {
          failures.push(
            `${vp.name}: nav/body edges misaligned L=${sample.edgeDeltaLeft} R=${sample.edgeDeltaRight}`
          );
        }
        if (Math.abs(sample.currentCenterOffset) > 3) {
          failures.push(
            `${vp.name}: current not body-centred offset=${sample.currentCenterOffset}`
          );
        }
      }
    }
    if (first.hasPrev) failures.push(`${vp.name}: first still has prev`);
    if (last.hasNext) failures.push(`${vp.name}: last still has next`);
    if (vp.width >= 900 && panelOpen.panelWidth != null) {
      if (Math.abs(panelOpen.panelWidth - panelOpen.unitWidth) > 2) {
        failures.push(
          `${vp.name}: panel width ${panelOpen.panelWidth} != unit ${panelOpen.unitWidth}`
        );
      }
      if (Math.abs(panelOpen.panelLeft - panelOpen.unitLeft) > 2) {
        failures.push(`${vp.name}: panel left not aligned with unit`);
      }
    }

    await ctx.close();
  }

  await browser.close();
  console.log(JSON.stringify(results, null, 2));
  if (failures.length) {
    console.log("FAILURES:");
    failures.forEach((f) => console.log(" -", f));
    process.exitCode = 1;
  } else {
    console.log("All reading-measure alignment checks passed.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
