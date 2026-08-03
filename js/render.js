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
            <div class="hover-scale-target" style="display:flex;flex-direction:column;height:100%;">
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
  };

  function phText(key) {
    const lang = global.PLI18n.currentLang();
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
        <div class="mock-screen" id="mockScreen-${screen}">
          <div class="mock-screen__inner" id="mockInner-${screen}"></div>
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

    // İlk frame'i render et
    const inner = mockCol.querySelector(`#mockInner-${screen}`);
    inner.innerHTML = buildMockFrameHTML(steps[0].frameId);
    fillMockFrame(inner);
    inner.dataset.currentFrame = steps[0].frameId;

    // Accordion davranışı: bir adıma tıklanınca sadece o adım açılır,
    // diğerleri kapanır; mock ekran tıklanan adıma crossfade eder.
    const stepEls = Array.from(stepsCol.querySelectorAll('.flow-step'));
    function openStep(targetEl, animate) {
      stepEls.forEach((se) => {
        const isTarget = se === targetEl;
        se.classList.toggle('is-active', isTarget);
        const head = se.querySelector('.flow-step__head');
        head.setAttribute('aria-expanded', isTarget ? 'true' : 'false');
      });
      const frameId = targetEl.getAttribute('data-frame');
      if (animate) {
        crossfadeToFrame(inner, frameId);
      } else {
        inner.dataset.currentFrame = frameId;
      }
    }

    stepEls.forEach((se) => {
      const head = se.querySelector('.flow-step__head');
      head.addEventListener('click', () => {
        if (se.classList.contains('is-active')) return; // zaten açık, kapatma yok — hep bir tanesi açık kalır
        openStep(se, true);
      });
    });

    // İlk adım varsayılan olarak açık
    openStep(stepEls[0], false);

    return { mockCol, stepsCol, inner };
  }

  function crossfadeToFrame(inner, frameId) {
    if (inner.dataset.currentFrame === frameId) return;
    inner.dataset.currentFrame = frameId;
    inner.style.transition = 'opacity 220ms ease-out';
    inner.style.opacity = '0';
    setTimeout(() => {
      inner.innerHTML = buildMockFrameHTML(frameId);
      fillMockFrame(inner);
      inner.style.opacity = '1';
    }, 200);
  }

  // -----------------------------------------------------------------------
  // Guide detail section (bir ana ekran için tüm bölüm)
  // -----------------------------------------------------------------------
  function renderScreenSection(screen) {
    const { t, meta, ui } = global.PLI18n;
    const m = meta();
    const sm = m.screenMeta[screen];
    const isTwoLevel = !!m.guideTopics[screen];

    const section = el(`
      <section class="section guide-section" id="guide-${screen}" data-accent="${sm.accent}">
        <div class="container">
          <button type="button" class="guide-back" data-back-to-catalog>
            ${I('ChevronLeft', { size: 16 })}<span data-ui="backToGuides"></span>
          </button>
          <div class="section-head reveal">
            <div class="icon-badge icon-badge-lg" data-accent="${sm.accent}">${I(sm.icon, { size: 30 })}</div>
            <h2 class="title-lg">${t(`guide.${screen}.title`)}</h2>
            ${t(`guide.${screen}.intro`) ? `<p class="body-lg">${t(`guide.${screen}.intro`)}</p>` : ''}
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

  function renderStaticUIText() {
    const { ui } = global.PLI18n;
    document.getElementById('heroTitle').innerHTML = ui('heroTitle');
    document.getElementById('heroSubtitle').textContent = ui('heroSubtitle');
    document.getElementById('scrollCueText').textContent = ui('scrollCue');
    document.getElementById('catalogEyebrow').textContent = ui('catalogEyebrow');
    document.getElementById('catalogTitle').textContent = ui('catalogTitle');
    document.getElementById('catalogSubtitle').textContent = ui('catalogSubtitle');
    document.getElementById('footerTag').textContent = ui('footerTag');
    document.getElementById('footerCopyright').textContent = ui('footerCopyright');
    document.querySelectorAll('.btn-store .store-text small').forEach(s => s.textContent = ui('storeSoon'));
  }

  function renderAll() {
    renderStaticUIText();
    renderCarousel();
    renderPillNav('heroPillNav');
    renderPillNav('footerPillNav');
    renderAllGuideDetails();
  }

  global.PLRender = {
    renderAll,
    renderCarousel,
    renderAllGuideDetails,
    crossfadeToFrame,
    applyUIStrings,
    fillMockFrame,
    buildMockFrameHTML,
  };
})(window);
