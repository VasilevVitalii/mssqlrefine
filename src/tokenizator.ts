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

export type TTokenLineChunk = {
    idx: number,
    deepCode?: number,
    deepImpartible?: number,
    kind: TTokenKind
} & TWorldKinds

export type TTokenLine = {
    chunks: TTokenLineChunk[]
}

export type TParseOption = {
    startAt?: TTokenLine[] | TTokenLineChunk | undefined,
    checkRelation?: boolean | undefined
}

export const operator = ['+', '-', '%', '=', '<', '>', '!', '(', ')', '/', '*']

const space = new RegExp(/[\u00A0\s]/, 'gi')

export function Get(text: string[], worldList: TWorldMap[], option?: TParseOption): TTokenLine[] {
    const result = [] as TTokenLine[]

    let startChunk = option?.startAt ? (Array.isArray(option.startAt) ? getLastChunk(option.startAt) : option.startAt) : undefined
    let deepCode = startChunk?.deepCode === undefined ? 0 : startChunk?.deepCode

    if (startChunk) {
        if (startChunk.kind === 'code-in-bracket' || startChunk.kind === 'comment-multi' || startChunk.kind === 'string') {
            if (startChunk.deepImpartible <= 0) {
                startChunk = undefined
            }
        } else if (startChunk.kind === 'operator' && startChunk.text === ')') {
            deepCode--
            startChunk = undefined
        } else {
            startChunk = undefined
        }
    }

    let kind = startChunk ? startChunk.kind : undefined as TTokenKind
    let deepImpartible = startChunk ? (startChunk.deepImpartible || 0) : 0 as number

    text.forEach(lineText => {
        const line = { chunks: [] } as TTokenLine

        let buffStartIdx = 0

        for (let idx = 0; idx < lineText.length; idx++) {
            const ch = lineText[idx]

            if (!kind) {
                deepImpartible = 0
                kind = getKindStart(ch, idx, lineText)
                if (kind === 'comment-single') {
                    addChunk(line.chunks, { idx, deepCode, kind, text: lineText.substring(idx) })
                    kind = undefined
                    break
                }

                if (kind === 'comma' || kind === 'semicolon' || kind === 'point') {
                    addChunk(line.chunks, { idx, deepCode, kind, text: ch })
                    kind = undefined
                    continue
                } else if (kind === 'operator') {
                    if (ch === '(') {
                        deepCode++
                    } else if (ch === ')') {
                        deepCode--
                    }
                    addChunk(line.chunks, { idx, deepCode, kind, text: ch })
                    kind = undefined
                    continue
                } else if (kind === 'comment-multi') {
                    buffStartIdx = idx
                    idx++
                    deepImpartible = 1
                    continue
                } else if (kind === 'string') {
                    buffStartIdx = idx
                    deepImpartible = 1
                    continue
                } else if (kind === 'code-in-bracket') {
                    buffStartIdx = idx
                    deepImpartible = 1
                    continue
                } else {
                    buffStartIdx = idx
                    continue
                }
            }

            if (kind === 'boundary') {
                if (!(ch === ` ` || space.test(ch))) {
                    addChunk(line.chunks, { idx: buffStartIdx, deepCode, kind, text: lineText.substring(buffStartIdx, idx) })
                    kind = null
                    idx--
                }
                continue
            }

            if (kind === 'string') {
                if (ch === '\'') {
                    const nech = getNech(idx, lineText)
                    if (nech !== '\'') {
                        deepImpartible--
                        addChunk(line.chunks, { idx: buffStartIdx, deepCode, deepImpartible, kind, text: lineText.substring(buffStartIdx, idx + 1) })
                        kind = null
                    } else {
                        idx++
                    }
                }
                continue
            }

            if (kind === 'code-in-bracket') {
                if (ch === ']') {
                    deepImpartible--
                    addChunk(line.chunks, { idx: buffStartIdx, deepCode, deepImpartible, kind, text: lineText.substring(buffStartIdx, idx + 1) })
                    kind = null
                }
                continue
            }

            if (kind === 'comment-multi') {
                if (ch === '*') {
                    const nech = getNech(idx, lineText)
                    if (nech === '/') {
                        deepImpartible--
                        if (deepImpartible <= 0) {
                            addChunk(line.chunks, { idx: buffStartIdx, deepCode, deepImpartible, kind, text: lineText.substring(buffStartIdx, idx + 2) })
                            kind = null
                        }
                        idx++
                    }
                }
                if (ch === '/') {
                    const nech = getNech(idx, lineText)
                    if (nech === '*') {
                        deepImpartible++
                    }
                    idx++
                }
                continue
            }

            //code
            if (ch === ',' || ch === ';' || ch === '.' || (ch !== '-' && ch !== '/' && operator.includes(ch))) {
                addChunk(line.chunks, { idx: buffStartIdx, deepCode, kind, ...GetWorld(worldList, lineText.substring(buffStartIdx, idx)) })
                if (ch === '(') {
                    deepCode++
                }
                addChunk(line.chunks, { idx, deepCode, kind: ch === ',' ? 'comma' : ch === ';' ? 'semicolon' : ch === '.' ? 'point' : 'operator', text: ch })
                if (ch === ')') {
                    deepCode--
                }
                kind = undefined
                continue
            }

            if (ch === '-') {
                const nech = getNech(idx, lineText)
                if (nech === '-') {
                    addChunk(line.chunks, { idx: buffStartIdx, deepCode, kind, ...GetWorld(worldList, lineText.substring(buffStartIdx, idx)) })
                    addChunk(line.chunks, { idx, deepCode, kind, text: lineText.substring(idx) })
                    kind = undefined
                    break
                } else {
                    addChunk(line.chunks, { idx: buffStartIdx, deepCode, kind, ...GetWorld(worldList, lineText.substring(buffStartIdx, idx)) })
                    addChunk(line.chunks, { idx, deepCode, kind: 'operator', text: ch })
                    kind = undefined
                    continue
                }
            }

            if (ch === ` ` || space.test(ch)) {
                addChunk(line.chunks, { idx: buffStartIdx, deepCode, kind, ...GetWorld(worldList, lineText.substring(buffStartIdx, idx)) })
                kind = 'boundary'
                buffStartIdx = idx
                continue
            }

            if (ch === '\'') {
                addChunk(line.chunks, { idx: buffStartIdx, deepCode, kind, ...GetWorld(worldList, lineText.substring(buffStartIdx, idx)) })
                deepImpartible = 1
                kind = 'string'
                buffStartIdx = idx
                continue
            }

            if (ch === '[') {
                addChunk(line.chunks, { idx: buffStartIdx, deepCode, kind, ...GetWorld(worldList, lineText.substring(buffStartIdx, idx)) })
                deepImpartible = 1
                kind = 'code-in-bracket'
                buffStartIdx = idx
                continue
            }

            if (ch === '/') {
                const nech = getNech(idx, lineText)
                if (nech === '*') {
                    addChunk(line.chunks, { idx: buffStartIdx, deepCode, kind, ...GetWorld(worldList, lineText.substring(buffStartIdx, idx)) })
                    deepImpartible = 1
                    kind = 'comment-multi'
                    buffStartIdx = idx
                    idx++
                } else {
                    addChunk(line.chunks, { idx: buffStartIdx, deepCode, kind, ...GetWorld(worldList, lineText.substring(buffStartIdx, idx)) })
                    addChunk(line.chunks, { idx, deepCode, kind: 'operator', text: ch })
                    kind = undefined
                }
                continue
            }


        }

        if (kind) {
            if (kind === 'code') {
                addChunk(line.chunks, {
                    idx: buffStartIdx,
                    deepCode,
                    kind,
                    ...GetWorld(worldList, lineText.substring(buffStartIdx))
                })
            } else {
                addChunk(line.chunks,{
                    idx: buffStartIdx,
                    deepCode,
                    deepImpartible: kind === 'comment-multi' || kind === 'code-in-bracket' || kind === 'string' ? deepImpartible : undefined,
                    kind,
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
    if (ch === ' ' && space.test(ch)) return 'boundary'
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

function addChunk(chunks: TTokenLineChunk[], chunk: TTokenLineChunk) {
    if (chunk.text === '') return
    chunks.push({
        ...chunk,
        deepCode: chunk.deepCode > 0 ? chunk.deepCode : undefined
    })
}