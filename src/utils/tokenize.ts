export function tokenize(input: string): string[] {
    const tokens: string[] = []
    const pattern = /"([^"]*)"|'([^']*)'|`([^`]*)`|([^\s]+)/g
    let match = pattern.exec(input)
    while (match) {
        tokens.push(match[1] ?? match[2] ?? match[3] ?? match[4] ?? "")
        match = pattern.exec(input)
    }
    return tokens
}
