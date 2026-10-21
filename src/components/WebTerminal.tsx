import { useCallback, useMemo, useRef, useState } from "react"
import { useGlobalShortcuts } from "../hooks/useGlobalShortcuts"
import { useTerminal } from "../hooks/useTerminal"
import type { PaletteItem, ProjectRecord, SectionKey, SiteConfig } from "../types"
import { CommandPalette } from "./CommandPalette"
import { Footer } from "./Footer"
import { Header } from "./Header"
import { ProjectModal } from "./ProjectModal"
import { ProjectsSection } from "./ProjectsSection"
import { RightPanel } from "./RightPanel"
import { SectionPanel } from "./SectionPanel"
import { Sidebar } from "./Sidebar"
import { TerminalPanel } from "./TerminalPanel"

interface Props {
    config: SiteConfig
    projects: ProjectRecord[]
    accentColor?: string
}

export function WebTerminal({ config, projects, accentColor = "#C4F500" }: Props) {
    const gridRef = useRef<HTMLDivElement>(null)
    const [section, setSection] = useState<SectionKey>("inicio")
    const [modalId, setModalId] = useState<string | null>(null)
    const [paletteOpen, setPaletteOpen] = useState(false)

    const selected = useMemo(
        () => projects.find((p) => p.id === modalId) ?? null,
        [modalId, projects]
    )

    const scrollToProjects = useCallback(() => {
        gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, [])

    const openProject = useCallback((id: string) => setModalId(id), [])

    const terminal = useTerminal({
        config,
        projects,
        onSection: (key) => {
            setSection(key)
            if (key === "projetos") scrollToProjects()
        },
        onOpenProject: openProject,
    })
    const { inputRef, setMode } = terminal

    const goTo = useCallback(
        (key: SectionKey) => {
            setSection(key)
            if (key === "inicio") setMode("welcome")
            if (key === "projetos") scrollToProjects()
            if (key === "terminal") inputRef.current?.focus()
        },
        [inputRef, scrollToProjects, setMode]
    )

    useGlobalShortcuts({
        dialogOpen: paletteOpen || selected !== null,
        onTogglePalette: () => setPaletteOpen((v) => !v),
        onSection: goTo,
        focusTerminal: () => inputRef.current?.focus(),
        focusFirstCard: () =>
            document.querySelector<HTMLElement>("[data-lab-card='true']")?.focus(),
    })

    const paletteItems = useMemo<PaletteItem[]>(() => {
        const sections: [string, SectionKey][] = [
            ["Início", "inicio"], ["Projetos", "projetos"], ["Terminal", "terminal"],
            ["Sobre", "about"], ["Skills", "skills"], ["Documentação", "docs"],
            ["Downloads", "downloads"], ["Contacto", "contact"],
        ]
        return [
            ...sections.map(([label, key]) => ({
                type: "section" as const,
                label,
                action: () => goTo(key),
            })),
            ...["help", "clear", "home", "downloads"].map((cmd) => ({
                type: "command" as const,
                label: cmd,
                action: () => terminal.run(cmd),
            })),
            ...projects.map((p) => ({
                type: "project" as const,
                label: `${p.title} · open ${p.projectSlug} · ${p.technologies}`,
                action: () => openProject(p.id),
            })),
        ]
    }, [goTo, openProject, projects, terminal])

    return (
        <div className="app" style={{ ["--accent" as string]: accentColor }}>
            <Header config={config} onOpenPalette={() => setPaletteOpen(true)} />
            <main className="layout">
                <Sidebar config={config} active={section} onSelect={goTo} />
                <div className="center">
                    <SectionPanel section={section} projects={projects} />
                    <TerminalPanel
                        config={config}
                        prompt={terminal.prompt}
                        mode={terminal.mode}
                        entries={terminal.entries}
                        input={terminal.input}
                        onInput={terminal.setInput}
                        onKeyDown={terminal.onKeyDown}
                        inputRef={terminal.inputRef}
                        scrollRef={terminal.scrollRef}
                    />
                    <ProjectsSection
                        projects={projects}
                        gridRef={gridRef}
                        onOpen={openProject}
                        onSeeAll={() => goTo("projetos")}
                    />
                </div>
                <RightPanel
                    config={config}
                    projects={projects}
                    onRun={terminal.run}
                    onOpenProject={openProject}
                    onOpenPalette={() => setPaletteOpen(true)}
                />
            </main>
            <Footer config={config} prompt={terminal.prompt} />

            {paletteOpen && (
                <CommandPalette items={paletteItems} onClose={() => setPaletteOpen(false)} />
            )}
            {selected && <ProjectModal project={selected} onClose={() => setModalId(null)} />}
        </div>
    )
}
