import { useEffect, useId, useRef, type ReactNode } from "react"
import { DashIcon } from "../dashboard/icons"

interface Props {
    open: boolean
    title: string
    onClose: () => void
    children: ReactNode
    footer?: ReactNode
}

export function Dialog({ open, title, onClose, children, footer }: Props) {
    const panelRef = useRef<HTMLDivElement>(null)
    const titleId = useId()

    useEffect(() => {
        if (!open) return

        const previous = document.activeElement as HTMLElement | null
        panelRef.current?.focus()

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault()
                onClose()
                return
            }
            if (event.key !== "Tab" || !panelRef.current) return

            const focusable = panelRef.current.querySelectorAll<HTMLElement>(
                'a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])'
            )
            if (focusable.length === 0) return
            const first = focusable[0]
            const last = focusable[focusable.length - 1]

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault()
                last.focus()
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault()
                first.focus()
            }
        }

        document.addEventListener("keydown", onKeyDown)
        const { overflow } = document.body.style
        document.body.style.overflow = "hidden"

        return () => {
            document.removeEventListener("keydown", onKeyDown)
            document.body.style.overflow = overflow
            previous?.focus()
        }
    }, [open, onClose])

    if (!open) return null

    return (
        <div
            className="overlay"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose()
            }}
        >
            <div
                className="dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                tabIndex={-1}
                ref={panelRef}
            >
                <header className="dialog__head">
                    <h2 className="dialog__title" id={titleId}>
                        {title}
                    </h2>
                    <button type="button" className="icon-btn" onClick={onClose} aria-label="Fechar">
                        <DashIcon name="close" size={15} />
                    </button>
                </header>

                <div className="dialog__body">{children}</div>
                {footer && <footer className="dialog__foot">{footer}</footer>}
            </div>
        </div>
    )
}
