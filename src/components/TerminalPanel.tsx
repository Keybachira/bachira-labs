import type { RefObject, KeyboardEvent } from "react"
import type { SiteConfig, TerminalEntry } from "../types"
import { HeroPortrait } from "./HeroPortrait"

interface Props {
    config: SiteConfig
    prompt: string
    mode: "welcome" | "output"
    entries: TerminalEntry[]
    input: string
    onInput: (value: string) => void
    onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void
    inputRef: RefObject<HTMLInputElement>
    scrollRef: RefObject<HTMLDivElement>
}

export function TerminalPanel({
    config, prompt, mode, entries, input, onInput, onKeyDown, inputRef, scrollRef,
}: Props) {
    return (
        <section className="terminal" aria-label="Terminal">
            <div className="terminal__main">
                <div className="traffic" aria-hidden="true">
                    <span style={{ background: "#FF5F57" }} />
                    <span style={{ background: "#FEBC2E" }} />
                    <span style={{ background: "#28C840" }} />
                </div>
                <div className="muted small">{prompt}</div>

                {mode === "welcome" ? (
                    <div className="welcome">
                        <svg className="welcome__logo" width="110" height="110" viewBox="0 0 120 120" aria-hidden="true">
                            <path d="M20 98 46 20h18l-24 78z" fill="var(--accent)" />
                            <path d="M54 98 68 20h30c12 0 18 6 18 14 0 10-8 16-18 17 9 1 14 7 14 15 0 19-16 32-40 32zM80 44h14c5 0 8-2 8-6 0-3-2-5-7-5H84zm-6 33h14c7 0 12-3 12-9 0-5-3-7-10-7H78z" fill="var(--accent)" />
                        </svg>
                        <div>
                            <h1>{config.brandName}</h1>
                            <p className="muted small">SOFTWARE ECOSYSTEM / ANGOLA</p>
                            <p className="muted small welcome__list">
                                Projetos demonstrativos<br />
                                Ferramentas úteis<br />
                                Sandbox seguro<br />
                                Construído por Aquiles_Bachira
                            </p>
                        </div>
                    </div>
                ) : (
                    <div ref={scrollRef} className="output" role="log" aria-live="polite">
                        {entries.map((entry) => (
                            <div key={entry.id} className={`line line--${entry.type}`}>
                                {entry.type === "command"
                                    ? `${entry.promptSnapshot} ${entry.text}`
                                    : entry.text}
                            </div>
                        ))}
                    </div>
                )}

                <label className="prompt-row">
                    <span className="prompt-row__label">{prompt}</span>
                    <input
                        ref={inputRef}
                        aria-label="Entrada do terminal"
                        value={input}
                        onChange={(e) => onInput(e.target.value)}
                        onKeyDown={onKeyDown}
                        autoComplete="off"
                        autoCapitalize="off"
                        spellCheck={false}
                    />
                </label>
            </div>
            <HeroPortrait />
        </section>
    )
}
