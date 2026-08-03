"use strict";

/**
 * Visual/a11y QA capture for sequential navigation fixture.
 * Run: npx playwright@1.49.0 test is not used — invoke with node via playwright chromium.
 */
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const FIXTURE = path.join(__dirname, "sequential-nav-qa.html");
const OUT = path.join(__dirname, "screenshots");
const URL = "http://localhost:8765/sequential-nav-qa.html";

fs.mkdirSync(OUT, { recursive: true });

async function metrics(page, label) {
  return page.evaluate((labelInner) => {
    const nav = document.querySelector(".util-journey-nav--sequential");
    const panel = document.getElementById("util-journey-all-panel");
    const panelLinks = panel ? [...panel.querySelectorAll(".util-journey-all-link")] : [];
    const sections = panelLinks
      .map((link) => {
        const href = link.getAttribute("href") || "";
        const id = href.startsWith("#") ? href.slice(1) : "";
        return id ? document.getElementById(id) : null;
      })
      .filter(Boolean);
    const posText = (nav?.querySelector(".util-journey-position__visible")?.textContent || "").trim();
    const posMatch = posText.match(/(\d+)\s+of\s+(\d+)/i);
    const activeIdx = posMatch ? Math.max(0, Number(posMatch[1]) - 1) : 0;
    const current = nav?.querySelector(".util-journey-current");
    const prev = nav?.querySelector("a.util-journey-adjacent--prev");
    const next = nav?.querySelector("a.util-journey-adjacent--next");
    const pos = nav?.querySelector(".util-journey-position");
    const btn = nav?.querySelector(".util-journey-all-btn");
    const titleEls = [...nav.querySelectorAll(".util-journey-adjacent__title, .util-journey-current")];
    const clampCheck = titleEls.map((el) => {
      const cs = getComputedStyle(el);
      return {
        text: el.textContent.trim(),
        lineClamp: cs.webkitLineClamp || cs.lineClamp,
        textOverflow: cs.textOverflow,
        whiteSpace: cs.whiteSpace,
        overflowWrap: cs.overflowWrap,
        clipped: el.scrollHeight > el.clientHeight + 1
      };
    });
    function stickyClearanceBottom() {
      const panelEl = document.getElementById("util-journey-all-panel");
      const unit = document.querySelector(".util-journey-sequential");
      const navEl = document.querySelector(".util-journey-nav--sequential");
      if (!navEl) return 0;
      let bottom = (unit || navEl).getBoundingClientRect().bottom;
      if (panelEl && !panelEl.hidden) {
        bottom -= panelEl.getBoundingClientRect().height;
      }
      return bottom;
    }
    const heading = sections[activeIdx]?.querySelector("h2") || sections[activeIdx];
    const navBottom = stickyClearanceBottom();
    const headingTop = heading ? heading.getBoundingClientRect().top : null;
    const unit = document.querySelector(".util-journey-sequential");
    const unitRect = unit ? unit.getBoundingClientRect() : null;
    const panelRect = panel && !panel.hidden ? panel.getBoundingClientRect() : null;
    return {
      label: labelInner,
      vw: window.innerWidth,
      vh: window.innerHeight,
      position: pos?.textContent.trim() || null,
      current: current?.textContent.trim() || null,
      prev: prev?.textContent.trim() || null,
      next: next?.textContent.trim() || null,
      stickyH: getComputedStyle(document.documentElement).getPropertyValue("--learner-sticky-nav-height").trim(),
      navHeight: nav.offsetHeight,
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      headingObscured: headingTop != null && headingTop < navBottom - 1,
      headingTop,
      navBottom,
      clampCheck,
      panelOpen: panel ? !panel.hasAttribute("hidden") : false,
      btnExpanded: btn?.getAttribute("aria-expanded"),
      progressTrack: !!document.querySelector(".util-journey-track"),
      percentLike: /%|percent complete|completion/i.test(nav.textContent),
      focus:
        document.activeElement &&
        (document.activeElement.getAttribute("aria-label") ||
          document.activeElement.className ||
          document.activeElement.tagName),
      allLinkCount: panelLinks.length,
      canonicalSectionCount: sections.length,
      journeySectionAttrCount: document.querySelectorAll("[data-journey-section]").length,
      structuralPresent: !!document.getElementById("journey-activities"),
      unitWidth: unitRect ? Math.round(unitRect.width) : null,
      panelWidth: panelRect ? Math.round(panelRect.width) : null,
      panelAligned: !!(
        unitRect &&
        panelRect &&
        Math.abs(unitRect.left - panelRect.left) < 3 &&
        Math.abs(unitRect.width - panelRect.width) < 3
      )
    };
  }, label);
}

async function scrollToSection(page, index) {
  await page.evaluate((idx) => {
    const links = [...document.querySelectorAll(".util-journey-all-link")];
    const href = links[idx]?.getAttribute("href") || "";
    const id = href.startsWith("#") ? href.slice(1) : "";
    const el = id ? document.getElementById(id) : null;
    if (!el) return;
    el.scrollIntoView({ block: "start" });
    window.dispatchEvent(new Event("scroll"));
  }, index);
  await page.waitForTimeout(350);
  await page.evaluate(() => {
    window.dispatchEvent(new Event("scroll"));
  });
  await page.waitForTimeout(200);
}

async function shot(page, name) {
  const file = path.join(OUT, name);
  await page.screenshot({ path: file, fullPage: false });
  return file;
}

async function runViewport(browser, { width, height, name, deviceScaleFactor = 1, colorScheme, reducedMotion, textSpacing }) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor,
    colorScheme: colorScheme || "light",
    reducedMotion: reducedMotion || "no-preference"
  });
  const page = await context.newPage();
  await page.goto(URL, { waitUntil: "networkidle" });
  if (textSpacing) {
    await page.addStyleTag({
      content: `*{letter-spacing:0.12em!important;word-spacing:0.16em!important;line-height:1.5!important;}`
    });
  }

  const results = [];

  // First boundary
  await scrollToSection(page, 0);
  results.push(await metrics(page, `${name}-first`));
  await shot(page, `${name}-first.png`);

  // Middle (section 7 / index 6) — 60-char current with adj titles
  await scrollToSection(page, 6);
  results.push(await metrics(page, `${name}-middle`));
  await shot(page, `${name}-middle.png`);

  // 60-char adjacent around section 2 (index 1) — long next from first already; use index 3 for long current
  await scrollToSection(page, 3);
  results.push(await metrics(page, `${name}-long-titles`));
  await shot(page, `${name}-long-titles.png`);

  // Final boundary
  await scrollToSection(page, 11);
  results.push(await metrics(page, `${name}-final`));
  await shot(page, `${name}-final.png`);

  // All Activities panel (middle)
  await scrollToSection(page, 6);
  await page.click(".util-journey-all-btn");
  await page.waitForTimeout(150);
  results.push(await metrics(page, `${name}-panel-open`));
  await shot(page, `${name}-panel-open.png`);

  // Escape closes + focus return
  await page.keyboard.press("Escape");
  await page.waitForTimeout(150);
  const afterEsc = await metrics(page, `${name}-panel-escape`);
  results.push(afterEsc);

  // Reopen and select entry
  await page.click(".util-journey-all-btn");
  await page.waitForTimeout(100);
  const focusedBeforeScroll = await page.evaluate(() => document.activeElement?.className || "");
  await page.click('.util-journey-all-list a[href="#activity-A3"]');
  await page.waitForTimeout(300);
  const afterNav = await metrics(page, `${name}-panel-select`);
  results.push({ ...afterNav, focusedBeforeScroll });

  // Scroll-driven update should not move focus: focus a link then scroll
  await page.focus(".util-journey-adjacent--next");
  const focusBefore = await page.evaluate(() => document.activeElement?.className || "");
  await scrollToSection(page, 8);
  const focusAfter = await page.evaluate(() => document.activeElement?.className || "");
  results.push({
    label: `${name}-scroll-focus`,
    focusBefore,
    focusAfter,
    focusPreserved: focusBefore === focusAfter
  });

  await context.close();
  return results;
}

async function main() {
  // Prefer local file if server unavailable
  let target = URL;
  try {
    const res = await fetch(URL);
    if (!res.ok) throw new Error("bad");
  } catch {
    target = "file://" + FIXTURE.replace(/\\/g, "/");
  }

  const browser = await chromium.launch({ headless: true });
  // Patch URL used inside runViewport via env
  process.env.QA_URL = target;
  const all = [];

  // Monkey-patch: rebind URL constant by wrapping
  const origRun = runViewport;
  async function run(browser, opts) {
    const contextOpts = {
      viewport: { width: opts.width, height: opts.height },
      deviceScaleFactor: opts.deviceScaleFactor || 1,
      colorScheme: opts.colorScheme || "light",
      reducedMotion: opts.reducedMotion || "no-preference"
    };
    const context = await browser.newContext(contextOpts);
    const page = await context.newPage();
    await page.goto(target, { waitUntil: "domcontentloaded" });
    if (opts.textSpacing) {
      await page.addStyleTag({
        content: `*{letter-spacing:0.12em!important;word-spacing:0.16em!important;line-height:1.5!important;}`
      });
    }
    const name = opts.name;
    const results = [];

    await scrollToSection(page, 0);
    results.push(await metrics(page, `${name}-first`));
    await shot(page, `${name}-first.png`);

    // Activity 1 must report 2 of 7 (canonical model)
    await scrollToSection(page, 1);
    results.push(await metrics(page, `${name}-activity1`));
    await shot(page, `${name}-activity1.png`);

    // Middle with 60-char title (activity-A5 / index 5)
    await scrollToSection(page, 5);
    results.push(await metrics(page, `${name}-middle`));
    await shot(page, `${name}-middle.png`);

    // Long titles around activity-A3 (index 3)
    await scrollToSection(page, 3);
    results.push(await metrics(page, `${name}-long-titles`));
    await shot(page, `${name}-long-titles.png`);

    await scrollToSection(page, 6);
    results.push(await metrics(page, `${name}-final`));
    await shot(page, `${name}-final.png`);

    await scrollToSection(page, 5);
    await page.click(".util-journey-all-btn");
    await page.waitForTimeout(150);
    results.push(await metrics(page, `${name}-panel-open`));
    await shot(page, `${name}-panel-open.png`);

    await page.keyboard.press("Escape");
    await page.waitForTimeout(150);
    results.push(await metrics(page, `${name}-panel-escape`));

    await page.click(".util-journey-all-btn");
    await page.waitForTimeout(100);
    await page.click('.util-journey-all-list a[href="#activity-A3"]');
    await page.waitForTimeout(300);
    results.push(await metrics(page, `${name}-panel-select`));

    await page.focus(".util-journey-adjacent--next");
    const focusBefore = await page.evaluate(() => document.activeElement?.className || "");
    await scrollToSection(page, 5);
    const focusAfter = await page.evaluate(() => document.activeElement?.className || "");
    results.push({ label: `${name}-scroll-focus`, focusBefore, focusAfter, focusPreserved: focusBefore === focusAfter });

    // Focus-visible check
    await page.keyboard.press("Tab");
    const outline = await page.evaluate(() => {
      const el = document.activeElement;
      const cs = getComputedStyle(el);
      return { className: el.className, outline: cs.outline, outlineWidth: cs.outlineWidth };
    });
    results.push({ label: `${name}-focus-indicator`, outline });

    await context.close();
    return results;
  }

  all.push(
    ...(await run(browser, { width: 1440, height: 900, name: "desktop" })),
    ...(await run(browser, { width: 768, height: 1024, name: "tablet" })),
    ...(await run(browser, { width: 390, height: 844, name: "w390" })),
    ...(await run(browser, { width: 320, height: 568, name: "w320" })),
    ...(await run(browser, { width: 720, height: 450, name: "zoom200", deviceScaleFactor: 2 })),
    ...(await run(browser, { width: 390, height: 844, name: "text-spacing", textSpacing: true })),
    ...(await run(browser, { width: 390, height: 844, name: "reduced-motion", reducedMotion: "reduce" }))
  );

  await browser.close();

  const reportPath = path.join(OUT, "qa-report.json");
  fs.writeFileSync(reportPath, JSON.stringify(all, null, 2));
  console.log("Wrote", reportPath);
  console.log("Screenshots in", OUT);

  const failures = [];
  for (const row of all) {
    if (row.horizontalOverflow) failures.push(`${row.label}: horizontal overflow`);
    if (row.headingObscured && !String(row.label || "").includes("panel-open")) {
      failures.push(`${row.label}: heading obscured`);
    }
    if (row.clampCheck) {
      for (const c of row.clampCheck) {
        if (c.lineClamp && c.lineClamp !== "none") failures.push(`${row.label}: line-clamp ${c.lineClamp}`);
        if (c.textOverflow === "ellipsis") failures.push(`${row.label}: ellipsis`);
        if (c.clipped) failures.push(`${row.label}: clipped ${c.text.slice(0, 40)}`);
      }
    }
    if (row.progressTrack) failures.push(`${row.label}: progress track present`);
    if (row.percentLike) failures.push(`${row.label}: percent/completion copy`);
    if (row.label?.endsWith("panel-escape") && row.panelOpen) failures.push(`${row.label}: panel still open`);
    if (row.label?.endsWith("panel-escape") && row.btnExpanded === "true") failures.push(`${row.label}: aria-expanded still true`);
    if (row.label?.endsWith("panel-escape") && row.focus && !/All activities|util-journey-all-btn/i.test(String(row.focus))) {
      failures.push(`${row.label}: focus not on All activities (${row.focus})`);
    }
    if (row.label?.endsWith("panel-select") && row.panelOpen) failures.push(`${row.label}: panel open after select`);
    if (row.focusPreserved === false) failures.push(`${row.label}: scroll moved focus`);
    if (row.allLinkCount != null && row.canonicalSectionCount != null && row.allLinkCount !== row.canonicalSectionCount) {
      failures.push(`${row.label}: All Activities (${row.allLinkCount}) != scrollspy targets (${row.canonicalSectionCount})`);
    }
    if (row.position && row.allLinkCount != null) {
      const m = String(row.position).match(/(\d+)\s+of\s+(\d+)/i);
      if (m && Number(m[2]) !== row.allLinkCount) {
        failures.push(`${row.label}: position total ${m[2]} != All Activities ${row.allLinkCount}`);
      }
    }
    if (row.label?.endsWith("activity1") && row.position !== "2 of 7") {
      failures.push(`${row.label}: expected 2 of 7, got ${row.position}`);
    }
    if (row.label?.endsWith("activity1") && row.prev && !/Orient/.test(row.prev)) {
      failures.push(`${row.label}: previous should be Orient`);
    }
    if (row.structuralPresent === false) failures.push(`${row.label}: journey-activities missing`);
    if (
      row.journeySectionAttrCount != null &&
      row.canonicalSectionCount != null &&
      row.journeySectionAttrCount <= row.canonicalSectionCount
    ) {
      failures.push(
        `${row.label}: expected extra structural data-journey-section (${row.journeySectionAttrCount} attrs, ${row.canonicalSectionCount} canonical)`
      );
    }
    if (row.label?.endsWith("panel-open") && row.panelAligned === false && row.vw >= 900) {
      failures.push(`${row.label}: panel not aligned with compact nav unit`);
    }
    if (row.label?.endsWith("middle") && row.vw >= 1200 && row.unitWidth != null) {
      // Reading-measure alignment: unit should match ~70ch body, not exceed old 44rem unit.
      if (row.unitWidth > 640) {
        failures.push(`${row.label}: desktop unit too wide (${row.unitWidth}px)`);
      }
    }
  }
  if (failures.length) {
    console.log("FAILURES:");
    failures.forEach((f) => console.log(" -", f));
    process.exitCode = 1;
  } else {
    console.log("All automated visual/a11y checks passed.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
