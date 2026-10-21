# Bachira Labs

Dashboard com terminal simulado, paleta de comandos e catálogo de projetos.
Versão React + Vite + TypeScript, separada em componentes a partir do `WebTerminal.tsx` do Framer.

## Correr

```bash
npm install
npm run dev        # desenvolvimento
npm run build      # typecheck + build de produção
```

## Estrutura

```
src/
├── App.tsx                  # liga config + dados ao WebTerminal
├── constants.ts             # config por defeito, comandos, navegação, textos
├── types.ts
├── data/projects.ts         # catálogo (edita aqui os cartões)
├── hooks/
│   ├── useTerminal.ts       # parser de comandos, histórico, Tab, Ctrl+L
│   └── useGlobalShortcuts.ts# Ctrl/Cmd+K, Alt+1/2/3, setas entre cartões
├── utils/                   # tokenize, links, files, path
├── components/
│   ├── WebTerminal.tsx      # composição e estado global
│   ├── Header / Sidebar / Footer
│   ├── TerminalPanel / HeroPortrait
│   ├── ProjectsSection / LabProjectCard / AppThumbnail
│   ├── RightPanel / SectionPanel
│   ├── CommandPalette / ProjectModal / TopLayerDialog
│   └── Icon
└── styles.css               # tema por variáveis CSS (--accent, --border, ...)
```

## Personalizar

- Marca, utilizador, tagline e local: `DEFAULT_CONFIG` em `src/constants.ts`.
- Cor de destaque: prop `accentColor` do `WebTerminal`.
- Projetos: `src/data/projects.ts`. `normalizeFiles` aceita chaves em PT (`nome`, `tamanho`, `sistema`) e EN.

## Atalhos

Alt+1 Início · Alt+2 Projetos · Alt+3 Terminal · Ctrl/Cmd+K paleta · Ctrl+L limpar · setas ←/→ entre cartões.
