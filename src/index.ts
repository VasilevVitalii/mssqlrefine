import { App, IApp } from './app'
import { Refine } from './refiner'
import { EOL } from 'os'

export function CreateRefineService(textRaw: string | string[]): App  {
    return new App(Array.isArray(textRaw) ? textRaw : textRaw.split(EOL))
}

export function SimpleRefine(textRaw: string | string[]): string[] {
    return Refine(0, undefined, Array.isArray(textRaw) ? textRaw : textRaw.split(EOL), ' ').map(m => { return m.line})
}

export { IApp as IRefineService }

