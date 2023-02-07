import { Refine, TClearLine, TEntry } from './refiner'

export interface IApp {
    refine()
    refineAt(lineIdx: number)
    get TextRefined(): TClearLine[]
    get TextRaw(): string[]
}

export class App implements IApp {
    private _textRaw: string[]
    private _textRefined: TClearLine[]

    constructor(textRaw: string[]) {
        this._textRaw = textRaw
        this._textRefined = []
    }

    public refine() {
        this.refineAt(0)
    }

    public refineAt(lineIdx: number) {
        let initDeep = 0
        let initDeepType = undefined as TEntry | undefined
        if (lineIdx < this._textRefined.length) {
            initDeep = this._textRefined[lineIdx - 1].endDeep
            initDeepType = this._textRefined[lineIdx - 1].endDeepType
        }
        this._textRefined.splice(lineIdx)
        this._textRefined.push(...Refine(initDeep, initDeepType, this._textRaw.slice(lineIdx), ' '))
    }

    get TextRefined(): TClearLine[] {
        return this._textRefined;
    }

    get TextRaw(): string[] {
        return this._textRaw;
    }
}

