export function resolvePath(
    currentPath: string[],
    inputPath: string,
    userName: string
): string[] | null {
    const homePath = ["home", userName]
    if (!inputPath || inputPath === "~") return [...homePath]
    let next = inputPath.startsWith("/") ? [] : [...currentPath]
    for (const part of inputPath.split("/").filter(Boolean)) {
        if (part === ".") continue
        if (part === "..") next = next.slice(0, -1)
        else if (part === "~") next = [...homePath]
        else next.push(part)
    }
    const path = "/" + next.join("/")
    const valid = [
        "/",
        "/home",
        `/home/${userName}`,
        `/home/${userName}/projects`,
    ]
    return valid.includes(path) ? next : null
}
