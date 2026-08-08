/**
 * PetLucid — Yem & Su Hesaplayıcı: formül motoru
 * Saf hesaplama katmanı. DOM'a, i18n'e dokunmaz — sadece sayı alır, sayı döner.
 * Her tür fonksiyonu şu şekli döner:
 *   { foodValue, foodUnit, waterValue, waterUnit, foodNoteKeys[], waterNoteKeys[] }
 * *NoteKeys alanları, sonuç ekranında hangi dipnotların (kuru madde esası,
 * tahmini değer uyarısı vb.) gösterileceğini işaretler — metinler calculator-i18n.js'te.
 *
 * Birimler daima: kilo girişi kg, gramaj çıktısı g, sıvı çıktısı ml (büyük
 * hacimlerde L'ye UI katmanında çevrilir), akvaryum hacmi L olarak alınır.
 */
(function (global) {
  const round = (n) => Math.round(n * 10) / 10;

  // Kuru/Yaş mama çarpanı — sadece kedi/köpek formunda kullanılır.
  // Yaş mama: su ihtiyacı azalır (mama zaten %70-80 su), kuru gramaj karşılığı ~3x büyür.
  function applyFoodTypeMultiplier(foodG, waterMl, foodType) {
    if (foodType === 'wet') {
      return { foodValue: foodG * 3, waterValue: waterMl * 0.75 };
    }
    return { foodValue: foodG, waterValue: waterMl };
  }

  // ---------------------------------------------------------------------
  // Tür formülleri — girdi: { weightKg, foodType?, tankLiters? }
  // ---------------------------------------------------------------------
  const SPECIES = {
    cat: {
      calc(inp) {
        const foodG = inp.weightKg * 17.5;   // 15-20 g/kg orta değer
        const waterMl = inp.weightKg * 50;
        const adj = applyFoodTypeMultiplier(foodG, waterMl, inp.foodType);
        return {
          foodValue: round(adj.foodValue), foodUnit: 'g',
          waterValue: round(adj.waterValue), waterUnit: 'ml',
          foodRange: '15-20 g/kg', waterRange: '50 ml/kg',
          noteKeys: ['estimateVet', 'activity'],
        };
      },
    },
    dog: {
      calc(inp) {
        const foodG = inp.weightKg * 22.5;   // 20-25 g/kg orta değer
        const waterMl = inp.weightKg * 55;   // 50-60 ml/kg orta değer
        const adj = applyFoodTypeMultiplier(foodG, waterMl, inp.foodType);
        return {
          foodValue: round(adj.foodValue), foodUnit: 'g',
          waterValue: round(adj.waterValue), waterUnit: 'ml',
          foodRange: '20-25 g/kg', waterRange: '50-60 ml/kg',
          noteKeys: ['estimateVet', 'activity'],
        };
      },
    },
    bird: {
      calc(inp) {
        const foodG = inp.weightKg * 1000 * 0.125;   // %10-15 canlı ağırlık orta değer, gram cinsinden
        const waterMl = inp.weightKg * 1000 * 0.175; // %15-20 orta değer
        return {
          foodValue: round(foodG), foodUnit: 'g',
          waterValue: round(waterMl), waterUnit: 'ml',
          foodRange: '%10-15 canlı ağırlık', waterRange: '%15-20 canlı ağırlık',
          noteKeys: ['estimateVet', 'birdFresh'],
        };
      },
    },
    fish: {
      calc(inp) {
        const foodG = inp.weightKg * 1000 * 0.02; // toplam balık ağırlığının %2'si
        return {
          foodValue: round(foodG), foodUnit: 'g',
          waterValue: inp.tankLiters ? round(inp.tankLiters) : null, waterUnit: 'l',
          foodRange: '%2 toplam ağırlık', waterRange: 'Akvaryum hacmi',
          noteKeys: ['estimateVet', 'fishTwoMin'],
          waterIsTankVolume: true,
        };
      },
    },
    hamster: {
      calc(inp) {
        const foodG = inp.weightKg * 1000 * 0.125;  // %10-15 orta değer
        const waterMl = (inp.weightKg * 1000 / 100) * 10; // 100g vücut ağırlığı -> 10ml
        return {
          foodValue: round(foodG), foodUnit: 'g',
          waterValue: round(waterMl), waterUnit: 'ml',
          foodRange: '%10-15 canlı ağırlık', waterRange: '10 ml/100g',
          noteKeys: ['estimateVet'],
        };
      },
    },
    rabbit: {
      calc(inp) {
        const foodG = inp.weightKg * 1000 * 0.05; // vücut ağırlığının %5'i pelet
        const waterMl = inp.weightKg * 100;
        return {
          foodValue: round(foodG), foodUnit: 'g',
          waterValue: round(waterMl), waterUnit: 'ml',
          foodRange: '%5 vücut ağırlığı (pelet)', waterRange: '100 ml/kg',
          noteKeys: ['estimateVet', 'rabbitHay'],
        };
      },
    },
    reptile: {
      calc(inp) {
        const foodG = inp.weightKg * 1000 * 0.025; // otçul sürüngen ort. %2-3
        const waterMl = inp.weightKg * 15; // 10-20 ml/kg orta değer
        return {
          foodValue: round(foodG), foodUnit: 'g',
          waterValue: round(waterMl), waterUnit: 'ml',
          foodRange: '%2-3 vücut ağırlığı (otçul)', waterRange: '10-20 ml/kg',
          noteKeys: ['estimateVet', 'reptileSpecies'],
        };
      },
    },
    poultry: {
      calc(inp) {
        // 120-250 g/baş/gün türe göre değişir; kilo girişinden orta değer
        // olarak %1.2-2.5 canlı ağırlık bandına yansıtılır (yaklaşık eşdeğer).
        const foodG = Math.min(250, Math.max(120, inp.weightKg * 1000 * 0.09));
        const waterMl = foodG * 2;
        return {
          foodValue: round(foodG), foodUnit: 'g',
          waterValue: round(waterMl), waterUnit: 'ml',
          foodRange: '120-250 g/baş/gün', waterRange: 'Yem × 2',
          noteKeys: ['estimateVet', 'dryMatter'],
        };
      },
    },
    horse: {
      calc(inp) {
        const foodKg = inp.weightKg * 0.0225; // %2-2.5 orta değer
        const waterMl = inp.weightKg * 50;
        return {
          foodValue: round(foodKg), foodUnit: 'kg',
          waterValue: round(waterMl), waterUnit: 'ml',
          foodRange: '%2-2.5 canlı ağırlık', waterRange: '50 ml/kg (~25-40 L)',
          noteKeys: ['estimateVet', 'dryMatter'],
        };
      },
    },
    cow: {
      calc(inp) {
        const foodKg = inp.weightKg * 0.035; // %3-4 orta değer
        const waterMl = inp.weightKg * 90; // 80-100 ml/kg orta değer
        return {
          foodValue: round(foodKg), foodUnit: 'kg',
          waterValue: round(waterMl), waterUnit: 'ml',
          foodRange: '%3-4 canlı ağırlık', waterRange: '80-100 ml/kg',
          noteKeys: ['estimateVet', 'dryMatter', 'cowLactation'],
        };
      },
    },
    sheep: {
      calc(inp) {
        const foodKg = inp.weightKg * 0.0325; // %3-3.5 orta değer
        const waterMl = inp.weightKg * 100;
        return {
          foodValue: round(foodKg), foodUnit: 'kg',
          waterValue: round(waterMl), waterUnit: 'ml',
          foodRange: '%3-3.5 canlı ağırlık', waterRange: '100 ml/kg (~4-8 L)',
          noteKeys: ['estimateVet', 'dryMatter'],
        };
      },
    },
    goat: {
      calc(inp) {
        const foodKg = inp.weightKg * 0.04; // %3.5-4.5 orta değer
        const waterMl = inp.weightKg * 100;
        return {
          foodValue: round(foodKg), foodUnit: 'kg',
          waterValue: round(waterMl), waterUnit: 'ml',
          foodRange: '%3.5-4.5 canlı ağırlık', waterRange: '100 ml/kg (~5-10 L)',
          noteKeys: ['estimateVet', 'dryMatter'],
        };
      },
    },
  };

  const SPECIES_ORDER = ['cat', 'dog', 'bird', 'fish', 'hamster', 'rabbit', 'reptile', 'poultry', 'horse', 'cow', 'sheep', 'goat'];

  // Hangi türde hangi form alanları gösterilir.
  const SPECIES_FIELDS = {
    cat: ['weightKg', 'foodType'],
    dog: ['weightKg', 'foodType'],
    fish: ['weightKg', 'tankLiters'],
    // diğer tüm türler: sadece weightKg
  };

  function fieldsFor(species) {
    return SPECIES_FIELDS[species] || ['weightKg'];
  }

  function compute(species, inputs) {
    const def = SPECIES[species];
    if (!def || !inputs || !(inputs.weightKg > 0)) return null;
    return def.calc(inputs);
  }

  global.PLCalcData = {
    SPECIES_ORDER,
    fieldsFor,
    compute,
  };
})(window);
