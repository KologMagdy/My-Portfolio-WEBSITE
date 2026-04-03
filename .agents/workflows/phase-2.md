---
description: Execute Phase 2: Static UI (Neo-Brutalism Theme) with RTL/LTR support preparation. Applies thick borders, hard shadows, and a Language Toggle button. Uses temporary text. NO JS yet.
---

# TASK: Execute Phase 2 (Static UI Construction - Neo-Brutalism)
# CONTEXT: Build upon the audited `index.html`. Obey the global rules strictly. Ensure layout works for both RTL and LTR.

## STRICT NEO-BRUTALISM & RTL RULES
1. **Borders & Shadows:** Use `border-4 border-black` (or `border-8`). Use hard shadows like `shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`.
2. **Colors:** Use aggressive palettes (`bg-yellow-400`, `bg-pink-500`, `bg-cyan-400`, `bg-white`, `bg-[#f4f4f0]`).
3. **Typography:** Use `font-black` for headers, `font-bold` for body.
4. **Logical Properties ONLY:** NEVER use physical directions (`ml-`, `pr-`, `text-left`, etc.). YOU MUST USE `ms-`, `me-`, `ps-`, `pe-`, `text-start`, `text-end`.

## EXECUTION STEPS (Update `index.html` ONLY)
Use temporary Arabic placeholder text. DO NOT write JavaScript.

### Step 1: Body & Navbar
Apply to `<body>`: `bg-[#f4f4f0] text-black font-sans selection:bg-pink-500 selection:text-white`.
Inside `<body>`, add `<nav class="p-4 border-b-4 border-black flex justify-end bg-white">`.
Inside it, create button `id="lang-toggle"` (Text: "English", `bg-yellow-400 border-4 border-black px-6 py-2 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`).

### Step 2: Hero Section (`<header id="hero">`)
Make it `min-h-[80vh] flex flex-col justify-center items-start p-8 md:p-16 border-b-8 border-black`.
Add massive placeholder Name (`id="hero-name"`), Title (`id="hero-title"`), Tagline (`id="hero-tagline"`).
Create two Brutalist CTA buttons (one `bg-cyan-400`, one `bg-white` with `id="hero-email"`).

### Step 3: Skills Section (`<section id="skills">`)
Make it `p-8 md:p-16 border-b-8 border-black`. Add bold title.
Create grid: `<div id="skills-grid" class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8"></div>`.
Inside it, place ONE Brutalist card template (with temporary background, thick border, hard shadow, placeholder category title, and placeholder skill tags).

### Step 4: Projects Section (`<section id="projects">`)
Make it `p-8 md:p-16 bg-cyan-400 border-b-8 border-black`. Add bold title (`id="projects-title"`).
Create grid: `<div id="projects-grid" class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8"></div>`.
Inside it, place ONE Brutalist card template (`bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]` with placeholder text and "Visit" button).

### Step 5: Footer (`<footer id="contact">`)
Make it `bg-pink-500 p-8 md:p-16 text-black border-t-8 border-black text-center`. Add brutalist links (`id="footer-github"`, `id="footer-linkedin"`).

# END OF PHASE 2
Output the updated `index.html`. STOP execution.