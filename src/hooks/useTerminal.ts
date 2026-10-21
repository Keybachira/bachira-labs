import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type KeyboardEvent,
} from "react"
import { COMMANDS, SECTION_COMMANDS, SECTION_TEXT } from "../constants"
import type {
    HistoryItem,
    ProjectRecord,
    SectionKey,
    SiteConfig,
    TerminalEntry,
} from "../types"
import { resolvePath } from "../utils/path"
import { tokenize } from "../utils/tokenize"

interface Options {
    config: SiteConfig
    projects: ProjectRecord[]
    onSection: (section: SectionKey) => void
    onOpenProject: (id: string) => void
}

export function useTerminal({
    config,
    projects,
    onSection,
    onOpenProject,
}: Options) {
    const { userName, welcomeText, location } = config
    const [path, setPath] = useState<string[]>(["home", userName])
    const [entries, setEntries] = useState<TerminalEntry[]>([])
    const [mode, setMode] = useState<"welcome" | "output">("welcome")
    const [input, setInput] = useState("")
    const [history, setHistory] = useState<HistoryItem[]>([])
    const [historyIndex, setHistoryIndex] = useState(-1)
    const inputRef = useRef<HTMLInputElement>(null)
    const scrollRef = useRef<HTMLDivElement>(null)
    const counter = useRef(0)

    useEffect(() => {
        setPath(["home", userName])
    }, [userName])

    const prompt = useMemo(() => {
        const full = "/" + path.join("/")
        const home = `/home/${userName}`
        const shown = full === home ? "~" : full.replace(home, "~")
        return `${userName}@bachira-labs:${shown} %`
    }, [path, userName])

    const readme = useMemo(
        () =>
            `${welcomeText}\n\nAmbiente simulado no navegador.\nEste conteúdo é seguro e não executa pacotes reais.\nUse 'help' para lista de comandos.`,
        [welcomeText]
    )

    useEffect(() => {
        const el = scrollRef.current
        if (el) el.scrollTop = el.scrollHeight
    }, [entries])

    const run = useCallback(
        (raw: string) => {
            const text = raw.trim()
            if (!text) return
            const [first = "", ...args] = tokenize(text)
            const command = first.toLowerCase()
            const snapshot = prompt
            const nextHistory = [
                ...history,
                { command: text, promptSnapshot: snapshot },
            ]
            setHistory(nextHistory)
            setHistoryIndex(-1)
            setMode("output")

            if (command === "clear") {
                setEntries([])
                return
            }

            const batch: TerminalEntry[] = []
            const push = (type: TerminalEntry["type"], line: string) => {
                counter.current += 1
                batch.push({
                    id: `entry-${counter.current}`,
                    type,
                    text: line,
                    promptSnapshot: snapshot,
                })
            }
            push("command", text)

            if (command === "help") {
                push(
                    "output",
                    "Comandos seguros: help, home, projects, about, skills, downloads, docs, contact, open <slug>, echo, date, clear, pwd, whoami, ls, cd, cat, history, uname, neofetch"
                )
            } else if (command === "home") {
                onSection("inicio")
                setMode("welcome")
                push("output", "Página inicial restaurada.")
            } else if (SECTION_COMMANDS.includes(command)) {
                onSection(command === "projects" ? "projetos" : (command as SectionKey))
                push("output", SECTION_TEXT[command] ?? "")
            } else if (command === "open") {
                const target = args.join(" ").toLowerCase()
                const found = projects.find(
                    (p) =>
                        p.projectSlug.toLowerCase() === target ||
                        p.title.toLowerCase() === target
                )
                if (!found) {
                    push("error", "Projeto não encontrado no catálogo atual.")
                } else {
                    onOpenProject(found.id)
                    push("output", `Abrindo detalhes de ${found.title}.`)
                }
            } else if (command === "echo") {
                push("output", args.join(" "))
            } else if (command === "date") {
                push("output", new Date().toLocaleString("pt-PT"))
            } else if (command === "pwd") {
                push("output", "/" + path.join("/"))
            } else if (command === "whoami") {
                push("output", userName)
            } else if (command === "ls") {
                const target = args[0] || "."
                const resolved = resolvePath(path, target, userName)
                if (!resolved) {
                    push("error", `ls: caminho inválido '${target}'`)
                } else {
                    const p = "/" + resolved.join("/")
                    push(
                        "output",
                        p === "/"
                            ? "home"
                            : p === "/home"
                              ? userName
                              : p.endsWith("/projects")
                                ? "README.txt"
                                : "projects"
                    )
                }
            } else if (command === "cd") {
                const target = args[0] || "~"
                const resolved = resolvePath(path, target, userName)
                if (!resolved) push("error", `cd: '${target}' não existe`)
                else setPath(resolved)
            } else if (command === "cat") {
                const target = args[0] || ""
                const absolute = target.startsWith("/")
                    ? target
                    : "/" + [...path, target].filter(Boolean).join("/")
                if (absolute === `/home/${userName}/projects/README.txt`) {
                    push("output", readme)
                } else {
                    push("error", `cat: ${target || "(vazio)"}: ficheiro não encontrado`)
                }
            } else if (command === "history") {
                push(
                    "output",
                    nextHistory
                        .map((h, i) => `${i + 1} ${h.promptSnapshot} ${h.command}`)
                        .join("\n")
                )
            } else if (command === "uname") {
                push("output", "BachiraLabOS DEMO")
            } else if (command === "neofetch") {
                push(
                    "output",
                    `${userName}@bachira-labs\nOS: Sandbox Simulada\nShell: zsh parser local\nLocation: ${location}\nStatus: SEM execução externa`
                )
            } else {
                push("error", `Comando "${command}" não reconhecido. Digite "help".`)
            }

            setEntries((prev) => [...prev, ...batch].slice(-200))
        },
        [history, location, onOpenProject, onSection, path, projects, prompt, readme, userName]
    )

    const complete = useCallback(() => {
        const parts = tokenize(input)
        const token = parts[parts.length - 1] ?? ""
        const head = (parts[0] ?? "").toLowerCase()
        let candidate: string | undefined
        if (parts.length <= 1) {
            candidate = COMMANDS.find((c) => c.startsWith(token.toLowerCase()))
            if (candidate) setInput(`${candidate} `)
        } else if (head === "open") {
            candidate = projects
                .map((p) => p.projectSlug)
                .find((s) => s.toLowerCase().startsWith(token.toLowerCase()))
            if (candidate) setInput(`open ${candidate}`)
        } else {
            candidate = [
                "~",
                "projects",
                "README.txt",
                `/home/${userName}/projects`,
            ].find((item) => item.startsWith(token))
            if (candidate) setInput([...parts.slice(0, -1), candidate].join(" "))
        }
        return Boolean(candidate)
    }, [input, projects, userName])

    const onKeyDown = useCallback(
        (event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter") {
                const text = input
                setInput("")
                run(text)
            } else if (event.key === "ArrowUp") {
                event.preventDefault()
                if (!history.length) return
                const next =
                    historyIndex < 0 ? history.length - 1 : Math.max(historyIndex - 1, 0)
                setHistoryIndex(next)
                setInput(history[next]?.command ?? "")
            } else if (event.key === "ArrowDown") {
                event.preventDefault()
                if (!history.length || historyIndex < 0) return
                const next = historyIndex + 1
                if (next >= history.length) {
                    setHistoryIndex(-1)
                    setInput("")
                } else {
                    setHistoryIndex(next)
                    setInput(history[next]?.command ?? "")
                }
            } else if (event.key === "Tab") {
                if (event.shiftKey || input.trim() === "") return
                if (complete()) event.preventDefault()
            } else if (event.ctrlKey && event.key.toLowerCase() === "l") {
                event.preventDefault()
                setEntries([])
            }
        },
        [complete, history, historyIndex, input, run]
    )

    return {
        entries,
        mode,
        setMode,
        input,
        setInput,
        prompt,
        run,
        onKeyDown,
        inputRef,
        scrollRef,
    }
}
