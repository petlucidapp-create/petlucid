/**
 * PetLucid — Scroll Effects
 * Hafif, vanilla JS scroll listener (rAF ile throttle edilmiş).
 * - Pinned Sticky Scroll: her flow-step viewport ortasına yaklaştıkça
 *   ilgili mock frame'e crossfade yapar + step aktif/pasif opacity.
 * - Scroll Driven Blur: hero bölümü scroll ile bulanıklaşıp hafifçe küçülür.
 * - Reveal: .reveal elemanları viewport'a girince belirir.
 * - Text Color Scrubbing: opsiyonel — büyük başlıklarda kelime kelime "ışıkla yıkama".
 */
(function (global) {
  let ticking = false;

  // Not: Adım aktivasyonu artık scroll ile değil, tıklama (accordion) ile
  // yapılıyor — bkz. render.js renderStickyFlow(). Bu yüzden eskiden burada
  // bulunan collectStepGroups()/updateStickyFlows() (scroll ile otomatik
  // adım/mock geçişi) kaldırıldı.

  // -------------------------------------------------------------------
  // Katmanlı Hero Scroll Efekti (Madde 3)
  // -------------------------------------------------------------------
  // Aşağı kaydırıldıkça kayboluş sırası: icon -> subtitle -> badges ->
  // keywords -> title (title en sona bırakılır, "sabit kalan slogan"
  // hissi için). Her katmanın kendi [start, end] penceresi var; pencere
  // içinde blur + opacity + hafif translateY uygulanır, pencere dışında
  // tam nettir. Title'ın penceresi en sonda olduğu için diğerleri
  // kaybolana kadar o sabit ve net kalır.
  const HERO_LAYER_WINDOWS = {
    icon:     { start: 0.00, end: 0.22 },
    subtitle: { start: 0.16, end: 0.40 },
    badges:   { start: 0.34, end: 0.58 },
    keywords: { start: 0.52, end: 0.76 },
    title:    { start: 0.70, end: 1.00 },
  };
  const HERO_MAX_BLUR_PX = 10;
  const HERO_MAX_RISE_PX = 22; // yukarı doğru kayarak kaybolma mesafesi

  let heroLayerEls = null; // cache: {name: element}

  function collectHeroLayers() {
    heroLayerEls = {};
    document.querySelectorAll('[data-hero-layer]').forEach((el) => {
      heroLayerEls[el.getAttribute('data-hero-layer')] = el;
    });
  }

  function updateHeroBlur() {
    const hero = document.getElementById('heroSection');
    if (!hero) return;
    if (!heroLayerEls) collectHeroLayers();

    const rect = hero.getBoundingClientRect();
    const heroHeight = rect.height || 1;
    // 0 = hero tam görünür üstte, 1 = hero tamamen scroll edilip geçilmiş
    const progress = Math.min(Math.max(-rect.top / (heroHeight * 0.85), 0), 1);

    for (const layerName in HERO_LAYER_WINDOWS) {
      const el = heroLayerEls[layerName];
      if (!el) continue;
      const win = HERO_LAYER_WINDOWS[layerName];
      // Bu katmanın kendi penceresi içindeki yerel ilerleme (0..1)
      const span = win.end - win.start;
      const local = Math.min(Math.max((progress - win.start) / span, 0), 1);
      // Ease-out benzeri yumuşatma (kare kök) — başta yavaş, sonra hızlı blur
      const eased = 1 - Math.pow(1 - local, 2);

      el.style.setProperty('--pl-blur', String(eased * HERO_MAX_BLUR_PX));
      el.style.setProperty('--pl-opacity', String(Math.max(1 - eased, 0)));
      // Title dışındaki katmanlar "yukarıdaki sabit slogana doğru" kayar;
      // title'ın kendisi düz yukarı gider.
      el.style.setProperty('--pl-y', String(-eased * HERO_MAX_RISE_PX));
    }
  }

  // -------------------------------------------------------------------
  // Reveal on scroll (IntersectionObserver — daha performanslı)
  // -------------------------------------------------------------------
  function setupRevealObserver() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal').forEach((elm) => io.observe(elm));
    return io;
  }

  function refreshRevealObserver() {
    // Yeni eklenen .reveal elemanları için (dil değişimi / re-render sonrası)
    if (global.__plRevealIO) {
      document.querySelectorAll('.reveal:not(.is-visible)').forEach((elm) => global.__plRevealIO.observe(elm));
    }
  }

  // -------------------------------------------------------------------
  // Header scrolled state + back-to-top visibility
  // -------------------------------------------------------------------
  function updateChrome() {
    const header = document.getElementById('siteHeader');
    const backBtn = document.getElementById('backToTop');
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 8);
    backBtn.classList.toggle('is-visible', y > 700);
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateHeroBlur();
      updateChrome();
      ticking = false;
    });
  }

  function init() {
    global.__plRevealIO = setupRevealObserver();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
  }

  global.PLScrollFX = {
    init,
    refreshRevealObserver,
    onScroll,
  };
})(window);
