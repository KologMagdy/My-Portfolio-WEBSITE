<h1 align="center">VS Code IDE Developer Portfolio 💻</h1>

<p align="center">
  <strong>A premium, data-driven developer portfolio template engineered with a pragmatic UI stack.</strong>
</p>

<p align="center">
  <a href="https://kolog.dev"><strong>🔴 View Live Demo</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vanilla_CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="Custom CSS" />
  <img src="https://img.shields.io/badge/Vanilla_JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
</p>

<br/>
<p align="center">
  <img src="demo.gif" alt="Portfolio Demo IDE UI" width="800" style="border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.5);"/>
</p>
<br/>

---

## ✨ Key Features

- **Premium Authentic UI:** IDE Tabs, sidebar, active states, and code highlighting integrated natively.
- **100% Data-Driven (JSON):** The entire portfolio content is isolated in `data.json`. Zero HTML editing required to update your profile.
- **Hybrid CSS Architecture:** Tailwind CSS for structural speed + Vanilla CSS for hyper-specific IDE UI details (custom scrollbars, glowing accents).
- **Blazingly Fast:** 100% Lighthouse Score. Zero dependencies, no Webpack, no JS bundlers.
- **Mobile Responsive:** The IDE collapses beautifully into a mobile-friendly layout without losing the hacker aesthetic.
- **SEO & Social Ready:** Pre-configured Open Graph meta tags for perfect sharing previews on LinkedIn, X, and WhatsApp.

## 🚀 The Architecture (Why This Stack?)

Most developer portfolios are over-engineered with heavy frontend frameworks just to render static data. This template introduces a **Pragmatic Hybrid Architecture**:

1. **Utility-First Speed (Tailwind CSS):** Used for rapid layout structuring, responsive design, and consistent typography.
2. **IDE Precision (Raw CSS):** Used for the complex styling that gives this portfolio its "IDE Soul".
3. **Data Core (Vanilla JS):** A lightweight script dynamically fetches and renders your data from a single JSON file.

## 🛠️ Zero-Config Setup (Make it Yours in 3 Mins)

Forget navigating through dozens of React components to change your name. This template relies on a **Single Source of Truth**.

### 1. 🍴 Fork & Clone
Start by forking this repository to your GitHub account.

### 2. 🧬 Inject Your DNA (`data.json`)
The entire UI is generated from one single file with built-in **Multi-Language (i18n)** support. Open `data.json` and replace the placeholder data with yours. The structure is cleanly separated by language:

```json
{
  "en": {
    "personal_info": {
      "name": "Your Name",
      "title": "Software Engineer",
      "avatar": "avatar.webp",
      "links": { ... }
    },
    "ui": { ... },
    "skills": { ... },
    "projects": [ ... ]
  },
  "ar": {
    "personal_info": { ... },
    "ui": { ... },
    "skills": { ... },
    "projects": [ ... ]
  }
}
```
*✨ Magic: The moment you save, the JS engine maps your data directly into the IDE layout, translating everything seamlessly between English and Arabic.*

### 3. 🎨 Advanced Theming (The IDE Soul)
Want to tweak the hacker vibe, change the syntax highlighting, or inject your own brand colors? The entire design system is centralized.

We use a highly scalable **Raw RGB Variable Architecture** to support Tailwind's native opacity/alpha utilities. Open `style.css` and modify the `:root` variables using space-separated RGB values (e.g., `255 0 127` instead of `#ff007f`):

```css
:root {
  /* Main IDE Backgrounds */
  --bg-main: 10 10 15;           /* Body and Nav background */
  --bg-card: 15 15 24;           /* Cards and Modals */

  /* IDE Syntax Highlighting */
  --syntax-key: 165 180 252;     /* JSON Keys (e.g., "name") */
  --syntax-string: 134 239 172;  /* JSON Strings */

  /* Primary Brand Accents */
  --accent-indigo: 99 102 241;   /* Change this to shift your primary theme color */
  
  /* ... open style.css to see all 30+ semantic variables to fine-tune your UI */
}
```
*✨ Important Note: Always use the raw `R G B` format (no commas, no hex codes). This allows Tailwind to seamlessly compile transparencies in your HTML, like `bg-accent-indigo/50` or `text-syntax-string/80`.*

### 4. 📸 Update Social Meta (SEO)
Don't skip this! Replace `og-image.jpg` in the root folder with a `1200x630` screenshot of your new portfolio. This guarantees your site looks premium when shared on LinkedIn, X, or Discord.

### 5. 🚀 One-Click Deploy
No build steps. No Webpack. No `node_modules`.
- Head to [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/).
- Import your forked repository.
- Click **Deploy**. Your site is live globally in 10 seconds.

## 📂 Project Structure

```text
├── index.html       # DOM structure and Tailwind utility classes
├── style.css        # Custom IDE aesthetic and Tailwind overrides
├── script.js        # Data-fetching and DOM manipulation engine
├── data.json        # ⚠️ YOUR ENTIRE PORTFOLIO CONTENT GOES HERE
├── og-image.jpg     # Social sharing preview image
├── demo.gif         # Visual proof for the README
└── README.md        # Documentation
```

## 🤝 Contributing
Love the IDE vibe? Pull Requests are highly welcome for new features like a functional terminal block, a global search feature (`Ctrl+P`), or new color themes!

## 📜 License & Copyright

**The Codebase:**
The structural code of this project (HTML, CSS, JS configuration) is open-source and available under the [MIT License](LICENSE). You are free to fork, modify, and use it for your own portfolio.

**The Content (Important):**
The personal data, images (`avatar.webp`, `og-image.jpg`, project previews), and project details included in this repository are **exclusive property of Kolog Magdy** and are **NOT** covered by the MIT License. 

When you fork this repository, please remove my personal information, avatar, and project screenshots, and replace them with your own before publishing.

---
<p align="center">
  Designed and Engineered by <a href="https://kolog.dev">Kolog Magdy</a>.
</p>
