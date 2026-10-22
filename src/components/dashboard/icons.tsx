import type { CSSProperties } from "react"

export type DashIconName =
    | "home"
    | "folder"
    | "github"
    | "info"
    | "mail"
    | "pin"
    | "terminal"
    | "grid"
    | "phone"
    | "utensils"
    | "chart"
    | "gamepad"
    | "commit"
    | "star"
    | "code"
    | "layers"
    | "target"
    | "arrow-right"
    | "arrow-left"
    | "moon"
    | "sun"
    | "menu"
    | "close"
    | "search"
    | "send"
    | "copy"
    | "check"
    | "external"
    | "refresh"
    | "download"
    | "user"
    | "repo"
    | "lock"

interface Props {
    name: DashIconName
    size?: number
    className?: string
    style?: CSSProperties
}

const GITHUB_PATH =
    "M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.1c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.07.78 2.16v3.2c0 .31.21.67.8.55C19.71 21.39 23 17.08 23 12 23 5.73 18.27.5 12 .5"

/** Ícones de traço do dashboard (20×20), a herdar a cor do texto. */
export function DashIcon({ name, size = 16, className, style }: Props) {
    if (name === "github") {
        return (
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className={className}
                style={style}
            >
                <path d={GITHUB_PATH} />
            </svg>
        )
    }

    const common = {
        width: size,
        height: size,
        viewBox: "0 0 20 20",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.6,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": true,
        className,
        style,
    } as const

    switch (name) {
        case "home":
            return (
                <svg {...common}>
                    <path d="M3 9.4 10 3.7l7 5.7V17H3z" />
                    <path d="M8 17v-4.2h4V17" />
                </svg>
            )
        case "folder":
            return (
                <svg {...common}>
                    <path d="M2.6 6h5l1.6 2h8.2v8.4h-14.8z" />
                </svg>
            )
        case "info":
            return (
                <svg {...common}>
                    <circle cx="10" cy="10" r="7" />
                    <path d="M10 9.2v4.4M10 6.6v.4" />
                </svg>
            )
        case "mail":
            return (
                <svg {...common}>
                    <rect x="2.4" y="4.6" width="15.2" height="10.8" rx="1.6" />
                    <path d="m3.6 6.2 6.4 5.1 6.4-5.1" />
                </svg>
            )
        case "pin":
            return (
                <svg {...common}>
                    <path d="M10 17s5.2-4.8 5.2-8.2A5.2 5.2 0 0 0 4.8 8.8C4.8 12.2 10 17 10 17z" />
                    <circle cx="10" cy="8.7" r="1.9" />
                </svg>
            )
        case "terminal":
            return (
                <svg {...common}>
                    <rect x="2.4" y="4" width="15.2" height="12" rx="1.6" />
                    <path d="m6.2 8.4 2 2-2 2M10.8 12.4h3" />
                </svg>
            )
        case "grid":
            return (
                <svg {...common}>
                    <rect x="2.8" y="2.8" width="6" height="6" rx="1.4" />
                    <rect x="11.2" y="2.8" width="6" height="6" rx="1.4" />
                    <rect x="2.8" y="11.2" width="6" height="6" rx="1.4" />
                    <rect x="11.2" y="11.2" width="6" height="6" rx="1.4" />
                </svg>
            )
        case "phone":
            return (
                <svg {...common}>
                    <rect x="5.4" y="2.6" width="9.2" height="14.8" rx="2.2" />
                    <path d="M9 15.4h2" />
                </svg>
            )
        case "utensils":
            return (
                <svg {...common}>
                    <path d="M6.2 3.2v5.6a2 2 0 0 0 4 0V3.2M8.2 9v7.8" />
                    <path d="M14 3.2c-1 1.2-1.4 2.4-1.4 3.9 0 1.3.6 2 1.4 2.1v7.6" />
                </svg>
            )
        case "chart":
            return (
                <svg {...common}>
                    <circle cx="10" cy="10" r="7" />
                    <path d="M10 3v7h7" />
                </svg>
            )
        case "gamepad":
            return (
                <svg {...common}>
                    <rect x="2.6" y="6.2" width="14.8" height="7.6" rx="3.4" />
                    <path d="M6.4 10h2.4M7.6 8.8v2.4M12.8 9.4h.2M14.6 11h.2" />
                </svg>
            )
        case "commit":
            return (
                <svg {...common}>
                    <circle cx="10" cy="10" r="2.8" />
                    <path d="M2.4 10h4.8M12.8 10h4.8" />
                </svg>
            )
        case "star":
            return (
                <svg {...common}>
                    <path d="m10 2.9 2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L2.8 8.1l5-.7z" />
                </svg>
            )
        case "code":
            return (
                <svg {...common}>
                    <path d="m7.2 6.4-3.4 3.6 3.4 3.6M12.8 6.4l3.4 3.6-3.4 3.6M11.2 4.4 8.8 15.6" />
                </svg>
            )
        case "layers":
            return (
                <svg {...common}>
                    <path d="m10 2.8 6.6 3.4L10 9.6 3.4 6.2z" />
                    <path d="m3.4 10.6 6.6 3.4 6.6-3.4M3.4 14.4l6.6 3.4 6.6-3.4" />
                </svg>
            )
        case "target":
            return (
                <svg {...common}>
                    <circle cx="10" cy="10" r="6.8" />
                    <circle cx="10" cy="10" r="3.2" />
                    <path d="M10 10h.01" />
                </svg>
            )
        case "arrow-right":
            return (
                <svg {...common}>
                    <path d="M3.6 10h12M11.4 6l4 4-4 4" />
                </svg>
            )
        case "arrow-left":
            return (
                <svg {...common}>
                    <path d="M16.4 10h-12M8.6 6l-4 4 4 4" />
                </svg>
            )
        case "menu":
            return (
                <svg {...common}>
                    <path d="M3.4 6h13.2M3.4 10h13.2M3.4 14h13.2" />
                </svg>
            )
        case "close":
            return (
                <svg {...common}>
                    <path d="m5.2 5.2 9.6 9.6M14.8 5.2l-9.6 9.6" />
                </svg>
            )
        case "search":
            return (
                <svg {...common}>
                    <circle cx="9" cy="9" r="5.2" />
                    <path d="m13 13 3.6 3.6" />
                </svg>
            )
        case "send":
            return (
                <svg {...common}>
                    <path d="M3.2 10 16.8 4l-4.2 13-2.8-5-6.6-2z" />
                </svg>
            )
        case "copy":
            return (
                <svg {...common}>
                    <rect x="7" y="7" width="8.6" height="9" rx="1.6" />
                    <path d="M12.6 4.4H5.8c-.9 0-1.6.7-1.6 1.6v7.2" />
                </svg>
            )
        case "check":
            return (
                <svg {...common}>
                    <path d="m4.6 10.4 3.6 3.6 7.2-8" />
                </svg>
            )
        case "external":
            return (
                <svg {...common}>
                    <path d="M11 3.6h5.4V9" />
                    <path d="m16.2 3.8-6.6 6.6" />
                    <path d="M14 12.4v3.2c0 .7-.6 1.2-1.2 1.2H4.8c-.7 0-1.2-.5-1.2-1.2V7.6c0-.6.5-1.2 1.2-1.2h3.2" />
                </svg>
            )
        case "download":
            return (
                <svg {...common}>
                    <path d="M10 3.4v8.2M6.6 8.6 10 12l3.4-3.4M3.8 16.4h12.4" />
                </svg>
            )
        case "user":
            return (
                <svg {...common}>
                    <circle cx="10" cy="7" r="3.1" />
                    <path d="M4.4 16.2c1.7-2.4 3.4-3.5 5.6-3.5s3.9 1.1 5.6 3.5" />
                </svg>
            )
        case "refresh":
            return (
                <svg {...common}>
                    <path d="M16.2 10a6.2 6.2 0 1 1-1.8-4.4" />
                    <path d="M16.4 3.6v4h-4" />
                </svg>
            )
        case "sun":
            return (
                <svg {...common}>
                    <circle cx="10" cy="10" r="3.4" />
                    <path d="M10 2.4v1.6M10 16v1.6M2.4 10h1.6M16 10h1.6M4.6 4.6l1.1 1.1M14.3 14.3l1.1 1.1M15.4 4.6l-1.1 1.1M5.7 14.3l-1.1 1.1" />
                </svg>
            )
        case "moon":
            return (
                <svg {...common}>
                    <path d="M15.4 12.4A6.6 6.6 0 0 1 7.6 4.6a6.6 6.6 0 1 0 7.8 7.8z" />
                </svg>
            )
        case "lock":
            return (
                <svg {...common}>
                    <rect x="4.4" y="8.6" width="11.2" height="8" rx="1.8" />
                    <path d="M7 8.6V6.8a3 3 0 0 1 6 0v1.8" />
                </svg>
            )
        case "repo":
        default:
            return (
                <svg {...common}>
                    <path d="M4 4.2h8.4l3.6 3.6v8H4z" />
                    <path d="M12.4 4.2v3.6H16" />
                </svg>
            )
    }
}
