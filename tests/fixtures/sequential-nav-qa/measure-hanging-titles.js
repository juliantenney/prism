"use strict";

/**
 * Measure hanging All-activities button + equal title-column layout.
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
    function lineCount(el) {
      if (!el) return null;
      const cs = getComputedStyle(el);
      const lh = parseFloat(cs.lineHeight) || 20;
      return Math.max(1, Math.round(el.getBoundingClientRect().height / lh));
    }
    const unit = document.querySelector(".util-journey-sequential");
    const row = document.querySelector(".util-journey-sequential__row");
    const body = document.querySelector(".util-learner-page");
    const btn = document.querySelector(".util-journey-all-btn");
    const prev = document.querySelector(".util-journey-adjacent--prev");
    const next = document.querySelector(".util-journey-adjacent--next");
    const current = document.querySelector(".util-journey-current");
    const panel = document.getElementById("util-journey-all-panel");
    const unitR = unit.getBoundingClientRect();
    const rowR = row.getBoundingClientRect();
    const bodyR = body.getBoundingClientRect();
    const btnR = btn.getBoundingClientRect();
    const prevR = prev ? prev.getBoundingClientRect() : null;
    const nextR = next ? next.getBoundingClientRect() : null;
    const curR = current.getBoundingClientRect();
    const btnCs = getComputedStyle(btn);
    const rowCs = getComputedStyle(row);
    const bodyCenter = (bodyR.left + bodyR.right) / 2;
    const curCenter = (curR.left + curR.right) / 2;
    const hanging = btnCs.position === "absolute";
    return {
      vw: window.innerWidth,
      bodyWidth: Math.round(bodyR.width * 10) / 10,
      bodyLeft: Math.round(bodyR.left * 10) / 10,
      bodyRight: Math.round(bodyR.right * 10) / 10,
      titleGridWidth: Math.round(rowR.width * 10) / 10,
      titleGridLeft: Math.round(rowR.left * 10) / 10,
      titleGridRight: Math.round(rowR.right * 10) / 10,
      edgeDeltaLeft: Math.round((rowR.left - bodyR.left) * 10) / 10,
      edgeDeltaRight: Math.round((rowR.right - bodyR.right) * 10) / 10,
      unitWidth: Math.round(unitR.width * 10) / 10,
      colPrev: prevR ? Math.round(prevR.width * 10) / 10 : null,
      colCurrent: Math.round(curR.width * 10) / 10,
      colNext: nextR ? Math.round(nextR.width * 10) / 10 : null,
      /* measure grid track via prev/current/next wrappers */
      trackPrev: prevR ? Math.round(prevR.width * 10) / 10 : null,
      trackCurrent: (() => {
        const wrap = document.querySelector(".util-journey-current-wrap");
        return wrap ? Math.round(wrap.getBoundingClientRect().width * 10) / 10 : null;
      })(),
      trackNext: nextR ? Math.round(nextR.width * 10) / 10 : null,
      currentCenterOffset: Math.round((curCenter - bodyCenter) * 10) / 10,
      btnPosition: btnCs.position,
      hanging,
      btnRight: Math.round(btnR.right * 10) / 10,
      btnLeft: Math.round(btnR.left * 10) / 10,
      gapBtnToGrid: Math.round((rowR.left - btnR.right) * 10) / 10,
      btnInViewport: btnR.left >= -1 && btnR.right <= window.innerWidth + 1,
      panelWidth: panel && !panel.hidden ? Math.round(panel.getBoundingClientRect().width * 10) / 10 : null,
      panelLeft: panel && !panel.hidden ? Math.round(panel.getBoundingClientRect().left * 10) / 10 : null,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      columns: rowCs.gridTemplateColumns,
      linesPrev: lineCount(prev && prev.querySelector(".util-journey-adjacent__title")),
      linesCurrent: lineCount(current),
      linesNext: lineCount(next && next.querySelector(".util-journey-adjacent__title")),
      titlePrev: prev ? prev.textContent.replace(/[‹›]/g, "").trim() : null,
      titleCurrent: current.textContent.trim(),
      titleNext: next ? next.textContent.replace(/[‹›]/g, "").trim() : null
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
    { name: "zoom200", width: 720, height: 450, deviceScaleFactor: 2 },
    { name: "text-spacing", width: 390, height: 844, textSpacing: true }
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
    if (vp.textSpacing) {
      await page.addStyleTag({
        content:
          "*{letter-spacing:0.12em!important;word-spacing:0.16em!important;line-height:1.5!important;}"
      });
    }

    await scrollToId(page, "activity-A3");
    const mid = await measure(page);

    await page.focus(".util-journey-all-btn");
    const focus = await page.evaluate(() => {
      const el = document.activeElement;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        outlineWidth: cs.outlineWidth,
        clipped:
          r.left < -2 ||
          r.right > window.innerWidth + 2 ||
          r.top < -2
      };
    });

    await page.click(".util-journey-all-btn");
    await page.waitForTimeout(150);
    const panelOpen = await measure(page);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(100);

    await scrollToId(page, "journey-orient");
    const first = await measure(page);
    await scrollToId(page, "journey-study-tips");
    const last = await measure(page);

    results.push({ vp: vp.name, mid, first, last, panelOpen, focus });

    const expectHang = vp.width >= 900;
    if (mid.hanging !== expectHang) {
      failures.push(`${vp.name}: hanging=${mid.hanging}, expected ${expectHang}`);
    }
    if (mid.overflow) failures.push(`${vp.name}: horizontal overflow`);
    if (!mid.btnInViewport) failures.push(`${vp.name}: All Activities outside viewport`);
    if (focus.clipped) failures.push(`${vp.name}: focus outline clipped`);
    if (!(parseFloat(focus.outlineWidth) > 0)) failures.push(`${vp.name}: missing focus outline`);

    if (expectHang) {
      if (Math.abs(mid.edgeDeltaLeft) > 2 || Math.abs(mid.edgeDeltaRight) > 2) {
        failures.push(
          `${vp.name}: title grid/body edges L=${mid.edgeDeltaLeft} R=${mid.edgeDeltaRight}`
        );
      }
      if (Math.abs(mid.currentCenterOffset) > 3) {
        failures.push(`${vp.name}: current centre offset ${mid.currentCenterOffset}`);
      }
      const tracks = [mid.trackPrev, mid.trackCurrent, mid.trackNext].filter((n) => n != null);
      if (tracks.length === 3) {
        const max = Math.max(...tracks);
        const min = Math.min(...tracks);
        if (max - min > 4) {
          failures.push(`${vp.name}: unequal columns ${tracks.join(",")}`);
        }
        // Three 1fr tracks share width after two column-gaps (~0.85rem each).
        const gapTotal = mid.titleGridWidth - tracks.reduce((a, b) => a + b, 0);
        const third = (mid.titleGridWidth - gapTotal) / 3;
        for (const t of tracks) {
          if (Math.abs(t - third) > 3) {
            failures.push(`${vp.name}: column ${t} != equal third ${third.toFixed(1)}`);
          }
        }
        if (Math.abs(mid.titleGridWidth - mid.bodyWidth) > 2) {
          failures.push(`${vp.name}: title grid width != body`);
        }
      }
      if (mid.gapBtnToGrid < 6 || mid.gapBtnToGrid > 20) {
        failures.push(`${vp.name}: button gap ${mid.gapBtnToGrid}`);
      }
      if (mid.btnRight > mid.titleGridLeft - 4) {
        failures.push(`${vp.name}: button overlaps title grid`);
      }
      if (panelOpen.panelWidth != null && Math.abs(panelOpen.panelWidth - mid.titleGridWidth) > 2) {
        failures.push(`${vp.name}: panel width not aligned to title grid`);
      }
      if (panelOpen.panelLeft != null && Math.abs(panelOpen.panelLeft - mid.titleGridLeft) > 2) {
        failures.push(`${vp.name}: panel left not aligned to title grid`);
      }
      // 60-char titles in fixture should not routinely hit 4 lines on desktop
      if (mid.linesCurrent != null && mid.linesCurrent > 3) {
        failures.push(`${vp.name}: current title ${mid.linesCurrent} lines (>3)`);
      }
    }
  }

  await browser.close();
  const desktop = results.find((r) => r.vp === "desktop");
  console.log(
    JSON.stringify(
      {
        desktop: desktop && desktop.mid,
        desktopPanel: desktop && desktop.panelOpen,
        fallbacks: results.map((r) => ({
          vp: r.vp,
          hanging: r.mid.hanging,
          titleGridWidth: r.mid.titleGridWidth,
          bodyWidth: r.mid.bodyWidth,
          columns: r.mid.columns,
          lines: [r.mid.linesPrev, r.mid.linesCurrent, r.mid.linesNext]
        }))
      },
      null,
      2
    )
  );
  if (failures.length) {
    console.log("FAILURES:");
    failures.forEach((f) => console.log(" -", f));
    process.exitCode = 1;
  } else {
    console.log("All hanging-title-layout checks passed.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
