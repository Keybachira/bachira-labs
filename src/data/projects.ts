import type { ProjectRecord } from "../types"

/**
 * Catálogo de projetos reais. Cada entrada aponta para um repositório público
 * da conta (campo `repo`), de onde a página do projeto lê stars, forks, commits,
 * licença e releases. Para acrescentar imagens ou vídeo, preenche `media`
 * (URLs http(s) ou ficheiros em `public/`, ex.: `/projetos/vyra/capa.png`).
 */
export const PROJECTS: ProjectRecord[] = [
    {
        id: "app-financeiro",
        repo: "app-financeiro",
        title: "App Financeiro",
        tagline: "Controla o teu dinheiro em Kwanzas, sem conta e sem internet.",
        description: "Finanças pessoais em Kwanzas (AOA): offline, privado e pensado para Angola.",
        longDescription:
            "A maioria das apps de finanças pede conta, envia os dados para a nuvem e não foi pensada para a nossa realidade. O App Financeiro usa Kwanzas (Kz) como moeda base, interface em português e guarda tudo apenas no telemóvel: sem registo, sem servidor, sem sincronização obrigatória.",
        kind: "app",
        technologies: ["TypeScript", "Android", "iOS", "Offline-first"],
        year: "2026",
        featured: true,
        demoUrl: "https://keybachira.github.io/app-financeiro/",
        features: [
            "Sem conta e sem servidor: os dados nunca saem do telemóvel",
            "Funciona offline a partir do primeiro arranque",
            "Teclado de valores próprio, categorias sugeridas e atalhos",
            "Ações principais ao alcance do polegar, para uso com uma mão",
            "Versão Android distribuída em APK pelas releases do GitHub",
        ],
        requirements: "Android ou iOS · descarregamento direto do APK",
        media: {
            images: [],
            alt: "App Financeiro — controlo de finanças pessoais em Kwanzas",
        },
    },
    {
        id: "vyra-studio",
        repo: "VYRA-STUDIO",
        title: "VYRA Studio",
        tagline: "Your camera. Your space.",
        description: "Câmara flutuante no desktop, estúdio de gravação e presets para criadores.",
        longDescription:
            "O VYRA transforma a webcam numa câmara flutuante que se move, encaixa e redimensiona sobre qualquer aplicação, sem sair do fluxo de trabalho. Junta um estúdio de gravação rápido, capturas de ecrã, presets por contexto (código, reunião, gaming) e uma paleta de comandos para controlar tudo pelo teclado.",
        kind: "desktop",
        technologies: ["Electron", "React", "TypeScript", "ffmpeg"],
        year: "2026",
        featured: true,
        features: [
            "Bolha sempre no topo, com arrasto, encaixe, opacidade e 7 formas",
            "Presets Coding, Recording, Meeting, Gaming e Minimal — ou teus",
            "Gravação de câmara, ecrã ou ambos através de um worker ffmpeg",
            "Capturas de ecrã para a pasta que escolheres",
            "Paleta de comandos (Ctrl + Space) e atalhos globais configuráveis",
            "Tudo processado localmente: sem analytics, telemetria ou nuvem",
        ],
        requirements: "Windows, macOS ou Linux",
        media: {
            images: [],
            alt: "VYRA Studio — câmara flutuante e estúdio de gravação",
        },
    },
    {
        id: "depsandbox",
        repo: "depsandbox",
        title: "depsandbox",
        tagline: "Testa upgrades de dependências antes de tocar no projeto real.",
        description: "CLI em Rust que corre upgrades num sandbox e relata o que quebrou.",
        longDescription:
            "Atualizar dependências é um salto no escuro: o `npm install` passa, os testes correm, mas algo parte em produção. O depsandbox tira um snapshot do projeto, cria uma baseline (duas vezes, para detetar testes instáveis), aplica o upgrade e compara o resultado — devolvendo um relatório do que mudou.",
        kind: "cli",
        technologies: ["Rust", "npm", "Ratatui"],
        year: "2026",
        featured: true,
        features: [
            "Snapshot do projeto antes de qualquer alteração",
            "Baseline executada duas vezes para detetar testes instáveis",
            "Relatórios em Markdown, JSON e HTML, com JSON Schema publicado",
            "TUI com assistente de upgrade e execução ao vivo",
            "Sugere o primeiro pacote desatualizado ao abrir o projeto",
        ],
        requirements: "Rust (cargo) para compilar · projeto Node/npm para testar",
        install: "cargo build --release\ncd o-teu-projeto\ndepsandbox init\ndepsandbox try lodash@5",
        media: {
            images: [],
            alt: "depsandbox — CLI de testes de upgrade de dependências",
        },
    },
    {
        id: "darb-shell",
        repo: "Darb-Shell",
        title: "Darb Shell",
        tagline: "AI-native coding environment for the terminal.",
        description: "IDE agêntico para o terminal, leve e escrito em Rust.",
        longDescription:
            "Darb Shell é um ambiente de desenvolvimento para o terminal com um agente de IA no centro: workspace em crates, indexação do projeto, memória de sessões em SQLite e uma TUI construída com Ratatui — leve o suficiente para correr onde um IDE gráfico não corre.",
        kind: "cli",
        technologies: ["Rust", "Ratatui", "Crossterm", "SQLite"],
        year: "2026",
        featured: true,
        features: [
            "Workspace separado em core, tools, context, memory, providers, agent e TUI",
            "Trait `Provider` com adapter OpenAI, preparado para outros modelos",
            "Indexer, mapa do projeto e seleção de contexto por relevância",
            "Histórico e sessões persistidos em SQLite",
            "Perfis de configuração: eco, fast, local e smart",
        ],
        requirements: "Rust (cargo) · chave de API do provider que escolheres",
        install: "cargo fmt\ncargo check --workspace\ncargo run -p darb",
        media: {
            images: [],
            alt: "Darb Shell — ambiente de desenvolvimento agêntico no terminal",
        },
    },
    {
        id: "kianda",
        repo: "-Cardapio-Digital-Inteligente",
        title: "Kianda — Cardápio Digital",
        tagline: "Cardápio QR-first com pedidos e conta em tempo real.",
        description: "Protótipo Next.js de cardápio digital com painel de cozinha e conta ao vivo.",
        longDescription:
            "Protótipo 100% front-end de um restaurante em Benguela: o cliente lê o QR da mesa, pede pelo telemóvel e acompanha a conta em tempo real; a cozinha recebe o pedido sem recarregar a página. Toda a sincronização acontece entre abas com localStorage e BroadcastChannel — sem servidor, para validar o fluxo antes de ligar uma base de dados a sério.",
        kind: "web dashboard",
        technologies: ["Next.js", "TypeScript", "localStorage", "BroadcastChannel"],
        year: "2026",
        features: [
            "QR por mesa com menu próprio para o cliente",
            "Conta da mesa atualizada ao vivo, a substituir a folha de papel",
            "Painel de cozinha (KDS) com colunas Novo → Em preparo → Pronto → Servido",
            "CRUD do cardápio e prato do dia refletidos no menu do cliente",
            "Sincronização instantânea entre separadores, sem backend",
        ],
        requirements: "Node.js 18+",
        install: "npm install\nnpm run dev",
        media: {
            images: [],
            alt: "Kianda — cardápio digital com pedidos em tempo real",
        },
    },
    {
        id: "gerador-faturas",
        repo: "GeradorFaturas",
        title: "Gerador de Facturas DOKAMA",
        tagline: "Facturas pro-forma em PDF, com pré-visualização em tempo real.",
        description: "App desktop (Electron) que gera facturas pro-forma da DOKAMA e exporta em PDF.",
        longDescription:
            "Ferramenta de desktop para a DOKAMA emitir facturas pro-forma: preenches os dados do cliente e dos produtos, vês a factura a atualizar a cada tecla com o mesmo visual do documento original e exportas em PDF com um clique. A empresa fica fixa; só o cliente e as linhas mudam.",
        kind: "desktop",
        technologies: ["Electron", "JavaScript", "Node.js"],
        year: "2026",
        features: [
            "Pré-visualização fiel à factura original, atualizada a cada tecla",
            "Tabela de produtos/serviços com referência, quantidade e unidade",
            "Exportação em PDF com um clique",
            "Dados da empresa fixos, para não repetir configuração",
        ],
        requirements: "Node.js 18+ · Windows 10/11",
        install: "npm install\nnpm start",
        media: {
            images: [],
            alt: "Gerador de Facturas DOKAMA — aplicação Electron",
        },
    },
    {
        id: "element-chat",
        repo: "ElementChat",
        title: "Element Chat",
        tagline: "Chat em grupo por Bluetooth, sem internet.",
        description: "App Flutter de chat em grupo via Bluetooth Classic e Wi-Fi Direct, com E2E.",
        longDescription:
            "Chat em grupo para onde não há rede: a app liga telemóveis por Bluetooth Classic (SPP), com Wi-Fi Direct como alternativa, elege um líder de mesh e faz relay das mensagens. As conversas ficam em SQLite para sincronizar mais tarde, e o conteúdo é cifrado ponta a ponta com AES-GCM.",
        kind: "app",
        technologies: ["Flutter", "Dart", "Bluetooth SPP", "Wi-Fi Direct", "SQLite"],
        year: "2026",
        features: [
            "Chat em grupo sem internet, por Bluetooth Classic (SPP)",
            "Fallback para Wi-Fi Direct quando disponível",
            "Mesh com eleição de líder e relay de mensagens",
            "Criptografia ponta a ponta com AES-GCM",
            "Mensagens guardadas em SQLite e notificações locais",
        ],
        requirements: "Android com Bluetooth · compilação Flutter",
        install: "flutter pub get\nflutter run",
        media: {
            images: [],
            alt: "Element Chat — chat em grupo por Bluetooth",
        },
    },
    {
        id: "nebulosa",
        repo: "Nebulosa",
        title: "Nebulosa",
        tagline: "Uma experiência digital construída para ir além do comum.",
        description: "Projeto web experimental com identidade própria, React, Vite e Bun.",
        longDescription:
            "Nebulosa é um espaço de experimentação: uma aplicação web com identidade visual própria, arquitetura cliente/servidor e migrações SQL versionadas. Está em desenvolvimento ativo, por isso a arquitetura e as funcionalidades evoluem — o objetivo é construir primeiro a possibilidade e refinar depois.",
        kind: "web",
        technologies: ["TypeScript", "React", "Vite", "Bun", "SQL"],
        year: "2026",
        features: [
            "Identidade visual e experiência próprias, sem template",
            "Cliente React com build em Vite e runtime Bun",
            "Servidor separado com migrações SQL versionadas",
            "Qualidade automatizada com ESLint e Prettier",
        ],
        requirements: "Bun (ou Node.js) para correr localmente",
        install: "bun install\nbun run dev",
        media: {
            images: [],
            alt: "Nebulosa — projeto web experimental",
        },
    },
]

/** Só os projetos marcados como destaque, pela ordem do catálogo. */
export const FEATURED_PROJECTS: ProjectRecord[] = PROJECTS.filter((project) => project.featured)

export function findProject(id: string | undefined): ProjectRecord | undefined {
    if (!id) return undefined
    return PROJECTS.find((project) => project.id === id)
}
