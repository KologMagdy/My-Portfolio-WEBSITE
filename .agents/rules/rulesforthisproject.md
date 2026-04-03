---
trigger: always_on
---

1. Core Tech Stack (Strictly Enforced)
Markup: Semantic HTML5 ONLY. The <html> tag must dynamically support both lang="ar" dir="rtl" and lang="en" dir="ltr"Styling: Tailwind CSS (via CDN only). Do not write custom CSS unless explicitly commanded.
Scripting: Vanilla JavaScript (ES6+) exclusively.
Data Source: All content MUST be fetched asynchronously from the external `data.json` file using the Fetch API.

2. Forbidden Technologies (Zero Tolerance)
NO Frontend Frameworks: Do not use or suggest React, Next.js, Vue, Astro, or Svelte.
NO Libraries: Do not use jQuery or Alpine.js.
NO UI Component Frameworks: Do not use Bootstrap, Material-UI, or pre-built Tailwind component libraries.
NO Build Tools: Do not use Webpack, Vite, npm, or node_modules.

3. Architectural Constraints
Separation of Concerns: Do not hardcode project details, skills, or bio into the HTML tags.
Dynamic UI: The UI architecture requires an empty HTML shell that gets populated dynamically by JavaScript fetching and parsing the `data.json` file.
Mobile-First: The Tailwind CSS approach must be strictly mobile-first (default to mobile classes, use md: and lg: prefixes for larger screens), Use logical properties (e.g., ps-, pe-, ms-, text-start) instead of physical properties (pl-, pr-, ml-, text-left) to support seamless RTL/LTR flipping.
Data Visualization: Do not use percentages or progress bars when rendering technical skills.