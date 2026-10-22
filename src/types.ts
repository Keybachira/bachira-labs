export interface ProjectMedia {
    /** Imagens do projeto (URLs http(s) ou caminhos em `public/`). A primeira é a capa. */
    images: string[]
    /** Vídeo opcional: YouTube, Vimeo ou URL direta `.mp4`/`.webm`. */
    videoUrl?: string
    /** Texto alternativo da capa. */
    alt?: string
}

export interface ProjectRecord {
    /** Identificador usado na rota `#/projetos/:id`. */
    id: string
    /**
     * Nome exato do repositório no GitHub. É a fonte de stars, forks, commits,
     * licença e releases mostrados na página do projeto.
     */
    repo: string
    title: string
    /** Uma linha, usada no topo da página do projeto. */
    tagline: string
    /** Descrição curta usada nos cartões. */
    description: string
    /** Texto editorial da página (2–3 parágrafos curtos). */
    longDescription: string
    /** Tipo de projeto; ver `kindLabel` em `components/dashboard/visual.ts`. */
    kind: string
    /** Tecnologias para além da linguagem principal detetada pelo GitHub. */
    technologies: string[]
    /** Ano de início (opcional; por omissão usa a data de criação do repositório). */
    year?: string
    /** Aparece em "Projetos em destaque" na página inicial. */
    featured?: boolean
    /** Link de produção/demo, quando existe. */
    demoUrl?: string
    /** Destaques mostrados na página do projeto. */
    features: string[]
    /** Requisitos ou como correr localmente. */
    requirements?: string
    /** Comando de instalação/arranque, mostrado num bloco de código. */
    install?: string
    media: ProjectMedia
}

export interface SiteConfig {
    userName: string
    welcomeText: string
    brandName: string
    tagline: string
    location: string
    /** Email usado no formulário de contacto (mailto). */
    email: string
    /** Frase curta de disponibilidade mostrada no contacto. */
    availability: string
}
