import * as os from 'os'

type TEntry = 'comment-multi' | 'comment-single' | 'string'

export class App {
    private _textRaw: string[]
    private _text: string[]

    constructor(text: string | string[]) {
        if (Array.isArray(text)) {
            this._textRaw = text
        } else {
            this._textRaw = text.split(os.EOL)
        }
    }

    get Text(): string[] {
        return this._text;
    }

    public parse(replaceChar: string) {
        const textResult = [...this._textRaw]

        let deepT = undefined as TEntry
        let deepN = 0

        let linePosition = 0

        for (let lineIdx = 0; lineIdx < this._textRaw.length; lineIdx++) {
            const line = this._textRaw[lineIdx]

            if (!deepT) {
                const open = findOpen(line, linePosition)
                if (!open) {
                    if (linePosition > 0) {
                        textResult[lineIdx] = `${textResult[lineIdx]}${line.substring(linePosition)}`
                    } else {
                        //do not edit textResult[lineIdx]
                    }
                    linePosition = 0
                    continue
                }

                if (open.type === 'comment-single') {
                    if (linePosition > 0) {
                        textResult[lineIdx] = `${textResult[lineIdx]}${line.substring(linePosition, open.idx)}${repeat(replaceChar, line.length - open.idx)}`
                    } else {
                        textResult[lineIdx] = `${line.substring(linePosition, open.idx)}${repeat(replaceChar,line.length - open.idx)}`
                    }
                    linePosition = 0
                    continue
                }

                if (open.type === 'comment-multi') {
                    if (linePosition > 0) {
                        textResult[lineIdx] = `${textResult[lineIdx]}${line.substring(linePosition, open.idx)}`
                    } else {
                        textResult[lineIdx] = `${line.substring(linePosition, open.idx)}`
                    }
                    linePosition = open.idx + 2
                    lineIdx--
                    deepT = 'comment-multi'
                    deepN = 1
                    continue
                }

                if (open.type === 'string') {
                    if (linePosition > 0) {
                        textResult[lineIdx] = `${textResult[lineIdx]}${line.substring(linePosition, open.idx)}`
                    } else {
                        textResult[lineIdx] = `${line.substring(linePosition, open.idx)}`
                    }
                    linePosition = open.idx + 1
                    lineIdx--
                    deepT = 'string'
                    deepN = 1
                    continue
                }
            } else {
                const close = findClose(line, linePosition, deepT)
                if (!close) {
                    if (linePosition > 0) {
                        textResult[lineIdx] = `${textResult[lineIdx]}${repeat(replaceChar,line.length - linePosition)}`
                    } else {
                        textResult[lineIdx] = repeat(replaceChar,line.length)
                    }
                    linePosition = 0
                    continue
                }

                const addlen = deepT === 'comment-multi' ? 2 : deepT === 'string' ? 1 : 0
                if (linePosition > 0) {
                    textResult[lineIdx] = `${textResult[lineIdx]}${repeat(replaceChar,close.idx - linePosition + addlen)}`
                } else {
                    textResult[lineIdx] = `${repeat(replaceChar, close.idx + addlen)}`
                }
                linePosition = close.idx
                lineIdx--
                if (close.type === 'close') {
                    deepN--
                    if (deepN === 0) deepT = undefined
                } else if (close.type === 'open') {
                    deepN++
                }
            }
        }
        this._text = textResult
    }
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
        if (idxOpen > 0 && (idxClose === -1 || idxClose > idxOpen)) {
            return { idx: idxOpen + 2, type: 'open' }
        }
        if (idxClose > 0 && (idxOpen === -1 || idxOpen > idxClose)) {
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