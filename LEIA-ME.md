# Site · Milena Heringer

Site estático (HTML, CSS e JavaScript, sem etapa de build), leve e rápido no celular.
O conteúdo fica em `data/content.json` e, depois que o Supabase estiver configurado, passa a ser editado pelo **painel** (`/admin.html`).

```
index.html          site
admin.html          painel administrativo (login com e-mail e senha)
css/                estilos (identidade: off-white, vinho #722F45, dourado #C5A15A)
js/                 código (main.js = site, admin.js = painel, doll.js = boneca animada)
data/content.json   todo o conteúdo inicial (textos, resumos, livros, redes…)
materiais/          PDFs dos resumos e o cronograma ENARE
assets/             boneca, avatar, ícones, imagem de compartilhamento
supabase/schema.sql estrutura do banco e do armazenamento
```

## 1. Publicar e atualizar o site (grátis) → GitHub Pages

Siga o **[COMO-PUBLICAR-NO-GITHUB.md](COMO-PUBLICAR-NO-GITHUB.md)**: criar a conta, subir os arquivos, ativar o GitHub Pages e atualizar livros, resumos e vídeos pelo painel (`admin.html`).

(O site também funciona no Netlify, Vercel ou Cloudflare Pages sem nenhuma configuração extra.)

> Para testar no computador, o site precisa de um servidor local (abrir o `index.html` com dois cliques não carrega o conteúdo). Exemplo: na pasta `site`, rode `npx serve` ou use a extensão "Live Server" do VS Code.

## 2. (Opcional) Painel com login e envio de arquivos pelo navegador · Supabase

Só é necessário se você quiser enviar PDFs direto pelo site, com senha, sem passar pelo GitHub.

1. Crie uma conta em <https://supabase.com> e clique em **New project** (guarde a senha do banco em lugar seguro).
2. Abra **SQL Editor → New query**, cole o conteúdo de `supabase/schema.sql`, **troque `SEU-EMAIL@exemplo.com` pelo seu e-mail** e clique em **Run**.
3. Vá em **Authentication → Users → Add user → Create new user**, use o mesmo e-mail e crie uma senha forte (marque *Auto Confirm User*).
4. Em **Authentication → Sign In / Providers**, desative **Allow new users to sign up** (assim ninguém mais cria conta).
5. Em **Project Settings → API**, copie a **Project URL** e a chave **anon public** e cole em `js/config.js`:
   ```js
   export const SUPABASE_URL = 'https://xxxx.supabase.co';
   export const SUPABASE_ANON_KEY = 'eyJ…';
   ```
6. Publique o site de novo (passo 1) e acesse `seu-site/admin.html`.

No painel você pode: enviar e excluir PDFs de resumos, adicionar e editar livros, colar links de vídeos do YouTube, atualizar redes sociais, trocar a foto e alterar todos os textos. Clique em **Salvar alterações**: o site é atualizado na hora.

A chave *anon* é pública por natureza; quem protege os dados são as regras criadas pelo `schema.sql` (só o seu e-mail pode alterar conteúdo e arquivos). Limite do plano gratuito: 1 GB de arquivos, até 50 MB por arquivo.

**Sem Supabase:** o painel ainda funciona em modo "editar e baixar": você edita, clica em **Baixar content.json** e substitui o arquivo `data/content.json` antes de publicar.

## 3. Coisas para preencher

- **Odon Concursos**: logo e link na aba *Trajetória → Parceria* (cupom MILENAODON já está no site).
- **Vídeos**: aba *Vídeos*; link do YouTube ou arquivo `.mp4` da pasta `videos/`.

## Detalhes técnicos

- Respeita "reduzir movimento" do sistema (as animações e a boneca ficam paradas).
- A boneca é a ilustração original animada por WebGL (piscar, sorriso, cabelo e cabeça), igual à vinheta; ela pausa quando sai da tela para economizar bateria.
- Segurança: Content-Security-Policy, todo conteúdo é escapado antes de ir para a página e só links `http(s)`, `mailto` e `tel` são aceitos.
- SEO: título, descrição, Open Graph (`assets/og-image.jpg`), dados estruturados e HTML semântico.
