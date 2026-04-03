# Implementation Plan: Production Readiness

**Branch**: `001-production-readiness` | **Date**: 2026-04-03 | **Spec**: [spec.md](file:///d:/My%20Portfolio%20WEBSITE/specs/001-production-readiness/spec.md)
**Input**: Feature specification from `/specs/001-production-readiness/spec.md`

## Summary

Prepare the existing vanilla HTML/CSS/JS portfolio for static hosting
deployment by cleaning dead code and unused styles, adding graceful
error handling for `data.json` fetch failures, fixing all placeholder
links and data parity issues across locales, and verifying all asset
paths resolve correctly. No build tools, no minification, no
architectural changes — purely surgical cleanup and hardening.

## Technical Context

**Language/Version**: Vanilla JavaScript (ES6+), HTML5, CSS3
**Primary Dependencies**: Tailwind CSS (CDN), Google Fonts (CDN) — no installed deps
**Storage**: `data.json` (flat file, Fetch API)
**Testing**: Manual browser testing (DevTools Console + Network tab)
**Target Platform**: Static file host (GitHub Pages, Netlify, Apache/Nginx)
**Project Type**: Static single-page website (no build step)
**Performance Goals**: Zero console errors, zero 404s, zero broken links
**Constraints**: No npm, no build tools, no new dependencies, no architectural changes
**Scale/Scope**: 3 source files (`index.html`, `script.js`, `style.css`) + 1 data file + 3 images

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Zero-innerHTML Rendering | ⚠ DEFERRED | Existing innerHTML sites are out of scope for this feature (per spec.md Assumptions, L226-228). No NEW innerHTML will be introduced. Deferred refactoring tracked as future initiative `002-architectural-refactoring`. |
| II. Modular Rendering Pipeline | ⚠ DEFERRED | Render function decomposition is out of scope (per spec.md Assumptions, L226-228). No new god-function code will be added. Deferred refactoring tracked as future initiative `002-architectural-refactoring`. |
| III. Observer Lifecycle Management | ⚠ DEFERRED | Existing observer leaks are out of scope (per spec.md Assumptions, L226-228). No new observers will be created. Deferred refactoring tracked as future initiative `002-architectural-refactoring`. |
| IV. Single Source of Truth (data.json) | ✅ PASS | FR-007/FR-008 enforce data parity. No hardcoded strings will be added. The bilingual error message (FR-004) is a static HTML fallback that CANNOT come from data.json (since data.json is what failed to load) — this is a justified exception. |
| V. Asset Performance Budget | ✅ PASS | Path verification ensures all assets load. Image optimization is out of scope but no new images are added. |
| VI. Accessibility by Default | ✅ PARTIAL | FR-005 adds `<noscript>` tag. Full WCAG audit (semantic elements, ARIA attributes, focus management) deferred to `002-architectural-refactoring` (per spec.md Assumptions, L226-228). No new inaccessible elements will be introduced. |
| VII. Boy Scout Rule | ✅ PASS | Files touched by this feature will have their direct violations fixed (dead code, console statements, unused CSS). Deeper structural refactoring (innerHTML, modular rendering) is explicitly out of scope per spec assumptions. |
| VIII. Dependency Lockdown | ✅ PASS | Zero new dependencies. |

**Gate result**: PASS — No blocking violations. Deferred items are
acknowledged as separate initiatives per the spec's explicit scope
boundary.

## Project Structure

### Documentation (this feature)

```text
specs/001-production-readiness/
├── plan.md              # This file
├── research.md          # Phase 0: dead code analysis, error handling patterns
├── data-model.md        # Phase 1: data.json schema and parity requirements
├── quickstart.md        # Phase 1: verification steps
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
./                          # Project root = deployment root
├── index.html              # HTML shell (modified: noscript, error fallback)
├── script.js               # Rendering engine (modified: dead code removal,
│                           #   error handling, link hiding, localStorage validation)
├── style.css               # Custom CSS (modified: unused selector removal)
├── data.json               # Content data (modified: locale parity fixes)
├── avatar.webp             # Profile image (unchanged)
├── 954shots_so.jpeg        # Tagen project screenshot (unchanged)
└── 981shots_so.jpeg        # Go Pet project screenshot (unchanged)
```

**Structure Decision**: Flat single-directory structure. No src/,
no build output, no additional directories. All files are at the
project root, which is also the deployment root for static hosting.

## Complexity Tracking

> No constitution violations require justification. All deferred
> items are explicitly scoped out per the spec's Assumptions section.
