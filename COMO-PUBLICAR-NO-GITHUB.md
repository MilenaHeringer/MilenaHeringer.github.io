# Como publicar e atualizar o site no GitHub (grátis)

Seu site vai ficar em um endereço como **https://SEU-USUARIO.github.io**, aberto para qualquer pessoa.
Tudo (textos, PDFs, capas de livros e vídeos curtos) fica guardado no próprio GitHub, sem precisar de Supabase.

---

## Parte 1 · Publicar pela primeira vez (uns 15 minutos)

### 1. Crie sua conta
Entre em <https://github.com/signup> e crie uma conta. O **nome de usuário** vai aparecer no link do site
(ex.: usuário `milenaheringer` → site `https://milenaheringer.github.io`).

### 2. Instale o GitHub Desktop
Baixe em <https://desktop.github.com>, instale e entre com a sua conta.
> Por que o aplicativo? Pelo navegador o GitHub só aceita arquivos de até **25 MB**, e o seu resumo de Histologia tem 34 MB. Pelo GitHub Desktop o limite é **100 MB por arquivo**.

### 3. Crie o repositório (a "pasta" do site)
No GitHub Desktop: **File → New repository…**
- **Name:** `SEU-USUARIO.github.io` (exatamente o seu usuário + `.github.io`)
- **Local path:** escolha onde guardar (ex.: Documentos)
- Clique em **Create repository**.

### 4. Coloque os arquivos do site
1. Clique em **Show in Explorer** (abre a pasta do repositório).
2. Copie **tudo que está dentro** da pasta `site` (index.html, admin.html, css, js, data, assets, materiais…) e cole nessa pasta.
3. Volte ao GitHub Desktop: no canto inferior esquerdo, em *Summary*, escreva `primeira versão do site` e clique em **Commit to main**.
4. Clique em **Publish repository** no topo e **desmarque** "Keep this code private". Depois clique em **Publish repository**.

### 5. Ative o GitHub Pages
1. No site do GitHub, abra o seu repositório (**Repository → View on GitHub**, no Desktop).
2. Vá em **Settings → Pages**.
3. Em **Branch**, escolha `main` e a pasta `/ (root)` e clique em **Save**.
4. Espere 1 a 2 minutos e acesse `https://SEU-USUARIO.github.io` 🎉

Esse é o link para colocar na bio do Instagram.

---

## Parte 2 · Atualizar o site (livros, resumos, vídeos, textos)

Sempre o mesmo caminho: **editar no painel → salvar → mandar para o GitHub**.

1. Abra `https://SEU-USUARIO.github.io/admin.html`.
2. Vá na aba desejada (ex.: **Livros → + Adicionar**) e preencha.
   - Para **capa, PDF ou vídeo**, clique em **Escolher…** e selecione o arquivo no seu computador: o caminho é preenchido sozinho (ex.: `livros/capa-netter.jpg`).
3. Clique em **Salvar (baixar content.json)**. O arquivo `content.json` vai para os seus Downloads.
4. Na pasta do repositório (no computador):
   - substitua `data/content.json` pelo que você baixou;
   - coloque os arquivos novos nas pastas indicadas (`livros/`, `materiais/`, `capas/`, `videos/`), **com o mesmo nome** que apareceu no painel.
5. No GitHub Desktop: escreva um resumo (ex.: `novo livro`) → **Commit to main** → **Push origin**.
6. Em 1 a 2 minutos o site está atualizado (se não aparecer, recarregue com Ctrl+F5).

> Dica: use nomes de arquivo **sem espaços e sem acentos** (ex.: `atlas-netter.jpg`).

### Exemplo de livro (se preferir editar o `content.json` direto no GitHub)
No GitHub, abra `data/content.json` → ícone de lápis ✏️ → procure `"books"` → dentro de `"items": [ … ]` adicione (com vírgula entre um livro e outro):

```json
{
  "id": "anatomia-sobotta",
  "title": "Título do livro",
  "author": "Nome do autor",
  "area": "Anatomia",
  "edition": "1ª edição",
  "description": "Por que eu indico esse livro.",
  "cover": "livros/nome-da-capa.jpg",
  "url": ""
}
```
Depois clique em **Commit changes**. A capa vai na pasta `livros/` (botão **Add file → Upload files**, para arquivos até 25 MB).

---

## Parte 3 · Vídeos

Você tem duas opções para cada vídeo no painel (aba **Vídeos**):

| Opção | Quando usar |
|---|---|
| **Link do YouTube** | vídeos longos ou em boa qualidade. Não pesa nada no site e a miniatura aparece sozinha. |
| **Arquivo .mp4 na pasta `videos/`** | vídeos curtos (Reels, cortes). Cada arquivo pode ter **até 100 MB**, mas o ideal é **menos de 30 MB** para abrir rápido no celular. |

Limites do GitHub Pages: o site todo deve ficar abaixo de **1 GB**. Por isso, o melhor é deixar vídeos grandes no YouTube e só os curtinhos no GitHub.

Para diminuir um vídeo antes de enviar: use o app gratuito **HandBrake** (preset "Social 25 MB 2 Minutes 720p30"), ou exporte em 720p no CapCut.

---

## Se você usa o terminal (opcional)
Dentro da pasta do repositório:
```bash
git add .
git commit -m "atualiza o site"
git push
```

## Painel com senha (opcional)
O GitHub Pages hospeda páginas, mas não tem login com senha. Por isso, no fluxo do GitHub, o painel serve para **editar e gerar o content.json**; quem publica é o seu commit no GitHub (só você tem acesso ao repositório).
Se um dia quiser enviar PDFs direto pelo navegador, com login, o site também aceita o Supabase: veja o `LEIA-ME.md`.
