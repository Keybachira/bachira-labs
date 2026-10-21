export function Skeleton({ width = "100%", height = 12 }: { width?: number | string; height?: number | string }) {
    return <span className="skeleton" style={{ width, height }} aria-hidden="true" />
}

export function SkeletonRows({ rows = 3, height = 11 }: { rows?: number; height?: number }) {
    return (
        <div className="skeleton-rows" aria-hidden="true">
            {Array.from({ length: rows }).map((_, index) => (
                <Skeleton key={index} width={index % 2 === 0 ? "100%" : "78%"} height={height} />
            ))}
        </div>
    )
}
