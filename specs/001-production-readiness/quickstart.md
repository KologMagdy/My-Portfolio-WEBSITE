# Quickstart: Production Readiness Verification

**Feature**: 001-production-readiness
**Date**: 2026-04-03

## Prerequisites

- A web browser with DevTools (Chrome or Firefox recommended)
- A local static file server (any of the following):
  - VS Code Live Server extension
  - Python: `python -m http.server 8000`
  - Any static file server that serves from the project root

## Verification Steps

### 1. Start a Local Server

Serve the project root directory on any port (e.g., 8000):

```bash
# From the project root:
python -m http.server 8000
```

Open `http://localhost:8000` in a browser.

### 2. Verify Zero Console Errors (SC-001)

1. Open DevTools → Console tab
2. Clear the console
3. Reload the page
4. Exercise all features:
   - Toggle language (EN → AR → EN)
   - Open/close profile modal (click avatar)
   - Click a project card → verify modal opens/closes
   - Scroll through all sections
   - Open/close mobile menu (resize to mobile width first)
5. **Expected**: Zero console messages from `script.js`

### 3. Verify Error Fallback (SC-002)

1. Stop the server or rename `data.json` to `data.json.bak`
2. Reload the page
3. **Expected**: A styled bilingual error message appears
   (English text first, Arabic text below) within 3 seconds
4. **Expected**: No blank page, no console-only error
5. Restore the file: rename `data.json.bak` back to `data.json`

### 4. Verify Malformed JSON Handling

1. Open `data.json`, add invalid content (e.g., `BROKEN` at line 1)
2. Reload the page
3. **Expected**: Same bilingual error message as step 3
4. Revert `data.json` to valid content

### 5. Verify Noscript Fallback

1. Open DevTools → Settings → Disable JavaScript
2. Reload the page
3. **Expected**: A visible message indicating JavaScript is required
4. Re-enable JavaScript

### 6. Verify Zero 404 Errors (SC-003)

1. Open DevTools → Network tab
2. Reload the page (with cache disabled)
3. Filter by status code or visually scan for red/failed entries
4. **Expected**: Zero 404 responses. All resources load successfully.

### 7. Verify Link Integrity (SC-005)

1. Load the site in English
2. Click every visible social link (GitHub, LinkedIn in contact section)
3. Click every project card → in the modal, click "Live Preview"
4. **Expected**: No link navigates to `#`. All links open real URLs.
5. **Expected**: Twitter, Instagram, Facebook links are NOT visible
   in the profile modal, contact section, or mobile menu.
6. **Expected**: "Source Code" button is NOT visible in project modals.
7. Toggle to Arabic and repeat steps 2-6.

### 8. Verify Data Parity (SC-004)

1. Load the site in English, note all project URLs and social links
2. Toggle to Arabic
3. **Expected**: Same project URLs appear in Arabic version
4. **Expected**: No `#` links are clickable in either language

### 9. Verify No Visual Regressions (SC-006)

1. Load the site in English at desktop width
2. Visually verify: hero section, skills grid, project cards,
   contact section, footer — all render correctly
3. Resize to mobile width — verify responsive layout
4. Toggle to Arabic — verify RTL layout
5. **Expected**: No layout shifts, broken styles, or missing content
   compared to the pre-change state
