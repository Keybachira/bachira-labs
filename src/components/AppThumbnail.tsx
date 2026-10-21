interface Props {
    slug: string
    kind: string
    accentColor?: string
}

const svgProps = { viewBox: "0 0 224 88", width: "100%", height: "100%", "aria-hidden": true } as const

export function AppThumbnail({ slug, kind, accentColor = "#C4F500" }: Props) {
    const s = slug.toLowerCase()

    if (s.includes("omilu") || s.includes("map")) {
        return (
            <svg {...svgProps}>
                <rect width="224" height="88" fill="#C4F500" />
                <rect x="9" y="11" width="206" height="68" rx="4" fill="#060A0A" />
                <path d="M18 63 Q45 42 70 50 T120 45 T171 53 T210 44" stroke="#C4F500" strokeWidth="2" fill="none" />
                <circle cx="60" cy="46" r="4" fill="#C4F500" />
                <circle cx="151" cy="54" r="3" fill="#88E7B0" />
                <text x="18" y="26" fill="#C4F500" fontSize="9">Omilu</text>
            </svg>
        )
    }
    if (s.includes("vault") || s.includes("grid")) {
        return (
            <svg {...svgProps}>
                <rect width="224" height="88" fill="#0A1118" />
                <rect x="8" y="8" width="208" height="72" rx="4" fill="#0F1924" stroke="#18394E" />
                <rect x="8" y="8" width="44" height="72" fill="#0B141E" />
                {["vault", "secure", "assets"].map((t, i) => (
                    <text key={t} x="14" y={22 + i * 12} fill="#9AC7DF" fontSize="7">{t}</text>
                ))}
                {Array.from({ length: 5 }).map((_, i) => (
                    <rect key={i} x={58} y={17 + i * 12} width={145 - i * 14} height="7" fill="#173145" />
                ))}
            </svg>
        )
    }
    if (s.includes("shell") || s.includes("cli") || s.includes("terminal")) {
        return (
            <svg {...svgProps}>
                <rect width="224" height="88" fill="#07111B" />
                <rect x="8" y="8" width="208" height="72" rx="4" fill="#0B1723" stroke="#18394E" />
                <rect x="8" y="8" width="208" height="12" fill="#101D2A" />
                <circle cx="18" cy="14" r="2" fill="#ff5f57" />
                <circle cx="26" cy="14" r="2" fill="#febc2e" />
                <circle cx="34" cy="14" r="2" fill="#28c840" />
                {["$ depsandbox init", "$ npm run check", "$ status: demo"].map((t, i) => (
                    <text key={t} x="16" y={34 + i * 14} fill={i === 2 ? accentColor : "#9AC7DF"} fontSize="8">{t}</text>
                ))}
            </svg>
        )
    }
    if (s.includes("audio") || s.includes("music")) {
        return (
            <svg {...svgProps}>
                <rect width="224" height="88" fill="#101421" />
                <rect x="12" y="16" width="60" height="60" fill="#1E2638" />
                <circle cx="42" cy="46" r="16" fill="#2C3550" />
                <circle cx="42" cy="46" r="4" fill={accentColor} />
                {Array.from({ length: 18 }).map((_, i) => (
                    <rect key={i} x={86 + i * 7} y={34 + (i % 5) * 4} width="4" height={12 + ((i * 5) % 20)} fill={i % 3 ? "#88C6E3" : accentColor} />
                ))}
            </svg>
        )
    }
    if (s.includes("skyline") || s.includes("gold")) {
        return (
            <svg {...svgProps}>
                <rect width="224" height="88" fill="#1A140B" />
                <polygon points="25,72 60,36 95,72 60,83" fill="#9E782B" />
                <polygon points="90,74 130,26 170,74 130,87" fill="#C2953A" />
                <polygon points="145,74 182,40 210,74 182,84" fill="#D8AE56" />
                <line x1="12" y1="74" x2="216" y2="74" stroke="#F2CB78" strokeWidth="1.2" />
            </svg>
        )
    }
    if (s.includes("restaurant")) {
        return (
            <svg {...svgProps}>
                <rect width="224" height="88" fill="#2B1E17" />
                <rect x="10" y="10" width="204" height="68" fill="#3A281E" />
                <text x="18" y="28" fill="#F2D4A0" fontSize="10">MENU DA CASA</text>
                {["Massa", "Peixe", "Sobremesa"].map((t, i) => (
                    <text key={t} x="18" y={44 + i * 12} fill="#D2B689" fontSize="8">{t}</text>
                ))}
            </svg>
        )
    }
    if (s.includes("stats") || s.includes("dashboard")) {
        return (
            <svg {...svgProps}>
                <rect width="224" height="88" fill="#0D2034" />
                <rect x="10" y="10" width="204" height="68" fill="#122A44" />
                <rect x="18" y="18" width="44" height="14" fill="#1D446A" />
                <polyline points="20,64 56,50 88,54 124,33 154,44 200,30" stroke="#7AD1FF" strokeWidth="2" fill="none" />
                <rect x="18" y="40" width="18" height="24" fill={accentColor} />
                <rect x="40" y="48" width="18" height="16" fill="#88C6E3" />
            </svg>
        )
    }
    return (
        <svg {...svgProps}>
            <rect width="224" height="88" fill="#08131D" />
            <rect x="8" y="8" width="208" height="72" fill="#0F1E2C" stroke="#18394E" />
            <rect x="8" y="8" width="208" height="12" fill="#132A3A" />
            <text x="16" y="16" fill="#9AC7DF" fontSize="7">{kind || "app"}</text>
            {Array.from({ length: 4 }).map((_, i) => (
                <rect key={i} x="16" y={28 + i * 11} width={150 - i * 16} height="6" fill={i === 1 ? accentColor : "#1B3B55"} />
            ))}
        </svg>
    )
}
