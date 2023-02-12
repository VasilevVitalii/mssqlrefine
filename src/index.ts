import { App, IApp } from './app'
import { TWorldCase, TWorldKind, TWorld, TWorldFilter, TWorldMap } from './world'
import { TTokenKind, TTokenLineChunk, TTokenLine } from './tokenizator'

export { IApp as IRefineService, TWorldCase, TWorldKind, TWorld, TWorldFilter, TWorldMap, TTokenKind, TTokenLineChunk, TTokenLine }

export function CreateRefineService(): IApp {
    return new App()
}