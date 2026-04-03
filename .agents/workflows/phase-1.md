---
description: Execute Phase 1: Scaffolding & Data. Creates index.html with Semantic HTML5, Tailwind CDN, and embedded JSON data layer. Strict rule: NO UI layout or JavaScript logic yet.
---

TASK: Execute Phase 1 (Data Scaffolding & Skeleton)

CONTEXT: You are building V1 of a Personal Portfolio. Obey the global .cursorrules strictly.

Execute the following steps sequentially. DO NOT write any Tailwind classes in the body yet. DO NOT write any JavaScript.

Step 1: File Setup

Create index.html.

Set <html lang="ar" dir="rtl">.

Include Tailwind CSS CDN in <head>.

Add appropriate <title> and <meta name="viewport" content="width=device-width, initial-scale=1.0">.

Step 2: Data Layer Injection

Inject this exact JSON inside a <script type="application/json" id="portfolio-data"> tag in the <head>:

{
  "personal_info": {
    "name": "كلوج مجدي موريس",
    "title": "Software Engineer | Full-Stack Developer",
    "tagline": "أركز على بناء أنظمة قابلة للتوسع وتسليم حلول برمجية تجارية قوية في الموعد.",
    "links": { "github": "#", "linkedin": "#", "email": "mailto:your-email@example.com" }
  },
  "skills": {
    "core": ["PHP", "MySQL", "C++", "JavaScript", "OOP"],
    "frontend": ["HTML", "Tailwind CSS"],
    "delivery_tools": ["React", "Next.js", "Astro"]
  },
  "projects": [
    {
      "name": "طاجن (Tagen)",
      "description": "منصة تجارة إلكترونية. تم التركيز على الإطلاق الفعلي (Production) والتعامل مع مستخدمين حقيقيين.",
      "tech_stack": ["Next.js", "Tailwind CSS"],
      "link": "#"
    },
    {
      "name": "Go Pet",
      "description": "موقع خدمي للربط بين العملاء والوكلاء. التركيز على سرعة التسليم وتلبية متطلبات العميل بدقة هندسية.",
      "tech_stack": ["Astro", "React"],
      "link": "#"
    }
  ]
}


Step 3: Semantic Skeleton

Write this exact semantic structure in the <body>. Leave tags empty. Do not add classes other than the ones provided.

<body class="bg-gray-50 text-gray-900 font-sans antialiased">
    <header id="hero"></header>
    <main>
        <section id="skills"></section>
        <section id="projects"></section>
    </main>
    <footer id="contact"></footer>
</body>


END OF PHASE 1

Output the index.html file based on these instructions and STOP. Do not anticipate Phase 2. Do not write UI code.