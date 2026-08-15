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
  // Aşağı kaydırıldıkça kayboluş sırası: icon -> badges -> keywords ->
  // subtitle -> title (title en sona bırakılır, "sabit kalan slogan"
  // hissi için; subtitle de sloganın hemen altında uzunca bir süre sabit
  // kalıp store rozetleri ve anahtar kelimeler kaybolduktan SONRA, title'dan
  // hemen önce kaybolur). Her katmanın kendi [start, end] penceresi var;
  // pencere içinde blur + opacity + hafif translateY uygulanır, pencere
  // dışında tam nettir.
  // Madde 3: store rozetleri ve anahtar kelimeler artık daha geç başlayıp
  // daha uzun bir pencereye yayılıyor — scroll'un ilk hareketinde hemen
  // kaybolmuyorlar, ekranda daha uzun süre net kalıyorlar.
  const HERO_LAYER_WINDOWS = {
    icon:     { start: 0.00, end: 0.16 },
    badges:   { start: 0.30, end: 0.58 },
    keywords: { start: 0.46, end: 0.74 },
    subtitle: { start: 0.70, end: 0.90 },
    title:    { start: 0.86, end: 1.00 },
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
  // Madde 4 — Mock ekranlar için çok hafif dikey parallax. Her sticky
  // mock kolonunun viewport merkezine olan uzaklığı ölçülür ve küçük bir
  // translateY'e çevrilir (max birkaç piksel) — belirgin bir kayma değil,
  // ince bir "nefes alma" hissi. Sticky pozisyonlamayı bozmamak için mock
  // ekranın KENDİSİNE değil (o zaten sticky), .mock-screen/.mock-carousel
  // elemanına (--pl-mock-y ile) uygulanıyor.
  // -------------------------------------------------------------------
  const MOCK_PARALLAX_MAX_PX = 9;

  function updateMockParallax() {
    // Mobilde (≤900px) mock sticky değil, parallax transform uygulanmaz
    if (window.innerWidth <= 900) return;
    const cols = document.querySelectorAll('.sticky-flow__mock-col');
    const viewportH = window.innerHeight || document.documentElement.clientHeight;
    cols.forEach((col) => {
      const rect = col.getBoundingClientRect();
      const colCenter = rect.top + rect.height / 2;
      const viewportCenter = viewportH / 2;
      // -1 (üstte) .. 0 (merkezde) .. 1 (altta), aşırı uçlarda kırpılır
      const norm = Math.min(Math.max((colCenter - viewportCenter) / viewportCenter, -1), 1);
      col.style.setProperty('--pl-mock-y', String(-norm * MOCK_PARALLAX_MAX_PX));

      // Parallax glow (Mock arkası ışıltı): kolon viewport merkezine
      // yakınken parlak (--pl-glow ~1), kenara/dışarı çıktıkça söner (~0).
      // Aynı normalize edilmiş mesafe kullanılır ama ters çevrilip
      // 0..1 aralığına sıkıştırılır.
      const glow = Math.max(1 - Math.abs(norm), 0);
      col.style.setProperty('--pl-glow', String(glow));
    });
  }

  // -------------------------------------------------------------------
  // Mock görüntülerin arkasındaki parallax ışıltı — sabit (statik konumlu)
  // mock ekranlar (.sticky-flow__mock-col dışındaki, ör. mobilde artık
  // sticky olmayan kolon içindekiler dahil tüm .mock-screen'ler) için de
  // aynı mantık: viewport merkezine yakınlık = parlaklık. Bu, mobilde artık
  // sticky olmayan mock ekranın da doğal akışta kayarken ışıltısının
  // merkeze gelince parlaması, kenara çıkınca sönmesi için gerekli.
  // -------------------------------------------------------------------
  function updateStandaloneMockGlow() {
    const viewportH = window.innerHeight || document.documentElement.clientHeight;
    const viewportCenter = viewportH / 2;
    // .mock-glow, .mock-screen'in KARDEŞİ (aynı ebeveyn içinde ayrı bir
    // eleman) — bu yüzden --pl-glow doğrudan .mock-glow üzerine yazılır,
    // .mock-screen üzerine değil (miras/inheritance kardeşler arası işlemez).
    document.querySelectorAll('.mock-glow').forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.height === 0 && rect.width === 0) return; // display:none / gizli
      const elCenter = rect.top + rect.height / 2;
      const norm = Math.min(Math.max((elCenter - viewportCenter) / viewportCenter, -1), 1);
      const glow = Math.max(1 - Math.abs(norm), 0);
      el.style.setProperty('--pl-glow', String(glow));
    });
  }

  // -------------------------------------------------------------------
  // Coverflow — Mobil Mock Carousel (Madde 3) + Masaüstü/Mobil App Showcase
  // şeridi. Ortadaki slayt öne/büyük, yanlardakiler arkada/küçük. Her
  // track'in KENDİ scroll event'i dinlenir (yatay iç scroll, sayfa
  // scroll'undan bağımsız); her slaytın track merkezine olan uzaklığı
  // slayt genişliğine oranlanarak --pl-dist'e yazılır. İki farklı slayt
  // sınıfı (.mock-carousel__slide, .showcase-carousel__slide) aynı
  // mekanizmayı paylaşır — hangisi geçerliyse track içinde o seçilir.
  // -------------------------------------------------------------------
  const coverflowTracks = new Set();
  const COVERFLOW_SLIDE_SELECTOR = '.mock-carousel__slide, .showcase-carousel__slide';
  const COVERFLOW_TRACK_SELECTOR = '.mock-carousel__track, .showcase-carousel__track';

  function updateCoverflowTrack(track) {
    const trackRect = track.getBoundingClientRect();
    const trackCenter = trackRect.left + trackRect.width / 2;
    const slides = track.querySelectorAll(COVERFLOW_SLIDE_SELECTOR);
    slides.forEach((slide) => {
      const r = slide.getBoundingClientRect();
      const slideCenter = r.left + r.width / 2;
      const dist = Math.abs(slideCenter - trackCenter) / (r.width || 1);
      slide.style.setProperty('--pl-dist', String(dist));
      slide.style.setProperty('--pl-z', String(dist < 0.15 ? 10 : 5));
      // Coverflow'da öne gelen (ortadaki, dist~0) slayt parlar; yanlara
      // kayan/arkaya düşen slaytların ışıltısı söner.
      const glow = Math.max(1 - Math.min(dist, 1), 0);
      slide.style.setProperty('--pl-glow', String(glow));
    });
  }

  function registerCoverflowTrack(track) {
    if (!track || coverflowTracks.has(track)) return;
    coverflowTracks.add(track);
    let localTicking = false;
    const onTrackScroll = () => {
      if (localTicking) return;
      localTicking = true;
      requestAnimationFrame(() => {
        updateCoverflowTrack(track);
        localTicking = false;
      });
    };
    track.addEventListener('scroll', onTrackScroll, { passive: true });
    updateCoverflowTrack(track);
  }

  function initCoverflow() {
    document.querySelectorAll(COVERFLOW_TRACK_SELECTOR).forEach(registerCoverflowTrack);
  }

  function refreshCoverflow() {
    // Dil değişimi / yeni guide section render sonrası yeni track'leri bağlar.
    initCoverflow();
  }

  window.addEventListener('resize', () => {
    coverflowTracks.forEach(updateCoverflowTrack);
  });

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
  // Border Beam — [data-beam] kartları ekran dışındayken animasyonu
  // durdurur (GPU/pil tasarrufu). reveal observer'dan farklı olarak
  // unobserve YAPMAZ — kart tekrar ekrana girip çıktıkça sürekli
  // aç/kapa yapması gerekiyor.
  // -------------------------------------------------------------------
  function setupBeamObserver() {
    const targets = document.querySelectorAll('[data-beam]');
    if (!targets.length) return null;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-offscreen', !entry.isIntersecting);
      });
    }, { threshold: 0.01 });
    targets.forEach((elm) => io.observe(elm));
    return io;
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
      updateMockParallax();
      updateStandaloneMockGlow();
      ticking = false;
    });
  }

  function init() {
    global.__plRevealIO = setupRevealObserver();
    setupBeamObserver();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    initCoverflow();
  }

  global.PLScrollFX = {
    init,
    refreshRevealObserver,
    onScroll,
    refreshCoverflow,
  };
})(window);
