# Data Model: Production Readiness

**Feature**: 001-production-readiness
**Date**: 2026-04-03

## Entity: `data.json`

The sole data entity in this project. A flat JSON file with two
top-level locale keys (`en`, `ar`) containing identical structures.

### Schema (per locale)

```
{locale}
├── personal_info
│   ├── name: string (required)
│   ├── title: string (required)
│   ├── tagline: string (required)
│   ├── avatar: string (relative file path, required)
│   └── links
│       ├── github: string (URL or "#")
│       ├── linkedin: string (URL or "#")
│       ├── twitter: string (URL or "#")
│       ├── instagram: string (URL or "#")
│       ├── facebook: string (URL or "#")
│       └── email: string (mailto: URL, required)
├── ui
│   ├── [39 UI text keys: hero_status, hero_projects_btn, etc.]
│   └── (all keys are string, all required)
├── skills
│   ├── categories: object { core, frontend, delivery_tools }
│   ├── core: string[]
│   ├── frontend: string[]
│   └── delivery_tools: string[]
├── projects_title: string (required)
└── projects: array of Project
```

### Entity: Project (within `data.json`)

```
Project
├── name: string (required)
├── type: string (required, e.g., "Web Platform")
├── description: string (required)
├── role: string (required)
├── year: string (required, e.g., "2025")
├── status: string (required, e.g., "live")
├── status_label: string (required)
├── image: string (relative file path, required)
├── highlights: string[] (optional, may be empty)
├── tech_stack: string[] (required, non-empty)
├── icon: string (required, key into projectIcons map)
├── link: string (URL, required — "#" means hidden)
└── source: string (URL, required — "#" means hidden)
```

### Parity Rules

1. **Structural parity**: Every key in `en` MUST exist in `ar`
   and vice versa. No key may be present in one locale only.

2. **URL parity**: Where a real URL exists in one locale, the
   same URL MUST exist in the other.
   - `projects[n].link`: If English has a URL, Arabic MUST too
   - `projects[n].source`: Same rule
   - `personal_info.links.*`: Same rule per link key

3. **Placeholder handling**: A value of `"#"` indicates "not yet
   configured." The rendering engine hides elements whose URL is
   `"#"` in BOTH locales. If only one locale has `"#"`, it's a
   parity violation (rule 2).

4. **Image references**: All `image` and `avatar` values MUST
   reference files that exist at the project root with exact
   case-sensitive filename match.

### Current Parity Violations (to fix)

| Path | `en` | `ar` | Fix |
|------|------|------|-----|
| `projects[0].link` | `https://tagen.app` | `#` | Set `ar` to `https://tagen.app` |
| `projects[1].link` | `https://gopet.net` | `#` | Set `ar` to `https://gopet.net` |

### Elements to Hide (both locales have `#`)

| Path | Action |
|------|--------|
| `personal_info.links.twitter` | Hide in UI |
| `personal_info.links.instagram` | Hide in UI |
| `personal_info.links.facebook` | Hide in UI |
| `projects[*].source` | Hide "Source Code" button in modal |
