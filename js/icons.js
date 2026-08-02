/**
 * PetLucid — Minimal Lucide-compatible icon set.
 * Ağır kütüphane bağımlılığından kaçınmak için sadece kullanılan ikonlar
 * inline SVG path verisi olarak tanımlanmıştır (stroke-width 1.75, Lucide diliyle uyumlu).
 * Kullanım: Icon('Home', {size:24, class:'x'})
 */
(function (global) {
  const PATHS = {
    Home: '<path d="M3 9.5 12 3l9 6.5"/><path d="M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10"/>',
    PawPrint: '<circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M9 10a5 5 0 0 0-5 5v3.5a2.5 2.5 0 0 0 4.5 1.5c1-1 2-1.5 3.5-1.5s2.5.5 3.5 1.5A2.5 2.5 0 0 0 20 18.5V17a5 5 0 0 0-5-5"/><circle cx="4" cy="12" r="2"/>',
    Stethoscope: '<path d="M4.8 2.3A.3.3 0 1 0 5 2.3a.3.3 0 0 0-.2 0Z"/><path d="M8 3v3a4 4 0 0 0 8 0V3"/><path d="M12 10v5a5 5 0 0 0 10 0v-1.5"/><circle cx="20" cy="10" r="2"/>',
    HeartPulse: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.7 0-3.2.9-4.5 2.5C10.7 3.9 9.2 3 7.5 3A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/><path d="M3.5 10h2.5l2-3 3 6 1.5-3H15"/>',
    BellRing: '<path d="M6 8a6 6 0 0 1 12 0c0 4.5 1.5 6 1.5 6H4.5S6 12.5 6 8Z"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><path d="M4 4 2 6"/><path d="M20 4l2 2"/>',
    Settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.65 1.65 0 0 0-1.8-.3 1.65 1.65 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.65 1.65 0 0 0-1-1.5 1.65 1.65 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.65 1.65 0 0 0 .3-1.8 1.65 1.65 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.65 1.65 0 0 0 1.5-1 1.65 1.65 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.65 1.65 0 0 0 1.8.3H9a1.65 1.65 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.65 1.65 0 0 0 1 1.5 1.65 1.65 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.65 1.65 0 0 0-.3 1.8V9a1.65 1.65 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.65 1.65 0 0 0-1.5 1Z"/>',
    PlusCircle: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
    CalendarCheck: '<rect x="3" y="4.5" width="18" height="16" rx="3"/><path d="M8 2.5v4M16 2.5v4M3 9.5h18"/><path d="m9 15 2 2 4-4"/>',
    CalendarDays: '<rect x="3" y="4.5" width="18" height="16" rx="3"/><path d="M8 2.5v4M16 2.5v4M3 9.5h18"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01"/>',
    IdCard: '<rect x="2.5" y="5" width="19" height="14" rx="3"/><circle cx="9" cy="11.5" r="2"/><path d="M6.5 16c.6-1.4 1.6-2 2.5-2s1.9.6 2.5 2M15 9.5h4M15 13h4"/>',
    PencilLine: '<path d="M13 6.5 17.5 11 7 21.5H2.5V17Z"/><path d="m16 3.5 4.5 4.5"/><path d="M3 21.5h18"/>',
    HeartHandshake: '<path d="M12 5.5c-1.3-1.5-2.8-2.5-4.5-2.5A5 5 0 0 0 2.5 8c0 2 1.3 3.6 2.6 5L12 20l3-3"/><path d="m11 12 1.5 1.5a2 2 0 0 0 2.9 0l4-4a2 2 0 0 0-2.9-2.9L15 8.1"/><path d="m8.5 9.5 2 2"/>',
    UserPlus: '<circle cx="9" cy="8" r="4"/><path d="M2.5 20.5c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5"/><path d="M19 8v6M22 11h-6"/>',
    ClipboardList: '<rect x="5" y="4" width="14" height="17" rx="2.5"/><path d="M9 2.5h6a1 1 0 0 1 1 1V5H8V3.5a1 1 0 0 1 1-1Z"/><path d="M8.5 11h7M8.5 14.5h7M8.5 18h4.5"/>',
    Inbox: '<path d="M3.5 12.5h5l1.7 3h3.6l1.7-3h5"/><path d="M6 5h12l3.5 7.5V18a1.5 1.5 0 0 1-1.5 1.5h-16A1.5 1.5 0 0 1 2.5 18v-5.5Z"/>',
    LayoutGrid: '<rect x="3" y="3" width="8" height="8" rx="1.8"/><rect x="13" y="3" width="8" height="8" rx="1.8"/><rect x="3" y="13" width="8" height="8" rx="1.8"/><rect x="13" y="13" width="8" height="8" rx="1.8"/>',
    SlidersHorizontal: '<path d="M4 6h9M17 6h3M4 12h3M9 12h11M4 18h13M19 18h1"/><circle cx="14" cy="6" r="2"/><circle cx="7" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
    Pill: '<path d="m10.5 20.5-7-7a5 5 0 0 1 7-7l7 7a5 5 0 0 1-7 7Z"/><path d="M8.5 8.5 15.5 15.5"/>',
    FileText: '<path d="M14 2.5H7a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5Z"/><path d="M14 2.5V8.5H20"/><path d="M8.5 13h7M8.5 17h5"/>',
    Users: '<circle cx="9" cy="8" r="4"/><path d="M2 20.5c0-3.6 3.1-6.5 7-6.5s7 2.9 7 6.5"/><path d="M17 4.2a4 4 0 0 1 0 7.6M22 20.5c0-3-2-5.5-4.7-6.3"/>',
    ShieldCheck: '<path d="M12 2.5 4.5 5.5v6c0 5 3.2 8.5 7.5 10 4.3-1.5 7.5-5 7.5-10v-6Z"/><path d="m9 12 2 2 4-4.5"/>',
    Sparkles: '<path d="M12 3v3M12 18v3M4.2 6.2l2 2M17.8 15.8l2 2M3 12h3M18 12h3M4.2 17.8l2-2M17.8 8.2l2-2"/><path d="M12 8a4 4 0 0 0 4 4 4 4 0 0 0-4 4 4 4 0 0 0-4-4 4 4 0 0 0 4-4Z" fill="currentColor" stroke="none"/>',
    ChevronRight: '<path d="m9 6 6 6-6 6"/>',
    ChevronLeft: '<path d="m15 6-6 6 6 6"/>',
    ChevronDown: '<path d="m6 9 6 6 6-6"/>',
    ArrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    Search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    Moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
    Sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4"/>',
    Globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    Salad: '<path d="M7 21h10M12 21a7 7 0 0 0 7-7H5a7 7 0 0 0 7 7Z"/><path d="M9.5 14 8 6.5M14.5 14 16 6.5M12 14V5"/><path d="M6.5 9c-1.5-1-2-3 0-4.5"/><path d="M17.5 9c1.5-1 2-3 0-4.5"/>',
    Scissors: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.5 8.5 20 20M20 4 8.5 15.5"/>',
    Weight: '<circle cx="12" cy="6" r="3.5"/><path d="M8 9.5H4.8a2 2 0 0 0-2 1.7l-1.3 8A2 2 0 0 0 3.5 21.5h17a2 2 0 0 0 2-2.3l-1.3-8a2 2 0 0 0-2-1.7H16"/>',
    Ruler: '<path d="m21.3 15.4-6.7 6.7a1 1 0 0 1-1.4 0L2.6 11.5a1 1 0 0 1 0-1.4l6.7-6.7a1 1 0 0 1 1.4 0l10.6 10.6a1 1 0 0 1 0 1.4Z"/><path d="m14.5 8.5 2 2M11 12l2 2M7.5 15.5l2 2"/>',
    Footprints: '<path d="M4 16v-2.4a2.5 2.5 0 0 1 5 0V16a2.5 2.5 0 0 1-5 0Z"/><path d="M15 21v-2.4a2.5 2.5 0 0 1 5 0V21a2.5 2.5 0 0 1-5 0Z"/><path d="M6.5 10.5c1-1 1-2.5 0-4M17.5 15.5c1-1 1-2.5 0-4"/>',
    DollarSign: '<path d="M12 1.5v21M17 5.8c0-2-2.2-3.3-5-3.3S7 3.8 7 5.8s2 2.7 5 3.4 5 1.6 5 3.6-2.2 3.4-5 3.4-5-1.4-5-3.4"/>',
    Syringe: '<path d="m18 2 4 4M11 7l6 6M4 20l3.5-1L18 8.5 15.5 6 5 16.5 4 20Z"/><path d="m9.5 8.5 2 2M6.5 11.5l2 2"/>',
    ScanLine: '<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M3 12h18"/>',
    Leaf: '<path d="M11 20A7 7 0 0 1 4 13c0-5.5 4.5-10 11-11 1 6.5-3.5 11-9 11"/><path d="M4 20c5-1 9-3 12-8"/>',
    FlaskConical: '<path d="M9 2.5h6M10 2.5V9L4.5 18a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 9V2.5"/><path d="M7 15h10"/>',
    ShoppingBag: '<path d="M6.5 8h11l1 12.5a1.5 1.5 0 0 1-1.5 1.5h-10a1.5 1.5 0 0 1-1.5-1.5Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    Shield: '<path d="M12 2.5 4.5 5.5v6c0 5 3.2 8.5 7.5 10 4.3-1.5 7.5-5 7.5-10v-6Z"/>',
    Plane: '<path d="M17.8 19.2 16 21l-4-6-5 2-1.5-1.5 3.6-3-6-2 2-2 8 1.5L20 3l1.8 1.8-9.5 8.7L17.8 19.2Z"/>',
    X: '<path d="M18 6 6 18M6 6l12 12"/>',
    Check: '<path d="M20 6 9 17l-5-5"/>',
    Info: '<circle cx="12" cy="12" r="9.5"/><path d="M12 11v6M12 7.5h.01"/>',
    Sparkle: '<path d="M12 3v3M12 18v3M4.2 6.2l2 2M17.8 15.8l2 2M3 12h3M18 12h3M4.2 17.8l2-2M17.8 8.2l2-2"/>',
  };

  function Icon(name, opts) {
    opts = opts || {};
    const size = opts.size || 24;
    const cls = opts.class ? ` class="${opts.class}"` : '';
    const strokeWidth = opts.strokeWidth || 1.75;
    const fillPaths = name === 'Sparkles';
    const p = PATHS[name];
    if (!p) return '';
    return `<svg${cls} width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  }

  global.PLIcon = Icon;
  global.PLIconNames = Object.keys(PATHS);
})(window);
