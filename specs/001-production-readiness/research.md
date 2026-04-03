# Research: Production Readiness

**Feature**: 001-production-readiness
**Date**: 2026-04-03

## 1. Console Statement Audit

**Decision**: 1 console statement found — will be replaced with UI error feedback.

| File | Line | Statement | Action |
|------|------|-----------|--------|
| `script.js` | 25 | `.catch(err => console.error("Error loading data:", err))` | Replace with UI fallback (FR-004) |

**Rationale**: This is the only console statement in the codebase.
It's inside the `data.json` fetch error handler. Since FR-004
mandates a visible UI fallback for fetch failures, this `console.error`
becomes redundant — the error will be communicated visually instead.

**Alternatives considered**: Keep console.error alongside UI fallback
for developer debugging. Rejected: the spec (FR-001) explicitly
mandates removal of all console statements not part of a UI feedback
path. The UI fallback IS the feedback path.

---

## 2. Dead JavaScript Function Audit

**Decision**: Zero dead functions found. All 10 top-level functions are reachable.

| Function | Line | Called From |
|----------|------|-------------|
| `initNavScrollBehavior()` | 35 | DOMContentLoaded (line 28) |
| `initMobileMenu()` | 70 | DOMContentLoaded (line 29) |
| `initActiveSectionTracking()` | 103 | DOMContentLoaded (line 30) |
| `initProfileCard()` | 132 | DOMContentLoaded (line 31) |
| `render(lang)` | 190 | DOMContentLoaded (line 23), lang toggle (line 11) |
| `buildProjectsSection(data, lang)` | 492 | `render()` (line 477) |
| `buildCompactCard(project, data, index)` | 510 | `buildProjectsSection()` (line 503) |
| `openProjModal(project, data)` | 659 | `buildCompactCard()` onclick (line 515) |
| `closeProjModal(e)` | 769 | DOMContentLoaded #2 (lines 789-790) |
| `initProjectReveal()` | 800 | `buildProjectsSection()` (line 507) |

**Rationale**: Full call-graph trace confirms every function has at
least one reachable call site. No removal needed.

---

## 3. Unused CSS Selector Audit

**Decision**: 6 selector groups are dead code — never referenced in
`index.html` or `script.js`.

| Selector | Lines | Why Dead |
|----------|-------|----------|
| `.profile-social-icon` + `:hover` | 218–237 | Old profile modal social link design. Current modal uses inline Tailwind classes. Never applied by any element. |
| `.avatar-ring` + `:hover` | 240–246 | Old navbar avatar ring class. Current avatar uses inline gradient classes. Never applied by any element. |
| `.project-spotlight-border` + all variants | 302–358 | Legacy "spotlight/featured" card design from a previous iteration. All project cards now use `.project-card-border`. Never applied. |
| `.project-number` + all variants | 549–577 | Legacy "01.", "02." project number badge. Removed from card design. Never applied. |
| `.animate-marquee-infinite` + keyframes + RTL variant | 638–656 | Marquee animation CSS. `data.json` has a `marquee` UI key, but no marquee element exists in `index.html` or is created by `script.js`. Orphaned. |

**Total dead CSS**: ~100 lines (lines 218-246, 302-358, 549-577, 638-656)

**Rationale**: Cross-referenced every class name in `style.css`
against all occurrences in `index.html` (static markup) and
`script.js` (dynamic class assignments via `.className` and
`.classList`). The 6 groups above have zero references.

**Note on dynamic classes**: Several CSS selectors are only applied
via JavaScript (`.nav-scrolled`, `.open`, `.revealed`, `.active`).
These are NOT dead — they are toggle classes added/removed at runtime.
The audit accounts for this.

---

## 4. Data Parity Audit

**Decision**: 3 parity issues found in `data.json`.

| Key Path | English Value | Arabic Value | Fix |
|----------|--------------|--------------|-----|
| `projects[0].link` (Tagen) | `https://tagen.app` | `#` | Copy English URL to Arabic |
| `projects[0].source` (Tagen) | `#` | `#` | Both `#` — hide element |
| `projects[1].link` (Go Pet) | `https://gopet.net` | `#` | Copy English URL to Arabic |
| `projects[1].source` (Go Pet) | `#` | `#` | Both `#` — hide element |
| `personal_info.links.twitter` | `#` | `#` | Both `#` — hide element |
| `personal_info.links.instagram` | `#` | `#` | Both `#` — hide element |
| `personal_info.links.facebook` | `#` | `#` | Both `#` — hide element |
| `personal_info.links.email` | `mailto:test@example.com` | `mailto:test@example.com` | Placeholder — remains as-is (user must provide real email) |

**Rationale**: Per clarification Q3, real URLs are copied across
locales. Elements with `#` in both locales are hidden dynamically.
The test email is flagged but NOT auto-fixed (only the user knows
their production email).

---

## 5. Asset Path Audit

**Decision**: All paths are already relative and correct.

| Reference | File | Path | Status |
|-----------|------|------|--------|
| `style.css` | `index.html:27` | `href="style.css"` | ✅ Relative, exists |
| `script.js` | `index.html:637` | `src="script.js"` | ✅ Relative, exists |
| `avatar.webp` | `index.html:46,47,131,544` | `src="avatar.webp"` | ✅ Relative, exists |
| `data.json` | `script.js:16` | `fetch('data.json')` | ✅ Relative, exists |
| `954shots_so.jpeg` | `data.json` (both locales) | `"image": "954shots_so.jpeg"` | ✅ Relative, exists |
| `981shots_so.jpeg` | `data.json` (both locales) | `"image": "981shots_so.jpeg"` | ✅ Relative, exists |
| Google Fonts | `index.html:9-13` | External CDN URL | ✅ External (expected) |
| Tailwind CDN | `index.html:14` | External CDN URL | ✅ External (expected) |

**Rationale**: Zero absolute filesystem paths. Zero broken references.
All assets resolve from the project root. No changes needed.

---

## 6. Error Handling Pattern Research

**Decision**: Implement a static HTML fallback element hidden by
default, shown by JavaScript when fetch fails.

**Pattern**:
```
1. Hard-code a <div id="data-error"> in index.html with bilingual
   message, styled with Tailwind classes, initially hidden (class="hidden").
2. In the fetch .catch() handler, remove the "hidden" class to show it.
3. Same logic for JSON.parse errors (malformed response).
4. The error element is self-contained — no data.json dependency.
```

**Alternatives considered**:
- Dynamic error element creation via JS: Rejected — if JS itself
  has an error, the dynamic element won't be created either. A
  pre-existing HTML element is more robust.
- Full-page error overlay: Rejected — too heavy for a simple data
  load failure. An inline message in the main content area is
  proportionate.

---

## 7. localStorage Validation Research

**Decision**: Add a validation check at the top of the script.

**Pattern**: Read `localStorage.getItem('lang')`, validate it's
`'en'` or `'ar'`, default to `'en'` otherwise. Single line change
to the existing `currentLang` initialization on line 2.

**Current code**: `let currentLang = localStorage.getItem('lang') || 'en';`
**Issue**: If localStorage contains `'fr'` or `'xyz'`, this passes
validation (truthy non-null) and `render('fr')` silently fails.
**Fix**: `let currentLang = ['en', 'ar'].includes(localStorage.getItem('lang')) ? localStorage.getItem('lang') : 'en';`
