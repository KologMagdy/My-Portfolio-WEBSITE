<!--
  ═══════════════════════════════════════════════════════
  SYNC IMPACT REPORT
  ═══════════════════════════════════════════════════════
  Version change: 1.0.0 → 1.1.0
  Bump rationale: MINOR — Principle VII materially expanded
    with a new Scoped Deferral exception clause. No
    principles removed or redefined.

  Modified Principles:
    VII. Boy Scout Rule (Mandatory Refactoring)
      → Added "Scoped Deferral Exception" sub-section
        permitting features to defer structural refactoring
        when the feature spec explicitly excludes
        architectural changes, subject to documentation
        requirements.

  Modified Sections:
    - Code Quality Gates: Updated "Boy Scout compliance"
      gate to reference the scoped deferral exception.

  Added Sections: None
  Removed Sections: None

  Templates requiring updates:
    - .specify/templates/plan-template.md      ✅ No update needed
        (Constitution Check section already supports ⚠ DEFERRED
        status annotations — the new exception clause formalizes
        existing practice)
    - .specify/templates/spec-template.md       ✅ No update needed
        (Assumptions section already supports scope boundaries)
    - .specify/templates/tasks-template.md      ✅ No update needed
        (Phase structure and polish section unchanged)
    - .agents/rules/rulesforthisproject.md      ✅ No update needed
        (No references to Boy Scout Rule)

  Follow-up TODOs: None.
  ═══════════════════════════════════════════════════════
-->

# Portfolio V1 Constitution

## Core Principles

### I. Zero-innerHTML Rendering

All DOM content MUST be constructed using the safe DOM API
(`document.createElement`, `textContent`, `setAttribute`,
`appendChild`). The use of `innerHTML`, `outerHTML`, or
`insertAdjacentHTML` to inject content is **strictly forbidden**
in all new and modified code.

**Rationale**: `innerHTML` with interpolated data is a
textbook XSS vector. Even with a static `data.json` today,
this data source will migrate to a Laravel backend in V2.
Building the habit of safe DOM construction now prevents a
class of vulnerabilities from ever existing.

**The only exception**: Static SVG icon literals defined as
constants (e.g., `projectIcons`) MAY use `innerHTML` to inject
into a container that receives no user-derived or data-derived
values. Every such usage MUST be commented with
`// SAFE: static SVG literal, no interpolated data`.

### II. Modular Rendering Pipeline

The rendering engine (`script.js`) MUST be decomposed into
discrete, single-responsibility functions. Each function MUST
own exactly one UI section or concern.

**Required module boundaries** (minimum):
- `renderHero(data)` — hero section content
- `renderSkills(data)` — skills grid construction
- `renderProjects(data)` — project cards and grid
- `renderContact(data)` — contact board content
- `renderNav(data)` — navigation text and links
- `renderFooter(data)` — footer content
- `renderProfileModal(data)` — profile card modal content
- `bindSocialLinks(links)` — single function to populate all
  social link anchors across all components (nav, contact,
  profile modal, mobile drawer)

The top-level `render(lang)` function MUST be a thin
orchestrator that calls these sub-functions. No sub-function
may exceed 60 lines. If it does, split further.

**Rationale**: A 290-line god function is unmaintainable and
untestable. Modular rendering enables isolated debugging,
reduces merge conflicts, and makes each section independently
comprehensible.

### III. Observer Lifecycle Management

Every `IntersectionObserver`, `MutationObserver`,
`ResizeObserver`, or event listener created during a render
cycle MUST be tracked and explicitly disconnected/removed
before a new render cycle begins.

**Required pattern**:
```javascript
// Module-level reference
let revealObserver = null;

function initProjectReveal() {
    // Disconnect previous observer if exists
    if (revealObserver) revealObserver.disconnect();

    revealObserver = new IntersectionObserver(/* ... */);
    // ...
}
```

**Rationale**: Creating new observers on every language toggle
without disconnecting the old ones is a memory leak. Over N
toggles, N redundant observers accumulate watching the same
DOM nodes.

### IV. Single Source of Truth (data.json)

**Every** user-visible text string, label, link, and content
value MUST originate from `data.json`. No exceptions.

This explicitly includes:
- Navigation labels ("About", "Skills", etc.)
- Button text, modal labels, section headers
- Social link URLs
- Meta descriptions and page titles

Hardcoding translatable strings in `script.js` (e.g., a
`navTranslations` object), `index.html`, or `style.css` is a
**constitution violation**.

**Data parity rule**: Every key present in `data.json.en`
MUST have an equivalent key in `data.json.ar` with a
meaningful, non-placeholder value. If a value is intentionally
identical across languages (e.g., a URL), it MUST still be
explicitly declared in both locale objects.

**Rationale**: The PRD mandates strict data/presentation
decoupling. Scattering translations across JS defeats the
entire architecture and makes i18n maintenance error-prone.

### V. Asset Performance Budget

All image assets served to the browser MUST comply with:
- **Format**: WebP preferred. JPEG/PNG only when WebP is
  technically infeasible.
- **File size**: No single image asset may exceed **200KB**.
- **Responsive images**: All `<img>` tags rendering
  content images (not UI icons) MUST use `srcset` and `sizes`
  attributes, or at minimum provide a reasonably sized source
  for mobile viewports.
- **Lazy loading**: All below-the-fold images MUST include
  `loading="lazy"`.

**CSS animation rule**: Any CSS animation using
`animation: ... infinite` MUST NOT run when its containing
element is outside the viewport. Use `IntersectionObserver`
to add/remove an `.animating` class, or use
`animation-play-state: paused` with visibility detection.

**Tailwind CDN**: The project currently uses `cdn.tailwindcss.com`
per the project rules constraint. This is acknowledged as a
performance liability. When the project rules are amended to
allow a build step, migrating to a compiled Tailwind output
MUST be the first action.

**Rationale**: The PRD mandates 95+ Lighthouse scores. Serving
920KB JPEGs and running infinite GPU animations on off-screen
elements is incompatible with that goal.

### VI. Accessibility by Default

All interactive elements MUST meet baseline WCAG 2.1 Level A:

- **Clickable non-link, non-button elements**: Any `<div>` or
  `<span>` with an `onclick` handler MUST be replaced with a
  `<button>` (for actions) or `<a>` (for navigation). If a
  semantic element is truly inappropriate, the element MUST
  have `role="button"`, `tabindex="0"`, and a `keydown`
  handler for Enter/Space.
- **Modals**: MUST have `role="dialog"` and
  `aria-modal="true"`. Focus MUST be trapped inside the modal
  while open and restored to the trigger element on close.
- **Lists**: Skill lists and project grids MUST use semantic
  `<ul>/<li>` markup (styled with Tailwind), not `<div>` soup.
- **Heading hierarchy**: Exactly one `<h1>` per page. All
  subsequent headings MUST follow a logical descending order
  (`<h2>`, `<h3>`, etc.) with no skipped levels.
- **`<noscript>` fallback**: The `index.html` MUST include a
  `<noscript>` tag with a meaningful message indicating that
  JavaScript is required.

**Rationale**: A portfolio targeting technical recruiters will
be evaluated on engineering quality. Inaccessible markup
signals carelessness. Screen readers, keyboard navigation,
and semantic HTML are non-negotiable fundamentals.

### VII. Boy Scout Rule (Mandatory Refactoring)

**"Leave every file cleaner than you found it."**

Any modification to an existing file MUST include refactoring
that file to comply with this constitution's principles
**before** adding new logic. This is non-negotiable.

Specifically, when touching a file:
1. **Audit first**: Scan the file for innerHTML usage,
   hardcoded strings, accessibility violations, observer
   leaks, or god-function patterns.
2. **Refactor**: Fix all identified violations in scope.
3. **Then extend**: Only after the file is clean, add the
   new feature or fix.

If the refactoring scope is too large to include in the
current task, the developer MUST:
- File the refactoring as a separate, blocking prerequisite
  task.
- Complete the refactoring task first.
- Then proceed with the original work.

#### Scoped Deferral Exception

A feature MAY defer Boy Scout refactoring for specific
constitution principles when **all** of the following
conditions are met:

1. **Explicit scope boundary**: The feature's `spec.md`
   Assumptions section explicitly states that architectural
   or structural refactoring is out of scope.
2. **Documented in plan.md**: The feature's `plan.md`
   Constitution Check table marks the deferred principles
   with `⚠ DEFERRED` status and a rationale explaining why
   the deferral is justified for this feature.
3. **No new violations introduced**: The feature MUST NOT
   introduce any new instances of the deferred violation
   pattern. Deferral applies only to pre-existing violations
   in the file.
4. **Follow-up initiative**: The plan.md MUST acknowledge the
   deferred refactoring as a separate, future initiative.
   This initiative MUST be tracked (e.g., as a separate
   feature spec or a documented backlog item).

**What this exception does NOT permit**:
- Silently ignoring violations without documentation.
- Deferring violations that the current feature's scope
  directly addresses (e.g., a "code cleanup" feature cannot
  defer dead code removal).
- Adding new code that violates a deferred principle (only
  pre-existing violations are deferred, not new ones).

**Rationale**: Some features are narrowly scoped by design
(e.g., deployment hardening, data parity fixes). Forcing a
full architectural refactoring into a cleanup-focused feature
conflates two distinct initiatives, inflates scope 2–4x, and
increases risk. The deferral exception preserves the Boy Scout
Rule's intent (trending toward quality) while respecting
deliberate scope boundaries. The documentation requirements
ensure deferrals are transparent, not silent.

### VIII. Dependency Lockdown

No external library, framework, CDN resource, polyfill, or
third-party script may be added to the project without
**explicit, documented user approval**.

This includes but is not limited to:
- JavaScript libraries (jQuery, Alpine, GSAP, etc.)
- CSS frameworks beyond the approved Tailwind CDN
- Icon libraries (Font Awesome, Heroicons CDN, etc.)
- Analytics scripts, tracking pixels, or third-party embeds
- Google Fonts additions beyond the currently approved set
  (Inter, JetBrains Mono, IBM Plex Sans Arabic)

**Process**: Before proposing any new dependency, present:
1. What problem it solves
2. Why vanilla JS/CSS cannot solve it
3. Bundle size / performance impact
4. Security/privacy implications

**Rationale**: The PRD and project rules explicitly forbid
frameworks, libraries, and build tools. This principle
extends that prohibition to any form of external dependency
creep — even "small" utility scripts.

## Forbidden Patterns

The following patterns are explicitly banned. Any code review
or modification that introduces these MUST be rejected:

| Pattern | Why Banned | Use Instead |
|---------|-----------|-------------|
| `el.innerHTML = '...' + variable` | XSS vector | `createElement` + `textContent` |
| Hardcoded UI text in `.js`/`.html` | Breaks i18n decoupling | Add key to `data.json` |
| `new IntersectionObserver()` without tracking | Memory leak | Module-level ref + `.disconnect()` |
| `<div onclick="...">` | Not keyboard accessible | `<button>` with proper handler |
| Multiple `<h1>` tags | Breaks heading hierarchy | Single `<h1>`, use `<h2>+` |
| Images > 200KB | Fails performance budget | Compress/convert to WebP |
| `function()` > 60 lines | God function anti-pattern | Decompose into sub-functions |
| Duplicate link-binding logic | DRY violation | Single `bindSocialLinks()` |
| `#` as production href | Broken UX / misleading | Real URL or remove element |
| Physical CSS properties (`pl-`, `ml-`, `text-left`) | Breaks RTL | Logical (`ps-`, `ms-`, `text-start`) |

## Code Quality Gates

Before any change is considered complete, it MUST pass:

- [ ] **No innerHTML with interpolated data**: Grep
  `innerHTML` — every hit is either a static SVG literal
  with the `// SAFE:` comment or a violation.
- [ ] **No hardcoded UI strings**: All user-visible text
  traces back to a `data.json` key.
- [ ] **Data parity**: Every `en` key exists in `ar` with a
  non-placeholder value. No `#` links in one locale when a
  real URL exists in the other.
- [ ] **Observer cleanup**: Every observer creation has a
  corresponding `.disconnect()` in the re-render path.
- [ ] **Function length**: No function exceeds 60 lines.
- [ ] **Accessibility**: Interactive elements are semantic
  (`<button>`/`<a>`), modals have ARIA attributes, lists use
  `<ul>/<li>`.
- [ ] **Image budget**: No image > 200KB. Content images have
  `loading="lazy"`.
- [ ] **Boy Scout compliance**: If the file existed before
  this change, pre-existing violations in the file are fixed
  — unless a valid Scoped Deferral Exception (Principle VII)
  is documented in plan.md with `⚠ DEFERRED` status.
- [ ] **Single entry point**: Exactly one `DOMContentLoaded`
  listener in `script.js`.

## Governance

This constitution is the **supreme authority** for all code
decisions in this project. It supersedes general coding
preferences, external style guides, and AI default behaviors.

**Amendment procedure**:
1. Propose the change with rationale.
2. Document the impact on existing code.
3. Obtain explicit user approval.
4. Update this document with a version bump.
5. Propagate changes to dependent templates if affected.

**Versioning policy**: Semantic versioning.
- **MAJOR**: Principle removal, redefinition, or
  backward-incompatible governance change.
- **MINOR**: New principle added or existing principle
  materially expanded.
- **PATCH**: Clarification, wording fix, or non-semantic
  refinement.

**Compliance review**: Every code modification MUST be checked
against the Code Quality Gates section before completion.
Violations discovered post-merge MUST be remediated in the
immediately following task — they do not accumulate.

**Version**: 1.1.0 | **Ratified**: 2026-04-03 | **Last Amended**: 2026-04-03
