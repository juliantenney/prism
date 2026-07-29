# Sprint 70 — Durable Learner Package Export

## Shape

```js
LearnerPackage = {
  html: "<!doctype html>...",
  assets: [
    {
      path: "assets/activity-a1-materials-entry.png",
      bytes: Uint8Array,
      mime: "image/png",
      brief_id?: string,
      asset_id?: string
    }
  ],
  metadata?: {
    package_kind: "learner_package",
    schema_version: "70.export",
    html_entry: "learner-page.html",
    asset_count: number,
    built_at: string,
    page_slug?: string,
    title?: string
  }
}
```

## Modules

| Module | Role |
|--------|------|
| `lib/learner-package.js` | Pure package builder: naming, data-URL decode, HTML rewrite |
| `lib/learner-package-zip.js` | `serializeLearnerPackageToZip(package)` via fflate |
| Utilities Download menu | Explicit **HTML only** vs **Learner package** |

## ZIP layout

```
{page-slug}-learner-package.zip
  learner-page.html
  assets/
    activity-a1-materials-entry.png
    knowledge-summary-after-content.png
    ...
```

`assets/manifest.json` is not included in this sprint (optional and deferred).

## Export behaviour

- **HTML only:** unchanged — standalone HTML with embedded data URLs.
- **Learner package:** always available; relative `assets/...` paths; no `blob:` URLs.
- **Open in New Tab:** unchanged session HTML (data URLs OK).

## MathJax / offline

Export HTML may still inject the existing MathJax CDN bootstrap when math delimiters are present.
Pages that require MathJax may still depend on network access to that CDN when opened offline.
This sprint does **not** vendor MathJax into the learner package.
