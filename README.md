# Aquiles_Bachira Repository

Portefólio pessoal (React + Vite + TypeScript) com cinco páginas, dados reais do
GitHub, tema claro/escuro e layout responsivo. Sem dependências de UI.

## Correr

```bash
npm install
npm run dev        # desenvolvimento
npm run build      # typecheck (tsc --noEmit) + build de produção
npm run preview    # serve o build
```

## Páginas

Navegação por hash, sem router externo (`src/router.tsx`):

| Rota | Página | Conteúdo |
| --- | --- | --- |
| `#/` | Início | hero, 4 projetos em destaque, estatísticas, commits, linguagens, detalhes, repositórios e mapa de atividade |
| `#/projetos` | Projetos | catálogo completo com pesquisa e filtro por tipo |
| `#/projetos/:id` | Detalhe | abre o projeto em diálogo (link partilhável; `Esc` fecha) |
| `#/github` | GitHub | perfil, números, commits, linguagens e repositórios |
| `#/sobre` | Sobre | percurso, foco atual e princípios de trabalho |
| `#/contacto` | Contacto | formulário validado que abre o cliente de email (mailto) |

## Estrutura

```
src/
├── App.tsx                  # provider do GitHub + shell + página da rota
├── router.tsx               # rotas por hash, <Link>, navigate()
├── constants.ts             # config por defeito (marca, email, local)
├── types.ts
├── data/projects.ts         # catálogo; os 4 primeiros são os destaques
├── context/GitHubContext.tsx# uma única chamada a useGitHub para o site todo
├── services/github.ts       # API do GitHub (perfil, repos, commits, linguagens, atividade)
├── hooks/useGitHub.ts       # estado, cache e erro
├── utils/                   # format, heatmap, files, links
├── pages/                   # HomePage, ProjectsPage, GitHubPage, AboutPage, ContactPage
├── components/
│   ├── layout/Shell.tsx     # moldura fixa, tema, aviso de erro, menu mobile
│   ├── dashboard/           # TopBar, SideNav, MobileNav, Hero, painéis, ProjectCard/Detail
│   └── ui/                  # Dialog (foco + Esc), Skeleton, EmptyState, PageHead
└── styles.css               # tokens dos dois temas, grelha e responsividade
```

## Personalizar

- Marca, email, disponibilidade e local: `DEFAULT_CONFIG` em `src/constants.ts`.
- Cor de destaque: `--accent` em `src/styles.css` (tema escuro) e no bloco `[data-theme="light"]`.
- Projetos: `src/data/projects.ts`. `normalizeFiles` aceita chaves em PT (`nome`, `tamanho`, `sistema`) e EN.
- Cada projeto liga ao repositório real quando `projectSlug` coincide com um repo da conta;
  caso contrário o detalhe mostra um email pré-preenchido sobre esse projeto.

## GitHub

A ligação está isolada em `src/services/github.ts` (sem dependências externas).

```bash
cp .env.example .env    # VITE_GITHUB_USERNAME (e VITE_GITHUB_TOKEN, opcional)
```

```tsx
const { data, loading, error, stale, refresh } = useGitHub()
data?.stats.repositories   // nº de repositórios
data?.commits              // últimos commits (todos os repos)
data?.languages            // % por linguagem
data?.contributions        // heatmap do último ano (precisa de token)
```

Sem token a API pública dá ~60 pedidos/hora, por isso as respostas ficam em
`localStorage` durante 20 min (`cacheTtlMs`). Se a API falhar e existir cache, o
hook devolve os dados antigos com `stale: true` e a moldura mostra um aviso que
pode ser fechado ou repetido. Qualquer `VITE_*` fica visível no bundle: usa
apenas um token fine-grained de leitura.

### Permissões do token

O token é opcional, mas sem ele o mapa de contribuições não existe (o GitHub só
o expõe via GraphQL autenticado) e o limite de pedidos cai para 60/hora.

Criar em **GitHub → Settings → Developer settings → Personal access tokens →
Fine-grained tokens**, com estas permissões e nada mais:

| Secção | Permissão | Nível | Porque |
| --- | --- | --- | --- |
| Repository access | — | Public repositories (read-only) | Só repositórios públicos |
| Repository permissions | Contents | Read-only | Commits, linguagens e `search/commits` |
| Repository permissions | Metadata | Read-only | Vem activo por omissão |
| Repository permissions | restantes | No access | Não são usadas |
| Account permissions | Profile | Read-only | `contributionsCollection` (heatmap) |
| Account permissions | Email addresses | No access | O site não lê emails da API |
| Account permissions | Events | No access | O site não consulta eventos |
| Account permissions | Followers | No access | Seguidores vêm do endpoint público |

> **Nota de segurança.** `VITE_GITHUB_TOKEN` é embutido no JavaScript servido ao
> browser, ou seja, qualquer visitante pode extraí-lo. Daí as regras: só leitura,
> nunca escrita, e as permissões de conta reduzidas ao mínimo. Uma permissão
> `Email addresses: Read-only` permitiria a quem extraísse o token listar os teus
> emails privados via `GET /user/emails`. Se o token for comprometido, revoga-o
> logo em GitHub.

Depois de colar o token no `.env`, valida-o antes de relies no dashboard:

```bash
npm run check:token
```

O script testa o perfil, os commits, as linguagens, o `search/commits`, o
GraphQL do heatmap e o `rate_limit`, e confirma que o token **não** consegue
listar emails. É uma verificação de privilégio mínimo, não só de funcionamento.

## Acessibilidade

- Navegação por teclado com `:focus-visible`, link “saltar para o conteúdo” e
  `aria-current` nos itens ativos.
- Diálogo com `role="dialog"`, foco preso, `Esc` e clique no fundo a fechar.
- Formulário com `aria-invalid`, mensagens associadas por `aria-describedby` e
  `role="status"` no sucesso.
- `prefers-reduced-motion` desliga transições; tema claro/escuro é persistido em
  `localStorage` e refletido em `meta[name="theme-color"]`.
