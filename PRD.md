Product Requirements Document (PRD)

Product Name: Personal Portfolio V1 (Static-to-Dynamic Pipeline)


1. Executive Summary & Objective

The objective of this project is to build a highly performant, single-page personal portfolio. The primary goal is to establish a professional web presence to showcase commercial projects (e.g., Tagen, Go Pet) to potential clients and technical recruiters. The architecture must strictly separate data from presentation to allow seamless migration to a Laravel Blade architecture in V2.

2. Target Audience & Personas

Persona 1: The Freelance Client. Looking for proof of reliable delivery, clear communication, and past commercial success. They care about business outcomes, not code.

Persona 2: The Technical Recruiter / Tech Lead. Looking for clean architectural decisions, performance awareness, and core software engineering fundamentals. They care about the tech stack and structural decisions.

3. User Stories

US1: As a visitor, I want to immediately understand the developer's core value proposition (Hero section) so that I know if they fit my business or technical needs.

US2: As a technical recruiter, I want to see a clearly categorized list of core competencies vs. delivery tools, so I can accurately assess the developer's true depth and expertise.

US3: As a potential client, I want to read brief case studies of shipped projects to verify real-world experience and problem-solving capabilities.

US4: As a developer (admin/owner), I want to update my skills and projects by editing a single data source (Data Layer) without needing to alter or recompile the UI codebase (Presentation Layer).

4. Functional Requirements (FRs)

FR1 - Hero Module: The system must display the user's Name, Title, a conversion-focused tagline, and explicit Call-to-Action (CTA) buttons (e.g., "View Work", "Download Resume").

FR2 - Skills Matrix: The system must display categorized skills (Core, Frontend, Delivery Tools) fetched dynamically from a structured data format. Constraint: No arbitrary proficiency percentages or progress bars are allowed.

FR3 - Project Showcase: The system must display at least two flagship projects. Each project entry must include a description focusing on the business problem/solution, technical stack tags, and a live URL.

FR4 - Contact Module: The system must provide direct outbound links to GitHub, LinkedIn, and Email.

5. Non-Functional Requirements (NFRs)

Performance: The page must achieve a 95+ score on Google Lighthouse across both Mobile and Desktop audits (Fast LCP and TBT).

Maintainability (Strict Decoupling): The UI layer must be completely decoupled from the data layer. Data must be sourced from a standardized JSON structure, mimicking a headless approach.

Portability & Future-Proofing: The markup must be strictly semantic HTML5 heavily relying on utility classes (Tailwind paradigm) without any frontend framework lock-in (No React, Next.js, or Vue). This guarantees 100% compatibility for future Laravel Blade integration.

Responsiveness: The interface must be fully responsive utilizing a strictly mobile-first approach.

6. Out of Scope (For V1)

A backend Content Management System (CMS) or Admin Dashboard.

Authentication, Authorization, or User Login systems.

Complex WebGL, heavy JavaScript animations, or scroll-hijacking.

Server-Side Rendering (SSR) frameworks.