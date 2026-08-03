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
  // 21 dilin tamamı data/guides.json meta.langs listesiyle birebir eşleşir.
  const UI_STRINGS = {
    tr: {
      heroTitle: 'Evcil dostunuz için<br/>her şey tek yerde.',
      heroSubtitle: 'PetLucid\'i nasıl kullanacağınızı adım adım keşfedin — hatırlatıcılardan sağlık kayıtlarına, veteriner takibinden yedeklemeye kadar.',
      scrollCue: 'Kaydır',
      storeSoon: 'Yakında',
      catalogEyebrow: 'PetLucid Kullanım Rehberi',
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
      heroTitle: 'Everything for your pet,<br/>in one place.',
      heroSubtitle: 'Discover how to use PetLucid step by step — from reminders to health records, vet tracking to backups.',
      scrollCue: 'Scroll',
      storeSoon: 'Coming soon',
      catalogEyebrow: 'PetLucid User Guide',
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
    de: {
      heroTitle: 'Alles für Ihr Haustier,<br/>an einem Ort.',
      heroSubtitle: 'Entdecken Sie Schritt für Schritt, wie PetLucid funktioniert — von Erinnerungen über Gesundheitsakten bis zu Backups.',
      scrollCue: 'Scrollen',
      storeSoon: 'Demnächst',
      catalogEyebrow: 'PetLucid Benutzerhandbuch',
      catalogTitle: 'Wo möchten Sie beginnen?',
      catalogSubtitle: 'Jede Karte öffnet die vollständige Anleitung für den jeweiligen Bildschirm in der App.',
      readGuide: 'Anleitung öffnen',
      backToTop: 'Nach oben',
      footerTag: 'Für Ihr Haustier, auf Ihrem Gerät.',
      footerCopyright: '© 2026 PetLucid. Alle Rechte vorbehalten.',
      dataNote: 'Die hier gezeigten Bildschirminhalte sind Platzhalterdaten.',
      topicsIntro: 'Wählen Sie ein Thema, um mehr zu erfahren',
      stepLabel: 'Schritt',
    },
    fr: {
      heroTitle: 'Tout pour votre animal,<br/>au même endroit.',
      heroSubtitle: 'Découvrez comment utiliser PetLucid étape par étape — des rappels aux dossiers de santé, du suivi vétérinaire aux sauvegardes.',
      scrollCue: 'Faire défiler',
      storeSoon: 'Bientôt disponible',
      catalogEyebrow: 'Guide d\'utilisation PetLucid',
      catalogTitle: 'Par où souhaitez-vous commencer ?',
      catalogSubtitle: 'Chaque carte ouvre le guide complet de l\'écran correspondant dans l\'application.',
      readGuide: 'Ouvrir le guide',
      backToTop: 'Retour en haut',
      footerTag: 'Pour votre animal, sur votre appareil.',
      footerCopyright: '© 2026 PetLucid. Tous droits réservés.',
      dataNote: 'Le contenu des écrans affichés ici utilise des données fictives.',
      topicsIntro: 'Choisissez un sujet pour en savoir plus',
      stepLabel: 'Étape',
    },
    es: {
      heroTitle: 'Todo para tu mascota,<br/>en un solo lugar.',
      heroSubtitle: 'Descubre cómo usar PetLucid paso a paso — desde recordatorios hasta historiales médicos, seguimiento veterinario y copias de seguridad.',
      scrollCue: 'Desplázate',
      storeSoon: 'Próximamente',
      catalogEyebrow: 'Guía de uso de PetLucid',
      catalogTitle: '¿Por dónde te gustaría empezar?',
      catalogSubtitle: 'Cada tarjeta abre la guía completa de esa pantalla dentro de la app.',
      readGuide: 'Abrir guía',
      backToTop: 'Volver arriba',
      footerTag: 'Para tu mascota, en tu dispositivo.',
      footerCopyright: '© 2026 PetLucid. Todos los derechos reservados.',
      dataNote: 'El contenido de las pantallas mostradas aquí usa datos ficticios.',
      topicsIntro: 'Elige un tema para saber más',
      stepLabel: 'Paso',
    },
    it: {
      heroTitle: 'Tutto per il tuo animale,<br/>in un unico posto.',
      heroSubtitle: 'Scopri come usare PetLucid passo dopo passo — da promemoria e cartelle cliniche al monitoraggio veterinario e ai backup.',
      scrollCue: 'Scorri',
      storeSoon: 'Prossimamente',
      catalogEyebrow: 'Guida all\'uso di PetLucid',
      catalogTitle: 'Da dove vuoi iniziare?',
      catalogSubtitle: 'Ogni scheda apre la guida completa per quella schermata dell\'app.',
      readGuide: 'Apri la guida',
      backToTop: 'Torna su',
      footerTag: 'Per il tuo animale, sul tuo dispositivo.',
      footerCopyright: '© 2026 PetLucid. Tutti i diritti riservati.',
      dataNote: 'I contenuti delle schermate mostrate qui usano dati fittizi.',
      topicsIntro: 'Scegli un argomento per saperne di più',
      stepLabel: 'Passo',
    },
    pt: {
      heroTitle: 'Tudo para o seu pet,<br/>em um só lugar.',
      heroSubtitle: 'Descubra como usar o PetLucid passo a passo — de lembretes a registros de saúde, acompanhamento veterinário e backups.',
      scrollCue: 'Deslize',
      storeSoon: 'Em breve',
      catalogEyebrow: 'Guia de Uso do PetLucid',
      catalogTitle: 'Por onde você gostaria de começar?',
      catalogSubtitle: 'Cada cartão abre o guia completo daquela tela no aplicativo.',
      readGuide: 'Abrir guia',
      backToTop: 'Voltar ao topo',
      footerTag: 'Para o seu pet, no seu dispositivo.',
      footerCopyright: '© 2026 PetLucid. Todos os direitos reservados.',
      dataNote: 'O conteúdo das telas mostradas aqui usa dados fictícios.',
      topicsIntro: 'Escolha um tópico para saber mais',
      stepLabel: 'Passo',
    },
    nl: {
      heroTitle: 'Alles voor je huisdier,<br/>op één plek.',
      heroSubtitle: 'Ontdek stap voor stap hoe je PetLucid gebruikt — van herinneringen tot gezondheidsdossiers, van dierenartsbeheer tot back-ups.',
      scrollCue: 'Scrollen',
      storeSoon: 'Binnenkort',
      catalogEyebrow: 'PetLucid Gebruikershandleiding',
      catalogTitle: 'Waar wil je beginnen?',
      catalogSubtitle: 'Elke kaart opent de volledige handleiding voor dat scherm in de app.',
      readGuide: 'Handleiding openen',
      backToTop: 'Naar boven',
      footerTag: 'Voor je huisdier, op je apparaat.',
      footerCopyright: '© 2026 PetLucid. Alle rechten voorbehouden.',
      dataNote: 'De getoonde scherminhoud gebruikt fictieve gegevens.',
      topicsIntro: 'Kies een onderwerp om meer te lezen',
      stepLabel: 'Stap',
    },
    ru: {
      heroTitle: 'Всё для вашего питомца<br/>в одном месте.',
      heroSubtitle: 'Узнайте, как пользоваться PetLucid шаг за шагом — от напоминаний до медицинских записей, учёта визитов к ветеринару и резервных копий.',
      scrollCue: 'Прокрутите',
      storeSoon: 'Скоро',
      catalogEyebrow: 'Руководство пользователя PetLucid',
      catalogTitle: 'С чего хотите начать?',
      catalogSubtitle: 'Каждая карточка открывает полное руководство по соответствующему экрану приложения.',
      readGuide: 'Открыть руководство',
      backToTop: 'Наверх',
      footerTag: 'Для вашего питомца, на вашем устройстве.',
      footerCopyright: '© 2026 PetLucid. Все права защищены.',
      dataNote: 'Содержимое экранов здесь показано на примерных данных.',
      topicsIntro: 'Выберите тему, чтобы узнать больше',
      stepLabel: 'Шаг',
    },
    ja: {
      heroTitle: '大切なペットのために、<br/>すべてが一箇所に。',
      heroSubtitle: 'リマインダーから健康記録、動物病院管理、バックアップまで、PetLucidの使い方をステップごとにご紹介します。',
      scrollCue: 'スクロール',
      storeSoon: '近日公開',
      catalogEyebrow: 'PetLucid 利用ガイド',
      catalogTitle: 'どこから始めますか？',
      catalogSubtitle: '各カードをタップすると、アプリ内の該当画面の完全ガイドが開きます。',
      readGuide: 'ガイドを開く',
      backToTop: 'トップに戻る',
      footerTag: '大切なペットのために、あなたの端末で。',
      footerCopyright: '© 2026 PetLucid. All rights reserved.',
      dataNote: 'ここに表示されている画面内容はサンプルデータです。',
      topicsIntro: 'トピックを選んで詳しく見る',
      stepLabel: 'ステップ',
    },
    ko: {
      heroTitle: '소중한 반려동물을 위한 모든 것,<br/>한 곳에서.',
      heroSubtitle: '알림부터 건강 기록, 동물병원 관리, 백업까지 PetLucid 사용법을 단계별로 알아보세요.',
      scrollCue: '스크롤',
      storeSoon: '출시 예정',
      catalogEyebrow: 'PetLucid 사용 가이드',
      catalogTitle: '어디서부터 시작하시겠어요?',
      catalogSubtitle: '각 카드를 누르면 앱 내 해당 화면의 전체 가이드가 열립니다.',
      readGuide: '가이드 열기',
      backToTop: '맨 위로',
      footerTag: '소중한 반려동물을 위해, 당신의 기기에서.',
      footerCopyright: '© 2026 PetLucid. All rights reserved.',
      dataNote: '여기에 표시된 화면 내용은 예시 데이터입니다.',
      topicsIntro: '더 알아보려면 주제를 선택하세요',
      stepLabel: '단계',
    },
    zh: {
      heroTitle: '为你的宠物，<br/>一切尽在一处。',
      heroSubtitle: '逐步了解如何使用 PetLucid——从提醒事项到健康记录，从兽医管理到数据备份。',
      scrollCue: '滚动',
      storeSoon: '即将上线',
      catalogEyebrow: 'PetLucid 使用指南',
      catalogTitle: '您想从哪里开始？',
      catalogSubtitle: '每张卡片都会打开应用内对应屏幕的完整指南。',
      readGuide: '打开指南',
      backToTop: '回到顶部',
      footerTag: '为你的宠物，在你的设备上。',
      footerCopyright: '© 2026 PetLucid. 保留所有权利。',
      dataNote: '此处显示的屏幕内容为示例数据。',
      topicsIntro: '选择一个主题以了解更多',
      stepLabel: '步骤',
    },
    ar: {
      heroTitle: 'كل ما يحتاجه حيوانك الأليف،<br/>في مكان واحد.',
      heroSubtitle: 'اكتشف كيفية استخدام PetLucid خطوة بخطوة — من التذكيرات إلى السجلات الصحية، ومتابعة الطبيب البيطري إلى النسخ الاحتياطي.',
      scrollCue: 'مرر لأسفل',
      storeSoon: 'قريبًا',
      catalogEyebrow: 'دليل استخدام PetLucid',
      catalogTitle: 'من أين تريد أن تبدأ؟',
      catalogSubtitle: 'تفتح كل بطاقة الدليل الكامل للشاشة المقابلة داخل التطبيق.',
      readGuide: 'فتح الدليل',
      backToTop: 'العودة للأعلى',
      footerTag: 'لحيوانك الأليف، على جهازك.',
      footerCopyright: '© 2026 PetLucid. جميع الحقوق محفوظة.',
      dataNote: 'محتوى الشاشات المعروض هنا يستخدم بيانات توضيحية.',
      topicsIntro: 'اختر موضوعًا لقراءة المزيد',
      stepLabel: 'خطوة',
    },
    pl: {
      heroTitle: 'Wszystko dla Twojego zwierzaka,<br/>w jednym miejscu.',
      heroSubtitle: 'Poznaj krok po kroku, jak korzystać z PetLucid — od przypomnień, przez dokumentację zdrowotną, po wizyty u weterynarza i kopie zapasowe.',
      scrollCue: 'Przewiń',
      storeSoon: 'Wkrótce',
      catalogEyebrow: 'Przewodnik użytkownika PetLucid',
      catalogTitle: 'Od czego chcesz zacząć?',
      catalogSubtitle: 'Każda karta otwiera pełny przewodnik dla danego ekranu aplikacji.',
      readGuide: 'Otwórz przewodnik',
      backToTop: 'Powrót do góry',
      footerTag: 'Dla Twojego zwierzaka, na Twoim urządzeniu.',
      footerCopyright: '© 2026 PetLucid. Wszelkie prawa zastrzeżone.',
      dataNote: 'Treść ekranów pokazana tutaj to dane przykładowe.',
      topicsIntro: 'Wybierz temat, aby dowiedzieć się więcej',
      stepLabel: 'Krok',
    },
    sv: {
      heroTitle: 'Allt för ditt husdjur,<br/>på ett ställe.',
      heroSubtitle: 'Upptäck hur du använder PetLucid steg för steg — från påminnelser till hälsojournaler, veterinärhantering och säkerhetskopior.',
      scrollCue: 'Skrolla',
      storeSoon: 'Kommer snart',
      catalogEyebrow: 'PetLucid Användarguide',
      catalogTitle: 'Var vill du börja?',
      catalogSubtitle: 'Varje kort öppnar den fullständiga guiden för respektive skärm i appen.',
      readGuide: 'Öppna guide',
      backToTop: 'Till toppen',
      footerTag: 'För ditt husdjur, på din enhet.',
      footerCopyright: '© 2026 PetLucid. Alla rättigheter förbehållna.',
      dataNote: 'Skärminnehållet som visas här använder exempeldata.',
      topicsIntro: 'Välj ett ämne för att läsa mer',
      stepLabel: 'Steg',
    },
    no: {
      heroTitle: 'Alt for kjæledyret ditt,<br/>på ett sted.',
      heroSubtitle: 'Oppdag hvordan du bruker PetLucid steg for steg — fra påminnelser til helsejournaler, veterinæroppfølging og sikkerhetskopier.',
      scrollCue: 'Rull ned',
      storeSoon: 'Kommer snart',
      catalogEyebrow: 'PetLucid Brukerveiledning',
      catalogTitle: 'Hvor vil du begynne?',
      catalogSubtitle: 'Hvert kort åpner den fullstendige veiledningen for den skjermen i appen.',
      readGuide: 'Åpne veiledning',
      backToTop: 'Til toppen',
      footerTag: 'For kjæledyret ditt, på din enhet.',
      footerCopyright: '© 2026 PetLucid. Alle rettigheter forbeholdt.',
      dataNote: 'Skjerminnholdet som vises her bruker eksempeldata.',
      topicsIntro: 'Velg et emne for å lese mer',
      stepLabel: 'Steg',
    },
    da: {
      heroTitle: 'Alt til dit kæledyr,<br/>ét sted.',
      heroSubtitle: 'Opdag, hvordan du bruger PetLucid trin for trin — fra påmindelser til sundhedsjournaler, dyrlægeopfølgning og sikkerhedskopier.',
      scrollCue: 'Rul ned',
      storeSoon: 'Kommer snart',
      catalogEyebrow: 'PetLucid Brugervejledning',
      catalogTitle: 'Hvor vil du gerne starte?',
      catalogSubtitle: 'Hvert kort åbner den fulde vejledning til den pågældende skærm i appen.',
      readGuide: 'Åbn vejledning',
      backToTop: 'Til toppen',
      footerTag: 'Til dit kæledyr, på din enhed.',
      footerCopyright: '© 2026 PetLucid. Alle rettigheder forbeholdes.',
      dataNote: 'Skærmindholdet, der vises her, bruger eksempeldata.',
      topicsIntro: 'Vælg et emne for at læse mere',
      stepLabel: 'Trin',
    },
    fi: {
      heroTitle: 'Kaikki lemmikillesi,<br/>samassa paikassa.',
      heroSubtitle: 'Tutustu PetLucidin käyttöön vaihe vaiheelta — muistutuksista terveystietoihin, eläinlääkäriseurantaan ja varmuuskopioihin.',
      scrollCue: 'Vieritä',
      storeSoon: 'Tulossa pian',
      catalogEyebrow: 'PetLucid-käyttöopas',
      catalogTitle: 'Mistä haluat aloittaa?',
      catalogSubtitle: 'Jokainen kortti avaa täydellisen oppaan sovelluksen vastaavalle näytölle.',
      readGuide: 'Avaa opas',
      backToTop: 'Takaisin ylös',
      footerTag: 'Lemmikillesi, laitteellasi.',
      footerCopyright: '© 2026 PetLucid. Kaikki oikeudet pidätetään.',
      dataNote: 'Tässä näytetty näyttöjen sisältö käyttää esimerkkitietoja.',
      topicsIntro: 'Valitse aihe lukeaksesi lisää',
      stepLabel: 'Vaihe',
    },
    cs: {
      heroTitle: 'Vše pro vašeho mazlíčka,<br/>na jednom místě.',
      heroSubtitle: 'Objevte, jak používat PetLucid krok za krokem — od připomínek přes zdravotní záznamy až po sledování veterináře a zálohy.',
      scrollCue: 'Posunout',
      storeSoon: 'Již brzy',
      catalogEyebrow: 'Uživatelská příručka PetLucid',
      catalogTitle: 'Kde chcete začít?',
      catalogSubtitle: 'Každá karta otevře kompletní návod pro danou obrazovku v aplikaci.',
      readGuide: 'Otevřít návod',
      backToTop: 'Zpět nahoru',
      footerTag: 'Pro vašeho mazlíčka, na vašem zařízení.',
      footerCopyright: '© 2026 PetLucid. Všechna práva vyhrazena.',
      dataNote: 'Obsah obrazovek zobrazený zde používá ukázková data.',
      topicsIntro: 'Vyberte téma a přečtěte si více',
      stepLabel: 'Krok',
    },
    hu: {
      heroTitle: 'Minden a kedvencedért,<br/>egy helyen.',
      heroSubtitle: 'Fedezd fel lépésről lépésre, hogyan használd a PetLucidot — emlékeztetőktől az egészségügyi nyilvántartásokon át az állatorvosi követésig és a biztonsági mentésekig.',
      scrollCue: 'Görgetés',
      storeSoon: 'Hamarosan',
      catalogEyebrow: 'PetLucid Felhasználói Útmutató',
      catalogTitle: 'Honnan szeretnéd kezdeni?',
      catalogSubtitle: 'Minden kártya megnyitja az adott képernyő teljes útmutatóját az alkalmazásban.',
      readGuide: 'Útmutató megnyitása',
      backToTop: 'Vissza a tetejére',
      footerTag: 'A kedvencedért, a te eszközödön.',
      footerCopyright: '© 2026 PetLucid. Minden jog fenntartva.',
      dataNote: 'Az itt megjelenített képernyőtartalom minta adatokat használ.',
      topicsIntro: 'Válassz egy témát a bővebb olvasáshoz',
      stepLabel: 'Lépés',
    },
    ro: {
      heroTitle: 'Totul pentru animalul tău de companie,<br/>într-un singur loc.',
      heroSubtitle: 'Descoperă cum să folosești PetLucid pas cu pas — de la mementouri la fișe medicale, urmărirea veterinarului și copii de rezervă.',
      scrollCue: 'Derulează',
      storeSoon: 'În curând',
      catalogEyebrow: 'Ghidul de utilizare PetLucid',
      catalogTitle: 'De unde vrei să începi?',
      catalogSubtitle: 'Fiecare card deschide ghidul complet pentru ecranul respectiv din aplicație.',
      readGuide: 'Deschide ghidul',
      backToTop: 'Înapoi sus',
      footerTag: 'Pentru animalul tău, pe dispozitivul tău.',
      footerCopyright: '© 2026 PetLucid. Toate drepturile rezervate.',
      dataNote: 'Conținutul ecranelor afișat aici folosește date exemplificative.',
      topicsIntro: 'Alege un subiect pentru a citi mai mult',
      stepLabel: 'Pas',
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
