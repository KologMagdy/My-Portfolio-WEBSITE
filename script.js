let portfolioData = null;

// 4. Global Data Access Helper (T020)
function getVal(lang, path, fallback = '') {
    if (!portfolioData) return fallback;
    const keys = path.split('.');
    let current = portfolioData[lang];
    let currentEn = portfolioData['en'];

    for (const key of keys) {
        current = current ? current[key] : undefined;
        currentEn = currentEn ? currentEn[key] : undefined;
    }
    return current ?? currentEn ?? fallback;
}
let currentLang = ['en', 'ar'].includes(localStorage.getItem('lang')) ? localStorage.getItem('lang') : 'en';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Bind toggle button
    const toggleBtn = document.getElementById('lang-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            currentLang = currentLang === 'ar' ? 'en' : 'ar';
            localStorage.setItem('lang', currentLang);
            render(currentLang);
        });
    }

    // 2. Fetch data (runs immediately)
    fetch('data.json')
        .then(response => {
            if (!response.ok) throw new Error("Failed to load data.json");
            return response.json();
        })
        .then(data => {
            if (!data || typeof data !== 'object') throw new Error("Malformed JSON data");
            portfolioData = data;
            render(currentLang);
        })
        .catch(err => {
            const errorDiv = document.getElementById('data-error');
            if (errorDiv) errorDiv.classList.remove('hidden');
        });

    // 3. Initialize header behaviors
    initNavScrollBehavior();
    initMobileMenu();
    initActiveSectionTracking();
    initProfileCard();

    // 4. Auto-fit initial watermark text (before data.json loads)
    const wm = document.getElementById('footer-watermark');
    if (wm) autoFitWatermark(wm);
});

// ─── NAV: Scroll-aware show/hide + glassmorphism intensify ───
function initNavScrollBehavior() {
    const navContainer = document.querySelector('.nav-container');
    const mainNav = document.getElementById('main-nav');
    let lastScrollY = 0;
    let ticking = false;
    const SCROLL_THRESHOLD = 10;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;

                // Add/remove scrolled background intensity
                if (currentScrollY > 30) {
                    mainNav.classList.add('nav-scrolled');
                } else {
                    mainNav.classList.remove('nav-scrolled');
                }

                // Hide on scroll down, show on scroll up
                if (currentScrollY > lastScrollY && currentScrollY > 100 && (currentScrollY - lastScrollY) > SCROLL_THRESHOLD) {
                    navContainer.classList.add('nav-hidden');
                } else if ((lastScrollY - currentScrollY) > SCROLL_THRESHOLD || currentScrollY < 100) {
                    navContainer.classList.remove('nav-hidden');
                }

                lastScrollY = currentScrollY;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// ─── MOBILE MENU ───
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('mobile-menu-close');
    const overlay = document.getElementById('mobile-menu-overlay');
    const drawer = document.getElementById('mobile-menu-drawer');
    const mobileLinks = drawer ? drawer.querySelectorAll('.mobile-nav-link') : [];

    function openMenu() {
        menuBtn.classList.add('open');
        overlay.classList.add('open');
        drawer.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        menuBtn.classList.remove('open');
        overlay.classList.remove('open');
        drawer.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (menuBtn) menuBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });
}

// ─── ACTIVE SECTION TRACKING (Intersection Observer) ───
function initActiveSectionTracking() {
    const sections = document.querySelectorAll('#hero, #skills, #projects, #contact');
    const navLinks = document.querySelectorAll('[data-nav]');

    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                navLinks.forEach(link => {
                    if (link.dataset.nav === sectionId) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    });

    sections.forEach(section => observer.observe(section));
}


// ─── PROFILE CARD MODAL ───
function initProfileCard() {
    const avatarBtn = document.getElementById('avatar-btn');
    const overlay = document.getElementById('profile-modal-overlay');
    const closeBtn = document.getElementById('profile-modal-close');
    const backdrop = document.getElementById('profile-modal-backdrop');

    function openProfileCard() {
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeProfileCard() {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (avatarBtn) avatarBtn.addEventListener('click', openProfileCard);
    if (closeBtn) closeBtn.addEventListener('click', closeProfileCard);
    if (backdrop) backdrop.addEventListener('click', closeProfileCard);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('open')) {
            closeProfileCard();
        }
    });

    // Action buttons: close card → smooth scroll to target section
    document.querySelectorAll('[data-card-nav]').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.cardNav;
            closeProfileCard();
            // Wait for close animation to finish, then scroll
            setTimeout(() => {
                const section = document.querySelector(target);
                if (section) section.scrollIntoView({ behavior: 'smooth' });
            }, 350);
        });
    });
}

// ─── NAV TEXT TRANSLATIONS ───
const navTranslations = {
    ar: {
        about: 'عنّي',
        skills: 'المهارات',
        projects: 'المشاريع',
        contact: 'التواصل',
    },
    en: {
        about: 'About',
        skills: 'Skills',
        projects: 'Projects',
        contact: 'Contact',
    }
};


// ─── FOOTER WATERMARK: Auto-fit text to container width ───
function autoFitWatermark(el) {
    const container = el.parentElement;
    if (!container) return;

    // Measure the text's natural width at a known reference font-size
    // using a temporary off-screen span with the same font properties.
    // We hardcode letter-spacing as -0.05em (Tailwind's tracking-tighter)
    // because getComputedStyle returns px which won't scale correctly.
    const refSize = 100; // px reference for measurement
    const measurer = document.createElement('span');
    measurer.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;pointer-events:none;' +
        'font-family:' + getComputedStyle(el).fontFamily + ';' +
        'font-weight:' + getComputedStyle(el).fontWeight + ';' +
        'letter-spacing:-0.05em;' +
        'text-transform:uppercase;font-size:' + refSize + 'px;';
    measurer.textContent = el.textContent;
    document.body.appendChild(measurer);

    const textWidth = measurer.offsetWidth;
    document.body.removeChild(measurer);

    if (textWidth <= 0) return;

    // Available width = container width minus horizontal padding
    const containerStyle = getComputedStyle(container);
    const padLeft = parseFloat(containerStyle.paddingLeft) || 0;
    const padRight = parseFloat(containerStyle.paddingRight) || 0;
    const availableWidth = container.clientWidth - padLeft - padRight;

    // Calculate the font-size that makes text fit, with a 5% safety margin
    // (negative letter-spacing can cause edge characters to extend beyond the layout box)
    const idealSize = (availableWidth / textWidth) * refSize * 0.95;

    // Cap at a maximum of 17vw so it doesn't get absurdly large on wide screens
    const maxSize = (17 / 100) * window.innerWidth;
    el.style.fontSize = Math.min(idealSize, maxSize) + 'px';
}

// Re-fit watermark on window resize
let watermarkResizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(watermarkResizeTimer);
    watermarkResizeTimer = setTimeout(() => {
        const el = document.getElementById('footer-watermark');
        if (el) autoFitWatermark(el);
    }, 100);
}, { passive: true });

function render(lang) {
    if (!portfolioData || !portfolioData[lang]) return;

    // --- HTML Attributes & Meta ---
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    const pageTitle = `${getVal(lang, 'personal_info.name')} | ${getVal(lang, 'personal_info.title')}`;
    const pageDesc = getVal(lang, 'personal_info.tagline');

    document.title = pageTitle;

    const metaDesc = document.getElementById('meta-description');
    if (metaDesc) metaDesc.content = pageDesc;

    // Open Graph / Twitter Tags (SEO & Social Previews)
    const setContent = (id, content) => {
        const el = document.getElementById(id);
        if (el) el.content = content;
    };

    setContent('og-title', pageTitle);
    setContent('og-description', pageDesc);
    setContent('og-locale', lang === 'ar' ? 'ar_AR' : 'en_US');
    setContent('twitter-title', pageTitle);
    setContent('twitter-description', pageDesc);

    // --- Nav Text ---
    const navTexts = navTranslations[lang];
    document.querySelectorAll('[data-nav-text]').forEach(el => {
        const key = el.dataset.navText;
        if (navTexts[key]) el.textContent = navTexts[key];
    });
    document.querySelectorAll('[data-mobile-nav-text]').forEach(el => {
        const key = el.dataset.mobileNavText;
        if (navTexts[key]) el.textContent = navTexts[key];
    });
    const brandName = document.getElementById('nav-brand-handle');
    if (brandName) brandName.textContent = getVal(lang, 'ui.nav_brand_handle');

    const navViewProfile = document.getElementById('nav-view-profile');
    if (navViewProfile) navViewProfile.textContent = getVal(lang, 'ui.nav_view_profile');

    const navViewId = document.getElementById('nav-view-id');
    if (navViewId) navViewId.textContent = getVal(lang, 'ui.nav_view_id');

    // --- Static Text & Links ---
    const heroName = document.getElementById('hero-name');
    if (heroName) heroName.textContent = getVal(lang, 'personal_info.name');

    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) heroTitle.textContent = getVal(lang, 'personal_info.title');

    const heroTagline = document.getElementById('hero-tagline');
    if (heroTagline) heroTagline.textContent = getVal(lang, 'personal_info.tagline');

    const heroStatus = document.getElementById('hero-status');
    if (heroStatus) heroStatus.textContent = getVal(lang, 'ui.hero_status');

    const emailLink = document.getElementById('hero-email');
    if (emailLink) {
        emailLink.href = '#contact';
        const emailSvg = emailLink.querySelector('svg');
        emailLink.textContent = '';
        if (emailSvg) emailLink.prepend(emailSvg);
        const span = document.createElement('span');
        span.className = 'whitespace-nowrap';
        span.textContent = getVal(lang, 'ui.hero_contact_btn');
        emailLink.appendChild(span);
    }

    const projectsBtn = document.getElementById('hero-projects-btn');
    if (projectsBtn) {
        const projSvg = projectsBtn.querySelector('svg');
        projectsBtn.textContent = '';
        if (projSvg) projectsBtn.prepend(projSvg);
        projectsBtn.append(` ${getVal(lang, 'ui.hero_projects_btn')}`);
    }

    // --- Social Links Hiding Logic (T014) ---
    const isHidden = (key) => {
        return portfolioData['en'].personal_info.links[key] === '#' &&
            portfolioData['ar'].personal_info.links[key] === '#';
    };

    const githubLink = document.getElementById('footer-github');
    if (githubLink) githubLink.href = getVal(lang, 'personal_info.links.github');

    const linkedinLink = document.getElementById('footer-linkedin');
    if (linkedinLink) linkedinLink.href = getVal(lang, 'personal_info.links.linkedin');

    // Profile Card & Contact links
    const socialMap = {
        'github': ['footer-github', 'profile-modal-github', 'contact-social-github', 'mobile-github'],
        'linkedin': ['footer-linkedin', 'profile-modal-linkedin', 'contact-social-linkedin', 'mobile-linkedin'],
        'twitter': ['profile-modal-twitter', 'contact-social-twitter'],
        'instagram': ['profile-modal-instagram'],
        'facebook': ['profile-modal-facebook']
    };

    Object.entries(socialMap).forEach(([key, ids]) => {
        const hidden = isHidden(key);
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.href = getVal(lang, `personal_info.links.${key}`) || '#';
                if (hidden) el.classList.add('hidden');
                else el.classList.remove('hidden');
            }
        });
    });

    // --- Profile Card Modal Content ---
    const profileName = document.getElementById('profile-modal-name');
    if (profileName) profileName.textContent = getVal(lang, 'personal_info.name');

    const profileTitle = document.getElementById('profile-modal-title');
    if (profileTitle) profileTitle.textContent = getVal(lang, 'personal_info.title');

    const profileEmail = document.getElementById('profile-modal-email');
    if (profileEmail) profileEmail.href = getVal(lang, 'personal_info.links.email');

    // Card action button labels
    const cardProjectsSpan = document.querySelector('[data-card-btn="projects"]');
    if (cardProjectsSpan) cardProjectsSpan.textContent = getVal(lang, 'ui.card_projects_btn');

    const cardContactSpan = document.querySelector('[data-card-btn="contact"]');
    if (cardContactSpan) cardContactSpan.textContent = getVal(lang, 'ui.card_contact_btn');


    // Mobile social links
    const mobileGithub = document.getElementById('mobile-github');
    if (mobileGithub) mobileGithub.href = getVal(lang, 'personal_info.links.github');
    const mobileLinkedin = document.getElementById('mobile-linkedin');
    if (mobileLinkedin) mobileLinkedin.href = getVal(lang, 'personal_info.links.linkedin');

    const skillsTitle = document.getElementById('skills-title');
    if (skillsTitle) skillsTitle.textContent = getVal(lang, 'ui.skills_title');

    const projTitleEl = document.getElementById('projects-title');
    if (projTitleEl) projTitleEl.textContent = getVal(lang, 'projects_title');

    const footerCopyright = document.getElementById('footer-copyright');
    if (footerCopyright) {
        footerCopyright.textContent = `© ${new Date().getFullYear()} ${getVal(lang, 'personal_info.name')}`;
    }

    // --- Contact Section ---
    const contactTitle = document.getElementById('contact-title');
    if (contactTitle) contactTitle.textContent = getVal(lang, 'ui.footer_title') || 'Contact Me';

    const contactSubtitle = document.getElementById('contact-subtitle');
    const contactSubtitleAccent = document.getElementById('contact-subtitle-accent');
    if (contactSubtitle && contactSubtitleAccent) {
        // Remove existing text nodes, keep the accent <span> intact
        Array.from(contactSubtitle.childNodes).forEach(n => {
            if (n.nodeType === 3) n.remove();
        });
        // Insert fresh text node before the accent span
        contactSubtitle.insertBefore(
            document.createTextNode(getVal(lang, 'ui.contact_subtitle') + ' '),
            contactSubtitleAccent
        );
        contactSubtitleAccent.textContent = getVal(lang, 'ui.contact_subtitle_accent');
    }

    const contactText = document.getElementById('contact-text');
    if (contactText) contactText.textContent = getVal(lang, 'ui.contact_text');

    const contactEmailBtn = document.getElementById('contact-email-btn');
    const userEmail = getVal(lang, 'personal_info.links.email');
    if (contactEmailBtn) contactEmailBtn.href = userEmail;

    const contactBtnText = document.getElementById('contact-btn-text');
    if (contactBtnText && userEmail) {
        contactBtnText.textContent = userEmail.replace('mailto:', '');
    }

    const socialTitle = document.getElementById('social-title');
    if (socialTitle) socialTitle.textContent = getVal(lang, 'ui.social_title');

    const contactGithub = document.getElementById('contact-social-github');
    if (contactGithub) contactGithub.href = getVal(lang, 'personal_info.links.github');
    const contactLinkedin = document.getElementById('contact-social-linkedin');
    if (contactLinkedin) contactLinkedin.href = getVal(lang, 'personal_info.links.linkedin');
    const contactTwitter = document.getElementById('contact-social-twitter');
    if (contactTwitter) contactTwitter.href = getVal(lang, 'personal_info.links.twitter') || '#';

    // Update Toggle Button Text
    const toggleBtn = document.getElementById('lang-toggle');
    if (toggleBtn) {
        const svg = toggleBtn.querySelector('svg');
        toggleBtn.textContent = '';
        if (svg) toggleBtn.prepend(svg);
        const label = document.createElement('span');
        label.textContent = lang === 'ar' ? 'English' : 'عربي';
        toggleBtn.appendChild(label);
    }

    // Update IDE Footer Status
    const statusLang = document.getElementById('status-lang');
    if (statusLang) statusLang.textContent = lang === 'ar' ? 'AR' : 'EN';

    // --- Newly dynamic elements ---
    const contactSectionLabel = document.getElementById('contact-section-label');
    if (contactSectionLabel) contactSectionLabel.textContent = getVal(lang, 'ui.contact_section_label');

    const contactPrimaryLabel = document.getElementById('contact-primary-label');
    if (contactPrimaryLabel) contactPrimaryLabel.textContent = getVal(lang, 'ui.primary_link_label');

    const footerWatermark = document.getElementById('footer-watermark');
    if (footerWatermark) {
        footerWatermark.textContent = getVal(lang, 'ui.footer_watermark');
        autoFitWatermark(footerWatermark);
    }

    const profileEmailLabel = document.getElementById('profile-email-label');
    if (profileEmailLabel) profileEmailLabel.textContent = getVal(lang, 'ui.email_label');

    // --- Code Window values ---
    const cwName = document.getElementById('cw-name');
    if (cwName) cwName.textContent = `"${getVal(lang, 'ui.code_window_name')}"`;
    const cwRole = document.getElementById('cw-role');
    if (cwRole) cwRole.textContent = `"${getVal(lang, 'ui.code_window_role')}"`;
    const cwFocus = document.getElementById('cw-focus');
    if (cwFocus) cwFocus.textContent = `"${getVal(lang, 'ui.code_window_focus')}"`;





    // --- Build Skills Grid ---
    const skillsGrid = document.getElementById('skills-grid');
    if (skillsGrid) {
        skillsGrid.innerHTML = '';

        const categoryThemes = {
            core: {
                accentBorder: 'via-indigo-500/80',
                iconColor: 'text-indigo-400',
                pillHoverBorder: 'hover:border-indigo-500/40',
                pillHoverText: 'hover:text-indigo-200',
                pillDot: 'bg-indigo-400/50',
                svg: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>`
            },
            frontend: {
                accentBorder: 'via-emerald-500/80',
                iconColor: 'text-emerald-400',
                pillHoverBorder: 'hover:border-emerald-500/40',
                pillHoverText: 'hover:text-emerald-200',
                pillDot: 'bg-emerald-400/50',
                svg: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1zm0 0v4m16-4v4M4 9h16"/></svg>`
            },
            delivery_tools: {
                accentBorder: 'via-purple-500/80',
                iconColor: 'text-purple-400',
                pillHoverBorder: 'hover:border-purple-500/40',
                pillHoverText: 'hover:text-purple-200',
                pillDot: 'bg-purple-400/50',
                svg: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>`
            }
        };

        let delayCounter = 0;

        const categories = getVal(lang, 'skills.categories', {});
        for (const [categoryKey, categoryTitle] of Object.entries(categories)) {
            const skillsList = getVal(lang, `skills.${categoryKey}`, []);
            if (!skillsList) continue;

            const theme = categoryThemes[categoryKey] || categoryThemes.core;

            const card = document.createElement('div');
            card.className = `project-reveal project-reveal-delay-${(delayCounter % 3) + 1} flex flex-col bg-bg-card border border-white/[0.06] rounded-2xl p-6 md:p-7 transition-all duration-300 relative group overflow-hidden shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/40 hover:-translate-y-1 hover:bg-bg-window-title`;
            delayCounter++;

            // Top gradient accent line (revealed on hover)
            const accentLine = document.createElement('div');
            accentLine.className = `absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent ${theme.accentBorder} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`;
            card.appendChild(accentLine);

            // Header (Icon + Title)
            const header = document.createElement('div');
            header.className = "flex items-center gap-4 mb-6";

            const iconWrap = document.createElement('div');
            iconWrap.className = `w-12 h-12 shrink-0 rounded-xl flex items-center justify-center bg-white/[0.03] border border-white/[0.06] group-hover:bg-white/[0.06] transition-colors duration-300 ${theme.iconColor}`;
            iconWrap.innerHTML = theme.svg;

            const title = document.createElement('h3');
            title.className = "text-xl font-bold text-text-heading tracking-tight";
            title.textContent = categoryTitle;

            header.appendChild(iconWrap);
            header.appendChild(title);
            card.appendChild(header);

            // Skills List
            const skillsContainer = document.createElement('div');
            skillsContainer.className = "flex flex-wrap gap-2.5 mt-auto";

            skillsList.forEach((skill) => {
                const pill = document.createElement('div');
                pill.className = `inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-white/[0.06] bg-bg-pill text-text-main font-mono text-sm transition-colors duration-200 cursor-default hover:bg-bg-pill-hover ${theme.pillHoverBorder} ${theme.pillHoverText}`;

                pill.innerHTML = `
                  <span class="w-1.5 h-1.5 rounded-full ${theme.pillDot}"></span>
                  ${skill}
                `;
                skillsContainer.appendChild(pill);
            });

            card.appendChild(skillsContainer);
            skillsGrid.appendChild(card);
        }
    }

    // --- Build Projects (Spotlight + Grid) ---
    buildProjectsSection(lang);
}

// ─── PROJECT ICON SVGs ───
const projectIcons = {
    cart: `<svg class="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/></svg>`,
    globe: `<svg class="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>`,
    code: `<svg class="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>`,
    server: `<svg class="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"/></svg>`
};

const externalLinkSVG = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>`;

const codeSVG = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>`;

function buildProjectsSection(lang) {
    const gridContainer = document.getElementById('projects-grid');
    const subtitleEl = document.getElementById('projects-subtitle');

    if (subtitleEl) subtitleEl.textContent = getVal(lang, 'ui.projects_subtitle');

    const projects = getVal(lang, 'projects', []);
    if (projects.length === 0) return;

    if (gridContainer) {
        gridContainer.innerHTML = '';
        projects.forEach((proj, index) => {
            gridContainer.appendChild(buildCompactCard(proj, lang, index));
        });
    }

    initProjectReveal();
}

function buildCompactCard(project, lang, index) {
    const wrap = document.createElement('article');
    // State-of-the-art highly aesthetic monolithic card
    wrap.className = `project-reveal project-reveal-delay-${index} cursor-pointer group flex flex-col relative w-[85vw] sm:w-[360px] md:w-[400px] shrink-0 snap-center rounded-[1.25rem] bg-bg-modal border border-white/5 hover:border-indigo-500/40 transition-all duration-500 overflow-hidden shadow-xl shadow-black/40 hover:shadow-2xl hover:shadow-indigo-500/10`;
    
    wrap.onclick = () => openProjModal(project, lang);

    // Auto-generate URL
    let displayDomain = '';
    let hrefLink = project.link && project.link !== '#' ? project.link : '#';
    if (project.link && project.link !== '#') {
        try {
            let parseUrl = project.link.startsWith('http') ? project.link : 'https://' + project.link;
            displayDomain = new URL(parseUrl).hostname.replace('www.', '');
        } catch (e) {
            displayDomain = project.link;
        }
    } else {
        displayDomain = (project.name || '').toLowerCase().replace(/[^a-z0-9]/g, '') + '.app';
    }

    // ==========================================
    // 1. IMAGE SECTION (Top Half)
    // ==========================================
    const imgWrap = document.createElement('div');
    imgWrap.className = 'relative w-full aspect-[4/3] bg-bg-preview-skeleton overflow-hidden';

    if (project.image) {
        const img = document.createElement('img');
        img.src = project.image;
        img.alt = project.name;
        img.className = 'w-full h-full object-cover object-top transition-transform duration-1000 ease-[cubic-bezier(0.25,0.8,0.25,1)] group-hover:scale-110';
        img.loading = 'lazy';
        imgWrap.appendChild(img);
    } else {
        imgWrap.classList.add('flex', 'items-center', 'justify-center');
        imgWrap.innerHTML = `<span class="text-border-main font-mono text-xs font-bold tracking-widest">[ ${getVal(lang, 'ui.no_preview') || 'NO PREVIEW'} ]</span>`;
    }

    // Gradient Overlay to ensure bottom contrast and blend
    const gradientOverlay = document.createElement('div');
    gradientOverlay.className = 'absolute inset-0 bg-gradient-to-t from-bg-modal via-bg-modal/20 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-70 pointer-events-none';
    imgWrap.appendChild(gradientOverlay);

    // Floating Type Badge (Top-End) overlaying the image
    const typeBadgeWrap = document.createElement('div');
    typeBadgeWrap.className = 'absolute top-4 end-4 z-10 max-w-[80%]'; // protects from too long texts
    typeBadgeWrap.innerHTML = `
      <div class="bg-bg-preview-skeleton/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center shadow-lg">
         <span class="text-[9px] md:text-[10px] font-mono font-semibold text-indigo-300 uppercase tracking-widest truncate">${project.type}</span>
      </div>
    `;
    imgWrap.appendChild(typeBadgeWrap);

    // Hover Action Button Center Overlay
    const actionOverlay = document.createElement('div');
    actionOverlay.className = 'absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 bg-black/20 backdrop-blur-[2px] pointer-events-none';
    actionOverlay.innerHTML = `
      <div class="bg-indigo-600 text-white flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out shadow-xl shadow-indigo-900/50">
         <span>${getVal(lang, 'ui.view_details') || 'View Details'}</span>
         <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
      </div>
    `;
    imgWrap.appendChild(actionOverlay);

    wrap.appendChild(imgWrap);

    // ==========================================
    // 2. CONTENT SECTION (Bottom Half)
    // ==========================================
    const contentWrap = document.createElement('div');
    contentWrap.className = 'relative flex flex-col p-5 md:p-6 z-10 min-w-0';

    const titleRow = document.createElement('div');
    titleRow.className = 'flex items-center justify-between gap-4 w-full min-w-0';

    // Title
    const titleEl = document.createElement('h3');
    titleEl.className = 'text-xl md:text-2xl font-bold text-white tracking-tight truncate flex-1 min-w-0 group-hover:text-indigo-400 transition-colors duration-300';
    titleEl.textContent = project.name;
    titleRow.appendChild(titleEl);

    // Live Status
    if (project.status === 'live') {
        const statusWrap = document.createElement('div');
        statusWrap.className = 'flex items-center gap-1.5 shrink-0 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md';
        statusWrap.innerHTML = `
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span class="text-[9px] uppercase tracking-widest font-bold text-emerald-400/90 relative top-[1px]">${getVal(lang, 'ui.status_live') || 'LIVE'}</span>
        `;
        titleRow.appendChild(statusWrap);
    }
    
    contentWrap.appendChild(titleRow);

    // URL / Domain Row
    const linkRow = document.createElement('div');
    linkRow.className = 'flex items-center mt-3 text-text-muted min-w-0 w-full hover:text-text-main transition-colors duration-300';
    linkRow.innerHTML = `
      <svg class="w-4 h-4 me-2 shrink-0 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
      <span class="text-sm font-mono tracking-wide truncate w-full">${displayDomain}</span>
    `;

    contentWrap.appendChild(linkRow);

    wrap.appendChild(contentWrap);

    // Top-End shimmering spot effect (Luxury lighting touch)
    const shine = document.createElement('div');
    shine.className = 'absolute -top-24 -end-24 w-48 h-48 bg-indigo-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none';
    wrap.appendChild(shine);

    return wrap;
}

// Modal Logic
function openProjModal(project, lang) {
    const overlay = document.getElementById('proj-modal-overlay');

    // Fill data
    const imgEl = document.getElementById('proj-modal-img');
    if (project.image) {
        imgEl.src = project.image;
        imgEl.style.display = 'block';
    } else {
        imgEl.style.display = 'none';
    }

    document.getElementById('proj-modal-icon').innerHTML = projectIcons[project.icon] || projectIcons.code;
    document.getElementById('proj-modal-title').textContent = project.name;
    document.getElementById('proj-modal-desc').textContent = project.description;

    document.getElementById('proj-modal-role-label').textContent = getVal(lang, 'ui.project_role_label') || 'Role';
    document.getElementById('proj-modal-role').textContent = project.role;

    document.getElementById('proj-modal-desc-label').textContent = getVal(lang, 'ui.project_details_label');

    document.getElementById('proj-modal-tech-label').textContent = getVal(lang, 'ui.tech_stack_label');

    // Badges
    const badgesContainer = document.getElementById('proj-modal-badges');
    badgesContainer.innerHTML = '';

    const typeBadge = document.createElement('span');
    typeBadge.className = 'text-[10px] font-mono font-semibold text-indigo-400/80 uppercase tracking-widest bg-indigo-400/[0.06] px-2.5 py-1 rounded-md border border-indigo-400/10';
    typeBadge.textContent = project.type;
    badgesContainer.appendChild(typeBadge);

    const yearBadge = document.createElement('span');
    yearBadge.className = 'text-[10px] font-mono font-semibold text-text-secondary uppercase tracking-widest bg-bg-pill px-2.5 py-1 rounded-md border border-border-main';
    yearBadge.textContent = project.year;
    badgesContainer.appendChild(yearBadge);

    if (project.status === 'live') {
        const statusWrap = document.createElement('span');
        statusWrap.className = 'flex items-center gap-1.5 ms-2 me-2';
        const statusDot = document.createElement('span');
        statusDot.className = 'project-status-dot';
        const statusLabel = document.createElement('span');
        statusLabel.className = 'text-emerald-400 text-xs font-mono font-medium';
        statusLabel.textContent = project.status_label;
        statusWrap.appendChild(statusDot);
        statusWrap.appendChild(statusLabel);
        badgesContainer.appendChild(statusWrap);
    }

    // Highlights
    const hlContainer = document.getElementById('proj-modal-highlights-container');
    if (project.highlights && project.highlights.length > 0) {
        hlContainer.classList.remove('hidden');
        document.getElementById('proj-modal-hl-label').textContent = getVal(lang, 'ui.project_highlights_label') || 'Highlights';

        const hlList = document.getElementById('proj-modal-highlights');
        hlList.innerHTML = '';
        project.highlights.forEach(hl => {
            const item = document.createElement('div');
            item.className = 'project-highlight-item';
            item.textContent = hl;
            hlList.appendChild(item);
        });
    } else {
        hlContainer.classList.add('hidden');
    }

    // Tech
    const techWrap = document.getElementById('proj-modal-tech');
    techWrap.innerHTML = '';
    project.tech_stack.forEach(tech => {
        const pill = document.createElement('span');
        pill.className = 'relative px-3 py-1 text-[11px] font-mono font-medium rounded-full text-syntax-key bg-accent-indigo/[0.08] border border-accent-indigo/[0.12] transition-colors duration-250 tracking-wide hover:bg-accent-indigo/[0.14] hover:border-accent-indigo/[0.25] hover:text-accent-indigo-lighter';
        pill.textContent = tech;
        techWrap.appendChild(pill);
    });

    // Actions
    const actionsWrap = document.getElementById('proj-modal-actions');
    actionsWrap.innerHTML = '';

    const liveBtn = document.createElement('a');
    liveBtn.href = project.link;
    liveBtn.target = '_blank';
    liveBtn.className = 'inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-semibold font-sans transition-all duration-300 bg-accent-indigo/[0.12] text-syntax-key border border-accent-indigo/[0.18] hover:bg-accent-indigo/[0.22] hover:border-accent-indigo/[0.4] hover:text-accent-indigo-lightest hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(var(--accent-indigo),0.15)] flex-1 justify-center cursor-pointer no-underline';
    liveBtn.innerHTML = `${externalLinkSVG} <span>${getVal(lang, 'ui.visit_project') || 'Live Preview'}</span>`;
    actionsWrap.appendChild(liveBtn);

    // Check if source button should be hidden (T015)
    // We compare this project's source with the same project in the other locale
    // Find index of current project to match in other locale
    const projIndex = portfolioData[lang].projects.findIndex(p => p.name === project.name);
    const otherLang = lang === 'ar' ? 'en' : 'ar';
    const otherProj = portfolioData[otherLang].projects[projIndex];
    const sourceHidden = project.source === '#' && (!otherProj || otherProj.source === '#');

    if (project.source && !sourceHidden) {
        const srcBtn = document.createElement('a');
        srcBtn.href = project.source;
        srcBtn.target = '_blank';
        srcBtn.className = 'inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-semibold font-sans transition-all duration-300 bg-pure-white/[0.03] text-text-muted border border-pure-white/[0.06] hover:bg-pure-white/[0.06] hover:border-pure-white/[0.12] hover:text-text-main hover:-translate-y-[2px] flex-1 justify-center cursor-pointer no-underline';
        srcBtn.innerHTML = `${codeSVG} <span>${getVal(lang, 'ui.view_source') || 'Source Code'}</span>`;
        actionsWrap.appendChild(srcBtn);
    }

    // Show modal
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden'; // prevent bg scroll

    // Slight animation
    const card = document.getElementById('proj-modal-card');
    card.animate([
        { transform: 'scale(0.95) translateY(10px)', opacity: 0 },
        { transform: 'scale(1) translateY(0)', opacity: 1 }
    ], { duration: 300, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
}

function closeProjModal(e) {
    if (e) e.preventDefault();
    const overlay = document.getElementById('proj-modal-overlay');
    const card = document.getElementById('proj-modal-card');

    const anim = card.animate([
        { transform: 'scale(1) translateY(0)', opacity: 1 },
        { transform: 'scale(0.95) translateY(10px)', opacity: 0 }
    ], { duration: 250, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });

    anim.onfinish = () => {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    };
}

// Bind close events
document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.getElementById('proj-modal-close');
    const backdrop = document.getElementById('proj-modal-backdrop');
    if (closeBtn) closeBtn.addEventListener('click', closeProjModal);
    if (backdrop) backdrop.addEventListener('click', closeProjModal);

    // Override profile listener to not break existing DOM tree structure
    const pcloseBtn = document.getElementById('profile-modal-close');
    if (pcloseBtn && !pcloseBtn.hasAttribute('data-bound')) {
        // Just letting existing logic handle it, don't overwrite
    }
});

// ─── SCROLL REVEAL OBSERVER ───
function initProjectReveal() {
    const revealEls = document.querySelectorAll('.project-reveal');
    if (!revealEls.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    });

    revealEls.forEach(el => observer.observe(el));
}

