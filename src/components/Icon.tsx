interface IconProps {
    type: string
    color?: string
    size?: number
}

export function Icon({ type, color = "currentColor", size = 14 }: IconProps) {
    const common = {
        width: size,
        height: size,
        viewBox: "0 0 20 20",
        fill: "none",
        stroke: color,
        strokeWidth: 1.8,
        "aria-hidden": true,
    } as const
    switch (type) {
        case "home":
            return (
                <svg {...common}>
                    <path d="M3 9.5 10 4l7 5.5V17H3z" />
                    <path d="M8 17v-4h4v4" />
                </svg>
            )
        case "folder":
            return (
                <svg {...common}>
                    <path d="M2.5 6.5h5l1.5 2H17.5v8.5h-15z" />
                </svg>
            )
        case "terminal":
            return (
                <svg {...common}>
                    <path d="M3 4.5h14v11H3z" />
                    <path d="m6 9 2 2-2 2M10.5 13H14" />
                </svg>
            )
        case "user":
            return (
                <svg {...common}>
                    <circle cx="10" cy="7" r="3.2" />
                    <path d="M4.5 16c1.7-2.3 3.3-3.4 5.5-3.4 2.2 0 3.8 1.1 5.5 3.4" />
                </svg>
            )
        case "code":
            return (
                <svg {...common}>
                    <path d="m7.5 6-3 4 3 4M12.5 6l3 4-3 4M11 4l-2 12" />
                </svg>
            )
        case "doc":
            return (
                <svg {...common}>
                    <path d="M5 3.5h7l3 3V16.5H5z" />
                    <path d="M12 3.5v3h3M7.5 10.5h5M7.5 13.5h5" />
                </svg>
            )
        case "download":
            return (
                <svg {...common}>
                    <path d="M10 3.5v8M6.5 8.8 10 12.2l3.5-3.4M4 16h12" />
                </svg>
            )
        default:
            return (
                <svg {...common}>
                    <path d="M3 5h14v10H3z" />
                    <path d="m4 6 6 5 6-5" />
                </svg>
            )
    }
}
