/**
 * PetLucid — App bootstrap
 * Veri yükleme, dil/tema yönetimi, dil menüsü, smooth scroll navigasyonu.
 */
(function () {
  const THEME_KEY = 'petlucid_theme';

  function applyTheme(theme) {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.getElementById('themeIconSun').style.display = theme === 'dark' ? 'none' : 'block';
    document.getElementById('themeIconMoon').style.display = theme === 'dark' ? 'block' : 'none';
    localStorage.setItem(THEME_KEY, theme);
  }

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(saved || (prefersDark ? 'dark' : 'light'));

    document.getElementById('themeToggle').addEventListener('click', () => {
      const isDark = document.documentElement.classList.contains('dark');
      applyTheme(isDark ? 'light' : 'dark');
    });
  }

  function buildLangMenu() {
    const { meta, currentLang, langName } = window.PLI18n;
    const m = meta();
    const menu = document.getElementById('langMenu');
    menu.innerHTML = m.langs.map((code) => `
      <div class="lang-menu__item ${code === currentLang() ? 'is-active' : ''}" role="option" data-lang="${code}">
        ${langName(code)}
      </div>
    `).join('');

    menu.querySelectorAll('.lang-menu__item').forEach((item) => {
      item.addEventListener('click', () => {
        const lang = item.getAttribute('data-lang');
        switchLanguage(lang);
        closeLangMenu();
      });
    });
  }

  function openLangMenu() {
    document.getElementById('langMenu').classList.add('is-open');
    document.getElementById('langTrigger').setAttribute('aria-expanded', 'true');
  }
  function closeLangMenu() {
    document.getElementById('langMenu').classList.remove('is-open');
    document.getElementById('langTrigger').setAttribute('aria-expanded', 'false');
  }

  function initLangMenu() {
    const trigger = document.getElementById('langTrigger');
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = document.getElementById('langMenu').classList.contains('is-open');
      isOpen ? closeLangMenu() : openLangMenu();
    });
    document.addEventListener('click', (e) => {
      const wrap = document.querySelector('.lang-select-wrap');
      if (!wrap.contains(e.target)) closeLangMenu();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLangMenu();
    });
  }

  function updateLangTriggerLabel() {
    const { currentLang, langName } = window.PLI18n;
    document.getElementById('langTriggerLabel').textContent = langName(currentLang());
  }

  function switchLanguage(lang) {
    window.PLI18n.setLang(lang);
    updateLangTriggerLabel();
    buildLangMenu();
    // Scroll pozisyonunu koru
    const scrollY = window.scrollY;
    window.PLRender.renderAll();
    window.requestAnimationFrame(() => {
      window.scrollTo(0, scrollY);
      window.PLScrollFX.refreshRevealObserver();
      window.PLScrollFX.onScroll();
      bindSmoothScroll();
    });
  }

  function bindSmoothScroll() {
    document.querySelectorAll('[data-goto]').forEach((elm) => {
      elm.addEventListener('click', (e) => {
        const targetId = 'guide-' + elm.getAttribute('data-goto');
        const target = document.getElementById(targetId);
        if (target) {
          e.preventDefault();
          const headerOffset = 76;
          const y = target.getBoundingClientRect().top + window.scrollY - headerOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, { once: false });
    });

    document.querySelectorAll('[data-topic-target]').forEach((elm) => {
      elm.addEventListener('click', () => {
        const target = document.getElementById(elm.getAttribute('data-topic-target'));
        if (target) {
          const headerOffset = 76;
          const y = target.getBoundingClientRect().top + window.scrollY - headerOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      });
    });
  }

  function initBackToTop() {
    document.getElementById('backToTop').addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // -------------------------------------------------------------------
  // Guide carousel — masaüstü ok navigasyonu (Apple.com tarzı)
  // -------------------------------------------------------------------
  function initCarouselNav() {
    const track = document.getElementById('guideCarousel');
    const prevBtn = document.getElementById('guideCarouselPrev');
    const nextBtn = document.getElementById('guideCarouselNext');
    if (!track || !prevBtn || !nextBtn) return;

    function cardStep() {
      const item = track.querySelector('.carousel-item');
      if (!item) return track.clientWidth * 0.8;
      const style = getComputedStyle(track);
      const gap = parseFloat(style.columnGap || style.gap || '20');
      return item.getBoundingClientRect().width + gap;
    }

    function updateButtons() {
      const max = track.scrollWidth - track.clientWidth;
      prevBtn.disabled = track.scrollLeft <= 4;
      nextBtn.disabled = track.scrollLeft >= max - 4;
    }

    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -cardStep(), behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: cardStep(), behavior: 'smooth' });
    });
    track.addEventListener('scroll', updateButtons, { passive: true });
    window.addEventListener('resize', updateButtons);
    updateButtons();
  }

  async function boot() {
    try {
      await window.PLI18n.loadData();
    } catch (err) {
      console.error('PetLucid: veri yüklenemedi', err);
      document.body.innerHTML = '<div style="padding:80px;text-align:center;font-family:sans-serif;">Guide data could not be loaded. Please check data/guides.json.</div>';
      return;
    }

    const initialLang = window.PLI18n.detectInitialLang();
    window.PLI18n.setLang(initialLang);

    initTheme();
    updateLangTriggerLabel();
    buildLangMenu();
    initLangMenu();
    initBackToTop();

    window.PLRender.renderAll();
    bindSmoothScroll();
    initCarouselNav();

    window.PLScrollFX.init();
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
