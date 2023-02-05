export type TEntry = 'comment-multi' | 'comment-single' | 'string'

export type TClearLine = {
    endDeep: number,
    endDeepType: TEntry | undefined,
    line: string
}

export function Refine(initDeep: number, initDeepType: TEntry | undefined, text: string[], replaceChar: string): TClearLine[] {
    const result = text.map(m => { return {
        line: m,
        endDeep: 0,
        endDeepType: undefined
    }}) as TClearLine[]

    let deepT = initDeepType
    let deepN = initDeep

    let linePosition = 0

    for (let lineIdx = 0; lineIdx < text.length; lineIdx++) {
        const line = text[lineIdx]

        result[lineIdx].endDeep = deepN
        result[lineIdx].endDeepType = deepT

        if (!deepT) {
            const open = findOpen(line, linePosition)
            if (!open) {
                if (linePosition > 0) {
                    result[lineIdx].line = `${result[lineIdx].line}${line.substring(linePosition)}`
                } else {
                    //do not edit textResult[lineIdx]
                }
                linePosition = 0
                continue
            }

            if (open.type === 'comment-single') {
                if (linePosition > 0) {
                    result[lineIdx].line = `${result[lineIdx].line}${line.substring(linePosition, open.idx)}${repeat(replaceChar, line.length - open.idx)}`
                } else {
                    result[lineIdx].line = `${line.substring(linePosition, open.idx)}${repeat(replaceChar,line.length - open.idx)}`
                }
                linePosition = 0
                continue
            }

            if (open.type === 'comment-multi') {
                if (linePosition > 0) {
                    result[lineIdx].line = `${result[lineIdx].line}${line.substring(linePosition, open.idx)}`
                } else {
                    result[lineIdx].line = `${line.substring(linePosition, open.idx)}`
                }
                linePosition = open.idx + 2
                deepT = open.type
                deepN = 1
                result[lineIdx].endDeepType = deepT
                result[lineIdx].endDeep = deepN
                lineIdx--
                continue
            }

            if (open.type === 'string') {
                if (linePosition > 0) {
                    result[lineIdx].line = `${result[lineIdx].line}${line.substring(linePosition, open.idx)}`
                } else {
                    result[lineIdx].line = `${line.substring(linePosition, open.idx)}`
                }
                linePosition = open.idx + 1
                deepT = open.type
                deepN = 1
                result[lineIdx].endDeepType = deepT
                result[lineIdx].endDeep = deepN
                lineIdx--
                continue
            }
        } else {
            const close = findClose(line, linePosition, deepT)
            let corrlen = 0
            if (!close || close?.type === 'close') {
                corrlen = deepT === 'comment-multi' ? 2 : deepT === 'string' ? 1 : 0
            }

            if (!close) {
                if (linePosition > 0) {
                    result[lineIdx].line = `${result[lineIdx].line}${repeat(replaceChar,line.length - linePosition + corrlen)}`
                } else {
                    result[lineIdx].line = repeat(replaceChar,line.length)
                }
                linePosition = 0
                continue
            }

            if (linePosition > 0) {
                result[lineIdx].line = `${result[lineIdx].line}${repeat(replaceChar,close.idx - linePosition + corrlen)}`
            } else {
                result[lineIdx].line = `${repeat(replaceChar, close.idx)}`
            }
            linePosition = close.idx + (close.type === 'open' ? (deepT === 'comment-multi' ? 2 : deepT === 'string' ? 1 : 0) : 0 )
            if (close.type === 'close') {
                deepN--
                if (deepN === 0) deepT = undefined
            } else if (close.type === 'open') {
                deepN++
            }
            result[lineIdx].endDeepType = deepT
            result[lineIdx].endDeep = deepN
            lineIdx--
            continue
        }
    }

    return result
}

function findOpen(text: string, position: number): { idx: number, type: TEntry } | undefined {
    if (!text) return undefined

    const idxCommentSingle = text.indexOf('--', position)
    if (idxCommentSingle === 0) {
        return { idx: 0, type: 'comment-single' }
    }
    const idxCommentMulti = text.indexOf('/*', position)
    const idxString = text.indexOf('\'', position)

    if (idxCommentSingle >= 0) {
        if ((idxCommentMulti === -1 || idxCommentMulti > idxCommentSingle)
        && (idxString === -1 || idxString > idxCommentSingle)) {
            return { idx: idxCommentSingle, type: 'comment-single' }
        }
    }

    if (idxCommentMulti >= 0) {
        if ((idxCommentSingle === -1 || idxCommentSingle > idxCommentMulti)
        && (idxString === -1 || idxString > idxCommentMulti)) {
            return { idx: idxCommentMulti, type: 'comment-multi' }
        }
    }

    if (idxString >= 0) {
        if ((idxCommentSingle === -1 || idxCommentSingle > idxString)
        && (idxCommentMulti === -1 || idxCommentMulti > idxString)) {
            return { idx: idxString, type: 'string' }
        }
    }

    return undefined
}

function findClose(text: string, position: number, entrance: TEntry): { idx: number, type: 'open' | 'close' } | undefined {
    if (!text) return undefined

    if (entrance === 'comment-multi') {
        const idxOpen = text.indexOf('/*', position)
        const idxClose = text.indexOf('*/', position)
        if (idxOpen >= 0 && (idxClose === -1 || idxClose > idxOpen)) {
            return { idx: idxOpen, type: 'open' }
        }
        if (idxClose >= 0 && (idxOpen === -1 || idxOpen > idxClose)) {
            return { idx: idxClose + 2, type: 'close' }
        }
        return undefined
    }

    if (entrance === 'string') {
        for (let idx = position; idx < text.length; idx++) {
            if (text[idx] !== '\'') continue;
            if (text[idx + 1] === '\'') {
                idx++
                continue
            }
            return { idx: idx + 1, type: 'close' }
        }
        return undefined
    }

    return undefined
}

function repeat(text: string, len: number): string {
    if (len <= 0) return ''
    return text.repeat(len)
}