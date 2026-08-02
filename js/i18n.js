/**
 * PetLucid — i18n data layer
 * data/guides.json içindeki tüm dilleri yükler, aktif dili yönetir,
 * key bazlı çeviri erişimi sağlar (t('guide.index.title') gibi).
 */
(function (global) {
  const STORAGE_KEY = 'petlucid_lang';
  const DEFAULT_LANG = 'tr';

  const state = {
    data: null,           // tüm JSON (meta + strings)
    lang: DEFAULT_LANG,
    ready: false,
    listeners: [],
  };

  // UI chrome metinleri (guide JSON'unda olmayan, sitenin kendi arayüz metinleri)
  // Not: Bunlar placeholder — proje genişledikçe ayrı bir ui-strings.json'a taşınabilir.
  const UI_STRINGS = {
    tr: {
      heroEyebrow: 'Kılavuz',
      heroTitle: 'Evcil dostunuz için<br/>her şey tek yerde.',
      heroSubtitle: 'PetLucid\'i nasıl kullanacağınızı adım adım keşfedin — hatırlatıcılardan sağlık kayıtlarına, veteriner takibinden yedeklemeye kadar.',
      scrollCue: 'Kaydır',
      storeSoon: 'Yakında',
      catalogEyebrow: 'Kılavuz Kataloğu',
      catalogTitle: 'Nereden başlamak istersiniz?',
      catalogSubtitle: 'Her kart, uygulama içindeki ilgili ekranın tam kılavuzunu açar.',
      readGuide: 'Kılavuzu aç',
      backToTop: 'Yukarı çık',
      footerTag: 'Evcil dostunuz için, cihazınızda.',
      footerCopyright: '© 2026 PetLucid. Tüm hakları saklıdır.',
      dataNote: 'Ekran içerikleri temsili verilerle hazırlanmıştır.',
      topicsIntro: 'Devamını okumak için bir konu seçin',
      stepLabel: 'Adım',
    },
    en: {
      heroEyebrow: 'Guide',
      heroTitle: 'Everything for your pet,<br/>in one place.',
      heroSubtitle: 'Discover how to use PetLucid step by step — from reminders to health records, vet tracking to backups.',
      scrollCue: 'Scroll',
      storeSoon: 'Coming soon',
      catalogEyebrow: 'Guide Catalog',
      catalogTitle: 'Where would you like to start?',
      catalogSubtitle: 'Each card opens the full guide for that screen in the app.',
      readGuide: 'Open guide',
      backToTop: 'Back to top',
      footerTag: 'For your pet, on your device.',
      footerCopyright: '© 2026 PetLucid. All rights reserved.',
      dataNote: 'Screen content shown here uses placeholder data.',
      topicsIntro: 'Choose a topic to read more',
      stepLabel: 'Step',
    },
  };

  function fallbackUI(lang) {
    return UI_STRINGS[lang] || UI_STRINGS.en;
  }

  async function loadData() {
    const res = await fetch('data/guides.json', { cache: 'force-cache' });
    if (!res.ok) throw new Error('guides.json yüklenemedi: ' + res.status);
    state.data = await res.json();
    state.ready = true;
  }

  function detectInitialLang() {
    const saved = global.localStorage ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved && state.data.meta.langs.includes(saved)) return saved;
    const nav = (navigator.language || 'tr').slice(0, 2).toLowerCase();
    if (state.data.meta.langs.includes(nav)) return nav;
    return DEFAULT_LANG;
  }

  function setLang(lang) {
    if (!state.data.meta.langs.includes(lang)) lang = DEFAULT_LANG;
    state.lang = lang;
    if (global.localStorage) localStorage.setItem(STORAGE_KEY, lang);
    const isRTL = state.data.meta.rtlLangs.includes(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    state.listeners.forEach((fn) => fn(lang));
  }

  function onLangChange(fn) {
    state.listeners.push(fn);
  }

  // Deep-get by dot path, e.g. "guide.index.title"
  function get(path, obj) {
    return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
  }

  function t(path) {
    const langBlock = state.data.strings[state.lang];
    const val = get(path, langBlock);
    if (val !== undefined) return val;
    // fallback to english
    const enBlock = state.data.strings.en;
    const fallback = get(path, enBlock);
    return fallback !== undefined ? fallback : '';
  }

  function ui(key) {
    const block = fallbackUI(state.lang);
    return block[key] !== undefined ? block[key] : fallbackUI('en')[key] || '';
  }

  function meta() {
    return state.data.meta;
  }

  function currentLang() {
    return state.lang;
  }

  function langName(code) {
    return state.data.meta.langNames[code] || code;
  }

  global.PLI18n = {
    loadData,
    detectInitialLang,
    setLang,
    onLangChange,
    t,
    ui,
    meta,
    currentLang,
    langName,
    get state() { return state; },
  };
})(window);
