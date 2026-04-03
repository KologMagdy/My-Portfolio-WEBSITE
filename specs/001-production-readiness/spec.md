# Feature Specification: Production Readiness

**Feature Branch**: `001-production-readiness`
**Created**: 2026-04-03
**Status**: Draft
**Input**: User description: "Production Readiness — File optimization, codebase cleanup, data fetching reliability, and path verification for static deployment"

## Clarifications

### Session 2026-04-03

- Q: How should minification be handled for CSS and JS files? → A: Minification is cancelled entirely. All files remain in their original, readable state.
- Q: What language should the error fallback UI display when data.json fails to load? → A: Both English and Arabic, stacked (English first, Arabic below).
- Q: How should placeholder `#` links be remediated in data.json? → A: Copy real URLs across locales where they exist. Hide elements entirely when no real URL exists in either locale.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Clean Codebase (Priority: P1)

As the site owner, I want all dead code, unused styles, debugging
artifacts, and console statements removed from the codebase so that
the deployed files contain only production-quality code with zero
development residue.

**Why this priority**: Dead code and console statements are the most
visible indicators of an unfinished project. A recruiter inspecting
DevTools console or view-source will immediately notice `console.log`
noise. This is the highest-impact, lowest-risk cleanup.

**Independent Test**: Open the deployed site in a browser with
DevTools Console open. Zero application-generated log messages appear
on any page state (initial load, language toggle, modal open/close,
scroll). View the source files — no functions exist that are never
called, no CSS classes exist that are never referenced.

**Acceptance Scenarios**:

1. **Given** the site is loaded in a browser, **When** the user opens
   the DevTools Console, **Then** zero `console.log` or `console.error`
   messages originate from `script.js` under normal operation.
2. **Given** the `style.css` file, **When** every CSS class/selector
   is cross-referenced against `index.html` and `script.js`, **Then**
   no orphaned selectors exist that are never applied to any element.
3. **Given** the `script.js` file, **When** every top-level function
   is traced for call sites, **Then** no function exists that is
   never invoked from any code path.

---

### User Story 2 - Graceful Data Loading (Priority: P2)

As a visitor on a slow or unreliable connection, I want the site to
handle `data.json` loading failures gracefully so that I see a
meaningful message instead of a blank screen, and the site loads
content as efficiently as possible.

**Why this priority**: A blank page on fetch failure is an immediate
bounce. Recruiters evaluating engineering quality will test edge cases
like network errors. Graceful degradation demonstrates professional
error handling.

**Independent Test**: Simulate a `data.json` fetch failure (e.g.,
rename the file temporarily or use browser DevTools to block the
request). Reload the site. A visible, styled error message appears
in both English and Arabic instead of a blank page. With a valid
file, content renders without unnecessary blocking or layout shift.

**Acceptance Scenarios**:

1. **Given** `data.json` is unreachable (network error, 404),
   **When** the page loads, **Then** a styled, user-friendly error
   message appears in the main content area displaying both an
   English and Arabic message (English first, Arabic below),
   indicating the site could not load its data.
2. **Given** `data.json` is reachable, **When** the page loads,
   **Then** content renders without visible layout shift or flash
   of unstyled/empty content.
3. **Given** the `data.json` response is malformed (invalid JSON),
   **When** the page loads, **Then** the same bilingual error state
   from scenario 1 is displayed (not a silent failure or blank page).
4. **Given** a `<noscript>` tag exists in `index.html`, **When** a
   visitor has JavaScript disabled, **Then** a message is displayed
   indicating that JavaScript is required.

---

### User Story 3 - Verified Asset Paths & Data Parity (Priority: P3)

As the site owner deploying to a static host (e.g., GitHub Pages),
I want all asset paths to be correct and relative, and all data
entries to be complete across both languages, so that every resource
loads correctly and no broken or placeholder links exist.

**Why this priority**: Broken paths cause silent failures — missing
images, unstyled pages, or a non-functional site. Placeholder `#`
links mislead visitors. This is a gate-blocker for deployment but
is quick to verify and fix.

**Independent Test**: Serve the project from a local static server.
Open DevTools Network tab. Zero 404 errors. All images render, styles
apply, scripts execute, and `data.json` loads. Click every social
link and project link — none navigate to `#`. Links that have real
URLs in one locale have the same URL in the other. Social links
without real URLs in either locale are not visible.

**Acceptance Scenarios**:

1. **Given** the project is served from a static server at the
   repository root, **When** the page loads, **Then** the DevTools
   Network tab shows zero 404 responses for any asset.
2. **Given** the `index.html` file, **When** all `src`, `href`,
   and `fetch()` paths are inspected, **Then** every path is
   relative (no absolute filesystem paths like `D:\...` or
   `file:///...`) and correctly resolves from the project root.
3. **Given** the `data.json` file references image filenames
   (`954shots_so.jpeg`, `981shots_so.jpeg`, `avatar.webp`),
   **When** those filenames are checked against the actual files
   in the project root, **Then** every referenced file exists with
   an exact filename match (case-sensitive).
4. **Given** a project link exists in one locale (e.g., English
   Tagen has `https://tagen.app`), **When** the other locale is
   checked, **Then** it has the same real URL (not `#`).
5. **Given** a social link has `#` as its URL in both locales,
   **When** the site renders, **Then** that social link element
   is hidden from the UI entirely (not displayed as a clickable
   dead link).

---

### Edge Cases

- What happens if `data.json` contains a key in `en` but not `ar`?
  The rendering engine MUST NOT throw — it should fall back to the
  English value or display an empty string without crashing.
- What happens if an image file referenced in `data.json` does not
  exist? The `<img>` tag should display the browser's default broken
  image indicator, not crash the rendering pipeline.
- What happens if `localStorage` contains an invalid `lang` value
  (neither `'en'` nor `'ar'`)? The system MUST default to `'en'`.
- What happens if a social link URL changes from `#` to a real URL
  in a future `data.json` update? The rendering logic MUST
  automatically show the element — hiding is conditional on the
  current value, not hardcoded.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST remove all `console.log`, `console.error`,
  and `console.warn` statements from `script.js` that are not part
  of an error-handling UI feedback path.
- **FR-002**: System MUST remove all unused CSS selectors from
  `style.css` that are not referenced by any element in `index.html`
  or dynamically created in `script.js`.
- **FR-003**: System MUST remove all dead JavaScript functions from
  `script.js` — functions that are defined but never called from any
  reachable code path.
- **FR-004**: System MUST implement a visible, styled fallback UI
  when `data.json` fails to load (network error, 404, or malformed
  JSON). The fallback MUST display a bilingual message (English
  first, Arabic below) and MUST NOT require `data.json` to render.
- **FR-005**: System MUST add a `<noscript>` element to `index.html`
  displaying a message when JavaScript is disabled.
- **FR-006**: System MUST verify all asset paths in `index.html`,
  `script.js`, and `data.json` are relative and resolve correctly
  from the project root when served by a static file server.
- **FR-007**: System MUST ensure `data.json` locale parity — every
  key in the `en` object MUST have a corresponding key in the `ar`
  object. Where a real URL exists in one locale (e.g., a project
  link), the same URL MUST be present in the other locale.
- **FR-008**: System MUST conditionally hide any social link element
  whose URL is `#` in both locales. The hiding logic MUST be dynamic
  — if the URL is later updated to a real value in `data.json`, the
  element MUST automatically appear without code changes.
- **FR-009**: System MUST validate that the `lang` value read from
  `localStorage` is one of `'en'` or `'ar'`, defaulting to `'en'`
  if invalid or absent.

### Key Entities

- **`data.json`**: The single external data source containing all
  bilingual content, social links, project data, and UI text.
  Key attributes: `en` and `ar` locale objects, each containing
  `personal_info`, `ui`, `skills`, and `projects` sections.
- **`style.css`**: Custom CSS file containing animations,
  glassmorphism effects, modal transitions, and component styles
  that supplement Tailwind utility classes.
- **`script.js`**: Vanilla JS rendering engine that fetches
  `data.json`, populates the DOM, and manages all interactivity
  (modals, navigation, language toggle, scroll observers).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Zero `console.log`/`console.error` messages originate
  from application code when the site loads and all interactive
  features are exercised (language toggle, both modals, scroll,
  mobile menu).
- **SC-002**: When `data.json` is unreachable, 100% of test
  visitors see a styled bilingual error message (English + Arabic)
  within 3 seconds — not a blank page.
- **SC-003**: Zero 404 errors in the browser Network tab when the
  site is served from a static server at the project root.
- **SC-004**: Every key in `data.json.en` has a corresponding key
  in `data.json.ar` with a non-placeholder production value.
- **SC-005**: Zero `#` links are visible and clickable in the
  rendered UI. Links with real URLs are consistent across both
  locales.
- **SC-006**: The site functions identically after all cleanup —
  no visual regressions, no broken interactions, no layout shifts.

## Assumptions

- The deployment target is a simple static file host (e.g., GitHub
  Pages, Netlify, or a basic Apache/Nginx server) that serves files
  directly from the repository root without any build step.
- The Tailwind CSS CDN (`cdn.tailwindcss.com`) remains the styling
  delivery mechanism per current project rules. Its performance
  implications are acknowledged but out of scope for this feature.
- No file minification will be performed. All CSS and JS files
  remain in their original, human-readable state.
- No changes to the project's architectural pattern (empty HTML shell
  + JS-driven rendering + external JSON data source) are in scope.
- Font loading via Google Fonts CDN is out of scope for this feature.
- Constitution-mandated refactoring (Boy Scout Rule, innerHTML
  cleanup, modular rendering) is a separate, larger initiative. This
  feature focuses only on deployment-blocking cleanliness.
- Dynamic hiding of `#` social links is implemented in `script.js`
  render logic, not via CSS or data.json structural changes. The
  `data.json` entries for unused social links remain present (with
  `#` value) so they can be activated by simply updating the URL.
