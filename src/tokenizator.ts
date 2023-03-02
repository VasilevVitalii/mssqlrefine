import { GetWorld, TWorldMap, TWorldKinds } from "./world"

export type TTokenKind =
    'boundary' |
    'code' |
    'code-in-bracket' |
    'comment-single' |
    'comment-multi' |
    'string' |
    'comma' |
    'semicolon' |
    'operator' |
    'point'

export type TTokenLineChunk = { idx: number, deepImpartible?: number, kind: TTokenKind } & TWorldKinds

export type TTokenLine = {
    chunks: TTokenLineChunk[]
}

export type TParseOption = {
    startAt?: TTokenLine[] | TTokenLineChunk | undefined
}

export const operator = ['+', '-', '%', '=', '<', '>', '!', '(', ')', '/', '*']

const space = new RegExp(/[\u00A0\s]/, 'gi')

export function Parse(text: string[], worldList: TWorldMap[], option?: TParseOption): TTokenLine[] {
    const result = [] as TTokenLine[]

    let startChunk = option?.startAt ? (Array.isArray(option.startAt) ? getLastChunk(option.startAt) : option.startAt) : undefined

    if (startChunk) {
        if (startChunk.kind === 'code-in-bracket' || startChunk.kind === 'comment-multi' || startChunk.kind === 'string') {
            if (startChunk.deepImpartible <= 0) {
                startChunk = undefined
            }
        } else {
            startChunk = undefined
        }
    }

    let buffKind = startChunk ? startChunk.kind : undefined as TTokenKind
    let deepImpartible = startChunk ? (startChunk.deepImpartible || 0) : 0 as number

    text.forEach(lineText => {
        const line = { chunks: [] } as TTokenLine

        let buffStartIdx = 0

        for (let chidx = 0; chidx < lineText.length; chidx++) {
            const ch = lineText[chidx]

            if (!buffKind) {
                deepImpartible = 0
                buffKind = getKindStart(ch, chidx, lineText)
                if (buffKind === 'comma' || buffKind === 'semicolon' || buffKind === 'operator' || buffKind === 'point') {
                    line.chunks.push({ idx: chidx, kind: buffKind, kindCode: undefined, text: ch })
                    buffKind = undefined
                    continue
                } if (buffKind === 'comment-single') {
                    line.chunks.push({ idx: chidx, kind: buffKind, kindCode: undefined, text: lineText.substring(chidx) })
                    buffKind = undefined
                    break
                } else if (buffKind === 'comment-multi') {
                    buffStartIdx = chidx
                    chidx++
                    deepImpartible = 1
                    continue
                } else if (buffKind === 'string') {
                    buffStartIdx = chidx
                    deepImpartible = 1
                    continue
                } else if (buffKind === 'code-in-bracket') {
                    buffStartIdx = chidx
                    deepImpartible = 1
                    continue
                } else {
                    buffStartIdx = chidx
                    continue
                }
            }

            if (buffKind === 'boundary') {
                if (!(ch === ` ` || space.test(ch))) {
                    line.chunks.push({ idx: buffStartIdx, kind: buffKind, kindCode: undefined, text: lineText.substring(buffStartIdx, chidx) })
                    buffKind = null
                    chidx--
                }
                continue
            }

            if (buffKind === 'string') {
                if (ch === '\'') {
                    const nech = getNech(chidx, lineText)
                    if (nech !== '\'') {
                        deepImpartible--
                        line.chunks.push({ idx: buffStartIdx, deepImpartible: deepImpartible, kind: buffKind, kindCode: undefined, text: lineText.substring(buffStartIdx, chidx + 1) })
                        buffKind = null
                    } else {
                        chidx++
                    }
                }
                continue
            }

            if (buffKind === 'code-in-bracket') {
                if (ch === ']') {
                    deepImpartible--
                    line.chunks.push({ idx: buffStartIdx, deepImpartible: deepImpartible, kind: buffKind, kindCode: undefined, text: lineText.substring(buffStartIdx, chidx + 1) })
                    buffKind = null
                }
                continue
            }

            if (buffKind === 'comment-multi') {
                if (ch === '*') {
                    const nech = getNech(chidx, lineText)
                    if (nech === '/') {
                        deepImpartible--
                        if (deepImpartible <= 0) {
                            line.chunks.push({ idx: buffStartIdx, deepImpartible: deepImpartible, kind: buffKind, kindCode: undefined, text: lineText.substring(buffStartIdx, chidx + 2) })
                            buffKind = null
                        }
                        chidx++
                    }
                }
                if (ch === '/') {
                    const nech = getNech(chidx, lineText)
                    if (nech === '*') {
                        deepImpartible++
                    }
                    chidx++
                }
                continue
            }

            //code
            if (ch === ',' || ch === ';' || ch === '.' || (ch !== '-' && ch !== '/' && operator.includes(ch))) {
                line.chunks.push({ idx: buffStartIdx, kind: buffKind, ...GetWorld(worldList, lineText.substring(buffStartIdx, chidx)) })
                line.chunks.push({ idx: chidx, kind: ch === ',' ? 'comma' : ch === ';' ? 'semicolon' : ch === '.' ? 'point' : 'operator', kindCode: undefined, text: ch })
                buffKind = undefined
                continue
            }

            if (ch === '-') {
                const nech = getNech(chidx, lineText)
                if (nech === '-') {
                    line.chunks.push({ idx: buffStartIdx, kind: buffKind, ...GetWorld(worldList, lineText.substring(buffStartIdx, chidx)) })
                    line.chunks.push({ idx: chidx, kind: buffKind, kindCode: undefined, text: lineText.substring(chidx) })
                    buffKind = undefined
                    break
                } else {
                    line.chunks.push({ idx: buffStartIdx, kind: buffKind, ...GetWorld(worldList, lineText.substring(buffStartIdx, chidx)) })
                    line.chunks.push({ idx: chidx, kind: 'operator', kindCode: undefined, text: ch })
                    buffKind = undefined
                    continue
                }
            }

            if (ch === ` ` || space.test(ch)) {
                line.chunks.push({ idx: buffStartIdx, kind: buffKind, ...GetWorld(worldList, lineText.substring(buffStartIdx, chidx)) })
                buffKind = 'boundary'
                buffStartIdx = chidx
                continue
            }

            if (ch === '\'') {
                line.chunks.push({ idx: buffStartIdx, kind: buffKind, ...GetWorld(worldList, lineText.substring(buffStartIdx, chidx)) })
                deepImpartible = 1
                buffKind = 'string'
                buffStartIdx = chidx
                continue
            }

            if (ch === '[') {
                line.chunks.push({ idx: buffStartIdx, kind: buffKind, ...GetWorld(worldList, lineText.substring(buffStartIdx, chidx)) })
                deepImpartible = 1
                buffKind = 'code-in-bracket'
                buffStartIdx = chidx
                continue
            }

            if (ch === '/') {
                const nech = getNech(chidx, lineText)
                if (nech === '*') {
                    line.chunks.push({ idx: buffStartIdx, kind: buffKind, ...GetWorld(worldList, lineText.substring(buffStartIdx, chidx)) })
                    deepImpartible = 1
                    buffKind = 'comment-multi'
                    buffStartIdx = chidx
                    chidx++
                } else {
                    line.chunks.push({ idx: buffStartIdx, kind: buffKind, ...GetWorld(worldList, lineText.substring(buffStartIdx, chidx)) })
                    line.chunks.push({ idx: chidx, kind: 'operator', kindCode: undefined, text: ch })
                    buffKind = undefined
                }
                continue
            }
        }

        if (buffKind) {
            if (buffKind === 'code') {
                line.chunks.push({ idx: buffStartIdx, kind: buffKind, ...GetWorld(worldList, lineText.substring(buffStartIdx)) })
            } else {
                line.chunks.push({
                    idx: buffStartIdx,
                    deepImpartible: buffKind === 'comment-multi' || buffKind === 'code-in-bracket' || buffKind === 'string' ? deepImpartible : undefined,
                    kind: buffKind,
                    kindCode: undefined,
                    text: lineText.substring(buffStartIdx)
                })
            }
        }

        result.push(line)
    })

    return result
}

function getNech(chidx: number, line: string): string | undefined {
    const nechidx = chidx + 1
    return line.length > nechidx ? line[nechidx] : undefined
}

function getKindStart(ch: string, chidx: number, lineText: string): TTokenKind {
    if (ch === ',') return 'comma'
    if (ch === ';') return 'semicolon'
    if (ch === '\'') return 'string'
    if (ch === '[') return 'code-in-bracket'
    if (space.test(ch)) return 'boundary'
    if (operator.includes(ch) && ch !== '-' && ch !== '/') return 'operator'
    if (ch === '-' || ch === '/') {
        const nech = getNech(chidx, lineText)
        if (ch === '-' && nech !== '-') return 'operator'
        if (ch === '/' && nech !== '*') return 'operator'
        if (ch === '-' && nech === '-') return 'comment-single'
        if (ch === '/' && nech === '*') return 'comment-multi'
    }
    return 'code'
}

function getLastChunk(tokens: TTokenLine[]): TTokenLineChunk {
    if (!tokens) return undefined
    for (let i = tokens.length - 1; i >= 0; i--) {
        const line = tokens[i]
        if (line.chunks.length > 0) return line.chunks[line.chunks.length - 1]
    }
    return undefined
}