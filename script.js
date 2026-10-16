'use strict';

/* ══════════════════════════════════════════════════════════════
   Portfolio runtime — renders data.json into the Material 3 UI.
   ══════════════════════════════════════════════════════════════ */

const LANGS = ['en', 'ar'];
const SEEDS = ['violet', 'blue', 'green', 'orange', 'rose'];
const THEMES = ['system', 'light', 'dark'];
const THEME_ICONS = { system: 'brightness_auto', light: 'light_mode', dark: 'dark_mode' };

const SKILL_ICONS = { languages: 'code', frameworks: 'layers', backend_db: 'database', architecture: 'hub' };
const SKILL_SHAPES = ['cookie9', 'clover4', 'sunny8', 'flower6'];
const SOCIALS = [
  { key: 'github', label: 'GitHub' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'twitter', label: 'X' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'facebook', label: 'Facebook' },
];

const root = document.documentElement;
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const storage = {
  get(key) { try { return localStorage.getItem(key); } catch (e) { return null; } },
  set(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* private mode */ } },
  remove(key) { try { localStorage.removeItem(key); } catch (e) { /* private mode */ } },
};

let data = null;
let lang = LANGS.includes(storage.get('lang')) ? storage.get('lang') : 'en';

/* ─── Data helpers ─── */
function getVal(path, fallback = '') {
  if (!data) return fallback;
  const walk = (obj) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
  return walk(data[lang]) ?? walk(data.en) ?? fallback;
}
const t = (key, fallback = '') => getVal(`ui.${key}`, fallback);

/** Tiny element builder: h('a', { class: 'x', href }, [children]) — text is always escaped. */
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
const brandIcon = (key) => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'brand-icon');
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', `#i-${key}`);
  svg.append(use);
  return svg;
};
const isRealLink = (url) => typeof url === 'string' && url.trim() !== '' && url.trim() !== '#';

function domainOf(url) {
  try { return new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace(/^www\./, ''); }
  catch (e) { return url; }
}

/* ══════════ Rendering ══════════ */
function render() {
  if (!data || !data[lang]) return;

  root.lang = lang;
  root.dir = lang === 'ar' ? 'rtl' : 'ltr';

  // Meta / SEO
  const name = getVal('personal_info.name');
  const title = `${name} | ${getVal('personal_info.title')}`;
  const desc = getVal('personal_info.tagline');
  document.title = title;
  const setContent = (id, v) => { const el = document.getElementById(id); if (el) el.content = v; };
  setContent('meta-description', desc);
  setContent('og-title', title);
  setContent('og-description', desc);
  setContent('twitter-title', title);
  setContent('twitter-description', desc);
  setContent('og-locale', lang === 'ar' ? 'ar_AR' : 'en_US');

  // Declarative bindings
  $$('[data-i18n]').forEach((el) => { const v = t(el.dataset.i18n); if (v) el.textContent = v; });
  $$('[data-i18n-aria]').forEach((el) => { const v = t(el.dataset.i18nAria); if (v) el.setAttribute('aria-label', v); });
  $$('[data-i18n-title]').forEach((el) => { const v = t(el.dataset.i18nTitle); if (v) el.title = v; });
  $$('[data-field]').forEach((el) => { const v = getVal(`personal_info.${el.dataset.field}`); if (v) el.textContent = v; });

  // Language switch shows the *other* language, in that language
  const other = lang === 'ar' ? 'en' : 'ar';
  const langBtn = $('#lang-btn');
  langBtn.lang = other;
  $('#lang-btn-label').textContent = other === 'ar' ? 'عربي' : 'English';
  langBtn.setAttribute('aria-label', other === 'ar' ? 'التبديل إلى العربية' : 'Switch to English');

  $('#footer-copyright').textContent = `© ${new Date().getFullYear()} ${name}`;

  // Hero chips
  const chips = t('hero_chips', []);
  $$('[data-hero-chip]').forEach((el, i) => { if (chips[i]) el.textContent = chips[i]; });

  renderEmail();
  renderSocials();
  renderSkills();
  renderProjects();
  renderStats();
  updateThemeButton();
  observeReveals();
}

function renderEmail() {
  const email = getVal('personal_info.links.email');
  const btn = $('#contact-email-btn');
  if (!isRealLink(email)) { btn.parentElement.hidden = true; return; }
  btn.parentElement.hidden = false;
  btn.href = email.startsWith('mailto:') ? email : `mailto:${email}`;
  $('#contact-email-text').textContent = email.replace(/^mailto:/, '');
}

function renderSocials() {
  const list = $('#social-list');
  const profile = $('#profile-socials');
  list.replaceChildren();
  profile.replaceChildren();

  for (const { key, label } of SOCIALS) {
    const url = getVal(`personal_info.links.${key}`);
    if (!isRealLink(url)) continue;
    const handle = url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

    list.append(h('li', {}, h('a', { class: 'list-item state', href: url, target: '_blank', rel: 'noopener noreferrer' }, [
      h('span', { class: 'list-item__leading' }, brandIcon(key)),
      h('span', { class: 'list-item__text' }, [
        h('span', { class: 'title-medium', text: label, style: 'display:block' }),
        h('span', { class: 'body-medium', text: handle, style: 'display:block' }),
      ]),
      icon('arrow_outward', 'list-item__trailing icon--mirror'),
    ])));

    profile.append(h('a', {
      class: 'icon-btn icon-btn--tonal state', href: url, target: '_blank', rel: 'noopener noreferrer',
      'aria-label': label, title: label,
    }, brandIcon(key)));
  }

  const email = getVal('personal_info.links.email');
  if (isRealLink(email)) {
    const label = t('email_label', 'Email');
    profile.append(h('a', { class: 'icon-btn icon-btn--tonal state', href: email, 'aria-label': label, title: label }, icon('mail')));
  }
}

function renderSkills() {
  const grid = $('#skills-grid');
  grid.replaceChildren();
  const categories = getVal('skills.categories', {});

  Object.entries(categories).forEach(([key, title], i) => {
    const skills = getVal(`skills.${key}`, []);
    if (!Array.isArray(skills) || !skills.length) return;

    grid.append(h('article', { class: 'card skill-card reveal', style: `--i:${i}` }, [
      h('div', { class: 'skill-card__header' }, [
        h('span', { class: `skill-card__icon shape shape--${SKILL_SHAPES[i % SKILL_SHAPES.length]}` },
          icon(SKILL_ICONS[key] || 'deployed_code')),
        h('div', {}, [
          h('h3', { class: 'title-large', text: title }),
          h('p', { class: 'body-medium skill-card__count', text: `${skills.length} ${t('skills_count_suffix', 'skills')}` }),
        ]),
      ]),
      h('ul', { class: 'chip-set' }, skills.map((s) => h('li', { class: 'chip chip--sm', text: s }))),
    ]));
  });
}

function renderProjects() {
  const grid = $('#projects-grid');
  grid.replaceChildren();
  const projects = getVal('projects', []);

  projects.forEach((p, i) => {
    const hasLink = isRealLink(p.link);
    const tech = p.tech_stack || [];
    const shown = tech.slice(0, 3);

    const card = h('article', { class: `card project-card reveal${i === 0 ? ' project-card--featured' : ''}`, style: `--i:${i % 3}` }, [
      h('div', { class: 'project-card__media' }, [
        p.status === 'live'
          ? h('span', { class: 'chip chip--sm chip--status' }, [h('span', { class: 'live-dot', 'aria-hidden': 'true' }), t('status_live', 'Live')])
          : null,
        p.image
          ? h('img', { src: p.image, alt: '', loading: i === 0 ? 'eager' : 'lazy', decoding: 'async', width: 960, height: 720 })
          : null,
      ]),
      h('div', { class: 'project-card__content' }, [
        h('div', { class: 'project-card__body' }, [
          h('p', { class: 'label-large project-card__type', dir: 'ltr', style: 'text-align:start', text: p.type }),
          h('h3', { class: 'headline-small project-card__title' },
            h('button', { class: 'project-card__open', type: 'button', 'aria-haspopup': 'dialog', text: p.name })),
          h('p', { class: 'body-medium project-card__desc', text: p.description }),
          h('ul', { class: 'chip-set project-card__tech', 'aria-label': t('tech_stack_label', 'Tech stack') }, [
            ...shown.map((s) => h('li', { class: 'chip chip--sm', text: s })),
            tech.length > shown.length ? h('li', { class: 'chip chip--sm chip--tonal', dir: 'ltr', text: `+${tech.length - shown.length}` }) : null,
          ]),
        ]),
        h('div', { class: 'project-card__footer' }, [
          h('span', { class: 'project-card__domain label-large' }, [
            icon('language', 'icon--sm'),
            h('span', { text: hasLink ? domainOf(p.link) : t('private_project', 'Private') }),
          ]),
          hasLink ? h('a', {
            class: 'icon-btn icon-btn--tonal project-card__visit state', href: p.link, target: '_blank', rel: 'noopener noreferrer',
            'aria-label': `${t('visit_project', 'Visit')} — ${p.name}`, title: t('visit_project', 'Visit'),
          }, icon('arrow_outward', 'icon--mirror')) : null,
        ]),
      ]),
    ]);

    card.querySelector('.project-card__open').addEventListener('click', () => openProject(i));
    grid.append(card);
  });
}

function renderStats() {
  const projects = getVal('projects', []);
  const categories = Object.keys(getVal('skills.categories', {}));
  const techCount = new Set(categories.flatMap((k) => getVal(`skills.${k}`, []))).size;
  $('#stat-projects').textContent = projects.length;
  $('#stat-live').textContent = projects.filter((p) => p.status === 'live').length;
  $('#stat-tech').textContent = techCount >= 10 ? `${Math.floor(techCount / 5) * 5}+` : techCount;
}

/* ══════════ Project dialog ══════════ */
function openProject(index) {
  const p = getVal('projects', [])[index];
  if (!p) return;
  const dialog = $('#project-dialog');

  const img = $('#pd-img');
  img.parentElement.hidden = !p.image;
  if (p.image) img.src = p.image;

  $('#pd-title').textContent = p.name;
  $('#pd-desc').textContent = p.description;
  $('#pd-role').textContent = p.role || '';

  $('#pd-chips').replaceChildren(...[
    h('span', { class: 'chip chip--sm chip--tonal', dir: 'ltr', text: p.type }),
    p.year ? h('span', { class: 'chip chip--sm' }, [icon('calendar_today'), String(p.year)]) : null,
    p.status === 'live' ? h('span', { class: 'chip chip--sm chip--status' }, [h('span', { class: 'live-dot', 'aria-hidden': 'true' }), p.status_label || t('status_live', 'Live')]) : null,
  ].filter(Boolean));

  const highlights = p.highlights || [];
  $('#pd-highlights-wrap').hidden = !highlights.length;
  $('#pd-highlights').replaceChildren(...highlights.map((hl) => h('li', {}, [icon('check_circle'), h('span', { text: hl })])));
  $('#pd-tech').replaceChildren(...(p.tech_stack || []).map((s) => h('span', { class: 'chip chip--sm', text: s })));

  const actions = $('#pd-actions');
  actions.replaceChildren();
  if (isRealLink(p.source)) {
    actions.append(h('a', { class: 'btn btn--outlined state', href: p.source, target: '_blank', rel: 'noopener noreferrer' },
      [icon('code'), t('view_source', 'Source code')]));
  }
  if (isRealLink(p.link)) {
    actions.append(h('a', { class: 'btn btn--filled state', href: p.link, target: '_blank', rel: 'noopener noreferrer' },
      [icon('open_in_new'), t('visit_project', 'Visit site')]));
  }
  actions.hidden = !actions.children.length;

  openDialog(dialog);
  $('.dialog__scroll', dialog).scrollTop = 0;
}

/* ══════════ Dialog helpers (native <dialog> + exit animation) ══════════ */
function openDialog(dialog) {
  dialog.classList.remove('is-closing');
  if (!dialog.open) dialog.showModal();
}

function closeDialog(dialog, after) {
  if (!dialog.open || dialog.classList.contains('is-closing')) return;
  if (reducedMotion.matches) { dialog.close(); after && after(); return; }
  dialog.classList.add('is-closing');
  dialog.addEventListener('animationend', function done(e) {
    if (e.target !== dialog) return;
    dialog.removeEventListener('animationend', done);
    dialog.classList.remove('is-closing');
    dialog.close();
    after && after();
  });
}

function initDialogs() {
  $$('dialog').forEach((dialog) => {
    // Esc → animated close instead of instant close
    dialog.addEventListener('cancel', (e) => { e.preventDefault(); closeDialog(dialog); });
    // Click on the scrim (outside the dialog box)
    dialog.addEventListener('click', (e) => {
      if (e.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (!inside) closeDialog(dialog);
    });
    $$('[data-close]', dialog).forEach((b) => b.addEventListener('click', () => closeDialog(dialog)));
    $$('[data-close-nav]', dialog).forEach((a) => a.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      closeDialog(dialog, () => target && target.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth' }));
    }));
  });

  $('#profile-btn').addEventListener('click', () => openDialog($('#profile-dialog')));
}

/* ══════════ Theme + dynamic color ══════════ */
function currentTheme() { return root.dataset.theme || 'system'; }

function setTheme(theme) {
  if (theme === 'system') { delete root.dataset.theme; storage.remove('theme'); }
  else { root.dataset.theme = theme; storage.set('theme', theme); }
  updateThemeButton();
}

function updateThemeButton() {
  const theme = currentTheme();
  const btn = $('#theme-btn');
  const names = { system: t('theme_system', 'System'), light: t('theme_light', 'Light'), dark: t('theme_dark', 'Dark') };
  const label = `${t('theme_label', 'Theme')}: ${names[theme]}`;
  btn.querySelector('.icon').textContent = THEME_ICONS[theme];
  btn.setAttribute('aria-label', label);
  btn.title = label;
  // Keep the browser UI color in sync with the surface color
  requestAnimationFrame(() => {
    const surface = getComputedStyle(root).getPropertyValue('--md-sys-color-surface').trim();
    $$('meta[name="theme-color"]').forEach((m) => { m.content = surface; m.removeAttribute('media'); });
  });
}

function setSeed(seed) {
  root.dataset.seed = seed;
  storage.set('seed', seed);
  $$('.swatch').forEach((s) => s.setAttribute('aria-checked', String(s.dataset.seed === seed)));
  updateThemeButton();
}

function initTheme() {
  $('#theme-btn').addEventListener('click', () => {
    const next = THEMES[(THEMES.indexOf(currentTheme()) + 1) % THEMES.length];
    withViewTransition(() => setTheme(next));
  });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateThemeButton);

  const menu = $('#palette-menu');
  const trigger = $('#palette-btn');
  const seed = SEEDS.includes(root.dataset.seed) ? root.dataset.seed : SEEDS[0];
  $$('.swatch').forEach((s) => {
    s.setAttribute('aria-checked', String(s.dataset.seed === seed));
    s.addEventListener('click', () => withViewTransition(() => setSeed(s.dataset.seed)));
  });

  if (!menu.showPopover) { trigger.hidden = true; return; } // very old browsers
  // Position the menu under its anchor button
  menu.addEventListener('toggle', (e) => {
    if (e.newState !== 'open') return;
    const r = trigger.getBoundingClientRect();
    menu.style.top = `${r.bottom + 8}px`;
    const rtl = root.dir === 'rtl';
    const w = menu.offsetWidth;
    let left = rtl ? r.left : r.right - w;
    left = Math.max(8, Math.min(left, window.innerWidth - w - 8));
    menu.style.left = `${left}px`;
    const checked = $('.swatch[aria-checked="true"]', menu);
    checked && checked.focus();
  });
}

/** Smoothly cross-fades color changes where the View Transitions API exists. */
function withViewTransition(fn) {
  if (document.startViewTransition && !reducedMotion.matches) document.startViewTransition(fn);
  else fn();
}

/* ══════════ Language ══════════ */
function initLanguage() {
  $('#lang-btn').addEventListener('click', () => {
    lang = lang === 'ar' ? 'en' : 'ar';
    storage.set('lang', lang);
    withViewTransition(render);
  });
}

/* ══════════ Navigation: active destination + top app bar ══════════ */
function initNavigation() {
  const sections = ['about', 'skills', 'projects', 'contact'].map((id) => document.getElementById(id));
  const setActive = (id) => $$('[data-nav]').forEach((a) => {
    if (a.dataset.nav === id) a.setAttribute('aria-current', 'true');
    else a.removeAttribute('aria-current');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => s && observer.observe(s));
  setActive('about');

  // At the very bottom the last section may never cross the middle line
  const bar = $('#top-app-bar');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      bar.classList.toggle('is-scrolled', window.scrollY > 8);
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) setActive('contact');
      ticking = false;
    });
  }, { passive: true });
}

/* ══════════ Ripple ══════════ */
function initRipple() {
  document.addEventListener('pointerdown', (e) => {
    const host = e.target.closest('.state, .nav-dest');
    if (!host || e.button !== 0 || reducedMotion.matches) return;
    const surface = host.classList.contains('nav-dest') ? $('.nav-dest__indicator', host) : host;
    const r = surface.getBoundingClientRect();
    const size = Math.hypot(r.width, r.height) * 2;
    const ripple = h('span', {
      class: 'ripple',
      style: `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`,
    });
    surface.append(ripple);
    const release = () => {
      ripple.classList.add('is-fading');
      setTimeout(() => ripple.remove(), 400);
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', release);
    };
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
  });
}

/* ══════════ Scroll reveal ══════════ */
const revealObserver = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-visible');
      revealObserver.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
  : null;

function observeReveals() {
  $$('.reveal:not(.is-visible)').forEach((el) => {
    if (revealObserver) revealObserver.observe(el); else el.classList.add('is-visible');
  });
}

/* ══════════ Copy email + snackbar ══════════ */
let snackTimer;
function showSnackbar(message) {
  const bar = $('#snackbar');
  bar.textContent = message;
  bar.classList.add('is-visible');
  clearTimeout(snackTimer);
  snackTimer = setTimeout(() => bar.classList.remove('is-visible'), 3200);
}

function initCopyEmail() {
  const btn = $('#copy-email-btn');
  btn.addEventListener('click', async () => {
    const email = $('#contact-email-text').textContent.trim();
    try {
      await navigator.clipboard.writeText(email);
      btn.querySelector('.icon').textContent = 'check';
      setTimeout(() => { btn.querySelector('.icon').textContent = 'content_copy'; }, 2000);
      showSnackbar(t('email_copied', 'Email address copied'));
    } catch (e) {
      window.location.href = `mailto:${email}`;
    }
  });
}

/* ══════════ Boot ══════════ */
function loadData() {
  $('#data-error').hidden = true;
  return fetch('data.json', { cache: 'no-cache' })
    .then((res) => { if (!res.ok) throw new Error(`data.json: HTTP ${res.status}`); return res.json(); })
    .then((json) => {
      if (!json || !json.en) throw new Error('data.json: missing "en" locale');
      data = json;
      if (!data[lang]) lang = 'en';
      render();
    })
    .catch((err) => {
      console.error(err);
      $('#data-error').hidden = false;
    });
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLanguage();
  initNavigation();
  initDialogs();
  initRipple();
  initCopyEmail();
  updateThemeButton();
  observeReveals();
  $('#retry-btn').addEventListener('click', loadData);
  loadData();
});
