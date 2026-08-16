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
  // Madde 5: behavior artık 'auto' (anlık sıçrama / "pat diye" atlama)
  // değil, 'smooth' — kart tıklanınca sayfa sakince, akıcı bir kaydırmayla
  // ilgili bölüme gelir; ani zıplama hissi kalkar.
  function scrollToSectionTop(sectionEl) {
    const header = document.getElementById('siteHeader');
    const headerH = header ? header.getBoundingClientRect().height : 0;
    const rect = sectionEl.getBoundingClientRect();
    const targetY = window.scrollY + rect.top - headerH - 12;
    window.scrollTo({ top: Math.max(targetY, 0), behavior: 'smooth' });
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
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    // Madde: alt kart (topic) tıklanınca sayfa YERİNDE kalır — kılavuzun
    // başına scroll edilmez. Kullanıcı zaten o kılavuzun içinde; sadece
    // tıkladığı içerik açılır, sayfa kıpırdamaz.
    revealNow(sectionEl);
  }

  function showTopicList(screen) {
    const sectionEl = document.getElementById(`guide-${screen}`);
    if (!sectionEl) return;
    sectionEl.querySelectorAll('.topic-flow-block').forEach((blk) => blk.classList.remove('is-active'));
    const listWrap = sectionEl.querySelector('.topic-list-wrap');
    if (listWrap) listWrap.classList.add('is-active');
    guideViewState.topic = null;
    // Madde: "konulara dön" da sayfayı kaydırmaz — kullanıcı hangi
    // kartı görüyorsa listeye dönüşte de aynı konumda kalır.
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
  // Üst-seviye "glass-card" accordion kartları (Kılavuzlar, ileride
  // Evcil Hayvan Bilgileri vb.). Jenerik: [data-accordion] işaretli her
  // .accordion-card için başlığa tıklanınca aç/kapa. Tek yerden bağlanır,
  // yeni bir accordion kartı eklemek için sadece aynı HTML kalıbı
  // kopyalanır — JS'e dokunmaya gerek kalmaz. Açık/kapalı durum body
  // içinde tutulmaz (dil değişiminde render.js DOM'u sıfırdan kurar);
  // bunun yerine data-accordion elemanının kendi .is-open class'ı esas
  // alınır ve renderAll sonrası bu fonksiyon tekrar çağrılmaz çünkü
  // .accordion-card kartları innerHTML ile silinmez (guideSection'ın
  // dışında, statik HTML'de dururlar).
  // -------------------------------------------------------------------
  function initAccordionCards() {
    document.querySelectorAll('[data-accordion]').forEach((card) => {
      const header = card.querySelector('.accordion-card__header');
      if (!header || header.dataset.bound) return;
      header.dataset.bound = '1';
      header.addEventListener('click', () => {
        const willOpen = !card.classList.contains('is-open');
        card.classList.toggle('is-open', willOpen);
        header.setAttribute('aria-expanded', String(willOpen));
      });
    });
  }

  // -------------------------------------------------------------------
  // Kılavuz kartları — basılı tutma parıltısı (Madde 2). :active CSS
  // pseudo-class'ı touch cihazlarda scroll ile karışınca güvenilir
  // tetiklenmeyebiliyor; bu yüzden pointer olaylarıyla .is-pressed class'ı
  // da ekleniyor. Kartlar dinamik render edildiği için (dil değişimi,
  // guide detayları) event delegation kullanılıyor — tek kez bağlanır,
  // yeniden render sonrası tekrar bağlamaya gerek kalmaz.
  // -------------------------------------------------------------------
  function initCardPressGlow() {
    const press = (target) => {
      const card = target.closest('.guide-card');
      if (card) card.classList.add('is-pressed');
    };
    const release = () => {
      document.querySelectorAll('.guide-card.is-pressed').forEach((c) => c.classList.remove('is-pressed'));
    };
    document.addEventListener('pointerdown', (e) => press(e.target));
    document.addEventListener('pointerup', release);
    document.addEventListener('pointercancel', release);
    document.addEventListener('pointerleave', release, true);
  }

  // -------------------------------------------------------------------
  // Carousel — masaüstü ok navigasyonu (Apple.com tarzı)
  // Genel amaçlı: hem Kılavuzlar carousel'i (.carousel-item) hem App
  // Showcase coverflow şeridi (.showcase-carousel__slide) için kullanılır;
  // sadece slide seçicisi ve track/buton id'leri değişir.
  // -------------------------------------------------------------------
  function initCarouselNavFor(trackId, prevId, nextId, slideSelector) {
    const track = document.getElementById(trackId);
    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);
    if (!track || !prevBtn || !nextBtn) return;

    function cardStep() {
      const item = track.querySelector(slideSelector);
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

  function initCarouselNav() {
    initCarouselNavFor('guideCarousel', 'guideCarouselPrev', 'guideCarouselNext', '.carousel-item');
    initCarouselNavFor('showcaseCarousel', 'showcaseCarouselPrev', 'showcaseCarouselNext', '.showcase-carousel__slide');
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
    window.PLI18n.setLang(initialLang, { navigate: false });

    initTheme();
    updateLangTriggerLabel();
    buildLangMenu();
    initLangMenu();
    initBackToTop();

    window.PLRender.renderAll();
    bindGuideNavigation();
    initCarouselNav();
    initCardPressGlow();
    initAccordionCards();
    if (window.PLCalculator) window.PLCalculator.init();

    window.PLScrollFX.init();
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
