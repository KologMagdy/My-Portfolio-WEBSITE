# Tasks: Production Readiness

**Input**: Design documents from `/specs/001-production-readiness/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Tests**: Not requested — no test tasks included.

**Organization**: Tasks grouped by user story for independent implementation and verification.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

All source files are at the project root (`./`). No `src/` directory, no build output. The project root is the deployment root.

---

## Phase 1: Setup

**Purpose**: No project initialization needed — the project already exists. This phase covers pre-work that all user stories depend on.

- [x] T001 Validate localStorage `lang` initialization in `script.js` line 2 — replace `localStorage.getItem('lang') || 'en'` with explicit `['en', 'ar'].includes()` guard defaulting to `'en'` (FR-009)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: No foundational infrastructure tasks exist for this feature. The codebase is already functional — all work is surgical cleanup within each user story.

**⚠️ SKIP**: Proceed directly to user story phases after Phase 1.

---

## Phase 3: User Story 1 — Clean Codebase (Priority: P1) 🎯 MVP

**Goal**: Remove all dead code, unused CSS selectors, and console statements so deployed files contain only production-quality code with zero development residue.

**Independent Test**: Open the site with DevTools Console open. Zero application-generated log messages on any interaction (load, language toggle, modal open/close, scroll). View source — no unused functions, no orphaned CSS selectors.

### Implementation for User Story 1

- [x] T002 [US1] Remove the `console.error("Error loading data:", err)` statement from the `.catch()` handler in `script.js` line 25 — do NOT remove the `.catch()` block itself, only the console statement (FR-001, research.md §1)
- [x] T003 [P] [US1] Remove dead CSS selector group `.profile-social-icon` and its `:hover` variant from `style.css` lines 218–237 (research.md §3)
- [x] T004 [P] [US1] Remove dead CSS selector group `.avatar-ring` and its `:hover` variant from `style.css` lines 240–246 (research.md §3)
- [x] T005 [P] [US1] Remove dead CSS selector group `.project-spotlight-border` and all its variants from `style.css` lines 302–358 (research.md §3)
- [x] T006 [P] [US1] Remove dead CSS selector group `.project-number` and all its variants from `style.css` lines 549–577 (research.md §3)
- [x] T007 [P] [US1] Remove dead CSS selector group `.animate-marquee-infinite`, its `@keyframes`, and RTL variant from `style.css` lines 638–656 (research.md §3)
- [x] T019 [US1] Audit `script.js` for dead functions (FR-003) — trace every top-level function definition for call sites and confirm zero unreachable functions exist, or remove any found. Document results in commit message

**Checkpoint**: Site loads and functions identically. DevTools Console shows zero application messages. `style.css` is ~100 lines shorter. Zero dead JS functions remain. No visual regressions.

---

## Phase 4: User Story 2 — Graceful Data Loading (Priority: P2)

**Goal**: Handle `data.json` fetch failures gracefully with a visible bilingual error message, and ensure JavaScript-disabled visitors see a noscript fallback.

**Independent Test**: Rename `data.json` → `data.json.bak`, reload page. A styled bilingual message (English first, Arabic below) appears within 3 seconds. Restore file. Corrupt JSON content, reload — same error UI. Disable JavaScript — noscript message appears.

### Implementation for User Story 2

- [x] T008 [P] [US2] Add a `<noscript>` element to `index.html` inside `<body>` displaying a message that JavaScript is required (FR-005)
- [x] T009 [US2] Add a hidden error fallback `<div id="data-error">` to `index.html` inside the main content area with bilingual text (English first, Arabic below), styled with Tailwind classes, initially hidden via `class="hidden"` — this element MUST NOT depend on `data.json` (FR-004, research.md §6). **Acceptance constraint**: verify the error div's text content is hardcoded directly in the HTML markup, not populated by JavaScript from `data.json` or any other external source
- [x] T010 [US2] Update the `.catch()` handler in `script.js` (where T002 removed the console statement) to remove the `hidden` class from `#data-error` when `data.json` fetch fails (network error or 404) (FR-004)
- [x] T011 [US2] Add a JSON parse validation step in the `.then()` chain of the `data.json` fetch in `script.js` — if the response is not valid JSON, trigger the same `#data-error` reveal as T010 (FR-004, spec scenario 3)

**Checkpoint**: Fetch failure → bilingual error message displayed. Malformed JSON → same error message. Valid fetch → content renders normally. JavaScript disabled → noscript message visible.

---

## Phase 5: User Story 3 — Verified Asset Paths & Data Parity (Priority: P3)

**Goal**: Fix all data parity violations across locales, dynamically hide placeholder `#` links, and verify all asset paths resolve correctly for static deployment.

**Independent Test**: Serve the project from a local static server. Zero 404s in Network tab. Toggle between EN/AR — same project URLs in both. No `#` links visible or clickable. Twitter, Instagram, Facebook links hidden. "Source Code" buttons hidden in project modals.

### Implementation for User Story 3

- [x] T012 [P] [US3] Fix `data.json` parity: set `ar.projects[0].link` (Tagen) from `#` to `https://tagen.app` (data-model.md §Current Parity Violations)
- [x] T013 [P] [US3] Fix `data.json` parity: set `ar.projects[1].link` (Go Pet) from `#` to `https://gopet.net` (data-model.md §Current Parity Violations)
- [x] T014 [US3] Implement dynamic hiding logic in `script.js` render function: for each social link in `personal_info.links`, check if the URL is `#` in BOTH locales — if so, hide that link element entirely (FR-008, data-model.md §Elements to Hide)
- [x] T015 [US3] Implement dynamic hiding logic in `script.js` project modal: for each project's `source` field, check if the URL is `#` in BOTH `en` and `ar` locales — if so, hide the "Source Code" button in the project modal entirely. Apply the same cross-locale check pattern as T014 for consistency with FR-008
- [x] T020 [US3] Implement defensive locale key fallback in `script.js` render logic — when accessing a key from the active locale object, fall back to the English value if the key is missing (e.g., `data[lang].key ?? data['en'].key ?? ''`) to prevent crashes when `ar` keys lag behind `en` additions (spec.md Edge Cases, L132-134)
- [x] T016 [US3] Verify all asset paths are relative and resolve from project root — cross-check `index.html` (src, href), `script.js` (fetch), and `data.json` (image filenames) against actual files in the repo root (FR-006, research.md §5 — expected: zero changes needed, verification only)

**Checkpoint**: Zero 404s. Zero visible `#` links. Project URLs match across EN/AR. All images render. Social links with `#` in both locales are hidden. "Source Code" buttons hidden where `source` is `#`.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification across all user stories and manual quickstart validation.

- [ ] T017 Run full quickstart.md verification (all 9 steps) to confirm SC-001 through SC-006
- [ ] T018 [P] Verify no visual regressions: load site in EN desktop, resize to mobile, toggle to AR — confirm all sections render correctly with no layout shifts (SC-006)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: SKIPPED — no blocking infrastructure needed
- **Phase 3 (US1 — Clean Codebase)**: Depends on Phase 1 (T001)
- **Phase 4 (US2 — Graceful Data Loading)**: Depends on Phase 3 (T002 removes the console.error that T010 replaces with UI feedback)
- **Phase 5 (US3 — Asset Paths & Data Parity)**: Can start after Phase 1 — independent of US1 and US2
- **Phase 6 (Polish)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Start after T001. No cross-story dependencies.
- **US2 (P2)**: Start after US1 T002 (the `.catch()` handler cleanup is a prerequisite for the error UI implementation).
- **US3 (P3)**: Start after T001. Independent of US1 and US2 — touches `data.json` and render logic for link hiding, which are different code paths.

### Within Each User Story

- US1: T002 first (JS), then T003–T007 in parallel (CSS — all different line ranges), then T019 (dead function audit — after CSS cleanup to avoid false positives from removed references)
- US2: T008 and T009 in parallel (both HTML, but different elements), then T010, then T011 (sequential JS changes to same fetch chain)
- US3: T012 and T013 in parallel (different JSON entries), then T014, then T015, then T020 (sequential render logic), then T016 (verification)

### Parallel Opportunities

- **US1 CSS tasks**: T003, T004, T005, T006, T007 — all target non-overlapping line ranges in `style.css`
- **US2 HTML tasks**: T008 and T009 — different elements in `index.html`
- **US3 JSON tasks**: T012 and T013 — different locale entries in `data.json`
- **US3 vs US1**: US3 can start in parallel with US1 if desired (no shared files for T012/T013)
- **Polish**: T017 and T018 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Sequential first (JS file):
Task T002: "Remove console.error from .catch() handler in script.js"

# Then parallel (CSS file, non-overlapping ranges):
Task T003: "Remove .profile-social-icon from style.css lines 218-237"
Task T004: "Remove .avatar-ring from style.css lines 240-246"
Task T005: "Remove .project-spotlight-border from style.css lines 302-358"
Task T006: "Remove .project-number from style.css lines 549-577"
Task T007: "Remove .animate-marquee-infinite from style.css lines 638-656"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001 — localStorage validation)
2. Complete Phase 3: User Story 1 (T002–T007, T019 — dead code removal and audit)
3. **STOP and VALIDATE**: Zero console messages, zero dead CSS, zero dead functions, site functions identically
4. Deploy if ready — the site is already clean

### Incremental Delivery

1. T001 → localStorage is safe → Foundation ready
2. US1 (T002–T007, T019) → Clean codebase → Verify SC-001 (MVP!)
3. US2 (T008–T011) → Error handling → Verify SC-002
4. US3 (T012–T016, T020) → Data parity, link hiding & locale fallback → Verify SC-003, SC-004, SC-005
5. Polish (T017–T018) → Full quickstart validation → Verify SC-006
6. Each story adds resilience without breaking previous work

---

## Notes

- [P] tasks = different files or non-overlapping ranges, no dependencies
- [Story] label maps task to specific user story for traceability
- No test tasks generated (not requested in spec)
- Line numbers reference the current state of files per research.md audit
- Commit after each phase checkpoint
- Total: 20 tasks across 6 phases
