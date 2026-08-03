"use strict";

const path = require("node:path");
const { chromium } = require("./node_modules/playwright");

const FIXTURE = path.resolve(__dirname, "sequential-nav-qa.html");

async function measureAdjacent(page) {
  return page.evaluate(() => {
    function textBounds(el) {
      const range = document.createRange();
      range.selectNodeContents(el);
      const rects = [...range.getClientRects()];
      if (!rects.length) return el.getBoundingClientRect();
      let left = Infinity;
      let right = -Infinity;
      let top = Infinity;
      let bottom = -Infinity;
      rects.forEach((r) => {
        left = Math.min(left, r.left);
        right = Math.max(right, r.right);
        top = Math.min(top, r.top);
        bottom = Math.max(bottom, r.bottom);
      });
      return { left, right, top, bottom, width: right - left, height: bottom - top };
    }
    function measure(link) {
      if (!link) return null;
      const linkR = link.getBoundingClientRect();
      const chev = link.querySelector(".util-journey-adjacent__chevron");
      const title = link.querySelector(".util-journey-adjacent__title");
      if (!chev || !title) return null;
      const chevR = chev.getBoundingClientRect();
      const textR = textBounds(title);
      const cs = getComputedStyle(title);
      const linkCenter = (linkR.left + linkR.right) / 2;
      const textCenter = (textR.left + textR.right) / 2;
      return {
        text: title.textContent.trim(),
        textAlign: cs.textAlign,
        textCenterOffset: Math.round((textCenter - linkCenter) * 10) / 10,
        chevLeftInset: Math.round((chevR.left - linkR.left) * 10) / 10,
        chevRightInset: Math.round((linkR.right - chevR.right) * 10) / 10,
        linkWidth: Math.round(linkR.width * 10) / 10,
        textWidth: Math.round(textR.width * 10) / 10,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
      };
    }
    const prev = document.querySelector("a.util-journey-adjacent--prev");
    const next = document.querySelector("a.util-journey-adjacent--next");
    const cur = document.querySelector(".util-journey-current");
    const curR = cur ? cur.getBoundingClientRect() : null;
    const wrap = cur ? cur.closest(".util-journey-current-wrap") || cur.parentElement : null;
    const wrapR = wrap ? wrap.getBoundingClientRect() : null;
    return {
      prev: measure(prev),
      next: measure(next),
      currentOffset:
        curR && wrapR
          ? Math.round((((curR.left + curR.right) / 2) - (wrapR.left + wrapR.right) / 2) * 10) / 10
          : null,
      position: (document.querySelector(".util-journey-position") || {}).textContent || null
    };
  });
}

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

async function main() {
  const browser = await chromium.launch({ headless: true });
  const cases = [
    { name: "desktop", width: 1440, height: 900 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "w390", width: 390, height: 844 },
    { name: "w320", width: 320, height: 568 },
    { name: "zoom200", width: 720, height: 450, deviceScaleFactor: 2 }
  ];
  const results = [];
  const target = "file://" + FIXTURE.replace(/\\/g, "/");

  for (const vp of cases) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.deviceScaleFactor || 1
    });
    const page = await ctx.newPage();
    await page.goto(target, { waitUntil: "domcontentloaded" });

    await scrollToId(page, "activity-A1");
    const shortPrev = await measureAdjacent(page);

    await page.focus("a.util-journey-adjacent--next");
    const focus = await page.evaluate(() => {
      const el = document.activeElement;
      const cs = getComputedStyle(el);
      return {
        className: el.className,
        outlineWidth: cs.outlineWidth,
        outlineStyle: cs.outlineStyle,
        outlineColor: cs.outlineColor
      };
    });

    await scrollToId(page, "activity-A5");
    const longBoth = await measureAdjacent(page);

    await scrollToId(page, "journey-study-tips");
    const finalSection = await measureAdjacent(page);

    await scrollToId(page, "journey-orient");
    const firstSection = await measureAdjacent(page);

    results.push({
      vp: vp.name,
      shortPrev,
      longBoth,
      finalSection,
      firstSection,
      focus
    });
    await ctx.close();
  }
  await browser.close();

  const failures = [];
  for (const row of results) {
    const samples = [
      ["shortPrev", row.shortPrev],
      ["longBoth", row.longBoth],
      ["finalSection", row.finalSection],
      ["firstSection", row.firstSection]
    ];
    for (const [label, sample] of samples) {
      for (const side of ["prev", "next"]) {
        const a = sample[side];
        if (!a) continue;
        if (a.textAlign !== "center") {
          failures.push(`${row.vp}/${label}/${side}: text-align ${a.textAlign}`);
        }
        if (Math.abs(a.textCenterOffset) > 3) {
          failures.push(
            `${row.vp}/${label}/${side}: text not centred offset=${a.textCenterOffset} (${a.text})`
          );
        }
        if (side === "prev" && a.chevLeftInset > 4) {
          failures.push(`${row.vp}/${label}/prev: chevron inset ${a.chevLeftInset}`);
        }
        if (side === "next" && a.chevRightInset > 4) {
          failures.push(`${row.vp}/${label}/next: chevron inset ${a.chevRightInset}`);
        }
        if (a.overflow) failures.push(`${row.vp}/${label}: overflow`);
      }
    }
    if (row.shortPrev.prev && !/Orient/i.test(row.shortPrev.prev.text)) {
      failures.push(`${row.vp}: expected Orient as previous at activity 1`);
    }
    if (row.finalSection.next) {
      failures.push(`${row.vp}: final section still has next`);
    }
    if (row.firstSection.prev) {
      failures.push(`${row.vp}: first section still has prev`);
    }
    if (!(parseFloat(row.focus.outlineWidth) > 0)) {
      failures.push(`${row.vp}: missing focus outline width`);
    }
  }

  const desktop = results.find((r) => r.vp === "desktop");
  console.log(
    JSON.stringify(
      {
        desktopShortPrev: desktop && desktop.shortPrev,
        desktopLongBoth: desktop && desktop.longBoth,
        desktopFinal: desktop && desktop.finalSection,
        desktopFirst: desktop && desktop.firstSection
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
    console.log("All adjacent-centering checks passed.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
