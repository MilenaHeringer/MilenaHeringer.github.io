import { loadContent, esc, safeUrl, youtubeId } from './store.js';
import { icon, NETWORKS, CATEGORY_ICON } from './icons.js';
import { mountDoll } from './doll.js';

document.documentElement.classList.add('js');
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const get = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
const paras = list => (list || []).map(p => `<p>${esc(p)}</p>`).join('');

export const CAT_COLORS = {
  'Anatomia': ['#722F45', '#3F1724'], 'Histologia e Embriologia': ['#8A4A5E', '#4E1E2F'],
  'Bioquímica': ['#A8843F', '#6E5223'], 'Fisiologia': ['#5C2337', '#2C1D23'],
  'Microbiologia': ['#7D5A66', '#3F2A32'], 'Anatomia Dental': ['#B9848F', '#7A4656'],
  'Materiais Odontológicos': ['#6B6157', '#3A332D'], 'Outras disciplinas': ['#4E1E2F', '#2C1D23']
};
const colorsFor = cat => CAT_COLORS[cat] || ['#722F45', '#3F1724'];

function fillIcons(root = document) {
  $$('[data-icon]', root).forEach(el => { if (!el.querySelector('svg')) el.insertAdjacentHTML('afterbegin', icon(el.dataset.icon)); });
}
function bindText(c) {
  $$('[data-bind]').forEach(el => { const v = get(c, el.dataset.bind); if (typeof v === 'string') el.textContent = v; });
}

// ───────────── hero ─────────────
function renderHero(c) {
  const ig = (c.socials || []).find(s => s.network === 'instagram' && safeUrl(s.url));
  const btn = $('#cta-instagram');
  if (ig) { btn.href = safeUrl(ig.url); btn.hidden = false; }
}

// ───────────── about ─────────────
function renderAbout(c) {
  const a = c.about || {};
  const img = $('#about-photo');
  img.alt = a.photoAlt || 'Foto da Milena Heringer';
  img.addEventListener('error', () => { if (!img.dataset.fallback) { img.dataset.fallback = '1'; img.src = 'assets/boneca-retrato.webp'; } }, { once: false });
  img.src = safeUrl(a.photo) || 'assets/boneca-retrato.webp';
  $('#about-text').innerHTML = paras(a.paragraphs);
  $('#about-tags').innerHTML = (a.tags || []).map((t, i) => `<li style="--rot:${[-2, 1.5, -1, 2, -1.5, 1][i % 6]}deg">${esc(t)}</li>`).join('');
}

// ───────────── journey ─────────────
function renderJourney(c) {
  const j = c.journey || {};
  const t = j.technical || {}, ap = j.approvals || {}, co = j.contest || {}, pa = j.partner || {};
  const items = ap.items || [];
  const partnerLink = safeUrl(pa.url);
  const logo = safeUrl(pa.logo);
  $('#timeline').innerHTML = `
    <article class="tl-card tl-tech reveal">
      <div class="tl-ic">${icon('laptop')}</div>
      <span class="tl-tag">${esc(t.tag)}</span>
      <h3>${esc(t.title)}</h3>
      <p>${esc(t.text)}</p>
    </article>
    <article class="tl-card tl-approvals reveal">
      <div class="tl-ic">${icon('cap')}</div>
      <span class="tl-tag">${esc(ap.tag)}</span>
      <div class="counter"><strong data-count="${items.length}">${items.length}</strong><span>${esc(ap.title)}</span></div>
      <div class="unis">${items.map(u => `
        <div class="uni"><b>${esc(u.short)}</b><small>${esc(u.name)}</small>${u.note ? `<em>${esc(u.note)}</em>` : ''}</div>`).join('')}
      </div>
    </article>
    <article class="tl-card tl-contest tl-feature reveal">
      ${co.badge ? `<span class="seal">${icon('star')}${esc(co.badge)}</span>` : ''}
      <div class="tl-ic">${icon('building')}</div>
      <span class="tl-tag">${esc(co.tag)}</span>
      <h3>${esc(co.title)}</h3>
      <p>${esc(co.text)}</p>
    </article>
    <article class="tl-card tl-partner reveal">
      <div class="partner">
        <div class="partner-logo">${logo ? `<img src="${esc(logo)}" alt="Logo ${esc(pa.name)}" loading="lazy">` : icon('handshake')}</div>
        <div class="partner-body">
          <span class="tl-tag">${esc(pa.tag)}${pa.role ? ` · <b class="role">${esc(pa.role)}</b>` : ''}</span>
          <h3>${esc(pa.name)}</h3>
          <p>${esc(pa.text)}</p>
        </div>
      </div>
      ${pa.coupon ? `<div class="coupon">
        <div class="coupon-main">
          <span class="coupon-label">Cupom de desconto</span>
          <strong class="coupon-code">${esc(pa.coupon)}</strong>
          ${pa.couponText ? `<small>${esc(pa.couponText)}</small>` : ''}
        </div>
        <button class="btn btn-wine btn-sm coupon-copy" type="button" data-copy="${esc(pa.coupon)}">${icon('file')}<span>Copiar cupom</span></button>
      </div>` : ''}
      ${partnerLink ? `<a class="btn btn-ghost btn-sm partner-link" href="${esc(partnerLink)}" target="_blank" rel="noopener">Conhecer a plataforma ${icon('external')}</a>` : ''}
    </article>`;
  $('#timeline').addEventListener('click', async e => {
    const b = e.target.closest('[data-copy]'); if (!b) return;
    const code = b.dataset.copy, label = b.querySelector('span');
    try { await navigator.clipboard.writeText(code); }
    catch { const t = Object.assign(document.createElement('textarea'), { value: code }); document.body.append(t); t.select(); document.execCommand('copy'); t.remove(); }
    label.textContent = 'Copiado! ♡'; b.classList.add('done');
    setTimeout(() => { label.textContent = 'Copiar cupom'; b.classList.remove('done'); }, 2200);
  });
}

// ───────────── future ─────────────
function renderFuture(c) {
  const f = c.future || {};
  $('#future-text').innerHTML = paras(f.paragraphs);
  const pdf = safeUrl(f.planPdf);
  const card = $('#plan-card');
  if (pdf) { card.href = pdf; card.hidden = false; }
  const steps = (f.steps || []).slice(0, 4);
  // milestones along a winding path, from the graduation to the dream
  const pts = [[92, 448], [196, 382], [306, 418], [410, 330]];
  const labels = steps.map((s, i) => {
    const [x, y] = pts[i]; const last = i === steps.length - 1;
    const lx = Math.min(Math.max(x - 70, 8), 352), ly = i % 2 ? y - 62 : y + 16;
    return `<g class="step" style="transition-delay:${.6 + i * .35}s">
      <circle cx="${x}" cy="${y}" r="${last ? 15 : 9}" fill="${last ? '#C5A15A' : '#fff'}" stroke="#722F45" stroke-width="2"/>
      ${last ? `<path d="M${x} ${y - 7}l2 4.3 4.6.6-3.4 3.2.9 4.6-4.1-2.3-4.1 2.3.9-4.6-3.4-3.2 4.6-.6z" fill="#fff"/>` : `<circle cx="${x}" cy="${y}" r="3" fill="#C5A15A"/>`}
      <foreignObject x="${lx}" y="${last ? y - 76 : ly}" width="140" height="58">
        <div xmlns="http://www.w3.org/1999/xhtml" class="step-label${last ? ' dream' : ''}">${esc(s)}</div>
      </foreignObject>
    </g>`;
  }).join('');
  $('#future-art').innerHTML = `
  <svg viewBox="0 0 500 520" role="img" aria-label="Caminho da graduação até a cirurgia bucomaxilofacial">
    <defs><radialGradient id="fg" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#F4E7E9"/></radialGradient></defs>
    <circle cx="250" cy="240" r="226" fill="url(#fg)"/>
    <circle class="draw" style="--len:1420" cx="250" cy="240" r="226" fill="none" stroke="#C5A15A" stroke-width="1.2"/>
    <!-- big line-art tooth -->
    <g fill="none" stroke="#722F45" stroke-width=".5" stroke-linecap="round" stroke-linejoin="round" transform="translate(148 52) scale(7.6)">
      <path class="draw" style="--len:80" fill="#fff" d="M7 3C4.6 3 3 5 3 7.8c0 2.7 1.5 4.2 2 6.7.6 3 1 6.5 2.8 6.5 1.8 0 1.8-5 4.2-5s2.4 5 4.2 5c1.8 0 2.2-3.5 2.8-6.5.5-2.5 2-4 2-6.7C21 5 19.4 3 17 3c-2 0-3 1.2-5 1.2S9 3 7 3Z"/>
      <path class="draw" style="--len:10" stroke="#C5A15A" d="M6.3 9.4c-.1-1.6.7-2.7 2.1-3.1"/>
    </g>
    <!-- scalpel -->
    <g class="step" style="transition-delay:1.2s"><g transform="translate(388 96) rotate(32)">
      <rect x="-7" y="0" width="14" height="118" rx="6" fill="#fff" stroke="#722F45" stroke-width="2"/>
      <path d="M-7 0c0-26 5-46 14-60 5 16 3 40-7 60z" fill="#F4EEE7" stroke="#722F45" stroke-width="2" stroke-linejoin="round"/>
      <path d="M-7 30h14M-7 40h14" stroke="#C5A15A" stroke-width="2"/>
    </g></g>
    <!-- sparkles -->
    <g class="step" style="transition-delay:1.5s" fill="#C5A15A">
      <path d="M118 120l3 8 8 3-8 3-3 8-3-8-8-3 8-3z"/><path d="M376 238l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>
    </g>
    <path class="path draw" style="--len:640" d="M92 448C130 420 160 382 196 382s70 36 110 36 70-50 104-88"/>
    ${labels}
  </svg>`;
}

// ───────────── hobbies ─────────────
let audioCtx = null;
function playNote(freq) {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const t = audioCtx.currentTime, o = audioCtx.createOscillator(), o2 = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = 'sine'; o.frequency.value = freq; o2.type = 'sine'; o2.frequency.value = freq * 2;
    const g2 = audioCtx.createGain(); g2.gain.value = 0.18;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.22, t + 0.006); g.gain.setTargetAtTime(0, t + 0.01, 0.5);
    o.connect(g); o2.connect(g2); g2.connect(g); g.connect(audioCtx.destination);
    o.start(t); o2.start(t); o.stop(t + 2.5); o2.stop(t + 2.5);
  } catch { /* audio not available */ }
}
function renderHobbies(c) {
  const variants = ['hobby--wine', '', 'hobby--cream', '', 'hobby--wine'];
  const grid = $('#hobbies-grid');
  grid.innerHTML = (c.hobbies || []).map((h, i) => {
    let fun = '';
    if (h.id === 'piano') {
      const notes = [['Dó', 261.63], ['Ré', 293.66], ['Mi', 329.63], ['Fá', 349.23], ['Sol', 392], ['Lá', 440], ['Si', 493.88], ['Dó', 523.25]];
      fun = `<div class="hobby-fun"><div class="keys" role="group" aria-label="Mini piano: toque as teclas">${notes.map(([n, f]) => `<button class="key" data-f="${f}" aria-label="Nota ${n}"><span>${n}</span></button>`).join('')}</div><span class="hint">toca aí ♪</span></div>`;
    }
    if (h.id === 'games') fun = `<div class="hobby-fun tooth-game" data-game></div>`;
    const v = variants[i % variants.length];
    return `<article class="hobby ${v} reveal" data-hobby="${esc(h.id)}">
      <div class="hobby-ic">${icon(h.icon || 'heart')}</div>
      <h3>${esc(h.title)}</h3>
      <p>${esc(h.text)}</p>${fun}
    </article>`;
  }).join('');
  // mini piano
  grid.addEventListener('pointerdown', e => {
    const k = e.target.closest('.key'); if (!k) return;
    playNote(+k.dataset.f); k.classList.add('on'); setTimeout(() => k.classList.remove('on'), 160);
  });
  grid.addEventListener('keydown', e => {
    const k = e.target.closest('.key'); if (!k || (e.key !== 'Enter' && e.key !== ' ')) return;
    e.preventDefault(); playNote(+k.dataset.f); k.classList.add('on'); setTimeout(() => k.classList.remove('on'), 160);
  });
  const game = $('[data-game]', grid);
  if (game) mountToothGame(game);
}

// ───────────── mini game: brush the little tooth ─────────────
function mountToothGame(root) {
  const SPOTS = [[128, 54], [160, 44], [193, 56], [122, 92], [199, 94], [146, 76], [178, 112], [138, 124], [186, 128]];
  root.innerHTML = `
    <svg class="tg-svg" viewBox="0 0 320 210" role="img" aria-label="Dentinho para escovar. Arraste a escova sobre o dente.">
      <ellipse cx="160" cy="176" rx="70" ry="9" fill="#722F45" opacity=".08"/>
      <g class="tg-sparkles" fill="#C5A15A">
        <path d="M92 40l3 8 8 3-8 3-3 8-3-8-8-3 8-3z"/><path d="M232 30l2.4 6 6 2.4-6 2.4-2.4 6-2.4-6-6-2.4 6-2.4z"/><path d="M236 118l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/><path d="M84 112l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>
      </g>
      <g class="tg-tooth">
        <path transform="translate(88 14) scale(6)" d="M7 3C4.6 3 3 5 3 7.8c0 2.7 1.5 4.2 2 6.7.6 3 1 6.5 2.8 6.5 1.8 0 1.8-5 4.2-5s2.4 5 4.2 5c1.8 0 2.2-3.5 2.8-6.5.5-2.5 2-4 2-6.7C21 5 19.4 3 17 3c-2 0-3 1.2-5 1.2S9 3 7 3Z" fill="#fff" stroke="#722F45" stroke-width=".38" stroke-linejoin="round"/>
        <path transform="translate(88 14) scale(6)" d="M6.3 9.4c-.1-1.6.7-2.7 2.1-3.1" fill="none" stroke="#C5A15A" stroke-width=".38" stroke-linecap="round"/>
        <g class="tg-dirt">${SPOTS.map(([x, y], i) => `<g data-spot="${i}">
          <ellipse cx="${x}" cy="${y}" rx="${7 + (i % 3) * 2}" ry="${5 + (i % 2) * 2}" fill="${i % 3 ? '#A08560' : '#B4A66E'}"/>
          <circle cx="${x + 5}" cy="${y - 4}" r="2.6" fill="#8C6F4E"/><circle cx="${x - 6}" cy="${y + 3}" r="1.8" fill="#8C6F4E"/></g>`).join('')}</g>
        <g class="tg-face sad" fill="none" stroke="#3A1622" stroke-width="2.6" stroke-linecap="round">
          <path d="M134 70l11 4M186 70l-11 4"/><circle cx="141" cy="82" r="3" fill="#3A1622" stroke="none"/><circle cx="179" cy="82" r="3" fill="#3A1622" stroke="none"/>
          <path d="M147 106q13-10 26 0"/><path d="M190 88q3 6 0 9" stroke="#8FB6D8" stroke-width="2.2"/>
        </g>
        <g class="tg-face happy" fill="none" stroke="#3A1622" stroke-width="2.6" stroke-linecap="round">
          <path d="M134 84q7-9 14 0M172 84q7-9 14 0"/><path d="M144 98q16 16 32 0"/>
          <circle cx="128" cy="98" r="6.5" fill="#D9AEB8" stroke="none" opacity=".7"/><circle cx="192" cy="98" r="6.5" fill="#D9AEB8" stroke="none" opacity=".7"/>
        </g>
      </g>
      <g class="tg-foam"></g>
      <g class="tg-brush" transform="translate(262 156) rotate(-35)">
        <rect x="-4" y="-2" width="58" height="9" rx="4.5" fill="#722F45" transform="translate(4 -1)"/>
        <rect x="-16" y="-5" width="24" height="13" rx="4" fill="#fff" stroke="#722F45" stroke-width="1.6"/>
        <path d="M-13 -5v-8M-8 -5v-9M-3 -5v-9M2 -5v-8" stroke="#C5A15A" stroke-width="2.6" stroke-linecap="round"/>
      </g>
    </svg>
    <div class="tg-bar"><span class="tg-msg" aria-live="polite">O dentinho está sujo e tristinho… pegue a escova e limpe ele!</span>
      <button class="tg-btn" type="button" data-scrub>Escovar</button></div>`;
  const svg = $('.tg-svg', root), brush = $('.tg-brush', svg), foam = $('.tg-foam', svg), msg = $('.tg-msg', root), btn = $('[data-scrub]', root);
  const spots = [...svg.querySelectorAll('[data-spot]')].map((el, i) => ({ el, x: SPOTS[i][0], y: SPOTS[i][1], hp: 1 }));
  const REST = 'translate(262 156) rotate(-35)';
  let brushing = false, last = null, done = false;
  const pt = e => { const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); };
  const update = () => {
    const left = spots.filter(s => s.hp > 0).length;
    if (!left && !done) {
      done = true; root.classList.add('clean');
      msg.textContent = 'Brilhando! O dentinho ficou feliz ✨'; btn.textContent = 'Jogar de novo';
    } else if (!done && left < spots.length) msg.textContent = `Isso! Faltam ${left} ${left === 1 ? 'mancha' : 'manchas'}…`;
  };
  const scrubAt = (x, y, amount) => {
    spots.forEach(s => {
      if (s.hp <= 0) return;
      const d = Math.hypot(s.x - x, s.y - y);
      if (d < 22) { s.hp = Math.max(0, s.hp - amount * (1 - d / 26)); s.el.style.opacity = s.hp; s.el.style.transform = `scale(${0.6 + 0.4 * s.hp})`; }
    });
    update();
  };
  const addFoam = (x, y) => {
    if (foam.childElementCount > 18) foam.firstElementChild.remove();
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', x + (Math.random() - .5) * 14); c.setAttribute('cy', y + (Math.random() - .5) * 10);
    c.setAttribute('r', 2 + Math.random() * 3.5); c.setAttribute('class', 'tg-bubble');
    foam.append(c); setTimeout(() => c.remove(), 900);
  };
  svg.addEventListener('pointerdown', e => {
    if (done) return;
    brushing = true; svg.setPointerCapture(e.pointerId); root.classList.add('brushing');
    const p = pt(e); last = p; brush.setAttribute('transform', `translate(${p.x} ${p.y}) rotate(-25)`);
  });
  svg.addEventListener('pointermove', e => {
    if (!brushing) return;
    const p = pt(e), moved = Math.hypot(p.x - last.x, p.y - last.y);
    brush.setAttribute('transform', `translate(${p.x} ${p.y}) rotate(${-25 + Math.max(-12, Math.min(12, (p.x - last.x) * 2))})`);
    if (moved > 0.5) { scrubAt(p.x, p.y - 8, moved * 0.022); if (Math.random() < 0.5) addFoam(p.x, p.y - 8); }
    last = p;
  });
  const stop = () => { if (!brushing) return; brushing = false; root.classList.remove('brushing'); brush.setAttribute('transform', REST); };
  svg.addEventListener('pointerup', stop); svg.addEventListener('pointercancel', stop);
  btn.addEventListener('click', () => {
    if (done) {   // reset
      done = false; root.classList.remove('clean');
      spots.forEach(s => { s.hp = 1; s.el.style.opacity = 1; s.el.style.transform = ''; });
      msg.textContent = 'Sujou de novo! Pegue a escova e limpe ele!'; btn.textContent = 'Escovar'; return;
    }
    const s = spots.find(s => s.hp > 0); if (!s) return;   // keyboard-friendly: clean one spot per press
    s.hp = 0; s.el.style.opacity = 0; for (let i = 0; i < 5; i++) addFoam(s.x, s.y); update();
  });
}

// ───────────── study library ─────────────
function coverHTML(m) {
  const [c1, c2] = colorsFor(m.category);
  const img = safeUrl(m.cover);
  return `<div class="cover ${img ? '' : 'cover--art'}" style="--c1:${c1};--c2:${c2}">
    ${img ? `<img src="${esc(img)}" alt="" loading="lazy">` : `<span class="cover-ic">${icon(CATEGORY_ICON[m.category] || 'book')}</span>`}
    <span class="cover-cat">${esc(m.category)}</span>
    <span class="cover-title">${esc(m.title)}</span>
  </div>`;
}
function renderStudy(c) {
  $('#study-text').innerHTML = paras(c.study?.paragraphs);
  const mats = c.materials || [];
  const cats = c.categories || [];
  const state = { cat: 'Todas', q: '' };
  const count = cat => mats.filter(m => m.category === cat).length;
  $('#study-filters').innerHTML = ['Todas', ...cats].map(cat =>
    `<button class="chip" aria-pressed="${cat === 'Todas'}" data-cat="${esc(cat)}">${esc(cat)} <small>${cat === 'Todas' ? mats.length : count(cat)}</small></button>`).join('');
  const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const draw = () => {
    const q = norm(state.q);
    const list = mats.filter(m => (state.cat === 'Todas' || m.category === state.cat) &&
      (!q || norm([m.title, m.category, m.description, m.period].join(' ')).includes(q)));
    $('#study-count').textContent = list.length ? `${list.length} ${list.length === 1 ? 'material encontrado' : 'materiais encontrados'}` : '';
    $('#study-grid').innerHTML = list.length ? list.map(m => {
      const pdf = safeUrl(m.pdf);
      const links = (m.links || []).filter(l => safeUrl(l.url));
      return `<article class="doc">
        ${coverHTML(m)}
        <div class="doc-body">
          <div class="doc-meta">${m.period ? `<span>${esc(m.period)}</span>` : ''}${m.pages ? `<span>${esc(m.pages)} páginas</span>` : ''}</div>
          <p>${esc(m.description)}</p>
          ${links.length ? `<div class="doc-links">${links.map(l => `<a href="${esc(safeUrl(l.url))}" target="_blank" rel="noopener">${icon('external')}${esc(l.label || 'Link')}</a>`).join('')}</div>` : ''}
          ${pdf ? `<div class="doc-actions">
            <a class="btn btn-wine btn-sm" href="${esc(pdf)}" target="_blank" rel="noopener">${icon('read')}Ler</a>
            <a class="btn btn-ghost btn-sm" href="${esc(pdf)}" download>${icon('download')}Baixar</a>
          </div>` : ''}
        </div>
      </article>`;
    }).join('') : `<div class="empty"><b>${mats.length ? 'Nada por aqui…' : 'Em breve!'}</b>${mats.length
      ? (state.cat !== 'Todas' && !state.q ? `Ainda não tenho resumos de ${esc(state.cat)} — logo, logo eles chegam!` : 'Tente outra palavra ou outra disciplina.')
      : 'Os resumos estão sendo organizados com carinho.'}</div>`;
  };
  $('#study-filters').addEventListener('click', e => {
    const b = e.target.closest('.chip'); if (!b) return;
    state.cat = b.dataset.cat;
    $$('#study-filters .chip').forEach(x => x.setAttribute('aria-pressed', x === b));
    draw();
  });
  let tm; $('#study-search').addEventListener('input', e => { clearTimeout(tm); tm = setTimeout(() => { state.q = e.target.value; draw(); }, 120); });
  draw();
}

// ───────────── books ─────────────
const MARKS_KEY = 'estante:marcados';
const marks = (() => {
  let set = new Set();
  try { set = new Set(JSON.parse(localStorage.getItem(MARKS_KEY) || '[]')); } catch { /* storage off */ }
  const save = () => { try { localStorage.setItem(MARKS_KEY, JSON.stringify([...set])); } catch { /* storage off */ } };
  return { has: id => set.has(id), size: () => set.size, toggle(id) { set.has(id) ? set.delete(id) : set.add(id); save(); return set.has(id); } };
})();
const bookId = (b, i) => b.id || `${b.title}|${b.author}|${i}`;

function bookCover(b) {
  const [c1, c2] = colorsFor(b.area);
  const img = safeUrl(b.cover);
  return `<div class="book-cover" style="--c1:${c1};--c2:${c2}">
    ${img ? `<img src="${esc(img)}" alt="" loading="lazy">` : `
    <span class="bk-area">${esc(b.area)}</span>
    <span><span class="bk-title">${esc(b.title)}</span><span class="bk-line" style="display:block"></span><span class="bk-author">${esc(b.author)}</span></span>`}
  </div>`;
}
const ribbon = (id, title) => {
  const on = marks.has(id);
  return `<button class="bk-mark" type="button" data-mark="${esc(id)}" aria-pressed="${on}" aria-label="${on ? 'Desmarcar' : 'Marcar'} ${esc(title)}" title="${on ? 'Tirar dos marcados' : 'Guardar nos marcados'}"></button>`;
};

function renderBooks(c) {
  const B = c.books || {};
  $('#books-text').innerHTML = paras(B.paragraphs);
  const raw = (B.items || []).map((b, i) => ({ ...b, _id: bookId(b, i) }));
  // keep each area together, in the order the areas first appear
  const areas = [...new Set(raw.map(b => b.area || 'Outros'))];
  const items = raw.slice().sort((a, b) => areas.indexOf(a.area || 'Outros') - areas.indexOf(b.area || 'Outros'));
  const byId = new Map(items.map(b => [b._id, b]));
  const state = { cat: 'Todas', q: '' };
  const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const shelf = $('#shelf'), filters = $('#book-filters');

  const drawChips = () => {
    const count = cat => items.filter(b => (b.area || 'Outros') === cat).length;
    filters.innerHTML = [
      ['Todas', items.length], ['Marcados', marks.size()], ...areas.map(a => [a, count(a)])
    ].map(([cat, n]) => `<button class="chip${cat === 'Marcados' ? ' chip--mark' : ''}" aria-pressed="${state.cat === cat}" data-cat="${esc(cat)}">${esc(cat)} <small>${n}</small></button>`).join('');
  };

  const draw = () => {
    const q = norm(state.q);
    const list = items.filter(b =>
      (state.cat === 'Todas' || (state.cat === 'Marcados' ? marks.has(b._id) : (b.area || 'Outros') === state.cat)) &&
      (!q || norm([b.title, b.author, b.area, b.edition, b.description].join(' ')).includes(q)));
    $('#book-count').textContent = list.length ? `${list.length} ${list.length === 1 ? 'livro na estante' : 'livros na estante'}` : '';
    const groups = state.cat === 'Todas' || state.cat === 'Marcados';
    let last = null, html = '';
    list.forEach((b, i) => {
      const area = b.area || 'Outros';
      if (groups && area !== last) {
        html += `<div class="shelf-tag" aria-hidden="true"><span>${esc(area)}</span></div>`;
        last = area;
      }
      html += `<div class="book" style="--tilt:${(i % 5 === 3) ? -2 : 0}deg">
        <button class="book-open" type="button" data-book="${esc(b._id)}" aria-haspopup="dialog" aria-label="${esc(b.title)}, de ${esc(b.author)} — ver detalhes">${bookCover(b)}</button>
        ${ribbon(b._id, b.title)}
      </div>`;
    });
    if (!list.length) {
      html = `<div class="shelf-empty">${state.cat === 'Marcados' && !q
        ? 'Você ainda não marcou nenhum livro.<br><small>Use a fitinha dourada no canto de cada capa.</small>'
        : 'Nenhum livro encontrado nessa prateleira.'}</div>`;
    } else if (state.cat === 'Todas' && !q) {
      html += `<div class="book book--slot" aria-hidden="true"><div class="book-cover">mais livros<br>em breve</div></div>`;
    }
    shelf.innerHTML = html;
    shelf.scrollLeft = 0;
    updateNav();
  };

  const navs = $$('.shelf-nav');
  navs.forEach(b => { b.innerHTML = icon('arrow'); b.addEventListener('click', () =>
    shelf.scrollBy({ left: +b.dataset.dir * shelf.clientWidth * 0.8, behavior: reduced ? 'auto' : 'smooth' })); });
  function updateNav() {
    const max = shelf.scrollWidth - shelf.clientWidth - 8;
    navs[0].hidden = shelf.scrollLeft <= 8;
    navs[1].hidden = shelf.scrollLeft >= max;
  }
  shelf.addEventListener('scroll', updateNav, { passive: true });
  addEventListener('resize', updateNav);

  const toggleMark = id => {
    marks.toggle(id);
    $$(`[data-mark="${CSS.escape(id)}"]`).forEach(btn => btn.outerHTML = ribbon(id, byId.get(id)?.title));
    drawChips();
    if (state.cat === 'Marcados') draw();
  };

  filters.addEventListener('click', e => {
    const b = e.target.closest('.chip'); if (!b) return;
    state.cat = b.dataset.cat;
    $$('.chip', filters).forEach(x => x.setAttribute('aria-pressed', x === b));
    draw();
  });
  let tm; $('#book-search').addEventListener('input', e => { clearTimeout(tm); tm = setTimeout(() => { state.q = e.target.value; draw(); }, 120); });

  shelf.addEventListener('click', e => {
    const m = e.target.closest('[data-mark]');
    if (m) { toggleMark(m.dataset.mark); return; }
    const btn = e.target.closest('[data-book]'); if (!btn) return;
    const b = byId.get(btn.dataset.book); const url = safeUrl(b.url);
    openModal(`<div class="book-detail">
      <div class="book">${bookCover(b)}${ribbon(b._id, b.title)}</div>
      <div>
        <p class="eyebrow">${esc(b.area)}</p>
        <h3 id="modal-title" class="title" style="font-size:28px">${esc(b.title)}</h3>
        <dl class="dl">
          <dt>Autor</dt><dd>${esc(b.author)}</dd>
          ${b.edition ? `<dt>Edição</dt><dd>${esc(b.edition)}</dd>` : ''}
          <dt>Área</dt><dd>${esc(b.area)}</dd>
        </dl>
        <p style="color:var(--muted)">${esc(b.description)}</p>
        ${url ? `<a class="btn btn-wine" href="${esc(url)}" target="_blank" rel="noopener">${icon('external')}Acessar</a>` : ''}
      </div>
    </div>`);
  });
  $('#modal-body').addEventListener('click', e => {
    const m = e.target.closest('[data-mark]'); if (m) toggleMark(m.dataset.mark);
  });

  drawChips();
  draw();
}

// ───────────── instagram ─────────────
/** "https://www.instagram.com/p/ABC/?igsh=…" → embed URL, or '' when it is not a post/reel link. */
function igEmbed(url) {
  const m = String(url || '').match(/^https?:\/\/(?:www\.)?instagram\.com\/(?:[\w.]+\/)?(p|reels?|tv)\/([\w-]+)/i);
  if (!m) return '';
  const kind = m[1].toLowerCase().startsWith('reel') ? 'reel' : m[1].toLowerCase();
  return `https://www.instagram.com/${kind}/${m[2]}/embed/`;
}
/** One Instagram card: our own looping .mp4 when there is a file, else Instagram's embed. */
function igCard(p, i) {
  const file = safeUrl(p.file), link = safeUrl(p.url);
  if (file) {
    const poster = safeUrl(p.poster);
    return `<figure class="insta-post insta-post--video reveal">
      <video src="${esc(file)}"${poster ? ` poster="${esc(poster)}"` : ''} data-auto muted loop playsinline preload="metadata" aria-label="Vídeo do Instagram ${i + 1}"></video>
      ${soundBtn()}
      ${link ? `<a class="insta-link" href="${esc(link)}" target="_blank" rel="noopener">${icon('instagram')}<span>Ver no Instagram</span></a>` : ''}
    </figure>`;
  }
  return `<div class="insta-post reveal">
    <iframe src="${esc(p.embed)}" title="Post do Instagram ${i + 1}" loading="lazy" scrolling="no" allowtransparency="true" referrerpolicy="strict-origin-when-cross-origin"></iframe>
  </div>`;
}
// ── self-playing clips (muted, looping, play while on screen; tap pauses; one with sound at a time) ──
const soundBtn = () => `<button class="insta-sound" type="button" aria-pressed="false" aria-label="Ligar o som">${icon('muted')}</button>`;
const autoIO = 'IntersectionObserver' in window ? new IntersectionObserver(entries => entries.forEach(({ target: v, isIntersecting }) => {
  if (isIntersecting && !v.parentElement.classList.contains('is-paused')) v.play().catch(() => {});
  else if (!isIntersecting) v.pause();
}), { threshold: 0.5 }) : null;
function observeAutoVideos(root) { $$('video[data-auto]', root).forEach(v => autoIO ? autoIO.observe(v) : v.play().catch(() => {})); }
function bindAutoVideos(root) {
  root.addEventListener('click', e => {
    const b = e.target.closest('.insta-sound');
    if (b) {
      const v = b.parentElement.querySelector('video');
      const on = v.muted;              // currently muted → turn sound on
      $$('video[data-auto]').forEach(x => { if (x === v) return; x.muted = true;
        const xb = x.parentElement.querySelector('.insta-sound');
        if (xb) { xb.setAttribute('aria-pressed', 'false'); xb.setAttribute('aria-label', 'Ligar o som'); xb.innerHTML = icon('muted'); } });
      v.muted = !on;
      b.setAttribute('aria-pressed', on); b.setAttribute('aria-label', on ? 'Desligar o som' : 'Ligar o som'); b.innerHTML = icon(on ? 'sound' : 'muted');
      if (on) v.play().catch(() => {});
      return;
    }
    const v = e.target.closest('video[data-auto]');
    if (v) { v.paused ? v.play().catch(() => {}) : v.pause(); v.parentElement.classList.toggle('is-paused', v.paused); }
  });
}
function setupInstaVideos(grid) {
  const vids = $$('video', grid);
  if (!vids.length) return;
  // each card takes the shape of its own video (vertical reel, 3:4 or horizontal)
  const shape = v => { if (!v.videoWidth) return; const f = v.parentElement;
    f.style.aspectRatio = `${v.videoWidth} / ${v.videoHeight}`; f.classList.toggle('insta-post--wide', v.videoWidth > v.videoHeight); };
  vids.forEach(v => { v.readyState >= 1 ? shape(v) : v.addEventListener('loadedmetadata', () => shape(v), { once: true }); });
  bindAutoVideos(grid);
  observeAutoVideos(grid);
}
function renderInstagram(c) {
  const I = c.instagram || {};
  const posts = (I.posts || []).map(p => (typeof p === 'string' ? { url: p } : p))
    .map(p => ({ ...p, embed: igEmbed(p.url) })).filter(p => safeUrl(p.file) || p.embed);
  if (!posts.length) return;   // section and menu link stay hidden
  $('#instagram').hidden = false;
  $('#nav-instagram').hidden = false;
  $('#insta-grid').innerHTML = posts.map(igCard).join('');
  setupInstaVideos($('#insta-grid'));
  const profiles = (c.socials || []).filter(s => s.network === 'instagram' && safeUrl(s.url));
  $('#insta-profiles').innerHTML = profiles.map(s =>
    `<a class="btn btn-ghost" href="${esc(safeUrl(s.url))}" target="_blank" rel="noopener"><span class="btn-ic">${icon('instagram')}</span>${esc(s.handle || s.label)}</a>`).join('');
  // Instagram's embed page reports its height; resize the matching frame.
  addEventListener('message', e => {
    if (e.origin !== 'https://www.instagram.com') return;
    let d = e.data; try { if (typeof d === 'string') d = JSON.parse(d); } catch { return; }
    const h = d?.type === 'MEASURE' && +d.details?.height;
    if (!h) return;
    const f = $$('#insta-grid iframe').find(x => x.contentWindow === e.source);
    if (f) { f.style.height = `${Math.ceil(h)}px`; f.parentElement.classList.add('is-ready'); }
  });
  // stop the loading shimmer once a frame has loaded, even without a height message
  $$('#insta-grid iframe').forEach(f => f.addEventListener('load', () => f.parentElement.classList.add('is-ready')));
}

// ───────────── videos ─────────────
function renderVideos(c) {
  const V = c.videos || {};
  const items = (V.items || []).filter(v => safeUrl(v.file) || youtubeId(v.url) || safeUrl(v.url));
  const filters = $('#video-filters');
  const used = (V.categories || []).filter(cat => items.some(v => v.category === cat));
  if (used.length > 1) {
    filters.innerHTML = ['Todos', ...used].map(cat => `<button class="chip" aria-pressed="${cat === 'Todos'}" data-cat="${esc(cat)}">${esc(cat)}</button>`).join('');
  } else filters.remove();
  const ig = (c.socials || []).find(s => s.network === 'youtube' && safeUrl(s.url));
  const draw = cat => {
    const list = items.filter(v => cat === 'Todos' || v.category === cat);
    queueMicrotask(() => observeAutoVideos($('#video-grid')));
    $('#video-grid').innerHTML = list.length ? list.map((v, i) => {
      const id = youtubeId(v.url);
      const file = safeUrl(v.file);
      const thumb = safeUrl(v.thumbnail) || (id && !file ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : '');
      if (file) return `<article class="video video--auto${list.length === 1 ? ' video--feature' : ''}">
        <div class="thumb thumb--auto">
          <video src="${esc(file)}"${thumb ? ` poster="${esc(thumb)}"` : ''} data-auto muted loop playsinline preload="metadata" aria-label="${esc(v.title)}"></video>
          ${soundBtn()}
        </div>
        <div class="video-body">${v.category ? `<span class="tag">${esc(v.category)}</span>` : ''}<h3>${esc(v.title)}</h3><p>${esc(v.description)}</p></div>
      </article>`;
      return `<article class="video">
        <button class="thumb" data-video="${items.indexOf(v)}" aria-label="Assistir: ${esc(v.title)}">
          ${thumb ? `<img src="${esc(thumb)}" alt="" loading="lazy">` : file ? `<video src="${esc(file)}#t=0.5" preload="metadata" muted playsinline tabindex="-1"></video>` : ''}<span class="play">${icon('play')}</span>
        </button>
        <div class="video-body">${v.category ? `<span class="tag">${esc(v.category)}</span>` : ''}<h3>${esc(v.title)}</h3><p>${esc(v.description)}</p></div>
      </article>`;
    }).join('') : `<div class="empty"><b>Gravando…</b>Os primeiros vídeos chegam por aqui em breve.${ig ? `<br><br><a class="btn btn-wine btn-sm" href="${esc(safeUrl(ig.url))}" target="_blank" rel="noopener">${icon('youtube')}Ver meu canal</a>` : ''}</div>`;
  };
  filters.addEventListener?.('click', e => {
    const b = e.target.closest('.chip'); if (!b) return;
    $$('.chip', filters).forEach(x => x.setAttribute('aria-pressed', x === b)); draw(b.dataset.cat);
  });
  $('#video-grid').addEventListener('click', e => {
    const b = e.target.closest('[data-video]'); if (!b) return;
    const v = items[+b.dataset.video]; const id = youtubeId(v.url); const file = safeUrl(v.file);
    if (file) {
      openModal(`<div class="modal-video"><video src="${esc(file)}" ${safeUrl(v.thumbnail) ? `poster="${esc(safeUrl(v.thumbnail))}"` : ''} controls autoplay playsinline></video></div>
        <div class="modal-pad"><h3 id="modal-title">${esc(v.title)}</h3><p>${esc(v.description)}</p></div>`);
      return;
    }
    if (!id) { window.open(safeUrl(v.url), '_blank', 'noopener'); return; }
    openModal(`<div class="modal-video"><iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" title="${esc(v.title)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>
      <div class="modal-pad"><h3 id="modal-title">${esc(v.title)}</h3><p>${esc(v.description)}</p></div>`);
  });
  bindAutoVideos($('#video-grid'));
  draw('Todos');
}

// ───────────── socials ─────────────
function renderSocials(c) {
  const list = (c.socials || []).filter(s => safeUrl(s.url));
  $('#socials').outerHTML = list.length
    ? `<div class="socials" id="socials">${list.map(s => `<a class="social" href="${esc(safeUrl(s.url))}" target="_blank" rel="noopener me">
        <span class="s-ic">${icon(s.network)}</span><span><b>${esc(s.label || NETWORKS[s.network] || 'Link')}</b>${s.handle ? `<small>${esc(s.handle)}</small>` : ''}</span></a>`).join('')}</div>`
    : `<p class="soon" id="socials">Minhas redes chegam aqui em breve ♡</p>`;
}

// ───────────── contact & partnerships ─────────────
function renderContact(c) {
  const k = c.contact || {};
  const cards = [];
  if (k.email) cards.push({ ic: 'email', t: 'E-mail', s: k.email, href: `mailto:${k.email}` });
  if (k.whatsapp) cards.push({ ic: 'whatsapp', t: 'WhatsApp', s: k.whatsappLabel || k.whatsapp, href: `https://wa.me/${String(k.whatsapp).replace(/\D/g, '')}` });
  (k.directs || []).forEach(d => { if (safeUrl(d.url)) cards.push({ ic: 'instagram', t: d.label, s: d.handle, href: d.url }); });
  $('#talk-cards').innerHTML = `
    <div class="talk-list">${cards.map(x => `<a class="talk-card reveal" href="${esc(safeUrl(x.href))}" ${x.href.startsWith('mailto:') ? '' : 'target="_blank" rel="noopener"'}>
      <span class="talk-ic">${icon(x.ic)}</span><span><b>${esc(x.t)}</b><small>${esc(x.s)}</small></span><span class="talk-go">${icon('arrow')}</span></a>`).join('')}</div>
    ${k.partnersTitle ? `<aside class="partners-box reveal">
      <span class="partners-ic">${icon('handshake')}</span>
      <h3>${esc(k.partnersTitle)}</h3><p>${esc(k.partnersText)}</p>
      ${k.email ? `<a class="btn btn-wine btn-sm" href="mailto:${esc(k.email)}?subject=${encodeURIComponent('Proposta de parceria')}">${icon('email')}Enviar proposta</a>` : ''}
    </aside>` : ''}`;
}

// ───────────── modal ─────────────
const modal = $('#modal');
function openModal(html) {
  $('#modal-body').innerHTML = html;
  modal.showModal();
}
modal.addEventListener('click', e => { if (e.target === modal || e.target.closest('[data-close]')) modal.close(); });
modal.addEventListener('close', () => { $('#modal-body').innerHTML = ''; });
$('.modal-x').innerHTML = icon('close');

// ───────────── nav, progress, reveal ─────────────
function setupNav() {
  const nav = $('.nav'), bar = $('.progress span'), burger = $('.burger'), body = document.body;
  const setMenu = open => { body.classList.toggle('menu-open', open); burger.setAttribute('aria-expanded', open); burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu'); };
  burger.addEventListener('click', () => setMenu(!body.classList.contains('menu-open')));
  $$('.menu a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  let ticking = false;
  const onScroll = () => {
    ticking = false;
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
    nav.classList.toggle('scrolled', scrollY > 20);
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  const links = new Map($$('.menu a').map(a => [a.getAttribute('href').slice(1), a]));
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { links.forEach(a => a.classList.remove('active')); const a = links.get(e.target.id) || (e.target.id === 'redes' ? links.get('contato') : null); a?.classList.add('active'); } });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => io.observe(s));
}
function setupReveal() {
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in'); io.unobserve(e.target);
    $$('[data-count]', e.target).forEach(countUp);
  }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  $$('.reveal').forEach((el, i) => { el.style.transitionDelay = `${(i % 3) * 0.08}s`; io.observe(el); });
  const art = $('#future-art');
  if (art) new IntersectionObserver(([e], o) => { if (e.isIntersecting) { art.classList.add('in'); o.disconnect(); } }, { threshold: 0.3 }).observe(art);
}
function countUp(el) {
  const to = +el.dataset.count; if (reduced || !to) return;
  const t0 = performance.now();
  const step = now => { const p = Math.min(1, (now - t0) / 1200); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
  el.textContent = '0'; requestAnimationFrame(step);
}

/** Shrinks the big name if it would not fit its column (never cut). */
function fitName() {
  const n = $('.name'); if (!n) return;
  n.style.fontSize = '';
  const box = n.parentElement.clientWidth;
  const widest = Math.max(...[...n.children].map(s => s.getBoundingClientRect().width));
  if (widest > box) n.style.fontSize = `${parseFloat(getComputedStyle(n).fontSize) * box / widest * 0.98}px`;
}

// ───────────── boot ─────────────
async function boot() {
  fillIcons();
  $('#year').textContent = new Date().getFullYear();
  const done = () => document.body.classList.add('is-loaded');
  const safety = setTimeout(done, 1600);
  let content;
  try { content = (await loadContent()).data; }
  catch (e) { console.error(e); done(); return; }
  bindText(content);
  renderHero(content); renderAbout(content); renderJourney(content); renderFuture(content);
  renderHobbies(content); renderStudy(content); renderBooks(content); renderVideos(content); renderInstagram(content); renderContact(content); renderSocials(content);
  fillIcons();
  setupNav(); setupReveal(); fitName();
  addEventListener('resize', fitName);
  document.fonts?.ready.then(fitName);
  // the doll always keeps its gentle intro-like motion (softer when "reduce motion" is on)
  try { await mountDoll($('.doll'), 'assets/boneca.webp', { gentle: reduced }); } catch (e) { console.warn(e); }
  clearTimeout(safety); requestAnimationFrame(done);
}
boot();
