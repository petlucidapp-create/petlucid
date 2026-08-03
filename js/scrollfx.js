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
  // Scroll Driven Blur — Hero
  // -------------------------------------------------------------------
  function updateHeroBlur() {
    const hero = document.getElementById('heroSection');
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    const heroHeight = rect.height;
    // 0 = tam görünür üstte, 1 = tamamen scroll edilmiş (üstten çıkmış)
    const progress = Math.min(Math.max(-rect.top / (heroHeight * 0.7), 0), 1);
    const blurPx = progress * 14;
    const scale = 1 - progress * 0.04;
    const opacity = 1 - progress * 0.6;
    hero.style.filter = `blur(${blurPx}px)`;
    hero.style.transform = `scale(${scale})`;
    hero.style.opacity = String(Math.max(opacity, 0.3));
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
