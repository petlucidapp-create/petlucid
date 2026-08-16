/**
 * PetLucid — Live Mock UI screens
 * Her guide adımı (screen.section veya screen.topic.section) için, gerçek
 * uygulama ekran görüntüsünü gösteren bir çerçeve üretir. Görsel dosyası
 * yoksa boş bir placeholder çerçeve gösterilir (dosya adı ipucuyla).
 *
 * Görsel dosyaları — DİL-DUYARLI ARAMA SIRASI:
 *   1) assets/screens/<frameId>.<mevcutDil>.<ext>   (örn. index.empty_state.de.jpg)
 *   2) assets/screens/<frameId>.en.<ext>            (İngilizce fallback)
 *   3) assets/screens/<frameId>.<ext>               (eski/dilsiz orijinal dosya —
 *                                                     geriye dönük uyumluluk)
 *   4) placeholder (hiçbiri bulunamazsa)
 * Her aşamada EXT_CANDIDATES sırasıyla denenir (jpg, jpeg, png, webp).
 * Dil-özel görsel eklemek için sadece dosyayı doğru adla assets/screens/
 * içine koymak yeterli, kod değişikliği gerekmez.
 */
(function (global) {
  const I = global.PLIcon;
  const SCREENS_PATH = '/assets/screens/';
  const EXT_CANDIDATES = ['jpg', 'jpeg', 'png', 'webp'];

  // Guide meta'sından (guides.json) tüm geçerli frame ID'lerini üretir:
  // screen.section (tek seviyeli, meta.guideSections) veya
  // screen.topic.section (iki seviyeli, strings.<lang>.guide.<screen>.topics.<topic>.sections).
  function allFrameIds() {
    const { t, meta } = global.PLI18n;
    const m = meta();
    const ids = [];
    (m.screenOrder || []).forEach((screen) => {
      if (m.guideTopics && m.guideTopics[screen]) {
        m.guideTopics[screen].forEach((topic) => {
          const secs = t(`guide.${screen}.topics.${topic}.sections`);
          if (secs && typeof secs === 'object') {
            Object.keys(secs).forEach((sec) => ids.push(`${screen}.${topic}.${sec}`));
          }
        });
      } else {
        const secs = (m.guideSections && m.guideSections[screen]) || [];
        secs.forEach((sec) => ids.push(`${screen}.${sec}`));
      }
    });
    return ids;
  }

  // Bir frame için denenecek "yol adayları" listesini üretir:
  // önce mevcut dil, sonra İngilizce (mevcut dil zaten en değilse), sonra
  // dilsiz orijinal — her biri için 4 uzantı. Sıra korunur.
  function buildCandidates(frameId) {
    const currentLang = (global.PLI18n && global.PLI18n.currentLang) ? global.PLI18n.currentLang() : null;
    const langPrefixes = [];
    if (currentLang) langPrefixes.push(currentLang);
    if (currentLang !== 'en') langPrefixes.push('en');
    langPrefixes.push(''); // dilsiz orijinal dosya adı (geriye dönük uyumluluk)

    const candidates = [];
    langPrefixes.forEach((prefix) => {
      EXT_CANDIDATES.forEach((ext) => {
        const base = prefix ? `${frameId}.${prefix}` : frameId;
        candidates.push(`${SCREENS_PATH}${base}.${ext}`);
      });
    });
    return candidates;
  }

  // Bir frame için görsel elementi üretir. Görsel yüklenemezse (dosya henüz
  // konmadıysa) sırayla diğer adayları dener, hepsi başarısızsa placeholder'a
  // geri döner.
  function screenshotFrame(frameId) {
    const candidates = buildCandidates(frameId);
    const imgId = `shot-${frameId.replace(/\./g, '-')}`;
    return `
      <div class="mock-screenshot" id="${imgId}">
        <img
          alt=""
          data-frame-id="${frameId}"
          data-try-idx="0"
          onerror="window.PLMockFrames.handleImgError(this)"
          src="${candidates[0]}"
        />
        <div class="mock-screenshot__placeholder">
          ${I('ImageOff', { size: 26 })}
          <span class="mock-screenshot__filename">${frameId}.jpg</span>
        </div>
      </div>
    `;
  }

  // <img> yüklenemezse sırayla diğer adayları dener (dil → en → dilsiz orijinal,
  // her biri için uzantı sırası); hepsi başarısız olursa görseli gizler ve
  // placeholder'ı gösterir.
  function handleImgError(imgEl) {
    const frameId = imgEl.getAttribute('data-frame-id');
    const candidates = buildCandidates(frameId);
    let idx = parseInt(imgEl.getAttribute('data-try-idx'), 10) + 1;
    if (idx < candidates.length) {
      imgEl.setAttribute('data-try-idx', String(idx));
      imgEl.src = candidates[idx];
    } else {
      imgEl.style.display = 'none';
      const wrap = imgEl.closest('.mock-screenshot');
      if (wrap) wrap.classList.add('is-placeholder');
    }
  }

  // ---------------------------------------------------------------------
  // FRAMES — her ID guides.json'daki screen.section (veya
  // screen.topic.section) yapısıyla birebir eşleşir. Tümü aynı
  // screenshotFrame() üzerinden üretilir.
  // ---------------------------------------------------------------------
  const FRAME_IDS = [
    'index.empty_state', 'index.daily_summary',
    'pets.profile', 'pets.edit_farewell', 'pets.farewelled',
    'vet.empty_add', 'vet.detail',
    'reminders.overview', 'reminders.creating', 'reminders.calendar',
    'reminders.views', 'reminders.managing', 'reminders.farewell',
    'health.prescriptions.overview', 'health.prescriptions.visit_info',
    'health.prescriptions.status_cards', 'health.prescriptions.saving',
    'health.pdf.overview', 'health.pdf.health_report', 'health.pdf.lost_pet',
    'health.pdf.farewell_report', 'health.pdf.category_report',
    'health.bulk.overview', 'health.bulk.screen', 'health.bulk.creating',
    'health.bulk.notes', 'health.bulk.shares', 'health.bulk.manage',
    'health.bulk.farewell',
    'settings.backup.overview', 'settings.backup.auto_backup',
    'settings.backup.external_copy', 'settings.backup.manual_backup',
    'settings.backup.restore', 'settings.backup.warning',
    'settings.premium.overview', 'settings.premium.free_plan',
    'settings.premium.premium_plan', 'settings.premium.purchase',
  ];

  const FRAMES = {};
  FRAME_IDS.forEach((id) => {
    FRAMES[id] = () => screenshotFrame(id);
  });

  global.PLMockFrames = FRAMES;
  global.PLMockFrames.handleImgError = handleImgError;
  global.PLMockFrames.allFrameIds = allFrameIds;
})(window);
