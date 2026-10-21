import type { ProjectRecord } from "../types"
import { normalizeFiles } from "../utils/files"

/**
 * Catálogo de projetos (substitui o "registo CMS" do Framer).
 * Edita aqui, ou carrega de uma API/JSON e passa por normalizeFiles().
 * Os primeiros quatro aparecem em "Projetos em destaque".
 */
export const PROJECTS: ProjectRecord[] = [
    {
        id: "omilu-map",
        title: "OmíTu Geo",
        description: "Mapa utilitário demonstrativo com foco em simplicidade e performance.",
        longDescription:
            "Utilitário de mapas para explorar locais perto de ti sem ruído visual. Carrega tiles em camadas, guarda marcadores no browser e funciona bem em ligações lentas — o objectivo era provar que um mapa pode ser rápido e simples ao mesmo tempo.",
        kind: "map web",
        technologies: "React,TypeScript,Leaflet",
        version: "0.1.0",
        year: "2025",
        status: "beta",
        features: [
            "Mapa interativo com Leaflet e camadas OSM",
            "Pesquisa por localidade com resultados instantâneos",
            "Marcadores guardados localmente, sem conta",
        ],
        installCommand: "",
        requirements: "Navegador moderno",
        demoUrl: "",
        projectSlug: "omitu-geo",
        files: [],
    },
    {
        id: "depsandbox-cli",
        title: "DeepSandbox",
        description: "Ambiente CLI simulado e seguro para testar dependências e comandos.",
        longDescription:
            "Sandbox de linha de comandos para experimentar dependências e scripts sem sujar a máquina. Cada sessão corre num ambiente isolado, com histórico de comandos e saída reproduzível — útil para testar instalações duvidosas antes de as usar a sério.",
        kind: "cli",
        technologies: "Rust,Node.js",
        version: "0.2.1",
        year: "2025",
        status: "online",
        features: [
            "Sessões isoladas com reset num comando",
            "Histórico e saída reproduzível",
            "Binário único, sem dependências de sistema",
        ],
        installCommand: "npm i depsandbox (exemplo não publicado)",
        requirements: "Node 18+",
        demoUrl: "",
        projectSlug: "deep-sandbox",
        files: normalizeFiles([
            {
                name: "depsandbox-linux.tar.gz",
                url: "https://example.com/depsandbox-linux.tar.gz",
                size: "4.2 MB",
                os: "Linux",
                checksum: "a1b2c3",
            },
        ]),
    },
    {
        id: "vault-grid",
        title: "Vault Grid",
        description: "Gestor de ativos com navegação lateral e interface moderna.",
        longDescription:
            "Aplicação desktop para organizar ativos digitais em grelhas, com navegação lateral, filtros rápidos e sincronização opcional via Supabase. Interface pensada para teclado e sessões longas.",
        kind: "desktop",
        technologies: "Vue.js,Tailwind,Supabase",
        version: "0.1.0",
        year: "2026",
        status: "wip",
        features: [
            "Grelhas configuráveis com filtros instantâneos",
            "Atalhos de teclado para tudo",
            "Sincronização opcional entre dispositivos",
        ],
        installCommand: "",
        requirements: "Windows 10+ ou Linux",
        demoUrl: "",
        projectSlug: "vault-grid",
        files: normalizeFiles([
            {
                nome: "vault-grid-setup.exe",
                url: "https://example.com/vault-grid-setup.exe",
                tamanho: "18 MB",
                sistema: "Windows",
            },
        ]),
    },
    {
        id: "mesa-restaurant",
        title: "Mesa Restaurante",
        description: "Menu digital para restauração local com painel administrativo.",
        longDescription:
            "Menu digital para restaurantes locais: o cliente vê o menu em segundos, o restaurante actualiza pratos e preços sem tocar em código. Inclui painel administrativo simples e funcionamento offline.",
        kind: "web",
        technologies: "React,TS,Firebase",
        version: "0.1.0",
        year: "2025",
        status: "beta",
        features: [
            "Menu público leve e responsivo",
            "Painel para gerir pratos, preços e disponibilidade",
            "Modo offline com sincronização posterior",
        ],
        installCommand: "",
        requirements: "Navegador moderno",
        demoUrl: "",
        projectSlug: "mesa-restaurante",
        files: [],
    },
    {
        id: "stats-board",
        title: "Stats Board",
        description: "Painel de métricas com demo local.",
        longDescription:
            "Painel de métricas em SVG puro, sem bibliotecas de gráficos. Explora visualizações compactas para ecrãs pequenos e actualização incremental dos dados.",
        kind: "web dashboard",
        technologies: "Next.js,SVG",
        version: "0.3.0",
        year: "2024",
        status: "wip",
        features: ["Gráficos em SVG sem dependências", "Layout adaptado a ecrãs pequenos"],
        installCommand: "",
        requirements: "Navegador moderno",
        demoUrl: "",
        projectSlug: "stats-board",
        files: [],
    },
    {
        id: "skyline-gold",
        title: "Skyline Gold",
        description: "Jogo de arcade minimalista em pixel art.",
        longDescription:
            "Arcade minimalista em Canvas: desvia-te de obstáculos, acumula pontos e compete contigo mesmo. Feito para correr a 60 fps em qualquer portátil.",
        kind: "game",
        technologies: "JS,Canvas",
        version: "0.5.0",
        year: "2024",
        status: "online",
        features: ["Física simples com colisões precisas", "Recordes guardados localmente"],
        installCommand: "",
        requirements: "Navegador moderno",
        demoUrl: "",
        projectSlug: "skyline-gold",
        files: [],
    },
]
