export function HeroPortrait() {
    return (
        <div className="portrait" aria-hidden="true">
            <svg viewBox="0 0 340 304" width="100%" height="100%">
                <rect width="340" height="304" fill="#03070C" />
                {Array.from({ length: 22 }).map((_, i) => (
                    <path
                        key={i}
                        d={`M${120 + i * 6} ${20 + (i % 4) * 3} L${96 + i * 6} ${2 + (i % 5) * 2} L${132 + i * 7} ${28 + (i % 4) * 4} Z`}
                        fill={i % 2 ? "#0B0D10" : "#13161A"}
                    />
                ))}
                <path d="M112 78 L170 56 L241 85 L248 166 L216 245 L149 246 L108 210 L95 144 Z" fill="#2A3020" />
                <path d="M171 88 L227 104 L228 156 L203 216 L154 226 L123 200 L112 145 L127 105 Z" fill="#313A27" />
                <path d="M175 136 Q186 128 200 135 Q186 146 174 142 Z" fill="var(--accent)" />
                <circle cx="190" cy="136" r="2" fill="#0A0D08" />
                <path d="M167 136 Q190 124 204 132" stroke="#0A0D08" strokeWidth="2" fill="none" />
                <path d="M110 210 L184 204 L220 287 L137 287 Z" fill="#0B1118" />
                <path d="M206 212 L235 289 L212 289 L180 206 Z" fill="var(--accent)" />
                <path d="M132 230 L151 288 L126 288 L100 236 Z" fill="var(--accent)" />
                <path d="M226 124 L246 118 L240 148 Z" fill="var(--accent)" />
                <path d="M151 90 L208 83 L220 96 L160 105 Z" fill="#14181E" />
                {Array.from({ length: 10 }).map((_, i) => (
                    <path key={i} d={`M${142 + i * 8} ${64 + i} L${148 + i * 8} ${42 + i}`} stroke="var(--accent)" strokeWidth="0.8" />
                ))}
                <rect x="292" y="26" width="2" height="232" fill="var(--accent)" />
                <text x="300" y="56" fill="var(--accent)" fontSize="10">ラ</text>
                <text x="300" y="70" fill="var(--accent)" fontSize="10">ボ</text>
                <text x="296" y="92" fill="#9AC7DF" fontSize="8">BACHIRA</text>
            </svg>
        </div>
    )
}
