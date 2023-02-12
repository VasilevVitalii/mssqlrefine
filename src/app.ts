import { Parse, TTokenKind, TTokenLine } from "./tokenizator";
import { GetWorldMapList, TWorldCase, kindCodeList, TWorldMap, TWorldFilter } from "./world";

export interface IApp {
    prepareWorldsAll(worldCase?: TWorldCase)
    prepareWorldsCustom(filter: TWorldFilter[])
    getTokens(text: string[], startAt?: {kind: TTokenKind, deep: number}): TTokenLine[]
}

export class App implements IApp {

    private _worlds: TWorldMap[] = []

    public prepareWorldsAll(worldCase?: TWorldCase) {
        this._worlds = GetWorldMapList(kindCodeList.map(m => { return {worldKind: m, worldCase: worldCase} }))
    }

    public prepareWorldsCustom(filter: TWorldFilter[]) {
        this._worlds = GetWorldMapList(filter)
    }

    public getTokens(text: string[], startAt?: {kind: TTokenKind, deep: number}): TTokenLine[] {
        return Parse(text, this._worlds, startAt)
    }
}