import { App } from "./app"

export function Create(text: string | string[]): App  {
    return new App(text)
}

console.log('hello')
