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

  const guideViewState = { screen: null, topic: null };

  function switchLanguage(lang) {
    window.PLI18n.setLang(lang);
    updateLangTriggerLabel();
    buildLangMenu();
    window.PLRender.renderAll();
    window.requestAnimationFrame(() => {
      window.PLScrollFX.refreshRevealObserver();
      window.PLScrollFX.onScroll();
      window.PLScrollFX.refreshCoverflow();
      bindGuideNavigation();
      restoreGuideView();
    });
  }

  // -------------------------------------------------------------------
  // Guide navigation — "sadece tıklanan blok görünür" (Madde 6 & 6.1)
  // Kart tıklanınca: catalog gizlenir, sadece o guide-section görünür.
  // Topic-pill tıklanınca: topic listesi gizlenir, sadece o topic bloğu görünür.
  // Geri butonları bunu tersine çevirir.
  // -------------------------------------------------------------------
  function revealNow(root) {
    root.querySelectorAll('.reveal:not(.is-visible)').forEach((elm) => elm.classList.add('is-visible'));
  }

  // Sayfanın mutlak tepesine (window scrollTo top:0) değil, açılan bölümün
  // KENDİ başına scroll eder — sabit header'ın altında kalmaması için
  // header yüksekliği kadar pay bırakır. Önceki davranış her zaman en başa
  // (hero'nun üstüne) atlıyordu, bu "otomatik sitenin en başına gidiyor"
  // şikayetine sebep oluyordu.
  function scrollToSectionTop(sectionEl) {
    const header = document.getElementById('siteHeader');
    const headerH = header ? header.getBoundingClientRect().height : 0;
    const rect = sectionEl.getBoundingClientRect();
    const targetY = window.scrollY + rect.top - headerH - 12;
    window.scrollTo({ top: Math.max(targetY, 0), behavior: 'auto' });
  }

  function showGuideSection(screen) {
    document.querySelectorAll('.guide-section').forEach((sec) => {
      sec.classList.toggle('is-active', sec.id === `guide-${screen}`);
    });
    document.getElementById('guideSection').classList.add('is-hidden');
    document.getElementById('guideDetails').classList.add('is-active');
    guideViewState.screen = screen;
    guideViewState.topic = null;
    const activeSection = document.getElementById(`guide-${screen}`);
    if (activeSection) {
      revealNow(activeSection);
      scrollToSectionTop(activeSection);
    }
  }

  function showCatalog() {
    document.querySelectorAll('.guide-section').forEach((sec) => sec.classList.remove('is-active'));
    document.getElementById('guideSection').classList.remove('is-hidden');
    document.getElementById('guideDetails').classList.remove('is-active');
    guideViewState.screen = null;
    guideViewState.topic = null;
    const target = document.getElementById('guideSection');
    if (target) target.scrollIntoView({ behavior: 'auto', block: 'start' });
  }

  function showTopic(screen, topicId) {
    const sectionEl = document.getElementById(`guide-${screen}`);
    if (!sectionEl) return;
    sectionEl.querySelectorAll('.topic-flow-block').forEach((blk) => {
      blk.classList.toggle('is-active', blk.getAttribute('data-topic-id') === topicId);
    });
    const listWrap = sectionEl.querySelector('.topic-list-wrap');
    if (listWrap) listWrap.classList.remove('is-active');
    guideViewState.screen = screen;
    guideViewState.topic = topicId;
    revealNow(sectionEl);
    scrollToSectionTop(sectionEl);
  }

  function showTopicList(screen) {
    const sectionEl = document.getElementById(`guide-${screen}`);
    if (!sectionEl) return;
    sectionEl.querySelectorAll('.topic-flow-block').forEach((blk) => blk.classList.remove('is-active'));
    const listWrap = sectionEl.querySelector('.topic-list-wrap');
    if (listWrap) listWrap.classList.add('is-active');
    guideViewState.topic = null;
  }

  // Dil değişiminden sonra (renderAll ile DOM sıfırdan kurulduğunda) aynı
  // görünüme geri döner: katalogdaysak dokunma, bir screen/topic açıksa
  // scroll pozisyonuna güvenmeden aynı bloğu tekrar aktif hale getirir.
  function restoreGuideView() {
    if (!guideViewState.screen) return; // katalogtaydık, renderAll zaten katalog + gizli sectionlar üretti
    document.querySelectorAll('.guide-section').forEach((sec) => {
      sec.classList.toggle('is-active', sec.id === `guide-${guideViewState.screen}`);
    });
    document.getElementById('guideSection').classList.add('is-hidden');
    document.getElementById('guideDetails').classList.add('is-active');
    const activeSection = document.getElementById(`guide-${guideViewState.screen}`);
    if (guideViewState.topic && activeSection) {
      activeSection.querySelectorAll('.topic-flow-block').forEach((blk) => {
        blk.classList.toggle('is-active', blk.getAttribute('data-topic-id') === guideViewState.topic);
      });
      const listWrap = activeSection.querySelector('.topic-list-wrap');
      if (listWrap) listWrap.classList.remove('is-active');
    }
    if (activeSection) revealNow(activeSection);
  }

  function bindGuideNavigation() {
    document.querySelectorAll('[data-goto]').forEach((elm) => {
      elm.addEventListener('click', (e) => {
        e.preventDefault();
        showGuideSection(elm.getAttribute('data-goto'));
      });
    });

    document.querySelectorAll('[data-back-to-catalog]').forEach((elm) => {
      elm.addEventListener('click', () => showCatalog());
    });

    document.querySelectorAll('[data-topic-target]').forEach((elm) => {
      elm.addEventListener('click', () => {
        const val = elm.getAttribute('data-topic-target'); // "{screen}-{topicId}"
        const dashIdx = val.indexOf('-');
        const screen = val.slice(0, dashIdx);
        showTopic(screen, val);
      });
    });

    document.querySelectorAll('[data-back-to-topics]').forEach((elm) => {
      elm.addEventListener('click', () => {
        showTopicList(elm.getAttribute('data-back-to-topics'));
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
    bindGuideNavigation();
    initCarouselNav();

    window.PLScrollFX.init();
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
