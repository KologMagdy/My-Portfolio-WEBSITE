---
description: "Task list for Fix Text Clipping implementation"
---

# Tasks: Fix Text Clipping

**Input**: Design documents from `/specs/002-fix-text-clipping/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

*(No specific setup required for this CSS-only layout feature, as the project structure already exists.)*

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

*(No blocking backend/infrastructure prerequisites for this CSS-only layout feature.)*

**Checkpoint**: Foundation ready - user story implementation can start.

---

## Phase 3: User Story 1 - Read Website Content Without Clipping (Priority: P1) 🎯 MVP

**Goal**: Ensure all textual content wraps, breaks, or clamps appropriately to prevent any hidden or clipped text across English (LTR) and Arabic (RTL) views on all device sizes.

**Independent Test**: Can be fully tested by browsing the entire website in both languages across different screen sizes (down to 320px) and verifying that no text is cut off or causes horizontal scrolling.

### Implementation for User Story 1

- [ ] T001 [P] [US1] Apply `break-words` and `break-all` Tailwind utilities to long text containers (paragraphs, headings) in `index.html` to ensure exceptionally long URLs or continuous words wrap correctly.
- [ ] T002 [P] [US1] Apply Tailwind `line-clamp` utilities (e.g., `line-clamp-[n]`) to standard multi-line elements like bio and project descriptions in `index.html`.
- [ ] T003 [P] [US1] Refactor the footer watermark formatting in `index.html` to use wrapping or fluid scaling instead of strict bounding, explicitly preventing text clipping on narrow viewports.
- [ ] T004 [P] [US1] Remove fixed height (`h-*`) restrictions from multiline text containers in `index.html` to allow natural vertical expansion where `line-clamp` is not applied.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. All text must be visible without horizontal scroll.

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T005 [P] Test and verify LTR and RTL direction rendering on Mobile S (320px) up to Desktop using browser dev tools.
- [ ] T006 [P] Verify no JavaScript measurements or resize calculations are used for text bounding in `script.js`.
- [ ] T007 Run Lighthouse audit to confirm >95 scores for Accessibility and Best Practices.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Complete.
- **Foundational (Phase 2)**: Complete.
- **User Stories (Phase 3+)**: Ready to run.
- **Polish (Final Phase)**: Depends on User Story 1 completion.

### User Story Dependencies

- **User Story 1 (P1)**: Can start immediately. No dependencies.

### Within Each User Story

- Ensure all `index.html` changes adhere to mobile-first Taildwind and logical CSS properties (`ps-`, `pe-`).

### Parallel Opportunities

- T001, T002, T003, and T004 all target different types of elements within `index.html` and can be approached simultaneously or sequentially.

---

## Parallel Example: User Story 1

```bash
# Update text truncations and word breaking:
Task: "Apply `break-words` and `break-all` Tailwind utilities..."
Task: "Apply Tailwind `line-clamp` utilities..."
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 3: User Story 1
2. **STOP and VALIDATE**: Test User Story 1 independently in browser via RTL/LTR toggle.
3. Deploy/demo if ready.
