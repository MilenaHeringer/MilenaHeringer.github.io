import { hasBackend, getClient, loadContent, esc, slug, youtubeId } from './store.js';
import { STORAGE_BUCKET, CONTENT_ROW_ID } from './config.js';
import { NETWORKS } from './icons.js';

const $ = (s, r = document) => r.querySelector(s);
let state = null, sb = null, dirty = false, currentTab = 'inicio';

// ───────── form schema ─────────
const HOBBY_ICONS = { piano: 'Piano', whisk: 'Fouet (cozinha)', pad: 'Controle (games)', book: 'Livro', guitar: 'Violão', notes: 'Notas musicais', tooth: 'Dente', hat: 'Chapéu de chef', heart: 'Coração', star: 'Estrela' };
const T = {
  inicio: { label: 'Início', sections: [
    { title: 'Primeira dobra', fields: [
      { path: 'hero.kicker', label: 'Linha acima do nome', type: 'text' },
      { path: 'hero.phrase', label: 'Frase de apresentação', type: 'textarea' },
      { path: 'hero.ctaPrimary', label: 'Texto do botão principal', type: 'text' },
      { path: 'hero.ctaInstagram', label: 'Texto do botão do Instagram', type: 'text', help: 'O link vem da aba Redes sociais.' }]},
    { title: 'Encerramento', fields: [
      { path: 'closing.title', label: 'Título', type: 'text' },
      { path: 'closing.text', label: 'Frase de encerramento', type: 'textarea' }]}]},
  sobre: { label: 'Sobre mim', sections: [
    { title: 'Sobre mim', fields: [
      { path: 'about.title', label: 'Título', type: 'text' },
      { path: 'about.photo', label: 'Foto', type: 'image', folder: 'fotos' },
      { path: 'about.photoAlt', label: 'Descrição da foto (acessibilidade)', type: 'text' },
      { path: 'about.photoCaption', label: 'Legenda escrita à mão', type: 'text' },
      { path: 'about.paragraphs', label: 'Texto', type: 'paragraphs' },
      { path: 'about.tags', label: 'Etiquetas (uma por linha)', type: 'lines' }]}]},
  trajetoria: { label: 'Trajetória', sections: [
    { title: 'Cabeçalho', fields: [
      { path: 'journey.title', label: 'Título', type: 'textarea' },
      { path: 'journey.subtitle', label: 'Subtítulo', type: 'textarea' }]},
    { title: 'Formação técnica', fields: [
      { path: 'journey.technical.tag', label: 'Etiqueta', type: 'text' },
      { path: 'journey.technical.title', label: 'Título', type: 'text' },
      { path: 'journey.technical.text', label: 'Texto', type: 'textarea' }]},
    { title: 'Aprovações', fields: [
      { path: 'journey.approvals.tag', label: 'Etiqueta', type: 'text' },
      { path: 'journey.approvals.title', label: 'Frase ao lado do número', type: 'text' },
      { path: 'journey.approvals.items', label: 'Instituições', type: 'list', itemLabel: 'short', fields: [
        { key: 'short', label: 'Sigla / nome curto', type: 'text' },
        { key: 'name', label: 'Nome completo', type: 'text' },
        { key: 'note', label: 'Observação (ex.: ProUni 100%)', type: 'text' }]}]},
    { title: 'Concurso público', fields: [
      { path: 'journey.contest.tag', label: 'Etiqueta', type: 'text' },
      { path: 'journey.contest.title', label: 'Título', type: 'text' },
      { path: 'journey.contest.text', label: 'Texto', type: 'textarea' },
      { path: 'journey.contest.badge', label: 'Selo dourado', type: 'text' }]},
    { title: 'Parceria', fields: [
      { path: 'journey.partner.name', label: 'Nome', type: 'text' },
      { path: 'journey.partner.role', label: 'Função (ex.: Embaixadora)', type: 'text' },
      { path: 'journey.partner.text', label: 'Texto', type: 'textarea' },
      { path: 'journey.partner.coupon', label: 'Cupom de desconto', type: 'text' },
      { path: 'journey.partner.couponText', label: 'Texto do cupom', type: 'text' },
      { path: 'journey.partner.logo', label: 'Logo', type: 'image', folder: 'logos' },
      { path: 'journey.partner.url', label: 'Link da plataforma', type: 'url' }]}]},
  planos: { label: 'Planos futuros', sections: [
    { title: 'Planos futuros', fields: [
      { path: 'future.title', label: 'Título', type: 'text' },
      { path: 'future.paragraphs', label: 'Texto', type: 'paragraphs' },
      { path: 'future.steps', label: 'Etapas da ilustração (até 4, uma por linha)', type: 'lines' },
      { path: 'future.planTitle', label: 'Título do cartão do cronograma', type: 'text' },
      { path: 'future.planText', label: 'Texto do cartão', type: 'textarea' },
      { path: 'future.planPdf', label: 'PDF do cronograma', type: 'pdf', folder: 'materiais' }]}]},
  hobbies: { label: 'Hobbies', sections: [
    { title: 'Hobbies', fields: [
      { path: 'hobbiesTitle', label: 'Título da seção', type: 'text' },
      { path: 'hobbies', label: 'Cards', type: 'list', itemLabel: 'title', fields: [
        { key: 'title', label: 'Título', type: 'text' },
        { key: 'icon', label: 'Ícone', type: 'select', options: () => HOBBY_ICONS },
        { key: 'text', label: 'Descrição', type: 'textarea' },
        { key: 'id', label: 'Identificador', type: 'text', help: '"piano" mostra o mini piano; "games" mostra os botões.' }]}]}]},
  resumos: { label: 'Resumos', sections: [
    { title: 'Materiais', help: 'Cada material pode ter PDF, capa e links. Arquivos até 50 MB.', fields: [
      { path: 'materials', label: '', type: 'list', itemLabel: 'title', newItem: () => ({ title: 'Novo material', category: state.categories?.[0] || '', period: '', pages: '', description: '', cover: '', pdf: '', links: [] }), fields: [
        { key: 'title', label: 'Nome do material', type: 'text' },
        { key: 'category', label: 'Disciplina', type: 'select', options: () => Object.fromEntries((state.categories || []).map(c => [c, c])) },
        { key: 'period', label: 'Período / semestre', type: 'text' },
        { key: 'pages', label: 'Nº de páginas', type: 'number' },
        { key: 'description', label: 'Descrição', type: 'textarea' },
        { key: 'cover', label: 'Imagem de capa (opcional)', type: 'image', folder: 'capas' },
        { key: 'pdf', label: 'Arquivo PDF', type: 'pdf', folder: 'materiais' },
        { key: 'links', label: 'Links externos', type: 'list', itemLabel: 'label', newItem: () => ({ label: '', url: '' }), fields: [
          { key: 'label', label: 'Texto do link', type: 'text' }, { key: 'url', label: 'Endereço', type: 'url' }]}]}]},
    { title: 'Textos e disciplinas', fields: [
      { path: 'study.title', label: 'Título', type: 'text' },
      { path: 'study.paragraphs', label: 'Texto', type: 'paragraphs' },
      { path: 'study.disclaimer', label: 'Aviso', type: 'textarea' },
      { path: 'categories', label: 'Disciplinas (uma por linha)', type: 'lines' }]}]},
  livros: { label: 'Livros', sections: [
    { title: 'Estante', fields: [
      { path: 'books.items', label: '', type: 'list', itemLabel: 'title', newItem: () => ({ title: 'Novo livro', author: '', area: '', edition: '', description: '', cover: '', url: '' }), fields: [
        { key: 'title', label: 'Título', type: 'text' }, { key: 'author', label: 'Autor(a)', type: 'text' },
        { key: 'area', label: 'Área da Odontologia', type: 'text' }, { key: 'edition', label: 'Edição', type: 'text' },
        { key: 'description', label: 'Descrição', type: 'textarea' },
        { key: 'cover', label: 'Capa', type: 'image', folder: 'livros' },
        { key: 'url', label: 'Link de acesso (quando houver)', type: 'url' }]}]},
    { title: 'Textos', fields: [
      { path: 'books.title', label: 'Título', type: 'text' },
      { path: 'books.paragraphs', label: 'Texto', type: 'paragraphs' }]}]},
  videos: { label: 'Vídeos', sections: [
    { title: 'Vídeos', help: 'Use um link do YouTube (a miniatura aparece sozinha) OU um arquivo .mp4 da pasta videos/ do site.', fields: [
      { path: 'videos.items', label: '', type: 'list', itemLabel: 'title', newItem: () => ({ title: 'Novo vídeo', url: '', file: '', category: state.videos?.categories?.[0] || '', description: '', thumbnail: '' }), fields: [
        { key: 'title', label: 'Título', type: 'text' },
        { key: 'url', label: 'Link do vídeo (YouTube)', type: 'url' },
        { key: 'file', label: 'OU arquivo de vídeo (.mp4)', type: 'video', folder: 'videos' },
        { key: 'category', label: 'Categoria', type: 'select', options: () => Object.fromEntries((state.videos?.categories || []).map(c => [c, c])) },
        { key: 'description', label: 'Descrição', type: 'textarea' },
        { key: 'thumbnail', label: 'Miniatura personalizada (opcional)', type: 'image', folder: 'videos' }]}]},
    { title: 'Textos', fields: [
      { path: 'videos.title', label: 'Título', type: 'text' },
      { path: 'videos.text', label: 'Texto', type: 'textarea' },
      { path: 'videos.categories', label: 'Categorias (uma por linha)', type: 'lines' }]}]},
  contato: { label: 'Contato', sections: [
    { title: 'Contato e parcerias', fields: [
      { path: 'contact.title', label: 'Título', type: 'text' },
      { path: 'contact.text', label: 'Texto', type: 'textarea' },
      { path: 'contact.email', label: 'E-mail', type: 'text' },
      { path: 'contact.whatsapp', label: 'WhatsApp (só números, com 55 e DDD)', type: 'text' },
      { path: 'contact.whatsappLabel', label: 'WhatsApp como aparece no site', type: 'text' },
      { path: 'contact.directs', label: 'Directs do Instagram', type: 'list', itemLabel: 'label', newItem: () => ({ label: 'Direct', handle: '', url: '' }), fields: [
        { key: 'label', label: 'Nome exibido', type: 'text' }, { key: 'handle', label: 'Usuário', type: 'text' },
        { key: 'url', label: 'Link (https://ig.me/m/usuario)', type: 'url' }]},
      { path: 'contact.partnersTitle', label: 'Título do quadro de parcerias', type: 'text' },
      { path: 'contact.partnersText', label: 'Texto de parcerias', type: 'textarea' }]}]},
  redes: { label: 'Redes sociais', sections: [
    { title: 'Redes sociais', help: 'Só aparecem no site as redes com link preenchido.', fields: [
      { path: 'socials', label: '', type: 'list', itemLabel: 'label', newItem: () => ({ network: 'link', label: '', handle: '', url: '' }), fields: [
        { key: 'network', label: 'Rede', type: 'select', options: () => NETWORKS },
        { key: 'label', label: 'Nome exibido', type: 'text' },
        { key: 'handle', label: 'Usuário (ex.: @seuperfil)', type: 'text' },
        { key: 'url', label: 'Link completo', type: 'url' }]}]}]}
};

// ───────── helpers ─────────
const getP = (o, p) => p.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
function setP(o, p, v) { const ks = p.split('.'); let a = o; ks.slice(0, -1).forEach(k => { if (a[k] == null || typeof a[k] !== 'object') a[k] = {}; a = a[k]; }); a[ks.at(-1)] = v; }
function toast(msg, err = false) { const t = $('#a-toast'); t.textContent = msg; t.classList.toggle('err', err); t.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('on'), 3200); }
function markDirty(v = true) { dirty = v; const s = $('#a-status'); s.textContent = v ? 'Alterações não salvas' : 'Tudo salvo ✓'; s.classList.toggle('dirty', v); }
addEventListener('beforeunload', e => { if (dirty) { e.preventDefault(); e.returnValue = ''; } });

async function upload(file, folder) {
  if (!sb) throw new Error('Configure o Supabase para enviar arquivos (veja o LEIA-ME).');
  if (file.size > 50 * 1024 * 1024) throw new Error('Arquivo maior que 50 MB.');
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  const path = `${folder}/${Date.now()}-${slug(file.name.replace(/\.[^.]+$/, '')) || 'arquivo'}.${ext}`;
  const { error } = await sb.storage.from(STORAGE_BUCKET).upload(path, file, { cacheControl: '31536000', upsert: false, contentType: file.type });
  if (error) throw error;
  return sb.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl;
}
async function removeStored(url) {
  if (!sb || !url) return;
  const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
  const i = String(url).indexOf(marker);
  if (i < 0) return;
  await sb.storage.from(STORAGE_BUCKET).remove([decodeURIComponent(url.slice(i + marker.length))]);
}

// ───────── field renderers ─────────
function fieldEl(def, get, set) {
  const wrap = document.createElement('div'); wrap.className = 'f';
  const id = 'f' + Math.random().toString(36).slice(2, 9);
  if (def.label) wrap.insertAdjacentHTML('beforeend', `<span id="${id}-l">${esc(def.label)}${def.help ? ` <small>· ${esc(def.help)}</small>` : ''}</span>`);
  const v = get();
  const bindInput = (el, parse = x => x) => { el.addEventListener('input', () => { set(parse(el.value)); markDirty(); }); el.setAttribute('aria-labelledby', id + '-l'); wrap.append(el); return el; };
  switch (def.type) {
    case 'textarea': { const el = document.createElement('textarea'); el.value = v ?? ''; bindInput(el); break; }
    case 'paragraphs': { const el = document.createElement('textarea'); el.rows = 8; el.value = (v || []).join('\n\n');
      bindInput(el, s => s.split(/\n\s*\n/).map(x => x.trim()).filter(Boolean)); wrap.querySelector('span')?.insertAdjacentHTML('beforeend', ' <small>· deixe uma linha em branco entre os parágrafos</small>'); break; }
    case 'lines': { const el = document.createElement('textarea'); el.rows = 5; el.value = (v || []).join('\n'); bindInput(el, s => s.split('\n').map(x => x.trim()).filter(Boolean)); break; }
    case 'number': { const el = document.createElement('input'); el.type = 'number'; el.min = 0; el.value = v ?? ''; bindInput(el, s => s === '' ? '' : Number(s)); break; }
    case 'url': { const el = document.createElement('input'); el.type = 'url'; el.placeholder = 'https://'; el.value = v ?? ''; bindInput(el, s => s.trim()); break; }
    case 'select': { const el = document.createElement('select'); const opts = def.options();
      if (v && !(v in opts)) opts[v] = v;
      el.innerHTML = Object.entries(opts).map(([k, l]) => `<option value="${esc(k)}"${k === v ? ' selected' : ''}>${esc(l)}</option>`).join('');
      el.addEventListener('change', () => { set(el.value); markDirty(); }); el.setAttribute('aria-labelledby', id + '-l'); wrap.append(el); break; }
    case 'image': case 'pdf': case 'video': {
      const kind = { image: ['image/*', 'imagem'], pdf: ['application/pdf', 'PDF'], video: ['video/mp4,video/webm', 'vídeo'] }[def.type];
      const row = document.createElement('div'); row.className = 'file-row';
      const prev = def.type === 'image' ? Object.assign(document.createElement('img'), { className: 'file-prev', alt: '', src: v || 'data:,' }) : null;
      const txt = Object.assign(document.createElement('input'), { type: 'text', value: v ?? '', placeholder: `${def.folder || 'pasta'}/nome-do-arquivo` });
      txt.setAttribute('aria-labelledby', id + '-l');
      const pick = Object.assign(document.createElement('input'), { type: 'file', accept: kind[0], hidden: true });
      const btn = Object.assign(document.createElement('button'), { type: 'button', className: 'btn btn-ghost btn-sm', textContent: sb ? `Enviar ${kind[1]}` : `Escolher ${kind[1]}` });
      const open = def.type !== 'image' ? Object.assign(document.createElement('a'), { className: 'btn btn-ghost btn-sm', textContent: 'Abrir', target: '_blank', rel: 'noopener', href: v || '#' }) : null;
      const prog = Object.assign(document.createElement('span'), { className: 'progress-inline' });
      const apply = val => { txt.value = val; set(val); if (prev) prev.src = val || 'data:,'; if (open) open.href = val || '#'; markDirty(); };
      txt.addEventListener('input', () => apply(txt.value.trim()));
      btn.addEventListener('click', () => pick.click());
      pick.addEventListener('change', async () => {
        const f = pick.files[0]; if (!f) return;
        if (!sb) {   // GitHub workflow: just fill in the path; the file is uploaded to that folder on GitHub
          const clean = f.name.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-');
          apply(`${def.folder}/${clean}`);
          prog.textContent = `envie o arquivo para a pasta ${def.folder}/ no GitHub com o nome "${clean}"`;
          if (clean !== f.name) toast(`Renomeie o arquivo para "${clean}" antes de enviar (sem espaços e acentos).`);
          pick.value = ''; return;
        }
        btn.disabled = true; prog.textContent = 'enviando…';
        try { apply(await upload(f, def.folder || 'arquivos')); prog.textContent = 'enviado ✓'; toast('Arquivo enviado. Lembre de salvar!'); }
        catch (e) { prog.textContent = ''; toast(e.message || 'Falha no envio', true); }
        btn.disabled = false; pick.value = '';
      });
      row.append(...[prev, txt, btn, open, pick, prog].filter(Boolean)); wrap.append(row); break; }
    case 'list': wrap.append(listEl(def, get, set)); break;
    default: { const el = document.createElement('input'); el.type = 'text'; el.value = v ?? ''; bindInput(el); }
  }
  return wrap;
}
function listEl(def, get, set) {
  const box = document.createElement('div'); box.className = 'list';
  const arr = () => { let a = get(); if (!Array.isArray(a)) { a = []; set(a); } return a; };
  const draw = () => {
    box.innerHTML = '';
    arr().forEach((item, i) => {
      const card = document.createElement('div'); card.className = 'item';
      const head = document.createElement('div'); head.className = 'item-head';
      head.innerHTML = `<b>${esc(item[def.itemLabel] || `Item ${i + 1}`)}</b>
        <button type="button" class="mini" data-a="up" aria-label="Mover para cima" title="Mover para cima">↑</button>
        <button type="button" class="mini" data-a="down" aria-label="Mover para baixo" title="Mover para baixo">↓</button>
        <button type="button" class="mini danger" data-a="del" aria-label="Excluir" title="Excluir">✕</button>`;
      head.addEventListener('click', async e => {
        const a = e.target.closest('[data-a]')?.dataset.a; if (!a) return;
        const list = arr();
        if (a === 'up' && i > 0) [list[i - 1], list[i]] = [list[i], list[i - 1]];
        if (a === 'down' && i < list.length - 1) [list[i + 1], list[i]] = [list[i], list[i + 1]];
        if (a === 'del') {
          if (!confirm(`Excluir "${item[def.itemLabel] || 'este item'}"?`)) return;
          const files = ['pdf', 'cover', 'thumbnail'].map(k => item[k]).filter(u => u && String(u).includes('/storage/v1/object/public/'));
          list.splice(i, 1);
          if (files.length && confirm('Também apagar os arquivos enviados deste item do armazenamento?')) {
            try { await Promise.all(files.map(removeStored)); } catch { toast('Não foi possível apagar algum arquivo.', true); }
          }
        }
        markDirty(); draw();
      });
      card.append(head);
      const grid = document.createElement('div'); grid.className = 'grid2';
      def.fields.forEach(fd => {
        const el = fieldEl(fd, () => item[fd.key], val => { item[fd.key] = val; if (fd.key === def.itemLabel) head.querySelector('b').textContent = val || `Item ${i + 1}`; });
        if (['textarea', 'list', 'image', 'pdf', 'video', 'paragraphs'].includes(fd.type)) el.style.gridColumn = '1 / -1';
        grid.append(el);
      });
      card.append(grid); box.append(card);
    });
    const add = Object.assign(document.createElement('button'), { type: 'button', className: 'btn btn-ghost btn-sm add', textContent: '+ Adicionar' });
    add.addEventListener('click', () => {
      const n = def.newItem ? def.newItem() : Object.fromEntries(def.fields.map(f => [f.key, f.type === 'list' ? [] : '']));
      if ('id' in n || def.itemLabel === 'title') n.id = n.id || `${slug(n.title || 'item')}-${Date.now().toString(36)}`;
      arr().push(n); markDirty(); draw();
      box.lastElementChild.previousElementSibling?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    box.append(add);
  };
  draw();
  return box;
}

// ───────── tabs + panels ─────────
function renderTabs() {
  $('#a-tabs').innerHTML = Object.entries(T).map(([k, t]) => `<button role="tab" data-tab="${k}" aria-selected="${k === currentTab}">${esc(t.label)}</button>`).join('');
}
function renderPanel() {
  const panel = $('#a-panel'); panel.innerHTML = '';
  T[currentTab].sections.forEach(sec => {
    const s = document.createElement('section'); s.className = 'a-section';
    s.innerHTML = `<h2>${esc(sec.title)}</h2>${sec.help ? `<p class="help">${esc(sec.help)}</p>` : '<p class="help"></p>'}`;
    sec.fields.forEach(fd => s.append(fieldEl(fd, () => getP(state, fd.path), v => setP(state, fd.path, v))));
    panel.append(s);
  });
}
$('#a-tabs').addEventListener('click', e => {
  const b = e.target.closest('[data-tab]'); if (!b) return;
  currentTab = b.dataset.tab; renderTabs(); renderPanel(); scrollTo({ top: 0 });
});

// ───────── save / export ─────────
function clean(data) {
  // drop empty links, keep ids, normalise videos
  (data.materials || []).forEach(m => { m.links = (m.links || []).filter(l => l.url); if (!m.id) m.id = `${slug(m.title)}-${Date.now().toString(36)}`; });
  (data.videos?.items || []).forEach(v => { if (v.url && !youtubeId(v.url) && !/^https?:/i.test(v.url)) v.url = ''; });
  return data;
}
$('#btn-save').addEventListener('click', async () => {
  const data = clean(structuredClone(state));
  if (!sb) { download(data); toast('Baixei o content.json: envie para a pasta data/ do GitHub.'); markDirty(false); return; }
  const btn = $('#btn-save'); btn.disabled = true; btn.textContent = 'Salvando…';
  const { error } = await sb.from('site_content').upsert({ id: CONTENT_ROW_ID, data, updated_at: new Date().toISOString() });
  btn.disabled = false; btn.textContent = 'Salvar alterações';
  if (error) { toast('Não foi possível salvar: ' + error.message, true); return; }
  markDirty(false); toast('Salvo! O site já está atualizado ♡');
});
function download(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'content.json' });
  document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
$('#btn-export').addEventListener('click', () => download(clean(structuredClone(state))));

// ───────── auth + boot ─────────
async function openEditor() {
  state = (await loadContent()).data;
  $('#view-login').hidden = true; $('#view-setup').hidden = !!sb ? true : $('#view-setup').hidden;
  $('#btn-demo').hidden = true;
  $('#view-editor').hidden = false; $('#a-actions').hidden = false; $('#btn-logout').hidden = !sb;
  renderTabs(); renderPanel(); markDirty(false);
}
$('#login-form').addEventListener('submit', async e => {
  e.preventDefault();
  const f = new FormData(e.target); const err = $('#login-error'); err.textContent = '';
  const btn = e.target.querySelector('button'); btn.disabled = true;
  const { error } = await sb.auth.signInWithPassword({ email: f.get('email'), password: f.get('password') });
  btn.disabled = false;
  if (error) { err.textContent = 'E-mail ou senha incorretos.'; return; }
  openEditor();
});
$('#btn-logout').addEventListener('click', async () => {
  if (dirty && !confirm('Há alterações não salvas. Sair mesmo assim?')) return;
  dirty = false; await sb.auth.signOut(); location.reload();
});
$('#btn-demo').addEventListener('click', () => openEditor());

(async function boot() {
  if (!hasBackend()) { $('#view-setup').hidden = false; $('#btn-save').textContent = 'Salvar (baixar content.json)'; openEditor(); return; }
  try { sb = await getClient(); } catch { $('#view-setup').hidden = false; return; }
  const { data } = await sb.auth.getSession();
  if (data.session) openEditor(); else $('#view-login').hidden = false;
})();
