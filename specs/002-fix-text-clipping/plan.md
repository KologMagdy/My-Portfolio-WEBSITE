# Implementation Plan: Fix Text Clipping

**Branch**: `002-fix-text-clipping` | **Date**: 2026-04-05 | **Spec**: [specs/002-fix-text-clipping/spec.md](spec.md)
**Input**: Feature specification from `/specs/002-fix-text-clipping/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implement a series of responsive, purely CSS-based (Tailwind) layout adjustments to resolve text clipping issues across both English (LTR) and Arabic (RTL) locales. This involves using utility classes like `break-words`, `break-all`, and `line-clamp` instead of relying on JavaScript to calculate viewport bounds or restricting text containers with fixed dimensions.

## Technical Context

**Language/Version**: HTML5, Vanilla JS (ES6+), CSS3
**Primary Dependencies**: Tailwind CSS (via CDN)
**Storage**: N/A
**Testing**: Multi-viewport visual inspection, Lighthouse audits
**Target Platform**: Web browsers (Mobile, Tablet, Desktop)
**Project Type**: Static web portfolio
**Performance Goals**: >95 Lighthouse Accessibility and Best Practices scores
**Constraints**: Fully mobile-first, strict zero-JS for text bounding, logical CSS properties (`ps-`, `ms-`) for RTL compatibility.
**Scale/Scope**: UI/Presentation layer only; resolving text overflow bugs across the site.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Zero-innerHTML Rendering**: Complies. Change is strictly CSS/Tailwind utility classes.
- [x] **IV. Single Source of Truth**: Complies. No text content changes, only formatting changes.
- [x] **V. Asset Performance Budget**: Complies. No new assets or large JS calculations.
- [x] **VI. Accessibility by Default**: Complies. Eliminating horizontal scrolling improves accessibility.
- [x] **VII. Boy Scout Rule**: ⚠ DEFERRED. The `spec.md` states "This is purely a UI/Presentation layer feature". Widespread script refactoring is out of scope to avoid scope creep for a layout fix task, per the Scoped Deferral Exception.
- [x] **VIII. Dependency Lockdown**: Complies. Using existing Tailwind CDN. No new dependencies.

## Project Structure

### Documentation (this feature)

```text
specs/002-fix-text-clipping/
├── plan.md              # This file
├── research.md          # Output of Phase 0
├── data-model.md        # Phase 1 output (Null implementation)
├── quickstart.md        # Phase 1 output
└── tasks.md             # To be populated by /speckit-tasks
```

### Source Code (repository root)

```text
/
├── index.html           # Main markup container
├── style.css            # Custom CSS properties/fonts
└── script.js            # Translation data injection engine
```

**Structure Decision**: Single page static layout architecture. Modifications will be highly localized to HTML classes (Tailwind utilities) inside `index.html` and any dynamic tags injected via `script.js`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Boy Scout Rule | Narrow scope | This fix is strictly UI/CSS classes preventing regressions during extensive architectural refactoring. It should remain separate. |

