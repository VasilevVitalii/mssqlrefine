import { TWorldItem, GetWorld } from "./world"

export type TKind = 'boundary' | 'code' | 'code-in-bracket' | 'comment-single' | 'comment-multi' | 'string' | 'comma' | 'semicolon' | 'operator'

export type TLineChunk = { kind: TKind } & TWorldItem

type TLine = {
    chunks: TLineChunk[]
}

export const operator = ['+', '-', '%', '=', '<', '>', '!', '(', ')', '/', '*']

const space = new RegExp(/[\u00A0\s]/, 'gi')

export function Parse(text: string[]): TLine[] {
    const result = [] as TLine[]

    let buffKind = undefined as TKind
    let deep = 0

    text.forEach(lineText => {
        const line = { chunks: [] } as TLine

        let buffStartIdx = 0

        for (let chidx = 0; chidx < lineText.length; chidx++) {
            const ch = lineText[chidx]

            if (!buffKind) {
                buffKind = getKindStart(ch, chidx, lineText)
                if (buffKind === 'comma' || buffKind === 'semicolon' || buffKind === 'operator') {
                    line.chunks.push({ kind: buffKind, kindCode: undefined, text: ch })
                    buffKind = undefined
                    continue
                } if (buffKind === 'comment-single') {
                    line.chunks.push({ kind: buffKind, kindCode: undefined, text: lineText.substring(chidx) })
                    buffKind = undefined
                    break
                } else if (buffKind === 'comment-multi') {
                    buffStartIdx = chidx
                    chidx++
                    deep = 1
                    continue
                } else {
                    buffStartIdx = chidx
                    continue
                }
            }

            if (buffKind === 'boundary') {
                if (!space.test(ch)) {
                    line.chunks.push({ kind: buffKind, kindCode: undefined, text: lineText.substring(buffStartIdx, chidx) })
                    buffKind = null
                    chidx--
                }
                continue
            }

            if (buffKind === 'string') {
                if (ch === '\'') {
                    const nech = getNech(chidx, lineText)
                    if (nech !== '\'') {
                        line.chunks.push({ kind: buffKind, kindCode: undefined, text: lineText.substring(buffStartIdx, chidx + 1) })
                        buffKind = null
                    } else {
                        chidx++
                    }
                }
                continue
            }

            if (buffKind === 'code-in-bracket') {
                if (ch === ']') {
                    line.chunks.push({ kind: buffKind, kindCode: undefined, text: lineText.substring(buffStartIdx, chidx + 1) })
                    buffKind = null
                }
                continue
            }

            if (buffKind === 'comment-multi') {
                if (ch === '*') {
                    const nech = getNech(chidx, lineText)
                    if (nech === '/') {
                        deep--
                        if (deep <= 0) {
                            line.chunks.push({ kind: buffKind, kindCode: undefined, text: lineText.substring(buffStartIdx, chidx + 2) })
                            buffKind = null
                        }
                        chidx++
                    }
                }
                if (ch === '/') {
                    const nech = getNech(chidx, lineText)
                    if (nech === '*') {
                        deep++
                    }
                    chidx++
                }
                continue
            }

            //code
            if (ch === ',' || ch === ';' || (ch !== '-' && ch !== '/' && operator.includes(ch))) {
                line.chunks.push({ kind: buffKind, ...GetWorld(lineText.substring(buffStartIdx, chidx)) })
                line.chunks.push({ kind: ch === ',' ? 'comma' : ch === ';' ? 'semicolon' : 'operator', kindCode: undefined, text: ch })
                buffKind = undefined
                continue
            }

            if (ch === '-') {
                const nech = getNech(chidx, lineText)
                if (nech === '-') {
                    line.chunks.push({ kind: buffKind, ...GetWorld(lineText.substring(buffStartIdx, chidx)) })
                    line.chunks.push({ kind: buffKind, kindCode: undefined, text: lineText.substring(chidx) })
                    buffKind = undefined
                    break
                } else {
                    line.chunks.push({ kind: buffKind, ...GetWorld(lineText.substring(buffStartIdx, chidx)) })
                    line.chunks.push({ kind: 'operator', kindCode: undefined, text: ch })
                    buffKind = undefined
                    continue
                }
            }

            if (space.test(ch)) {
                line.chunks.push({ kind: buffKind, ...GetWorld(lineText.substring(buffStartIdx, chidx)) })
                buffKind = 'boundary'
                buffStartIdx = chidx
                continue
            }

            if (ch === '\'') {
                line.chunks.push({ kind: buffKind, ...GetWorld(lineText.substring(buffStartIdx, chidx)) })
                buffKind = 'string'
                buffStartIdx = chidx
                continue
            }

            if (ch === '[') {
                line.chunks.push({ kind: buffKind, ...GetWorld(lineText.substring(buffStartIdx, chidx)) })
                buffKind = 'code-in-bracket'
                buffStartIdx = chidx
                continue
            }

            if (ch === '/') {
                const nech = getNech(chidx, lineText)
                if (nech === '*') {
                    line.chunks.push({ kind: buffKind, ...GetWorld(lineText.substring(buffStartIdx, chidx)) })
                    deep = 1
                    buffKind = 'comment-multi'
                    buffStartIdx = chidx
                    chidx++
                } else {
                    line.chunks.push({ kind: buffKind, ...GetWorld(lineText.substring(buffStartIdx, chidx)) })
                    line.chunks.push({ kind: 'operator', kindCode: undefined, text: ch })
                    buffKind = undefined
                }
                continue
            }
        }

        if (buffKind) {
            if (buffKind === 'code') {
                line.chunks.push({ kind: buffKind, ...GetWorld(lineText.substring(buffStartIdx)) })
            } else {
                line.chunks.push({ kind: buffKind, kindCode: undefined, text: lineText.substring(buffStartIdx) })
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

function getKindStart(ch: string, chidx: number, lineText: string): TKind {
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