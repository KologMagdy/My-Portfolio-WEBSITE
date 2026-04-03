---
description: Execute Phase 3: Dynamic Data Integration. Create script.js to fetch data from the embedded JSON and dynamically populate the DOM. Must strictly preserve Neo-Brutalism Tailwind classes. Vanilla JS only.
---



CONTEXT: You have built the HTML structure and the Neo-Brutalist UI with placeholder text. Now, we inject the real data. Obey the global .cursorrules strictly.

Your goal is to write Vanilla JavaScript that reads the embedded JSON data and dynamically populates the UI, replacing the placeholder Arabic text.

EXECUTION STEPS

Step 1: Link the Script

At the bottom of index.html (just before closing </body>), add a script tag linking to a new file: <script src="script.js"></script>.

Step 2: Create script.js & Fetch Data

Create script.js. Write an IIFE (Immediately Invoked Function Expression) or a DOMContentLoaded event listener.
Inside, parse the data:
const data = JSON.parse(document.getElementById('portfolio-data').textContent);

Step 3: Populate Hero Section

Target the elements in <header id="hero">.
Update the text content for the Name, Title, and Tagline using data.personal_info.
Update the href attribute of the "Contact" or "Email" CTA button to data.personal_info.links.email.

Step 4: Populate Skills Section dynamically

Target the grid container inside <section id="skills">.

Clear its innerHTML completely.

Iterate over the categories in data.skills (core, frontend, delivery_tools).

For each category, create a Brutalist card (use the EXACT same Tailwind classes generated in Phase 2: border-4 border-black, hard shadows, bright backgrounds).

Inject the array of skills as a comma-separated string or a list of tags inside that card.

Append these cards back to the grid container.

Step 5: Populate Projects Section dynamically

Target the grid container inside <section id="projects">.

Clear its innerHTML completely.

Iterate over data.projects.

For each project, construct the HTML string or DOM elements for the Brutalist card (preserve EXACT Phase 2 Tailwind classes: bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]).

Inject project.name, project.description, map over project.tech_stack to create small Brutalist tags, and set the link href to project.link.

Append the project cards to the container.

Step 6: Populate Footer

Target <footer id="contact">. Update the links for GitHub and LinkedIn using data.personal_info.links. Update the email text if necessary.

STRICT RULES FOR JS

NO Frameworks (No React, Next, Vue).

Use ES6+ features (template literals, arrow functions, destructuring).

Ensure that the generated HTML strings exactly match the Neo-Brutalist classes from Phase 2. Do not lose the hard shadows or thick borders.

END OF PHASE 3

Output the updated index.html and the newly created script.js. STOP execution.