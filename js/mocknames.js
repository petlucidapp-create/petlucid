/**
 * PetLucid — Mock isim havuzu
 * Live mock ekranlarda kullanılan örnek pet/insan isimleri, dile göre
 * yerelleştirilmiş. Tüm isimler kurgusaldır; gerçek kişilerle karışmaması
 * için bilinçli olarak nötr/yaygın-olmayan kombinasyonlar seçilmiştir.
 *
 * Yapı: MOCK_NAMES[lang] = {
 *   cat, dog, bird, fish, hamster, rabbit, reptile, poultry,
 *   horse, cow, goat_sheep,   // tür başına 1 örnek isim
 *   vet,                       // "Dr. Ad Soyad" formatında
 *   owner                      // "Ad Soyad" formatında
 * }
 */
(function (global) {
  const MOCK_NAMES = {
    en: {
      cat: 'Whiskers', dog: 'Rocky', bird: 'Skye', fish: 'Bubbles',
      hamster: 'Peanut', rabbit: 'Clover', reptile: 'Rango', poultry: 'Henrietta',
      horse: 'Jasper', cow: 'Daisy', goat_sheep: 'Wooly',
      vet: 'Dr. Nathaniel Cole', owner: 'Meredith Hale',
    },
    tr: {
      cat: 'Boncuk', dog: 'Karabaş', bird: 'Civciv', fish: 'Habibi',
      hamster: 'Fıstık', rabbit: 'Tavcan', reptile: 'Şimşek', poultry: 'Sarıkız',
      horse: 'Doru', cow: 'Sarıkız Boğa', goat_sheep: 'Yumoş',
      vet: 'Dr. Kerem Aydınlı', owner: 'Derya Turgut',
    },
    de: {
      cat: 'Minka', dog: 'Bello', bird: 'Piepmatz', fish: 'Nemo',
      hamster: 'Knuffel', rabbit: 'Hoppel', reptile: 'Schuppi', poultry: 'Gackerine',
      horse: 'Falko', cow: 'Bella', goat_sheep: 'Wolli',
      vet: 'Dr. Lennart Brandt', owner: 'Frieda Wagner',
    },
    fr: {
      cat: 'Minette', dog: 'Médor', bird: 'Titi', fish: 'Nemo',
      hamster: 'Cacahuète', rabbit: 'Câlin', reptile: 'Écaille', poultry: 'Cocotte',
      horse: 'Éclair', cow: 'Marguerite', goat_sheep: 'Frisou',
      vet: 'Dr. Étienne Rocher', owner: 'Camille Fontaine',
    },
    es: {
      cat: 'Michi', dog: 'Firulais', bird: 'Piolín', fish: 'Nemo',
      hamster: 'Cacahuete', rabbit: 'Copito', reptile: 'Escamas', poultry: 'Pepita',
      horse: 'Relámpago', cow: 'Margarita', goat_sheep: 'Rizos',
      vet: 'Dr. Emilio Vargas', owner: 'Paloma Rivas',
    },
    it: {
      cat: 'Micio', dog: 'Fido', bird: 'Cip', fish: 'Bolla',
      hamster: 'Nocciolina', rabbit: 'Batuffolo', reptile: 'Squamoso', poultry: 'Chiocciolina',
      horse: 'Lampo', cow: 'Margherita', goat_sheep: 'Ricciolo',
      vet: 'Dr. Leonardo Ferraro', owner: 'Bianca Moretti',
    },
    pt: {
      cat: 'Mimi', dog: 'Rex', bird: 'Piu', fish: 'Bolha',
      hamster: 'Amendoim', rabbit: 'Fofinho', reptile: 'Escamas', poultry: 'Pintada',
      horse: 'Relâmpago', cow: 'Margarida', goat_sheep: 'Cacho',
      vet: 'Dr. Rafael Nogueira', owner: 'Beatriz Amaral',
    },
    nl: {
      cat: 'Poesje', dog: 'Fikkie', bird: 'Tjilp', fish: 'Bubbel',
      hamster: 'Pinda', rabbit: 'Flappie', reptile: 'Schub', poultry: 'Klukje',
      horse: 'Bliksem', cow: 'Bella', goat_sheep: 'Wolly',
      vet: 'Dr. Sander Visser', owner: 'Femke de Groot',
    },
    ru: {
      cat: 'Мурка', dog: 'Барсик', bird: 'Кеша', fish: 'Пузырёк',
      hamster: 'Орешек', rabbit: 'Пушок', reptile: 'Чешуйка', poultry: 'Пеструшка',
      horse: 'Зарница', cow: 'Ромашка', goat_sheep: 'Кудряшка',
      vet: 'Др. Игорь Соколов', owner: 'Марина Волкова',
    },
    ja: {
      cat: 'ミケ', dog: 'ポチ', bird: 'ピーコ', fish: 'あわ',
      hamster: 'ピーナッツ', rabbit: 'モコ', reptile: 'ウロコ', poultry: 'コッコ',
      horse: 'ライコウ', cow: 'マーガレット', goat_sheep: 'モコモコ',
      vet: '中村 拓海 先生', owner: '小林 陽子',
    },
    ko: {
      cat: '나비', dog: '초코', bird: '삐약이', fish: '보글이',
      hamster: '땅콩이', rabbit: '토실이', reptile: '비늘이', poultry: '꼬꼬',
      horse: '번개', cow: '마가렛', goat_sheep: '곱슬이',
      vet: '한지훈 원장', owner: '오서연',
    },
    zh: {
      cat: '咪咪', dog: '旺财', bird: '啾啾', fish: '泡泡',
      hamster: '花生', rabbit: '毛球', reptile: '鳞鳞', poultry: '花花',
      horse: '闪电', cow: '雏菊', goat_sheep: '卷卷',
      vet: '陈best医生', owner: '林思涵',
    },
    ar: {
      cat: 'قطقوطة', dog: 'ريكس', bird: 'زقزوق', fish: 'فقاعة',
      hamster: 'فستق', rabbit: 'زغبة', reptile: 'قشرة', poultry: 'بيضاء',
      horse: 'برق', cow: 'أقحوان', goat_sheep: 'مجعد',
      vet: 'د. عمر الراشدي', owner: 'لينا الحمداني',
    },
    pl: {
      cat: 'Mruczek', dog: 'Reksio', bird: 'Ćwirek', fish: 'Bąbelek',
      hamster: 'Orzeszek', rabbit: 'Puszek', reptile: 'Łuska', poultry: 'Pierzynka',
      horse: 'Błyskawica', cow: 'Stokrotka', goat_sheep: 'Kędzior',
      vet: 'Dr Marcin Wiśniewski', owner: 'Zofia Kamińska',
    },
    sv: {
      cat: 'Misse', dog: 'Bamse', bird: 'Kvitter', fish: 'Bubbla',
      hamster: 'Jordnöt', rabbit: 'Tofs', reptile: 'Fjäll', poultry: 'Pippi',
      horse: 'Blixt', cow: 'Prästkrage', goat_sheep: 'Lockig',
      vet: 'Dr. Erik Lindqvist', owner: 'Elin Bergström',
    },
    no: {
      cat: 'Pus', dog: 'Bamse', bird: 'Kvitre', fish: 'Boble',
      hamster: 'Peanøtt', rabbit: 'Dott', reptile: 'Skjell', poultry: 'Pippi',
      horse: 'Lyn', cow: 'Marigull', goat_sheep: 'Krøll',
      vet: 'Dr. Kristoffer Haugen', owner: 'Ingrid Solberg',
    },
    da: {
      cat: 'Mis', dog: 'Bamse', bird: 'Kvidre', fish: 'Boble',
      hamster: 'Peanut', rabbit: 'Fnug', reptile: 'Skæl', poultry: 'Pippi',
      horse: 'Lyn', cow: 'Mælkebøtte', goat_sheep: 'Krølle',
      vet: 'Dr. Anders Møller', owner: 'Sofie Kristensen',
    },
    fi: {
      cat: 'Muru', dog: 'Musti', bird: 'Peipponen', fish: 'Kupla',
      hamster: 'Pähkinä', rabbit: 'Töpöhäntä', reptile: 'Suomu', poultry: 'Tipu',
      horse: 'Salama', cow: 'Kaunokki', goat_sheep: 'Kihara',
      vet: 'Dr. Aleksi Virtanen', owner: 'Emilia Korhonen',
    },
    cs: {
      cat: 'Micka', dog: 'Bobík', bird: 'Čiperka', fish: 'Bublinka',
      hamster: 'Oříšek', rabbit: 'Chloupek', reptile: 'Šupinka', poultry: 'Kropenka',
      horse: 'Blesk', cow: 'Sedmikráska', goat_sheep: 'Kudrnáč',
      vet: 'MUDr. Tomáš Novák', owner: 'Barbora Svobodová',
    },
    hu: {
      cat: 'Cirmos', dog: 'Bodri', bird: 'Csipogó', fish: 'Buborék',
      hamster: 'Mogyoró', rabbit: 'Pihe', reptile: 'Pikkely', poultry: 'Tarka',
      horse: 'Villám', cow: 'Margaréta', goat_sheep: 'Bodros',
      vet: 'Dr. Bence Kovács', owner: 'Zsófia Molnár',
    },
    ro: {
      cat: 'Mimi', dog: 'Grivei', bird: 'Ciripel', fish: 'Bulbuc',
      hamster: 'Alunel', rabbit: 'Puf', reptile: 'Solzișor', poultry: 'Pestriță',
      horse: 'Fulger', cow: 'Bujor', goat_sheep: 'Creț',
      vet: 'Dr. Andrei Popescu', owner: 'Ioana Dumitrescu',
    },
  };

  /**
   * Belirli bir dil + tür/rol için mock ismi döner.
   * Dil eksikse İngilizce'ye, o da yoksa boş string'e düşer.
   * @param {string} key - cat, dog, bird, fish, hamster, rabbit, reptile,
   *   poultry, horse, cow, goat_sheep, vet, owner
   * @param {string} lang - dil kodu (guides.json meta.langs ile aynı)
   */
  function mockName(key, lang) {
    const block = MOCK_NAMES[lang] || MOCK_NAMES.en;
    return (block && block[key]) || (MOCK_NAMES.en[key]) || '';
  }

  global.PLMockNames = { MOCK_NAMES, mockName };
})(window);
                    
