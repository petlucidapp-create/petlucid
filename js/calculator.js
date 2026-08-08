/**
 * PetLucid — Yem & Su Hesaplayıcı: UI katmanı
 * PLCalcData (saf hesaplama, js/calculator-data.js) ve PLCalcI18n (21 dilli
 * sözlük, js/calculator-i18n.js) verilerini DOM'a bağlar. guides.json /
 * render.js akışına dahil değildir (kasıtlı — bkz. calculator-i18n.js
 * başlığı); kendi render + event fonksiyonlarını taşır, tek entegrasyon
 * noktası js/app.js içindeki initCalculator() çağrısıdır.
 *
 * Yapı, mevcut accordion-card / guide-card kalıplarını birebir taklit eder:
 *   - Üst kart: .glass-card.accordion-card (index.html'de statik, diğer
 *     accordion kartlarıyla aynı [data-accordion] mekanizmasını kullanır).
 *   - Hayvan kartları: .calc-animal-card, .guide-card'ın basınç/parıltı
 *     davranışının aynısı, ayrı bir class adı altında (guide-card'a stil
 *     sızdırmamak için).
 *   - Sonuç: .calc-overlay + .calc-alert — kod tabanında daha önce hiç
 *     olmayan bir modal/dialog paterni, glass-card gölge tarifiyle inşa
 *     edildi (bkz. calculator.css üst yorum bloğu).
 */
(function (global) {
  const I = global.PLIcon;

  function el(html) {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  // Tür -> ikon adı (icons.js'teki yeni Animal* path'leri) + accent.
  // Tüm 12 kart aynı 'teal' accent'i paylaşır (hesaplayıcının kendi kimliği);
  // guide kartlarındaki çoklu-accent şeması burada kasıtlı kullanılmadı,
  // çünkü 12 farklı renk bir "araç" hissi yerine dağınık bir liste hissi
  // verirdi. Tek accent + tür ikonu ayrımı yeterli görsel çeşitlilik sağlıyor.
  const SPECIES_ICON = {
    cat: 'AnimalCat', dog: 'AnimalDog', bird: 'AnimalBird', fish: 'AnimalFish',
    hamster: 'AnimalHamster', rabbit: 'AnimalRabbit', reptile: 'AnimalReptile',
    poultry: 'AnimalPoultry', horse: 'AnimalHorse', cow: 'AnimalCow',
    sheep: 'AnimalSheep', goat: 'AnimalGoat',
  };

  const state = {
    activeSpecies: null,
  };

  // -----------------------------------------------------------------------
  // Adım 1: Hayvan seçici grid
  // -----------------------------------------------------------------------
  function renderAnimalGrid() {
    const { SPECIES_ORDER } = global.PLCalcData;
    const { ct } = global.PLCalcI18n;
    const grid = document.getElementById('calcAnimalGrid');
    if (!grid) return;
    grid.innerHTML = '';
    SPECIES_ORDER.forEach((species) => {
      const card = el(`
        <button type="button" class="calc-animal-card" data-species="${species}">
          <div class="calc-animal-card__glow" aria-hidden="true"></div>
          <span class="calc-animal-card__icon">${I(SPECIES_ICON[species], { size: 26 })}</span>
          <span class="calc-animal-card__label">${ct(`animals.${species}`)}</span>
        </button>
      `);
      grid.appendChild(card);
    });
  }

  // -----------------------------------------------------------------------
  // Adım 2: Form — türe göre alanlar (SPECIES_FIELDS: weightKg + foodType?
  // + tankLiters?). Kilo tüm türlerde ortak; foodType sadece kedi/köpek;
  // tankLiters sadece balık.
  // -----------------------------------------------------------------------
  function renderForm(species) {
    const { fieldsFor } = global.PLCalcData;
    const { ct } = global.PLCalcI18n;
    const fields = fieldsFor(species);
    const form = document.getElementById('calcForm');
    const head = document.getElementById('calcFormHead');

    head.innerHTML = `
      <span class="calc-form-head__icon">${I(SPECIES_ICON[species], { size: 24 })}</span>
      <span class="calc-form-head__title">${ct(`animals.${species}`)}</span>
    `;

    let html = `
      <div class="calc-field">
        <label class="calc-field__label" for="calcWeightInput">${ct('weightLabel')}</label>
        <input type="number" inputmode="decimal" step="0.1" min="0" class="calc-field__input"
               id="calcWeightInput" placeholder="${ct('weightPlaceholder')}" />
        <div class="calc-field__error" id="calcWeightError">${ct('validationWeight')}</div>
      </div>
    `;

    if (fields.includes('foodType')) {
      html += `
        <div class="calc-field">
          <label class="calc-field__label">${ct('foodTypeLabel')}</label>
          <div class="calc-segmented" id="calcFoodTypeToggle" role="radiogroup">
            <button type="button" class="calc-segmented__option is-active" data-food-type="dry" role="radio" aria-checked="true">${ct('foodTypeDry')}</button>
            <button type="button" class="calc-segmented__option" data-food-type="wet" role="radio" aria-checked="false">${ct('foodTypeWet')}</button>
          </div>
        </div>
      `;
    }

    if (fields.includes('tankLiters')) {
      html += `
        <div class="calc-field">
          <label class="calc-field__label" for="calcTankInput">${ct('tankLabel')}</label>
          <input type="number" inputmode="decimal" step="1" min="0" class="calc-field__input"
                 id="calcTankInput" placeholder="${ct('tankPlaceholder')}" />
          <div class="calc-field__error" id="calcTankError">${ct('validationTank')}</div>
        </div>
      `;
    }

    html += `
      <button type="button" class="btn btn-primary calc-submit-btn" id="calcSubmitBtn">
        ${I('Salad', { size: 17 })} <span>${ct('calculateBtn')}</span>
      </button>
    `;

    form.innerHTML = html;

    const foodToggle = document.getElementById('calcFoodTypeToggle');
    if (foodToggle) {
      foodToggle.querySelectorAll('.calc-segmented__option').forEach((btn) => {
        btn.addEventListener('click', () => {
          foodToggle.querySelectorAll('.calc-segmented__option').forEach((b) => {
            b.classList.remove('is-active');
            b.setAttribute('aria-checked', 'false');
          });
          btn.classList.add('is-active');
          btn.setAttribute('aria-checked', 'true');
        });
      });
    }

    document.getElementById('calcSubmitBtn').addEventListener('click', () => handleSubmit(species));
  }

  function goToStep(step) {
    document.getElementById('calcStepAnimals').classList.toggle('is-active', step === 'animals');
    document.getElementById('calcStepForm').classList.toggle('is-active', step === 'form');
    document.getElementById('calcStepBack').classList.toggle('is-visible', step === 'form');
  }

  function selectAnimal(species) {
    state.activeSpecies = species;
    renderForm(species);
    goToStep('form');
  }

  // -----------------------------------------------------------------------
  // Doğrulama + hesaplama + sonuç modalı
  // -----------------------------------------------------------------------
  function setFieldError(inputId, errorId, show) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input) input.classList.toggle('has-error', show);
    if (error) error.classList.toggle('is-visible', show);
  }

  function readPositiveNumber(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return null;
    const val = parseFloat(input.value.replace(',', '.'));
    return Number.isFinite(val) && val > 0 ? val : null;
  }

  function handleSubmit(species) {
    const { fieldsFor, compute } = global.PLCalcData;
    const fields = fieldsFor(species);

    const weightKg = readPositiveNumber('calcWeightInput');
    setFieldError('calcWeightInput', 'calcWeightError', weightKg === null);

    let tankLiters = null;
    let tankValid = true;
    if (fields.includes('tankLiters')) {
      tankLiters = readPositiveNumber('calcTankInput');
      tankValid = tankLiters !== null;
      setFieldError('calcTankInput', 'calcTankError', !tankValid);
    }

    if (weightKg === null || !tankValid) return;

    const inputs = { weightKg };
    if (fields.includes('tankLiters')) inputs.tankLiters = tankLiters;
    if (fields.includes('foodType')) {
      const activeBtn = document.querySelector('#calcFoodTypeToggle .calc-segmented__option.is-active');
      inputs.foodType = activeBtn ? activeBtn.getAttribute('data-food-type') : 'dry';
    }

    const result = compute(species, inputs);
    if (!result) return;
    showResult(species, result);
  }

  // Büyük hacimleri litreye çevirir (at/inek/koyun/keçide ml çok büyük
  // görünüyor — bu tasarlanmış davranış, bkz. plan). 1000ml üzeri -> L.
  function formatWaterValue(value, unit) {
    if (unit === 'l') return { value: round1(value), unit: 'L' };
    if (unit === 'ml' && value >= 1000) return { value: round1(value / 1000), unit: 'L' };
    return { value, unit: 'ml' };
  }
  function round1(n) { return Math.round(n * 10) / 10; }

  function noteIcon(noteKey) {
    // Tahmin/veteriner uyarısı -> Info; diğer tüm dipnotlar (kuru madde,
    // aktivite, tür-özel notlar) -> Leaf. Basit iki-ikonlu ayrım yeterli;
    // 8 farklı ikon eşleştirmek sonuç ekranını gereksiz karmaşıklaştırır.
    return noteKey === 'estimateVet' ? 'Info' : 'Leaf';
  }

  function showResult(species, result) {
    const { ct } = global.PLCalcI18n;
    const overlay = document.getElementById('calcOverlay');

    const foodEl = document.getElementById('calcResultFoodValue');
    const foodRangeEl = document.getElementById('calcResultFoodRange');
    foodEl.textContent = `${result.foodValue} ${result.foodUnit}`;
    foodRangeEl.textContent = `${ct('resultRangeNote')}: ${result.foodRange}`;

    const waterCard = document.getElementById('calcResultWaterCard');
    const waterEl = document.getElementById('calcResultWaterValue');
    const waterRangeEl = document.getElementById('calcResultWaterRange');
    const waterTankNote = document.getElementById('calcResultWaterTankNote');

    if (result.waterValue === null) {
      // Balıkta akvaryum hacmi girilmediyse su kartı gizlenir.
      waterCard.style.display = 'none';
    } else {
      waterCard.style.display = '';
      const fw = formatWaterValue(result.waterValue, result.waterUnit);
      waterEl.textContent = `${fw.value} ${fw.unit}`;
      waterRangeEl.textContent = `${ct('resultRangeNote')}: ${result.waterRange}`;
      waterTankNote.style.display = result.waterIsTankVolume ? '' : 'none';
      if (result.waterIsTankVolume) waterTankNote.textContent = ct('resultWaterIsTank');
    }

    document.getElementById('calcAlertAnimal').textContent = ct(`animals.${species}`);

    const notesWrap = document.getElementById('calcAlertNotes');
    notesWrap.innerHTML = (result.noteKeys || []).map((nk) => {
      const stringKey = 'note' + nk.charAt(0).toUpperCase() + nk.slice(1);
      const text = ct(stringKey);
      if (!text) return '';
      const isWarning = nk === 'estimateVet';
      return `
        <div class="calc-alert__note${isWarning ? ' calc-alert__note--warning' : ''}">
          ${I(noteIcon(nk), { size: 15 })}
          <span>${text}</span>
        </div>
      `;
    }).join('');

    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeResult() {
    document.getElementById('calcOverlay').classList.remove('is-open');
    document.body.style.overflow = '';
  }

  // -----------------------------------------------------------------------
  // Statik UI metinleri (accordion başlığı, adım başlıkları, alert butonları)
  // -----------------------------------------------------------------------
  function applyStaticText() {
    const { ct } = global.PLCalcI18n;
    const map = {
      calcCardEyebrow: 'cardEyebrow',
      calcCardTitle: 'cardTitle',
      calcCardSubtitle: 'cardSubtitle',
      calcPickAnimalTitle: 'pickAnimalTitle',
      calcPickAnimalSubtitle: 'pickAnimalSubtitle',
      calcStepBackLabel: 'backToAnimals',
      calcAlertResultTitle: 'resultTitle',
      calcResultFoodLabel: 'resultFood',
      calcResultWaterLabel: 'resultWater',
      calcRecalcBtn: 'recalculateBtn',
      calcCloseBtn: 'closeBtn',
    };
    Object.keys(map).forEach((id) => {
      const elm = document.getElementById(id);
      if (elm) elm.textContent = ct(map[id]);
    });
  }

  // -----------------------------------------------------------------------
  // Tam render — dil değişiminde (PLI18n.onLangChange) yeniden çağrılır.
  // Açık bir sonuç varsa (species seçiliyse) form adımı korunur; guides
  // akışındaki restoreGuideView ile aynı mantık: dil değişimi kullanıcının
  // bulunduğu adımı sıfırlamamalı.
  // -----------------------------------------------------------------------
  function renderCalculator() {
    applyStaticText();
    renderAnimalGrid();
    if (state.activeSpecies) {
      renderForm(state.activeSpecies);
    }
  }

  function bindStaticEvents() {
    document.getElementById('calcAnimalGrid').addEventListener('click', (e) => {
      const card = e.target.closest('.calc-animal-card');
      if (card) selectAnimal(card.getAttribute('data-species'));
    });
    document.getElementById('calcStepBack').addEventListener('click', () => goToStep('animals'));
    document.getElementById('calcAlertClose').addEventListener('click', closeResult);
    document.getElementById('calcCloseBtn').addEventListener('click', closeResult);
    document.getElementById('calcRecalcBtn').addEventListener('click', () => {
      closeResult();
      goToStep('animals');
      state.activeSpecies = null;
    });
    document.getElementById('calcOverlay').addEventListener('click', (e) => {
      if (e.target.id === 'calcOverlay') closeResult();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.getElementById('calcOverlay').classList.contains('is-open')) {
        closeResult();
      }
    });

    // Basılı-tutma parıltısı — guide-card'daki initCardPressGlow ile aynı
    // pointer-event deseni, .calc-animal-card için ayrı bir delegation.
    const press = (target) => {
      const card = target.closest('.calc-animal-card');
      if (card) card.classList.add('is-pressed');
    };
    const release = () => {
      document.querySelectorAll('.calc-animal-card.is-pressed').forEach((c) => c.classList.remove('is-pressed'));
    };
    document.addEventListener('pointerdown', (e) => press(e.target));
    document.addEventListener('pointerup', release);
    document.addEventListener('pointercancel', release);
    document.addEventListener('pointerleave', release, true);
  }

  function initCalculator() {
    if (!document.getElementById('calcAnimalGrid')) return; // section DOM'da yoksa sessizce çık
    bindStaticEvents();
    renderCalculator();
    global.PLI18n.onLangChange(renderCalculator);
  }

  global.PLCalculator = { init: initCalculator };
})(window);
