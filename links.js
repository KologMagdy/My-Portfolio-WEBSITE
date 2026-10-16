'use strict';

/* ══════════════════════════════════════════════════════════════
   Links page runtime — renders the top-level "links" list from data.json.
   ══════════════════════════════════════════════════════════════ */

const LANGS = ['en', 'ar'];
const THEMES = ['system', 'light', 'dark'];
const THEME_ICONS = { system: 'brightness_auto', light: 'light_mode', dark: 'dark_mode' };
// Logos available in the <svg> sprite of links.html; any other "icon" is a Material Symbol name
const BRANDS = ['github', 'linkedin', 'twitter', 'instagram', 'facebook', 'youtube', 'tiktok', 'whatsapp', 'telegram'];
// Material Symbols loaded by links.html (the font is subset, so other names would render as text)
const SYMBOLS = ['article', 'calendar_month', 'call', 'campaign', 'chat', 'code', 'download', 'favorite', 'language',
  'link', 'mail', 'mic', 'play_circle', 'podcasts', 'school', 'shopping_bag', 'star', 'storefront', 'videocam', 'work'];

const root = document.documentElement;
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const storage = {
  get(key) { try { return localStorage.getItem(key); } catch (e) { return null; } },
  set(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* private mode */ } },
  remove(key) { try { localStorage.removeItem(key); } catch (e) { /* private mode */ } },
};

let data = null;
let lang = LANGS.includes(storage.get('lang')) ? storage.get('lang') : 'en';

function getVal(path, fallback = '') {
  if (!data) return fallback;
  const walk = (obj) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
  return walk(data[lang]) ?? walk(data.en) ?? fallback;
}
const t = (key, fallback = '') => getVal(`ui.${key}`, fallback);
/** A link's text is either a plain string or { "en": "...", "ar": "..." }. */
const localized = (v) => (v && typeof v === 'object' ? v[lang] ?? v.en ?? '' : v || '');
const isRealLink = (url) => typeof url === 'string' && url.trim() !== '' && url.trim() !== '#';

function h(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'text') el.textContent = v;
    else if (k === 'style') el.style.cssText = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of [].concat(children)) if (c != null) el.append(c);
  return el;
}
const icon = (name, extra = '') => h('span', { class: `icon ${extra}`.trim(), 'aria-hidden': 'true', text: name });
function linkIcon(name) {
  if (!BRANDS.includes(name)) return icon(SYMBOLS.includes(name) ? name : 'link');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'brand-icon');
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', `#i-${name}`);
  svg.append(use);
  return svg;
}

/* ══════════ Rendering ══════════ */
function render() {
  if (!data || !data[lang]) return;
  root.lang = lang;
  root.dir = lang === 'ar' ? 'rtl' : 'ltr';

  const name = getVal('personal_info.name');
  document.title = `${name} | ${t('links_label', 'Links')}`;
  const desc = t('links_bio');
  const setContent = (id, v) => { const el = document.getElementById(id); if (el && v) el.content = v; };
  setContent('meta-description', desc);
  setContent('og-title', document.title);
  setContent('og-description', desc);
  setContent('twitter-title', document.title);
  setContent('twitter-description', desc);
  setContent('og-locale', lang === 'ar' ? 'ar_AR' : 'en_US');

  $$('[data-i18n]').forEach((el) => { const v = t(el.dataset.i18n); if (v) el.textContent = v; });
  $$('[data-field]').forEach((el) => { const v = getVal(`personal_info.${el.dataset.field}`); if (v) el.textContent = v; });

  const other = lang === 'ar' ? 'en' : 'ar';
  const langBtn = $('#lang-btn');
  langBtn.lang = other;
  $('#lang-btn-label').textContent = other === 'ar' ? 'عربي' : 'English';
  langBtn.setAttribute('aria-label', other === 'ar' ? 'التبديل إلى العربية' : 'Switch to English');

  $('#footer-copyright').textContent = `© ${new Date().getFullYear()} ${name}`;

  renderLinks();
  updateThemeButton();
}

function renderLinks() {
  const list = $('#links-list');
  const links = (Array.isArray(data.links) ? data.links : []).filter((l) => l && isRealLink(l.url));

  if (!links.length) {
    list.replaceChildren(h('li', { class: 'body-large links__bio', text: t('links_empty', 'No links yet.') }));
    return;
  }

  list.replaceChildren(...links.map((l, i) => {
    const external = /^https?:/i.test(l.url) && !l.url.startsWith(location.origin);
    const subtitle = localized(l.subtitle);
    return h('li', { style: `--i:${i}` }, h('a', {
      class: `link-btn state${l.featured ? ' link-btn--featured' : ''}`,
      href: l.url,
      target: external ? '_blank' : null,
      rel: external ? 'noopener noreferrer' : null,
    }, [
      h('span', { class: 'link-btn__leading' }, linkIcon(l.icon)),
      h('span', { class: 'link-btn__text' }, [
        h('span', { class: 'title-medium', text: localized(l.title) }),
        subtitle ? h('span', { class: 'body-medium', text: subtitle }) : null,
      ]),
      icon('arrow_outward', 'link-btn__trailing icon--mirror'),
    ]));
  }));
}

/* ══════════ Theme ══════════ */
function currentTheme() { return root.dataset.theme || 'system'; }

function updateThemeButton() {
  const theme = currentTheme();
  const btn = $('#theme-btn');
  const names = { system: t('theme_system', 'System'), light: t('theme_light', 'Light'), dark: t('theme_dark', 'Dark') };
  const label = `${t('theme_label', 'Theme')}: ${names[theme]}`;
  btn.querySelector('.icon').textContent = THEME_ICONS[theme];
  btn.setAttribute('aria-label', label);
  btn.title = label;
  requestAnimationFrame(() => {
    const surface = getComputedStyle(root).getPropertyValue('--md-sys-color-surface').trim();
    $$('meta[name="theme-color"]').forEach((m) => { m.content = surface; m.removeAttribute('media'); });
  });
}

function withViewTransition(fn) {
  if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) document.startViewTransition(fn);
  else fn();
}

/* ══════════ Share + snackbar ══════════ */
let snackTimer;
function showSnackbar(message) {
  const bar = $('#snackbar');
  bar.textContent = message;
  bar.classList.add('is-visible');
  clearTimeout(snackTimer);
  snackTimer = setTimeout(() => bar.classList.remove('is-visible'), 3200);
}

async function share() {
  const url = location.href.split('#')[0];
  if (navigator.share) {
    try { await navigator.share({ title: document.title, url }); return; }
    catch (e) { if (e.name === 'AbortError') return; }
  }
  try {
    await navigator.clipboard.writeText(url);
    showSnackbar(t('links_copied', 'Link copied'));
  } catch (e) {
    showSnackbar(url);
  }
}

/* ══════════ Boot ══════════ */
document.addEventListener('DOMContentLoaded', () => {
  $('#theme-btn').addEventListener('click', () => {
    const next = THEMES[(THEMES.indexOf(currentTheme()) + 1) % THEMES.length];
    withViewTransition(() => {
      if (next === 'system') { delete root.dataset.theme; storage.remove('theme'); }
      else { root.dataset.theme = next; storage.set('theme', next); }
      updateThemeButton();
    });
  });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateThemeButton);

  $('#lang-btn').addEventListener('click', () => {
    lang = lang === 'ar' ? 'en' : 'ar';
    storage.set('lang', lang);
    withViewTransition(render);
  });

  $('#share-btn').addEventListener('click', share);
  updateThemeButton();

  fetch('/data.json', { cache: 'no-cache' })
    .then((res) => { if (!res.ok) throw new Error(`data.json: HTTP ${res.status}`); return res.json(); })
    .then((json) => {
      if (!json || !json.en) throw new Error('data.json: missing "en" locale');
      data = json;
      if (!data[lang]) lang = 'en';
      render();
    })
    .catch((err) => console.error(err));
});
