# Phase 0: Research

All `NEEDS CLARIFICATION` points from the Technical Context have been resolved in the Clarification phase. 

## Decisions

- **Decision**: Break continuous words across lines to fit their container.
  - **Rationale**: Long URLs or continuous strings will break responsive layouts natively on narrow screens if forced onto a single line.
  - **Alternatives considered**: JavaScript resizing, horizontal scrolling (rejected per SC-002).

- **Decision**: Strictly pure CSS for specific tricky elements (like the footer watermark) using fluid typography or CSS grid/flex wrapping.
  - **Rationale**: Keeps rendering tied to native browser features, reducing CPU load and JS dependency structure.
  - **Alternatives considered**: JS observers for layout (rejected per constraint FR-005).

- **Decision**: Standardize text truncation on multi-line elements using CSS `line-clamp` via Tailwind's `line-clamp-[n]`.
  - **Rationale**: Gracefully accommodates long localized strings without breaking block sizing.
  - **Alternatives considered**: Unbounded vertical expansion, strict heights with overflow hidden (rejected per FR-004).
