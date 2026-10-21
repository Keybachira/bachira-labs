import { useEffect, useRef, type ReactNode } from "react"

interface Props {
    children: ReactNode
    onClose: () => void
    labelledBy: string
    /** classe aplicada ao fundo (backdrop) que centra o conteúdo */
    className?: string
}

/**
 * <dialog> nativo em showModal(): top layer, focus trap e Esc nativos.
 * O foco volta ao elemento que abriu o diálogo ao fechar.
 */
export function TopLayerDialog({ children, onClose, labelledBy, className }: Props) {
    const ref = useRef<HTMLDialogElement>(null)
    const onCloseRef = useRef(onClose)
    onCloseRef.current = onClose

    useEffect(() => {
        const dialog = ref.current
        if (!dialog) return
        const previous =
            document.activeElement instanceof HTMLElement ? document.activeElement : null
        if (!dialog.open) dialog.showModal()
        const onCancel = (event: Event) => {
            event.preventDefault()
            onCloseRef.current()
        }
        dialog.addEventListener("cancel", onCancel)
        return () => {
            dialog.removeEventListener("cancel", onCancel)
            if (dialog.open) dialog.close()
            if (previous && document.contains(previous)) previous.focus()
        }
    }, [])

    return (
        <dialog
            ref={ref}
            className={`top-dialog ${className ?? ""}`}
            aria-labelledby={labelledBy}
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onCloseRef.current()
            }}
        >
            {children}
        </dialog>
    )
}
