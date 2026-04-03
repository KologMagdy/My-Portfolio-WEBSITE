---
description: Execute Phase 4: Polish & Optimization. Implement CSS smooth scrolling, Neo-Brutalist hover interactions (translates & shadows), Accessibility (ARIA labels), and final code cleanup for Production.
---

TASK: Execute Phase 4 (Polish & Optimization - Production Ready)

CONTEXT: The HTML is semantic, the Neo-Brutalist UI is applied, and the dynamic JS data is injected. Now, we add the final engineering polish for a 95+ Lighthouse score and premium UX. Obey .cursorrules strictly.

Your goal is to finalize the CSS/Tailwind interactions, ensure accessibility, and clean up the codebase.

EXECUTION STEPS

Step 1: Smooth Scrolling

In index.html, add scroll-smooth to the <html> tag so that anchor links (like the "View My Work" CTA) scroll smoothly to their target sections.

Step 2: Neo-Brutalist Hover & Active States

Target all interactive elements (Buttons, Project Cards, Social Links).
Apply strict Neo-Brutalist hover effects using Tailwind.
When hovered or active, the element should appear to be pressed down physically:

Add: transition-all duration-200

Add: hover:-translate-y-0.5 hover:translate-x-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] (Adjust shadow size to be smaller than the default shadow to simulate pressing).

Add: active:translate-y-1 active:translate-x-1 active:shadow-none (Fully pressed state).

Step 3: Accessibility (A11y) Audit

Ensure all <a> and <button> tags have appropriate aria-label attributes if their text content isn't 100% descriptive (e.g., GitHub icon links).

Ensure any <img> tags (if used for project placeholders) have descriptive alt attributes.

Verify color contrast ratios are high (Neo-Brutalism usually guarantees this, but double-check text on bright backgrounds).

Step 4: Final Code Cleanup

Review index.html and script.js.

Remove any unused commented-out code or console.logs.

Ensure consistent indentation.

Verify that NO external animation libraries (like GSAP or Framer Motion) were added. Stick to pure Tailwind CSS transitions.

END OF PHASE 4

Output the final, polished versions of index.html and script.js. STOP execution. The project is now complete.