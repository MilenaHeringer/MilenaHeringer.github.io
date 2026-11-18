// Line icons drawn for this site (24×24 grid, stroke = currentColor).
// Elements with class "g" use the gold accent colour.
const P = {
  tooth: '<path d="M7 3C4.6 3 3 5 3 7.8c0 2.7 1.5 4.2 2 6.7.6 3 1 6.5 2.8 6.5 1.8 0 1.8-5 4.2-5s2.4 5 4.2 5c1.8 0 2.2-3.5 2.8-6.5.5-2.5 2-4 2-6.7C21 5 19.4 3 17 3c-2 0-3 1.2-5 1.2S9 3 7 3Z"/><path class="g" d="M6.3 9.4c-.1-1.6.7-2.7 2.1-3.1"/>',
  pad: '<path d="M7.5 7h9c3 0 4.8 2.2 5.3 5.5l.6 3.8c.3 2-1 3.3-2.5 3.3-1.2 0-2-.8-2.7-1.8L16 16H8l-1.2 1.8c-.7 1-1.5 1.8-2.7 1.8-1.5 0-2.8-1.3-2.5-3.3l.6-3.8C2.7 9.2 4.5 7 7.5 7Z"/><path d="M6.6 10.6v3.8M4.7 12.5h3.8"/><circle class="g gf" cx="16.2" cy="11.3" r="1.05"/><circle class="g gf" cx="18.3" cy="13.5" r="1.05"/>',
  whisk: '<g transform="rotate(-24 12 12)"><path d="M12 14.6c-5.4-3.2-5.6-9.4 0-12.4 5.6 3 5.4 9.2 0 12.4Z"/><path d="M12 14.6c-2.8-3.3-2.9-9 0-12.4M12 14.6c2.8-3.3 2.9-9 0-12.4M12 14.6V2.2"/><path d="M12 15.6v5.8" stroke-width="2.6"/><path class="g" d="M10.5 15.1h3"/></g>',
  notes: '<path d="M9 17.6V6l11-2.4v11.8"/><path class="g" d="M9 9.3l11-2.4" stroke-width="1.8"/><ellipse class="gfw" cx="6.9" cy="17.6" rx="2.45" ry="1.85" transform="rotate(-21 6.9 17.6)"/><ellipse class="gfw" cx="17.9" cy="15.4" rx="2.45" ry="1.85" transform="rotate(-21 17.9 15.4)"/>',
  piano: '<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M7.25 19v-5M12 19v-5M16.75 19v-5"/><path class="gfw" d="M5.6 5h2.2v9H5.6zM10.4 5h2.2v9h-2.2zM15.2 5h2.2v9h-2.2z" stroke="none"/>',
  guitar: '<path d="M14.5 9.5l5-5M18 2.8l3.2 3.2"/><path d="M11.9 9.6c-1.2-1.2-3.4-1-4.4.4-.6.8-.6 1.7-1.6 2.1-1.4.5-2.9.9-3.5 2.5-.8 2.1.5 4.5 2.4 5.2 1.6.6 3.4-.1 4.3-1.4.6-.9.8-2 1.6-2.6.9-.6 2-.6 2.6-1.6.7-1.3.2-3.1-1.4-4.6Z"/><circle class="g" cx="8.8" cy="15.2" r="1.6"/><path d="M12.3 11.7l2.2-2.2"/>',
  book: '<path d="M4 5.5C4 4.7 4.7 4 5.5 4H11c.6 0 1 .4 1 1v15c0-.6-.4-1-1-1H4V5.5ZM20 5.5c0-.8-.7-1.5-1.5-1.5H13c-.6 0-1 .4-1 1v15c0-.6.4-1 1-1h7V5.5Z"/><path class="g" d="M6.5 8h3M6.5 11h3M14.5 8h3"/>',
  hat: '<path d="M7 18h10v-3.2c1.8-.5 3-2 3-3.9a4 4 0 0 0-5.1-3.9A3.9 3.9 0 0 0 12 5.5 3.9 3.9 0 0 0 9.1 7 4 4 0 0 0 4 10.9c0 1.9 1.2 3.4 3 3.9V18Z"/><path class="g" d="M7 20.5h10"/>',
  laptop: '<rect x="4" y="5" width="16" height="10.5" rx="1.5"/><path d="M2.5 18.5h19"/><path class="g" d="M9.5 9l-2 1.6 2 1.6M14.5 9l2 1.6-2 1.6"/>',
  cap: '<path d="M2.5 9.5L12 5l9.5 4.5L12 14 2.5 9.5Z"/><path d="M6.5 11.5v4c1.4 1.4 3.4 2.1 5.5 2.1s4.1-.7 5.5-2.1v-4"/><path class="g" d="M21.5 9.5v5.5"/>',
  building: '<path d="M3 20.5h18M5 20.5V10M19 20.5V10M3.5 10h17L12 4.5 3.5 10Z"/><path d="M9 20.5v-6M15 20.5v-6M12 20.5v-6"/><circle class="g gf" cx="12" cy="7.8" r=".9"/>',
  handshake: '<path d="M2.5 12.5l3-3 4 1.5 3-2.5h3l6 4.5"/><path d="M5.5 9.5L3 15l4 3.5 2-1.2 2 1.4 2-1.2 2 1 2.6-2.7"/><path class="g" d="M9.2 13.4l2 1.6M11.6 12.4l2.4 1.8"/>',
  star: '<path d="M12 3.5l2.5 5.3 5.8.7-4.3 4 1.1 5.7L12 16.4l-5.1 2.8L8 13.5l-4.3-4 5.8-.7L12 3.5Z"/>',
  scalpel: '<path d="M3.5 20.5L13 11"/><path d="M13 11l2-2c2.4-2.4 4.6-3.7 6-3.5.2 1.4-1.1 3.6-3.5 6l-2 2L13 11Z"/><path class="g" d="M6 15.5l2.5 2.5"/>',
  microscope: '<path d="M9 3.5l4 2-3 6-4-2z"/><path d="M11.5 8.5l3 1.5"/><path d="M6 20.5h12M8 17.5h6a5 5 0 0 0 1-9.6"/><path class="g" d="M10 13.5l1.5 4"/>',
  flask: '<path d="M9.5 3.5h5M10.5 3.5v5L5 18.5a1.5 1.5 0 0 0 1.3 2.2h11.4a1.5 1.5 0 0 0 1.3-2.2L13.5 8.5v-5"/><path class="g" d="M7.5 14.5h9"/>',
  microbe: '<circle cx="12" cy="12" r="5.5"/><path d="M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3M6 6l2.1 2.1M15.9 15.9L18 18M6 18l2.1-2.1M15.9 8.1L18 6"/><circle class="g gf" cx="10.5" cy="11" r="1"/><circle class="g gf" cx="13.5" cy="13.5" r=".8"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
  download: '<path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 19.5h14"/>',
  read: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle class="g" cx="12" cy="12" r="2.8"/>',
  external: '<path d="M14 4.5h5.5V10M19.5 4.5L11 13M17 14.5v4a1 1 0 0 1-1 1H5.5a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h4"/>',
  play: '<path d="M8 5.5v13l10.5-6.5L8 5.5Z"/>',
  sound: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path class="g" d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a7.8 7.8 0 0 1 0 11"/>',
  muted: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path class="g" d="M16 9.5l5 5M21 9.5l-5 5"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  heart: '<path d="M12 20s-7.5-4.4-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.6-7.5 10-7.5 10Z"/>',
  arrow: '<path d="M5 12h14M13.5 6.5L19 12l-5.5 5.5"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/><circle class="g gf" cx="12" cy="14.5" r="1.2"/>',
  file: '<path d="M6 3.5h8l4 4v13H6z"/><path d="M14 3.5v4h4"/><path class="g" d="M9 12h6M9 15.5h6"/>',
  // social networks (brand glyphs drawn as line icons)
  instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".9" fill="currentColor" stroke="none"/>',
  youtube: '<path d="M21 8.2c-.2-1.6-1.4-2.7-3-2.9C15.9 5 14 5 12 5s-3.9 0-6 .3c-1.6.2-2.8 1.3-3 2.9C2.8 9.4 2.8 10.7 2.8 12s0 2.6.2 3.8c.2 1.6 1.4 2.7 3 2.9 2.1.3 4 .3 6 .3s3.9 0 6-.3c1.6-.2 2.8-1.3 3-2.9.2-1.2.2-2.5.2-3.8s0-2.6-.2-3.8Z"/><path d="M10 9.2v5.6l4.8-2.8L10 9.2Z" fill="currentColor"/>',
  tiktok: '<path d="M14 3.5v11.2a3.8 3.8 0 1 1-3.8-3.8"/><path d="M14 3.5c.4 2.7 2.3 4.6 5 4.9"/>',
  spotify: '<circle cx="12" cy="12" r="9"/><path d="M7.2 9.4c3.4-1 7-.7 9.9.9M7.8 12.6c2.8-.8 5.6-.5 8 .8M8.4 15.6c2.1-.5 4.2-.3 6 .6"/>',
  whatsapp: '<path d="M4 20l1.2-3.9A8.5 8.5 0 1 1 8.1 19L4 20Z"/><path d="M9 8.6c0 3.5 2.9 6.4 6.4 6.4l.9-1.7-2-1-1 .9c-1-.5-1.9-1.4-2.4-2.4l.9-1-1-2L9 8.6Z" fill="currentColor" stroke-width="1"/>',
  linkedin: '<rect x="3.5" y="3.5" width="17" height="17" rx="2.5"/><path d="M8 10.5V16.5M8 7.6v.1M11.5 16.5v-6M11.5 13c0-1.6 1.1-2.6 2.5-2.6s2.3 1 2.3 2.6v3.5"/>',
  email: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'
};

export function icon(name, cls = '') {
  const body = P[name] || P.link;
  return `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${body}</svg>`;
}
export const ICON_NAMES = Object.keys(P);
export const NETWORKS = {
  instagram: 'Instagram', youtube: 'YouTube', tiktok: 'TikTok', spotify: 'Spotify',
  whatsapp: 'WhatsApp', linkedin: 'LinkedIn', email: 'E-mail', link: 'Outro link'
};
// icon per study category
export const CATEGORY_ICON = {
  'Anatomia': 'scalpel', 'Histologia e Embriologia': 'microscope', 'Bioquímica': 'flask',
  'Fisiologia': 'heart', 'Microbiologia': 'microbe', 'Anatomia Dental': 'tooth',
  'Materiais Odontológicos': 'tooth', 'Outras disciplinas': 'book'
};
