import type { SectionKey, SiteConfig } from "./types"

export const DEFAULT_CONFIG: SiteConfig = {
    userName: "visitor",
    welcomeText: "Uma linha de comando. Infinitas possibilidades.",
    brandName: "BACHIRA LABS",
    tagline: "> explore. build. automate. _",
    location: "Angola/Benguela",
}

export const COMMANDS = [
    "help", "home", "projects", "about", "skills", "downloads", "docs",
    "contact", "open", "echo", "date", "clear", "pwd", "whoami", "ls",
    "cd", "cat", "history", "uname", "neofetch",
]

export const SECTION_COMMANDS = [
    "projects", "about", "skills", "downloads", "docs", "contact",
]

export interface NavItem {
    label: string
    key: SectionKey
    icon: string
}

export const NAV_ITEMS: NavItem[] = [
    { label: "Início", key: "inicio", icon: "home" },
    { label: "Projetos", key: "projetos", icon: "folder" },
    { label: "Terminal", key: "terminal", icon: "terminal" },
    { label: "Sobre", key: "about", icon: "user" },
    { label: "Skills", key: "skills", icon: "code" },
    { label: "Documentação", key: "docs", icon: "doc" },
    { label: "Downloads", key: "downloads", icon: "download" },
    { label: "Contacto", key: "contact", icon: "mail" },
]

export const SECTION_TEXT: Record<string, string> = {
    about: "Sobre: laboratório de produtos digitais, experimentação e automação segura.",
    skills: "Skills: TypeScript, React, APIs seguras, UX de produto, automação.",
    downloads: "Downloads: listagem apenas de ficheiros com URL real http(s).",
    docs: "Documentação: comandos permitidos e atalhos de teclado para navegação e terminal.",
    contact: "Contacto: configure os dados de contacto em src/constants.ts.",
    projects: "Projetos em destaque.",
    projetos: "Projetos em destaque.",
    terminal: "Terminal simulado: escreve 'help' para ver os comandos.",
    inicio: "Início: visão geral da sandbox.",
}

export const SHORTCUTS_TEXT =
    "Atalhos: Alt+1 Início · Alt+2 Projetos · Alt+3 Terminal · Ctrl/Cmd+K Paleta · Ctrl+L Limpar."
