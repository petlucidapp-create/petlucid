/**
 * PetLucid — Render engine
 * i18n verisinden DOM'a: guide carousel kartları, detay bölümleri (sticky flow),
 * mock ekranların doldurulması.
 */
(function (global) {
  const I = global.PLIcon;

  function el(html) {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  // -----------------------------------------------------------------------
  // Guide summary text (kart üzerindeki kısa açıklama) — section/topic
  // sayısına göre placeholder-free kısa bir özet üretir (title'lardan).
  // -----------------------------------------------------------------------
  function screenSummary(screen) {
    const { t, meta } = global.PLI18n;
    const m = meta();
    if (m.guideTopics[screen]) {
      const topicIds = m.guideTopics[screen];
      const names = topicIds.map(id => t(`guide.${screen}.topics.${id}.navTitle`)).filter(Boolean);
      return names.join(' · ');
    }
    const secIds = m.guideSections[screen] || [];
    const names = secIds.map(id => t(`guide.${screen}.sections.${id}.title`)).filter(Boolean);
    return names.slice(0, 3).join(' · ');
  }

  // -----------------------------------------------------------------------
  // Carousel cards
  // -----------------------------------------------------------------------
  function renderCarousel() {
    const { t, meta, ui } = global.PLI18n;
    const m = meta();
    const track = document.getElementById('guideCarousel');
    track.innerHTML = '';

    m.screenOrder.forEach((screen) => {
      const sm = m.screenMeta[screen];
      const title = t(`guide.${screen}.title`);
      const summary = screenSummary(screen);
      const card = el(`
        <div class="carousel-item">
          <a href="#guide-${screen}" class="guide-card glass card hover-mask" data-accent="${sm.accent}" data-goto="${screen}">
            <div class="guide-card__glow" aria-hidden="true"></div>
            <div class="hover-scale-target" style="display:flex;flex-direction:column;height:100%;position:relative;z-index:1;">
              <div class="icon-badge icon-badge-lg guide-card__icon">${I(sm.icon, { size: 30 })}</div>
              <div class="guide-card__title">${title}</div>
              <div class="guide-card__desc">${summary}</div>
              <div class="guide-card__meta"><span data-ui="readGuide"></span>${I('ArrowRight', { size: 15 })}</div>
            </div>
          </a>
        </div>
      `);
      track.appendChild(card);
    });

    applyUIStrings(track);
  }

  // -----------------------------------------------------------------------
  // App Showcase Carousel — hero altındaki store screenshot şeridi.
  // 6 sabit görsel, assets/showcase/<id>.png yolunda beklenir. Dosya henüz
  // konmadıysa mockscreens.js'teki ile aynı "sırayla uzantı dene, hepsi
  // olmazsa placeholder göster" davranışı burada da geçerli (bkz.
  // handleShowcaseImgError). Alt metinleri her dilde showcase.items.<id>
  // guides.json'da YOKTUR — kısa, sabit bir liste burada tutulur ve ui()
  // üzerinden değil, doğrudan bu dosyada TR/EN + fallback ile çözülür,
  // çünkü bu sadece <img alt> için, görünür metin değil.
  // -----------------------------------------------------------------------
  const SHOWCASE_PATH = '/assets/showcase/';
  const SHOWCASE_EXT_CANDIDATES = ['png', 'jpg', 'jpeg', 'webp'];
  const SHOWCASE_ITEMS = [
    { id: 'home', alt: 'Home' },
    { id: 'health', alt: 'Health' },
    { id: 'prescription', alt: 'Prescription' },
    { id: 'reminders', alt: 'Reminders' },
    { id: 'pdf', alt: 'PDF Report' },
    { id: 'bulk', alt: 'Bulk Entry' },
  ];

  function handleShowcaseImgError(imgEl) {
    const id = imgEl.getAttribute('data-showcase-id');
    let idx = parseInt(imgEl.getAttribute('data-try-idx'), 10) + 1;
    if (idx < SHOWCASE_EXT_CANDIDATES.length) {
      imgEl.setAttribute('data-try-idx', String(idx));
      imgEl.src = `${SHOWCASE_PATH}${id}.${SHOWCASE_EXT_CANDIDATES[idx]}`;
    } else {
      const wrap = imgEl.closest('.showcase-carousel__slide');
      if (wrap) wrap.classList.add('is-placeholder');
    }
  }
  global.__plHandleShowcaseImgError = handleShowcaseImgError;

  function renderShowcaseCarousel() {
    const track = document.getElementById('showcaseCarousel');
    if (!track) return;
    track.innerHTML = '';
    SHOWCASE_ITEMS.forEach((item) => {
      const fileBase = SHOWCASE_PATH + item.id;
      const slide = el(`
        <div class="showcase-carousel__slide">
          <img
            alt="${item.alt}"
            data-showcase-id="${item.id}"
            data-try-idx="0"
            onerror="window.__plHandleShowcaseImgError(this)"
            src="${fileBase}.${SHOWCASE_EXT_CANDIDATES[0]}"
          />
          <div class="showcase-carousel__placeholder">
            ${I('ImageOff', { size: 24 })}
            <span>${item.id}.png</span>
          </div>
        </div>
      `);
      track.appendChild(slide);
    });
    if (global.PLScrollFX) global.PLScrollFX.refreshCoverflow();
  }

  function renderPillNav(containerId) {
    const { t, meta } = global.PLI18n;
    const m = meta();
    const nav = document.getElementById(containerId);
    if (!nav) return;
    nav.innerHTML = m.screenOrder.map(screen => {
      const title = t(`guide.${screen}.title`).split(' ')[0]; // kısa etiket
      return `<a href="#guide-${screen}" class="pill-nav__item" data-goto="${screen}">${title}</a>`;
    }).join('');
  }

  // -----------------------------------------------------------------------
  // Mock screen — bir screen.section (veya screen.topic.section) için
  // frame HTML üretir ve içindeki data-ph alanlarını placeholder metinle doldurur.
  // -----------------------------------------------------------------------
  const PLACEHOLDER_TEXT = {
    today: { tr: 'Bugün · 2 Ağustos', en: 'Today · Aug 2' },
    reminderCount: { tr: '3 hatırlatıcı', en: '3 reminders' },
    petType: { tr: 'Kedi · 2 yaş', en: 'Cat · 2 yrs' },
    editName: { tr: 'Ad, tür, cins', en: 'Name, species, breed' },
    editBreed: { tr: 'Doğum tarihi, bio', en: 'Birth date, bio' },
    farewellBtn: { tr: 'Veda et', en: 'Say farewell' },
    vetName: { tr: 'Dr. Veteriner Adı', en: 'Dr. Vet Name' },
    clinicName: { tr: 'Klinik adı', en: 'Clinic name' },
    upcoming: { tr: 'Yaklaşan ziyaretler', en: 'Upcoming visits' },
    remType: { tr: 'Tür seçimi', en: 'Type selection' },
    remFreq: { tr: 'Sıklık ve saat', en: 'Frequency & time' },
    save: { tr: 'Kaydet', en: 'Save' },
    calMonth: { tr: 'Ağustos 2026', en: 'August 2026' },
    paused: { tr: 'Duraklatıldı', en: 'Paused' },
    premiumOnly: { tr: 'Premium', en: 'Premium' },
    diagnosis: { tr: 'Teşhis adı', en: 'Diagnosis name' },
    addAnother: { tr: '+ Başka durum ekle', en: '+ Add another' },
    autoCreated: { tr: '✨ Otomatik oluşturuldu', en: '✨ Auto-created' },
    pdfType0: { tr: 'Sağlık Raporu', en: 'Health Report' },
    pdfType1: { tr: 'Kayıp İlanı', en: 'Lost Pet Flyer' },
    pdfType2: { tr: 'Veda Raporu', en: 'Farewell Report' },
    pdfType3: { tr: 'Kategori Raporu', en: 'Category Report' },
    createShare: { tr: 'Oluştur ve Paylaş', en: 'Create & Share' },
    lostPetTitle: { tr: 'KAYIP İLANI', en: 'LOST PET' },
    farewellReportTitle: { tr: 'Anı Raporu', en: 'Memory Report' },
    readOnly: { tr: 'Salt okunur', en: 'Read-only' },
    backupNow: { tr: 'Şimdi Yedekle', en: 'Back Up Now' },
    encrypt: { tr: 'Şifrele', en: 'Encrypt' },
    restoreBtn: { tr: 'Geri Yükle', en: 'Restore' },
    warningTitle: { tr: 'Mevcut veriler değişecek', en: 'Existing data will change' },
    free: { tr: 'Ücretsiz', en: 'Free' },
    bestChoice: { tr: 'En İyi Seçim', en: 'Best Choice' },
    premium: { tr: 'Premium Aktif', en: 'Premium Active' },
    buyNow: { tr: 'Ömür Boyu Satın Al', en: 'Buy Lifetime' },
    restorePurchase: { tr: 'Satın alımları geri yükle', en: 'Restore purchases' },
    addPet: { tr: 'Evcil Hayvan Ekle', en: 'Add Pet' },
    petTypeBreedAge: { tr: 'Kedi · Tekir · 2 yaş', en: 'Cat · Tabby · 2 yrs' },
    petSpecies_cat: { tr: 'Kedi', en: 'Cat' },
    petSpecies_dog: { tr: 'Köpek', en: 'Dog' },
    petSpecies_bird: { tr: 'Kuş', en: 'Bird' },
    assignedVet: { tr: 'ATANMIŞ VETERİNER', en: 'ASSIGNED VET' },
    prescriptions: { tr: 'Reçeteler', en: 'Prescriptions' },
    genderLabel: { tr: 'CİNSİYET', en: 'GENDER' },
    birthDateLabel: { tr: 'DOĞUM TARİHİ', en: 'BIRTH DATE' },
    birthDate: { tr: '27.01.2026', en: 'Jan 27, 2026' },
    farewellTitle: { tr: 'Sebep (isteğe bağlı)', en: 'Reason (optional)' },
    farewellsSection: { tr: 'Vedalar', en: 'Farewells' },
  };

  // Ad/soyad gerektiren placeholder key'leri -> mocknames.js'teki tür/rol
  // anahtarına eşleme. Bu key'ler PLACEHOLDER_TEXT yerine PLMockNames'ten
  // dile göre çekilir.
  const NAME_KEY_MAP = {
    petNameCat: 'cat', petNameDog: 'dog', petNameBird: 'bird',
    petNameFish: 'fish', petNameHamster: 'hamster', petNameRabbit: 'rabbit',
    petNameReptile: 'reptile', petNamePoultry: 'poultry', petNameHorse: 'horse',
    petNameCow: 'cow', petNameGoatSheep: 'goat_sheep',
    vetName: 'vet', ownerName: 'owner',
    petName: 'cat', petName_cat: 'cat', petName_dog: 'dog', petName_bird: 'bird',
  };

  function phText(key) {
    const lang = global.PLI18n.currentLang();
    if (NAME_KEY_MAP[key] && global.PLMockNames) {
      return global.PLMockNames.mockName(NAME_KEY_MAP[key], lang);
    }
    const entry = PLACEHOLDER_TEXT[key];
    if (!entry) return '';
    return entry[lang] || entry.tr || entry.en || '';
  }

  const TAB_LABELS_KEY = { index: 'home', vet: 'myVet', health: 'health', reminders: 'reminders', settings: 'settings' };

  function fillMockFrame(container) {
    const { t } = global.PLI18n;
    // tabkey elemanları: tabbar item label + topbar title
    container.querySelectorAll('[data-tabkey]').forEach((elm) => {
      const key = elm.getAttribute('data-tabkey');
      const stringsKey = TAB_LABELS_KEY[key] || key;
      elm.textContent = t(`tabs.${stringsKey}`) || t(`guide.${key}.title`) || '';
    });
    container.querySelectorAll('[data-ph]').forEach((elm) => {
      const key = elm.getAttribute('data-ph');
      elm.textContent = phText(key);
    });
  }

  function buildMockFrameHTML(frameId) {
    const builder = global.PLMockFrames[frameId];
    if (!builder) return '<div class="mock-body"></div>';
    return builder();
  }

  // -----------------------------------------------------------------------
  // Sticky flow: bir dizi step (section) verisinden, tek bir sticky mock +
  // yanında akan adım listesi üretir.
  // -----------------------------------------------------------------------
  function renderStickyFlow(screen, steps, wrapperEl, accent) {
    // steps: [{ frameId, titleKey, bodyKey }]
    const { t } = global.PLI18n;

    const mockCol = el(`
      <div class="sticky-flow__mock-col">
        <div class="mock-glow" id="mockGlow-${screen}"></div>
        <div class="mock-screen" id="mockScreen-${screen}">
          <div class="mock-screen__inner" id="mockInner-${screen}"></div>
        </div>
        <div class="mock-carousel" id="mockCarousel-${screen}">
          <div class="mock-carousel__track">
            ${steps.map((step, idx) => `
              <div class="mock-carousel__slide" data-slide-idx="${idx}">
                <div class="mock-glow"></div>
                <div class="mock-screen">
                  <div class="mock-screen__inner"></div>
                </div>
              </div>
            `).join('')}
          </div>
          <div class="mock-carousel__dots">
            ${steps.map((_, idx) => `<span class="mock-carousel__dot" data-dot-idx="${idx}"></span>`).join('')}
          </div>
        </div>
      </div>
    `);

    const stepsCol = el(`<div class="sticky-flow__steps" style="position:relative;"></div>`);

    steps.forEach((step, idx) => {
      const stepEl = el(`
        <div class="flow-step reveal" data-step-idx="${idx}" data-frame="${step.frameId}">
          <button type="button" class="flow-step__head" aria-expanded="${idx === 0 ? 'true' : 'false'}">
            <span class="flow-step__num" data-accent="${accent}">${idx + 1}</span>
            <span class="flow-step__title">${t(step.titleKey)}</span>
            <span class="flow-step__chevron">${I('ChevronDown', { size: 18 })}</span>
          </button>
          <div class="flow-step__panel">
            <div class="flow-step__panel-inner">
              <div class="flow-step__body">${t(step.bodyKey)}</div>
            </div>
          </div>
        </div>
      `);
      stepsCol.appendChild(stepEl);
    });

    wrapperEl.appendChild(mockCol);
    wrapperEl.appendChild(stepsCol);

    // ---- Masaüstü: sabit sticky mock, tıklamayla crossfade ----
    const inner = mockCol.querySelector(`#mockInner-${screen}`);
    inner.innerHTML = buildMockFrameHTML(steps[0].frameId);
    fillMockFrame(inner);
    inner.dataset.currentFrame = steps[0].frameId;

    // ---- Mobil: her adımın kendi görseli, yatay kayan şerit + nokta göstergesi ----
    const carouselEl = mockCol.querySelector(`#mockCarousel-${screen}`);
    const track = carouselEl.querySelector('.mock-carousel__track');
    const slideEls = Array.from(carouselEl.querySelectorAll('.mock-carousel__slide'));
    const dotEls = Array.from(carouselEl.querySelectorAll('.mock-carousel__dot'));
    slideEls.forEach((slideEl, idx) => {
      const slideInner = slideEl.querySelector('.mock-screen__inner');
      slideInner.innerHTML = buildMockFrameHTML(steps[idx].frameId);
      fillMockFrame(slideInner);
    });

    // Tek adımlı akışlarda (nadir) carousel'i tek slaytla sade bırak; nokta
    // göstergesini de tek nokta yerine tamamen gizle.
    if (steps.length <= 1) {
      carouselEl.querySelector('.mock-carousel__dots').style.display = 'none';
    }

    // Accordion davranışı: her adım tamamen bağımsız bir aç/kapa (toggle)
    // mekanizmasına sahiptir. Bir adıma tıklanınca sadece o adımın kendi
    // durumu değişir — diğer adımlar etkilenmez, aynı anda birden fazla
    // adım açık kalabilir. Zaten açık bir adıma tekrar tıklanınca kapanır.
    // Mock ekran, en son açılan (veya kapatılan) adıma göre güncellenir:
    // bir adım açılınca o adıma crossfade eder; kapatılınca hâlâ açık
    // kalan en yakın (üstteki) adıma geri döner; hiçbiri açık değilse
    // mock ekran son gösterileni korur.
    const stepEls = Array.from(stepsCol.querySelectorAll('.flow-step'));
    let syncingFromCarousel = false; // carousel scroll -> accordion güncellerken tekrar scroll tetiklememek için

    function setActiveDot(idx) {
      dotEls.forEach((d, i) => d.classList.toggle('is-active', i === idx));
    }

    function scrollCarouselTo(idx) {
      const target = slideEls[idx];
      if (!target) return;
      track.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
    }

    function setStepState(targetEl, isOpen, animate, fromCarousel) {
      targetEl.classList.toggle('is-active', isOpen);
      const head = targetEl.querySelector('.flow-step__head');
      head.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (isOpen) {
        const idx = parseInt(targetEl.getAttribute('data-step-idx'), 10);
        const frameId = targetEl.getAttribute('data-frame');
        if (animate) {
          crossfadeToFrame(inner, frameId);
        } else {
          inner.dataset.currentFrame = frameId;
        }
        setActiveDot(idx);
        if (!fromCarousel) scrollCarouselTo(idx);
      }
    }

    function fallbackToOpenStep() {
      // Kapatılan adımdan sonra hâlâ açık kalan bir adım varsa mock ekranı
      // ona göre günceller (en üstteki açık adım tercih edilir).
      const stillOpen = stepEls.find((se) => se.classList.contains('is-active'));
      if (stillOpen) {
        crossfadeToFrame(inner, stillOpen.getAttribute('data-frame'));
      }
    }

    stepEls.forEach((se) => {
      const head = se.querySelector('.flow-step__head');
      head.addEventListener('click', () => {
        const isCurrentlyOpen = se.classList.contains('is-active');
        setStepState(se, !isCurrentlyOpen, true, false);
        if (isCurrentlyOpen) fallbackToOpenStep();
      });
    });

    // İlk adım varsayılan olarak açık, diğerleri kapalı
    stepEls.forEach((se, idx) => setStepState(se, idx === 0, false, true));
    // İlk yükte carousel'i başa konumla (smooth animasyon olmadan)
    requestAnimationFrame(() => { track.scrollLeft = 0; });

    // Carousel kaydırıldıkça: en görünür slaytı bul, ilgili adımı aç,
    // diğerlerini kapat. IntersectionObserver track'in kendi scroll
    // konteynerine göre çalışır.
    if (steps.length > 1) {
      const io = new IntersectionObserver((entries) => {
        if (syncingFromCarousel) return;
        let best = null;
        entries.forEach((entry) => {
          if (entry.isIntersecting && (!best || entry.intersectionRatio > best.intersectionRatio)) {
            best = entry;
          }
        });
        if (!best) return;
        const idx = parseInt(best.target.getAttribute('data-slide-idx'), 10);
        syncingFromCarousel = true;
        stepEls.forEach((se, i) => setStepState(se, i === idx, true, true));
        syncingFromCarousel = false;
      }, { root: track, threshold: [0.5, 0.6, 0.7, 0.8, 0.9, 1] });
      slideEls.forEach((s) => io.observe(s));
    }

    return { mockCol, stepsCol, inner };
  }

  function crossfadeToFrame(inner, frameId) {
    if (inner.dataset.currentFrame === frameId) return;
    inner.dataset.currentFrame = frameId;
    // Fade-out
    inner.style.transition = 'opacity 180ms ease-out';
    inner.style.opacity = '0';
    // DOM güncelleme: transition bitince, bir sonraki frame'de yap
    // (setTimeout yerine transitionend + rAF — jank/titreme önler)
    function onFadeOut() {
      inner.removeEventListener('transitionend', onFadeOut);
      requestAnimationFrame(() => {
        inner.innerHTML = buildMockFrameHTML(frameId);
        fillMockFrame(inner);
        // Fade-in: layout hesaplandıktan sonra bir rAF daha bekle
        requestAnimationFrame(() => {
          inner.style.transition = 'opacity 200ms ease-in';
          inner.style.opacity = '1';
        });
      });
    }
    inner.addEventListener('transitionend', onFadeOut, { once: true });
  }

  // -----------------------------------------------------------------------
  // Guide detail section (bir ana ekran için tüm bölüm)
  // -----------------------------------------------------------------------
  function renderScreenSection(screen) {
    const { t, meta, ui } = global.PLI18n;
    const m = meta();
    const sm = m.screenMeta[screen];
    const isTwoLevel = !!m.guideTopics[screen];

    const stripHTML = m.screenOrder.map((s) => {
      const sMeta = m.screenMeta[s];
      const isCurrent = s === screen;
      return `
        <button type="button" class="guide-strip__item ${isCurrent ? 'is-current' : ''}" data-goto="${s}" data-accent="${sMeta.accent}">
          <span class="icon-badge" data-accent="${sMeta.accent}">${I(sMeta.icon, { size: 15 })}</span>
          ${t(`guide.${s}.title`)}
        </button>
      `;
    }).join('');

    const section = el(`
      <section class="section guide-section" id="guide-${screen}" data-accent="${sm.accent}">
        <div class="container">
          <button type="button" class="guide-back" data-back-to-catalog>
            ${I('ChevronLeft', { size: 16 })}<span data-ui="backToGuides"></span>
          </button>
          <div class="guide-strip scrollbar-none">${stripHTML}</div>
          <div class="section-head reveal">
            <div class="icon-badge icon-badge-lg" data-accent="${sm.accent}">${I(sm.icon, { size: 30 })}</div>
            <h2 class="title-lg">${t(`guide.${screen}.title`)}</h2>
            ${t(`guide.${screen}.intro`) ? `<p class="body-lg guide-section__intro">${t(`guide.${screen}.intro`)}</p>` : ''}
          </div>
        </div>
        <div class="container" id="guideBody-${screen}"></div>
      </section>
    `);

    const body = section.querySelector(`#guideBody-${screen}`);

    if (!isTwoLevel) {
      const secIds = m.guideSections[screen] || [];
      const steps = secIds.map((sid) => ({
        frameId: `${screen}.${sid}`,
        titleKey: `guide.${screen}.sections.${sid}.title`,
        bodyKey: `guide.${screen}.sections.${sid}.body`,
      }));
      const flowWrap = el(`<div class="sticky-flow reveal"></div>`);
      body.appendChild(flowWrap);
      renderStickyFlow(screen, steps, flowWrap, sm.accent);
    } else {
      // İki seviyeli: topic seçici kartlar + her topic için ayrı sticky-flow bloğu.
      // Varsayılan: sadece topic listesi görünür. Bir topic'e tıklanınca sadece
      // o topic'in bloğu görünür olur, liste ve diğer topic'ler gizlenir (Madde 6.1).
      const topicIds = m.guideTopics[screen];
      const topicListWrap = el(`<div class="topic-list-wrap reveal"></div>`);
      const topicNav = el(`<div class="card glass card-tight" style="padding:8px;"></div>`);
      topicIds.forEach((tid, i) => {
        const item = el(`
          <div class="topic-pill" data-topic-target="${screen}-${tid}">
            <div class="icon-badge" data-accent="${sm.accent}">${I(m.sectionIcons[`${screen}.${tid}`] || sm.icon, { size: 22 })}</div>
            <div style="flex:1;min-width:0;">
              <div style="font-weight:700;font-size:15px;">${t(`guide.${screen}.topics.${tid}.navTitle`)}</div>
              <div style="font-size:12.5px;color:var(--ink-faint);margin-top:2px;">${t(`guide.${screen}.topics.${tid}.navSubtitle`)}</div>
            </div>
            ${I('ChevronRight', { size: 16 })}
          </div>
          ${i < topicIds.length - 1 ? '<div style="height:1px;background:var(--hairline);margin:2px 12px;"></div>' : ''}
        `);
        topicNav.appendChild(item);
      });
      topicListWrap.appendChild(topicNav);
      body.appendChild(topicListWrap);

      const topicBlocks = {};
      topicIds.forEach((tid) => {
        const topicSectionIds = Object.keys(global.PLI18n.state.data.strings[global.PLI18n.currentLang()].guide[screen].topics[tid].sections || {});
        const wrapBlock = el(`
          <div class="topic-flow-block" id="topic-${screen}-${tid}" data-topic-id="${screen}-${tid}">
            <button type="button" class="guide-back guide-back--topic" data-back-to-topics="${screen}">
              ${I('ChevronLeft', { size: 16 })}<span data-ui="backToTopics"></span>
            </button>
            <div class="eyebrow" data-accent="${sm.accent}" style="margin-bottom:10px;"><span class="dot"></span>${t(`guide.${screen}.topics.${tid}.navTitle`)}</div>
            <div class="sticky-flow"></div>
          </div>
        `);
        body.appendChild(wrapBlock);
        topicBlocks[tid] = wrapBlock;
        const steps = topicSectionIds.map((sid) => ({
          frameId: `${screen}.${tid}.${sid}`,
          titleKey: `guide.${screen}.topics.${tid}.sections.${sid}.title`,
          bodyKey: `guide.${screen}.topics.${tid}.sections.${sid}.body`,
        }));
        renderStickyFlow(`${screen}-${tid}`, steps, wrapBlock.querySelector('.sticky-flow'), sm.accent);
      });

      // Başlangıçta: sadece topic listesi görünür, tüm topic blokları gizli.
      Object.values(topicBlocks).forEach((blk) => blk.classList.remove('is-active'));
      topicListWrap.classList.add('is-active');
    }

    return section;
  }

  function renderAllGuideDetails() {
    const { meta } = global.PLI18n;
    const m = meta();
    const main = document.getElementById('guideDetails');
    main.innerHTML = '';
    m.screenOrder.forEach((screen) => {
      main.appendChild(renderScreenSection(screen));
    });
    applyUIStrings(main);
  }

  // -----------------------------------------------------------------------
  // UI chrome strings (data-ui attr taşıyan elemanlar)
  // -----------------------------------------------------------------------
  function applyUIStrings(root) {
    const { ui } = global.PLI18n;
    const scope = root || document;
    scope.querySelectorAll('[data-ui]').forEach((elm) => {
      const key = elm.getAttribute('data-ui');
      const val = ui(key);
      if (val) elm.textContent = val;
    });
    scope.querySelectorAll('[data-ui-html]').forEach((elm) => {
      const key = elm.getAttribute('data-ui-html');
      const val = ui(key);
      if (val) elm.innerHTML = val;
    });
  }

  // "PetLucid" kelimesini shimmer span'ıyla sarar — 21 dilin hepsinde
  // başlık "PetLucid" ile başladığı için i18n string'lerine dokunmadan,
  // render sonrası tek bir yerde uygulanıyor. Marka adı geçmiyorsa
  // (ör. ileride eklenecek bir dilde) metin olduğu gibi kalır, hata vermez.
  function wrapBrandShimmer(html) {
    return html.replace(/PetLucid/, '<span class="hero__title-shimmer">PetLucid</span>');
  }

  function renderStaticUIText() {
    const { ui } = global.PLI18n;
    document.getElementById('heroTitle').innerHTML = wrapBrandShimmer(ui('heroTitle'));
    document.getElementById('heroSubtitle').textContent = ui('heroSubtitle');
    document.getElementById('guidesCardTitle').textContent = ui('guidesCardTitle');
    document.getElementById('catalogEyebrow').textContent = ui('catalogEyebrow');
    document.getElementById('catalogTitle').textContent = ui('catalogTitle');
    document.getElementById('catalogSubtitle').textContent = ui('catalogSubtitle');
    document.getElementById('guideCarouselPrev').setAttribute('aria-label', ui('ariaPrev'));
    document.getElementById('guideCarouselNext').setAttribute('aria-label', ui('ariaNext'));
    document.getElementById('showcaseEyebrow').textContent = ui('showcaseEyebrow');
    document.getElementById('showcaseTitle').textContent = ui('showcaseTitle');
    document.getElementById('showcaseSubtitle').textContent = ui('showcaseSubtitle');
    document.getElementById('showcaseCarouselPrev').setAttribute('aria-label', ui('ariaPrev'));
    document.getElementById('showcaseCarouselNext').setAttribute('aria-label', ui('ariaNext'));
    document.getElementById('footerTag').textContent = ui('footerTag');
    document.getElementById('footerCopyright').textContent = ui('footerCopyright');
    document.querySelectorAll('.btn-store .store-text small').forEach(s => s.textContent = ui('storeSoon'));
  }

  function renderAll() {
    renderStaticUIText();
    renderCarousel();
    renderShowcaseCarousel();
    renderPillNav('heroPillNav');
    renderPillNav('footerPillNav');
    renderAllGuideDetails();
  }

  global.PLRender = {
    renderAll,
    renderCarousel,
    renderShowcaseCarousel,
    renderAllGuideDetails,
    crossfadeToFrame,
    applyUIStrings,
    fillMockFrame,
    buildMockFrameHTML,
  };
})(window);
                                                                   
