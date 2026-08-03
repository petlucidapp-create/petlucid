/**
 * PetLucid — Live Mock UI screens
 * Her guide adımı (screen.section veya screen.topic.section) için
 * gerçekçi bir uygulama ekranı simülasyonu üretir.
 * Tüm metinler placeholder'dır — gerçek app string'leriyle değiştirilebilir.
 * Tab bar / kategori simgeleri types/index.ts (CATEGORY_ICONS) ile birebir eşleşir.
 */
(function (global) {
  const I = global.PLIcon;

  const TABS = [
    { key: 'index', icon: 'Home' },
    { key: 'vet', icon: 'Stethoscope' },
    { key: 'health', icon: 'HeartPulse' },
    { key: 'reminders', icon: 'BellRing' },
    { key: 'settings', icon: 'Settings' },
  ];

  function tabBar(activeKey) {
    return `<div class="mock-tabbar">${TABS.map(tb => `
      <div class="mock-tabbar__item ${tb.key === activeKey ? 'is-active' : ''}">
        ${I(tb.icon, { size: 21 })}
        <span data-tabkey="${tb.key}"></span>
      </div>`).join('')}</div>`;
  }

  function topbar(titleKey) {
    return `<div class="mock-topbar"><span class="mock-topbar__title" data-tabkey="${titleKey}"></span></div>`;
  }

  function fab() {
    return `<div class="mock-fab">${I('PlusCircle', { size: 22 })}</div>`;
  }

  function rowCard(icon, titlePh, subPh) {
    return `<div class="mock-row-card">
      <div class="mock-row-card__icon">${I(icon, { size: 19 })}</div>
      <div class="mock-row-card__text">
        <div class="mock-row-card__title">${titlePh}</div>
        <div class="mock-row-card__sub">${subPh}</div>
      </div>
    </div>`;
  }

  function emptyState(icon, title, sub) {
    return `<div class="mock-empty">
      ${I(icon, { size: 40 })}
      <div class="mock-empty__title">${title}</div>
      <div class="mock-empty__sub">${sub}</div>
    </div>`;
  }

  const HEALTH_CATS = [
    ['Salad', '#'], ['Scissors', '#'], ['Weight', '#'], ['Ruler', '#'],
    ['Footprints', '#'], ['DollarSign', '#'], ['Stethoscope', '#'], ['Pill', '#'],
  ];

  function catGrid() {
    return `<div class="mock-grid-2">${HEALTH_CATS.map(([icon]) => `
      <div class="mock-cat-tile">${I(icon, { size: 20 })}<span>&nbsp;</span></div>
    `).join('')}</div>`;
  }

  // ---------------------------------------------------------------------
  // Frame builders — id: "screen.section" veya "screen.topic.section"
  // Her frame `data-ph` (placeholder text) alanlarını render.js dolduracak.
  // ---------------------------------------------------------------------
  const FRAMES = {};

  // ---- index (home) ----
  FRAMES['index.empty_state'] = () => `
    ${topbar('index')}
    <div class="mock-body">
      <div class="mock-row-card"><div class="mock-row-card__icon">${I('Moon',{size:15})}</div><div class="mock-row-card__text" style="display:flex;gap:14px;align-items:center;"><span class="chip">0</span><span class="chip">0</span></div></div>
      ${emptyState('Heart', '', '')}
      <div style="align-self:center;"><span class="chip" style="background:var(--blue);color:#fff;border:none;" data-ph="addPet"></span></div>
    </div>
    ${fab()}
    ${tabBar('index')}
  `;
  FRAMES['index.daily_summary'] = () => `
    ${topbar('index')}
    <div class="mock-body">
      <div class="mock-row-card glass-sheen" style="position:relative;">
        <div class="mock-row-card__icon">${I('Moon', { size: 19 })}</div>
        <div class="mock-row-card__text">
          <div class="mock-row-card__title" data-ph="today"></div>
          <div class="mock-row-card__sub" data-ph="reminderCount"></div>
        </div>
      </div>
      <div class="mock-divider"></div>
      ${rowCard('ClipboardList', '', '')}
      ${['cat','dog','bird'].map(sp => `
        <div class="mock-row-card">
          <div style="width:40px;height:40px;border-radius:50%;background:var(--glass-bg);display:flex;align-items:center;justify-content:center;flex-shrink:0;">${I('PawPrint',{size:18})}</div>
          <div class="mock-row-card__text"><div class="mock-row-card__title" data-ph="petName_${sp}"></div><div class="mock-row-card__sub" data-ph="petSpecies_${sp}"></div></div>
        </div>`).join('')}
    </div>
    ${fab()}
    ${tabBar('index')}
  `;

  const PET_HEALTH_CATS = [
    'Salad', 'Scissors', 'Weight', 'Ruler', 'Footprints', 'DollarSign',
    'Stethoscope', 'HeartPulse', 'Pill', 'Syringe', 'Leaf', 'ScanLine', 'FlaskConical',
  ];
  function petHealthGrid() {
    return `<div class="mock-grid-2">${PET_HEALTH_CATS.map(icon => `
      <div class="mock-cat-tile">${I(icon, { size: 20 })}<span>&nbsp;</span></div>
    `).join('')}</div>`;
  }

  // ---- pets ----
  FRAMES['pets.profile'] = () => `
    <div class="mock-body" style="padding-top:20px;">
      <div style="display:flex;flex-direction:column;align-items:center;gap:6px;margin-bottom:6px;">
        <div style="width:76px;height:76px;border-radius:50%;background:var(--glass-bg);border:1px solid var(--glass-border);display:flex;align-items:center;justify-content:center;">${I('PawPrint', { size: 34 })}</div>
        <div class="mock-row-card__title" data-ph="petName" style="font-size:16px;"></div>
        <div class="caption" data-ph="petTypeBreedAge"></div>
      </div>
      <div class="mock-row-card"><div class="mock-row-card__icon">${I('Stethoscope', { size: 19 })}</div><div class="mock-row-card__text"><div class="mock-row-card__sub" data-ph="assignedVet"></div><div class="mock-row-card__title" data-ph="vetName" style="font-size:14px;"></div></div>${I('ChevronRight',{size:16})}</div>
      <div class="mock-row-card"><div class="mock-row-card__icon">${I('Pill', { size: 19 })}</div><div class="mock-row-card__text"><div class="mock-row-card__title" data-ph="prescriptions" style="font-size:13px;"></div></div>${I('Trash2',{size:15})}</div>
      <div class="mock-divider"></div>
      ${petHealthGrid()}
    </div>
    ${tabBar('index')}
  `;
  FRAMES['pets.edit_farewell'] = () => `
    ${topbar('pets')}
    <div class="mock-body">
      <div style="align-self:center;position:relative;">
        <div style="width:64px;height:64px;border-radius:50%;background:var(--glass-bg);border:1px solid var(--glass-border);display:flex;align-items:center;justify-content:center;">${I('PawPrint', { size: 28 })}</div>
        <div style="position:absolute;bottom:-2px;right:-2px;width:22px;height:22px;border-radius:50%;background:var(--blue);display:flex;align-items:center;justify-content:center;color:#fff;">${I('Camera',{size:12})}</div>
      </div>
      <div class="mock-row-card"><div class="mock-row-card__text"><div class="caption" data-ph="genderLabel"></div><div style="display:flex;gap:6px;"><span class="chip">${I('User',{size:12})}</span><span class="chip" style="background:var(--blue);color:#fff;border:none;">${I('User',{size:12})}</span><span class="chip">?</span></div></div></div>
      <div class="mock-row-card"><div class="mock-row-card__text"><div class="caption" data-ph="birthDateLabel"></div><div class="mock-row-card__sub" data-ph="birthDate"></div></div>${I('CalendarDays',{size:16})}</div>
      <div class="mock-divider"></div>
      <div style="align-self:center;"><span class="chip" style="background:var(--blue);color:#fff;border:none;" data-ph="save"></span></div>
      <div class="mock-row-card" style="border-color:color-mix(in srgb, var(--rose) 30%, var(--glass-border));justify-content:center;"><span style="font-size:16px;">😢</span><div class="mock-row-card__title" data-ph="farewellBtn" style="color:var(--rose);"></div></div>
      <div style="border:1px solid var(--glass-border);border-radius:14px;padding:14px;display:flex;flex-direction:column;gap:8px;align-items:center;">
        <span style="font-size:22px;">😢</span>
        <div class="mock-row-card__title" data-ph="farewellTitle" style="font-size:14px;"></div>
        <div class="mock-grid-2" style="width:100%;">
          ${['HeartHandshake','Users','Search','Scale'].map(ic => `<div class="mock-cat-tile" style="aspect-ratio:auto;padding:8px;">${I(ic,{size:14})}<span style="font-size:9px;">&nbsp;</span></div>`).join('')}
        </div>
        <span class="chip" style="background:var(--blue);color:#fff;border:none;align-self:center;">${I('HeartHandshake',{size:12})}</span>
      </div>
    </div>
    ${tabBar('index')}
  `;
  FRAMES['pets.farewelled'] = () => `
    ${topbar('index')}
    <div class="mock-body">
      ${['cat','dog'].map(() => `<div class="mock-row-card"><div style="width:40px;height:40px;border-radius:50%;background:var(--glass-bg);flex-shrink:0;"></div><div class="mock-row-card__text"><div class="mock-row-card__title" data-ph="petName" style="font-size:14px;"></div><div class="mock-row-card__sub" data-ph="petSpecies_cat"></div></div></div>`).join('')}
      <div class="mock-divider"></div>
      <div class="caption" style="display:flex;align-items:center;gap:6px;">😢<span data-ph="farewellsSection"></span></div>
      <div class="mock-row-card" style="opacity:0.55;"><div style="width:40px;height:40px;border-radius:50%;background:var(--glass-bg);flex-shrink:0;"></div><div class="mock-row-card__text"><div class="mock-row-card__title" style="font-size:14px;">😢 <span data-ph="petName"></span></div><div class="mock-row-card__sub" data-ph="petSpecies_cat"></div></div></div>
    </div>
    ${tabBar('index')}
  `;

  // ---- vet ----
  FRAMES['vet.empty_add'] = () => `
    ${topbar('vet')}
    <div class="mock-body">${emptyState('Stethoscope', '', '')}</div>
    ${fab()}
    ${tabBar('vet')}
  `;
  FRAMES['vet.detail'] = () => `
    <div class="mock-body" style="padding-top:20px;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:4px;">
        <div style="width:56px;height:56px;border-radius:16px;background:var(--glass-bg);border:1px solid var(--glass-border);display:flex;align-items:center;justify-content:center;">${I('Stethoscope', { size: 26 })}</div>
        <div><div class="mock-row-card__title" data-ph="vetName" style="font-size:15px;"></div><div class="mock-row-card__sub" data-ph="clinicName"></div></div>
      </div>
      <div class="mock-divider"></div>
      <div class="mock-pill">${I('CalendarDays', { size: 11 })}<span data-ph="upcoming"></span></div>
      ${rowCard('ClipboardList', '', '')}
    </div>
    ${tabBar('vet')}
  `;

  // ---- reminders ----
  FRAMES['reminders.overview'] = () => `
    ${topbar('reminders')}
    <div class="mock-body">${emptyState('BellRing', '', '')}</div>
    ${fab()}
    ${tabBar('reminders')}
  `;
  FRAMES['reminders.creating'] = () => `
    ${topbar('reminders')}
    <div class="mock-body">
      <div class="mock-row-card"><div class="mock-row-card__icon">${I('Pill', { size: 19 })}</div><div class="mock-row-card__text"><div class="mock-row-card__title" data-ph="remType"></div></div></div>
      <div class="mock-row-card"><div class="mock-row-card__icon">${I('CalendarDays', { size: 19 })}</div><div class="mock-row-card__text"><div class="mock-row-card__title" data-ph="remFreq"></div></div></div>
      <div class="mock-divider"></div>
      <div style="align-self:flex-end;"><span class="chip" style="background:var(--blue);color:#fff;border:none;" data-ph="save"></span></div>
    </div>
    ${tabBar('reminders')}
  `;
  FRAMES['reminders.calendar'] = () => `
    ${topbar('reminders')}
    <div class="mock-body">
      <div class="mock-row-card glass-sheen" style="position:relative;flex-direction:column;align-items:stretch;gap:8px;">
        <div style="display:flex;justify-content:space-between;"><span class="caption" data-ph="calMonth"></span>${I('CalendarDays',{size:15})}</div>
        <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;">
          ${Array.from({length:21}).map((_,i)=>`<div style="aspect-ratio:1;border-radius:6px;background:${[4,9,15].includes(i)?'color-mix(in srgb, var(--amber) 25%, transparent)':'var(--glass-bg)'};"></div>`).join('')}
        </div>
      </div>
    </div>
    ${tabBar('reminders')}
  `;
  FRAMES['reminders.views'] = () => `
    ${topbar('reminders')}
    <div class="mock-body">
      ${rowCard('PawPrint', '', '')}
      ${rowCard('Pill', '', '')}
      ${rowCard('LayoutGrid', '', '')}
    </div>
    ${tabBar('reminders')}
  `;
  FRAMES['reminders.managing'] = () => `
    ${topbar('reminders')}
    <div class="mock-body">
      <div style="position:relative;overflow:hidden;border-radius:16px;">
        ${rowCard('Pill', '', '')}
        <div style="position:absolute;top:0;right:0;bottom:0;width:64px;background:var(--rose);display:flex;align-items:center;justify-content:center;color:#fff;border-radius:0 16px 16px 0;">${I('X',{size:18})}</div>
      </div>
      ${rowCard('Syringe', '', '')}
    </div>
    ${tabBar('reminders')}
  `;
  FRAMES['reminders.farewell'] = () => `
    ${topbar('reminders')}
    <div class="mock-body">
      <div style="opacity:0.5;">${rowCard('HeartHandshake', '', '')}</div>
      <div class="mock-divider"></div>
      <div class="mock-pill" style="background:color-mix(in srgb, var(--ink-faint) 15%, transparent);color:var(--ink-faint);" data-ph="paused"></div>
    </div>
    ${tabBar('reminders')}
  `;

  // ---- health topics ----
  FRAMES['health.prescriptions.overview'] = () => `
    ${topbar('health')}
    <div class="mock-body">
      <div class="mock-pill">${I('Sparkles',{size:11})}<span data-ph="premiumOnly"></span></div>
      ${rowCard('Pill', '', '')}
    </div>
    ${tabBar('health')}
  `;
  FRAMES['health.prescriptions.visit_info'] = () => `
    ${topbar('health')}
    <div class="mock-body">
      ${rowCard('Stethoscope', '', '')}
      ${rowCard('CalendarDays', '', '')}
    </div>
    ${tabBar('health')}
  `;
  FRAMES['health.prescriptions.status_cards'] = () => `
    ${topbar('health')}
    <div class="mock-body">
      <div class="mock-row-card" style="flex-direction:column;align-items:stretch;gap:8px;">
        <div style="display:flex;justify-content:space-between;align-items:center;"><span class="mock-row-card__title" data-ph="diagnosis"></span>${I('X',{size:14})}</div>
        <div style="display:flex;gap:6px;">${['Pill','Syringe','Leaf'].map(i=>`<div class="mock-cat-tile" style="padding:8px;">${I(i,{size:16})}</div>`).join('')}</div>
      </div>
      <div class="chip" style="align-self:flex-start;" data-ph="addAnother"></div>
    </div>
    ${tabBar('health')}
  `;
  FRAMES['health.prescriptions.saving'] = () => `
    ${topbar('health')}
    <div class="mock-body">
      <div class="mock-row-card" style="border-color:color-mix(in srgb, var(--success) 30%, var(--glass-border));">
        <div class="mock-row-card__icon" style="background:color-mix(in srgb, var(--success) 15%, transparent);color:var(--success);">${I('Check',{size:19})}</div>
        <div class="mock-row-card__text"><div class="mock-row-card__title" data-ph="autoCreated"></div></div>
      </div>
      ${rowCard('BellRing', '', '')}
      ${rowCard('Pill', '', '')}
    </div>
    ${tabBar('health')}
  `;

  FRAMES['health.pdf.overview'] = () => `
    ${topbar('health')}
    <div class="mock-body">
      ${['FileText','FileText','FileText','FileText'].map((icon,i)=>`
        <div class="mock-row-card"><div class="mock-row-card__icon">${I(icon,{size:19})}</div><div class="mock-row-card__text"><div class="mock-row-card__title" data-ph="pdfType${i}"></div></div></div>
      `).join('')}
    </div>
    ${tabBar('health')}
  `;
  FRAMES['health.pdf.health_report'] = () => `
    ${topbar('health')}
    <div class="mock-body">
      ${catGrid()}
      <div class="mock-divider"></div>
      <div class="chip" style="align-self:flex-end;background:var(--blue);color:#fff;border:none;" data-ph="createShare"></div>
    </div>
    ${tabBar('health')}
  `;
  FRAMES['health.pdf.lost_pet'] = () => `
    ${topbar('health')}
    <div class="mock-body">
      <div style="border:2px solid var(--rose);border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:8px;align-items:center;">
        <div style="width:48px;height:48px;border-radius:10px;background:var(--glass-bg);display:flex;align-items:center;justify-content:center;">${I('PawPrint',{size:22})}</div>
        <span class="caption" style="color:var(--rose);" data-ph="lostPetTitle"></span>
      </div>
    </div>
    ${tabBar('health')}
  `;
  FRAMES['health.pdf.farewell_report'] = () => `
    ${topbar('health')}
    <div class="mock-body">
      <div style="border-radius:12px;padding:14px;background:var(--glass-bg);border:1px solid var(--glass-border);display:flex;flex-direction:column;gap:6px;align-items:center;text-align:center;">
        ${I('HeartHandshake',{size:26})}
        <span class="caption" data-ph="farewellReportTitle"></span>
      </div>
    </div>
    ${tabBar('health')}
  `;
  FRAMES['health.pdf.category_report'] = () => `
    ${topbar('health')}
    <div class="mock-body">
      ${rowCard('PawPrint', '', '')}
      ${rowCard('PawPrint', '', '')}
      <div class="mock-divider"></div>
      ${catGrid()}
    </div>
    ${tabBar('health')}
  `;

  FRAMES['health.bulk.overview'] = () => `
    ${topbar('health')}
    <div class="mock-body">
      <div class="mock-pill">${I('Sparkles',{size:11})}<span data-ph="premiumOnly"></span></div>
      ${rowCard('Users', '', '')}
    </div>
    ${tabBar('health')}
  `;
  FRAMES['health.bulk.screen'] = () => `
    ${topbar('health')}
    <div class="mock-body">${catGrid()}</div>
    ${tabBar('health')}
  `;
  FRAMES['health.bulk.creating'] = () => `
    ${topbar('health')}
    <div class="mock-body">
      ${rowCard('CalendarDays', '', '')}
      <div style="display:flex;gap:8px;">
        ${[1,2,3].map(()=>`<div style="flex:1;aspect-ratio:1;border-radius:12px;background:var(--glass-bg);border:1px solid var(--glass-border);display:flex;align-items:center;justify-content:center;">${I('PawPrint',{size:18})}</div>`).join('')}
      </div>
    </div>
    ${tabBar('health')}
  `;
  FRAMES['health.bulk.notes'] = () => `
    ${topbar('health')}
    <div class="mock-body">
      ${rowCard('Info', '', '')}
      ${rowCard('DollarSign', '', '')}
    </div>
    ${tabBar('health')}
  `;
  FRAMES['health.bulk.shares'] = () => `
    ${topbar('health')}
    <div class="mock-body">
      ${['A','B','C'].map(()=>`<div class="mock-row-card"><div class="mock-row-card__icon">${I('PawPrint',{size:19})}</div><div class="mock-row-card__text" style="display:flex;justify-content:space-between;align-items:center;"><span class="mock-row-card__title">&nbsp;</span><span class="chip" style="padding:4px 10px;">33%</span></div></div>`).join('')}
    </div>
    ${tabBar('health')}
  `;
  FRAMES['health.bulk.manage'] = () => `
    ${topbar('health')}
    <div class="mock-body">
      <div style="position:relative;overflow:hidden;border-radius:16px;">
        ${rowCard('Users', '', '')}
        <div style="position:absolute;top:0;right:0;bottom:0;width:64px;background:var(--rose);display:flex;align-items:center;justify-content:center;color:#fff;">${I('X',{size:18})}</div>
      </div>
    </div>
    ${tabBar('health')}
  `;
  FRAMES['health.bulk.farewell'] = () => `
    ${topbar('health')}
    <div class="mock-body">
      <div style="opacity:0.55;">${rowCard('Users', '', '')}</div>
      <div class="mock-pill" style="background:color-mix(in srgb, var(--ink-faint) 15%, transparent);color:var(--ink-faint);" data-ph="readOnly"></div>
    </div>
    ${tabBar('health')}
  `;

  // ---- settings topics ----
  FRAMES['settings.backup.overview'] = () => `
    ${topbar('settings')}
    <div class="mock-body">
      ${rowCard('ShieldCheck', '', '')}
      <div class="mock-grid-2">
        ${['PawPrint','ClipboardList','BellRing','Pill'].map(i=>`<div class="mock-cat-tile">${I(i,{size:18})}<span>&nbsp;</span></div>`).join('')}
      </div>
    </div>
    ${tabBar('settings')}
  `;
  FRAMES['settings.backup.auto_backup'] = () => `
    ${topbar('settings')}
    <div class="mock-body">
      ${rowCard('ShieldCheck', '', '')}
      ${['1','2','3'].map(()=>`<div class="mock-row-card" style="padding:10px 16px;"><div class="mock-row-card__icon" style="width:30px;height:30px;">${I('CalendarDays',{size:14})}</div><div class="mock-row-card__text"><div class="mock-row-card__sub" style="margin:0;">&nbsp;</div></div></div>`).join('')}
    </div>
    ${tabBar('settings')}
  `;
  FRAMES['settings.backup.external_copy'] = () => `
    ${topbar('settings')}
    <div class="mock-body">
      ${rowCard('ShoppingBag', '', '')}
      ${rowCard('Users', '', '')}
    </div>
    ${tabBar('settings')}
  `;
  FRAMES['settings.backup.manual_backup'] = () => `
    ${topbar('settings')}
    <div class="mock-body">
      <div class="mock-row-card" style="border-color:color-mix(in srgb, var(--blue) 30%, var(--glass-border));">
        <div class="mock-row-card__icon">${I('ShieldCheck',{size:19})}</div>
        <div class="mock-row-card__text"><div class="mock-row-card__title" data-ph="backupNow"></div></div>
      </div>
      <div class="chip" style="align-self:center;" data-ph="encrypt"></div>
    </div>
    ${tabBar('settings')}
  `;
  FRAMES['settings.backup.restore'] = () => `
    ${topbar('settings')}
    <div class="mock-body">
      ${rowCard('FileText', '', '')}
      <div class="chip" style="align-self:center;background:var(--blue);color:#fff;border:none;" data-ph="restoreBtn"></div>
    </div>
    ${tabBar('settings')}
  `;
  FRAMES['settings.backup.warning'] = () => `
    ${topbar('settings')}
    <div class="mock-body">
      <div class="mock-row-card" style="border-color:color-mix(in srgb, var(--amber) 35%, var(--glass-border));background:color-mix(in srgb, var(--amber) 8%, var(--glass-bg));">
        <div class="mock-row-card__icon" style="background:color-mix(in srgb, var(--amber) 18%, transparent);color:var(--amber);">${I('Info',{size:19})}</div>
        <div class="mock-row-card__text"><div class="mock-row-card__title" data-ph="warningTitle"></div></div>
      </div>
    </div>
    ${tabBar('settings')}
  `;

  FRAMES['settings.premium.overview'] = () => `
    ${topbar('settings')}
    <div class="mock-body">
      <div style="display:flex;gap:10px;">
        <div class="mock-row-card" style="flex-direction:column;align-items:flex-start;flex:1;">
          <span class="caption" data-ph="free"></span>
        </div>
        <div class="mock-row-card glass-sheen" style="position:relative;flex-direction:column;align-items:flex-start;flex:1;border-color:color-mix(in srgb, var(--amber) 40%, var(--glass-border));">
          <div class="mock-pill" style="background:color-mix(in srgb, var(--amber) 18%, transparent);color:var(--amber);">${I('Sparkles',{size:10})}<span data-ph="bestChoice"></span></div>
        </div>
      </div>
    </div>
    ${tabBar('settings')}
  `;
  FRAMES['settings.premium.free_plan'] = () => `
    ${topbar('settings')}
    <div class="mock-body">
      ${rowCard('PawPrint', '', '')}
      ${rowCard('HeartPulse', '', '')}
      ${rowCard('BellRing', '', '')}
    </div>
    ${tabBar('settings')}
  `;
  FRAMES['settings.premium.premium_plan'] = () => `
    ${topbar('settings')}
    <div class="mock-body">
      <div class="mock-pill" style="background:color-mix(in srgb, var(--amber) 18%, transparent);color:var(--amber);">${I('Sparkles',{size:11})}<span data-ph="premium"></span></div>
      ${rowCard('Users', '', '')}
      ${rowCard('FileText', '', '')}
      ${rowCard('ShieldCheck', '', '')}
    </div>
    ${tabBar('settings')}
  `;
  FRAMES['settings.premium.purchase'] = () => `
    ${topbar('settings')}
    <div class="mock-body">
      <div class="chip" style="align-self:center;background:linear-gradient(180deg,var(--amber),#e08600);color:#fff;border:none;padding:10px 22px;" data-ph="buyNow"></div>
      <span class="caption" style="text-align:center;" data-ph="restorePurchase"></span>
    </div>
    ${tabBar('settings')}
  `;

  global.PLMockFrames = FRAMES;
})(window);
