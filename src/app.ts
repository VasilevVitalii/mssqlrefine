import { Get, TTokenLine, TParseOption } from "./tokenizator";
import { GetWorldMapList, TWorldCase, kindCodeList, TWorldMap, TWorldFilter } from "./world";

export interface IApp {
    prepareWorldsAll(worldCase?: TWorldCase): any
    prepareWorldsCustom(filter: TWorldFilter[]): any
    getTokens(text: string[], option?: TParseOption): TTokenLine[]
}

export class App implements IApp {

    private _worlds: TWorldMap[] = []

    public prepareWorldsAll(worldCase?: TWorldCase) {
        this._worlds = GetWorldMapList(kindCodeList.map(m => { return {worldKind: m, worldCase: worldCase} }))
    }

    public prepareWorldsCustom(filter: TWorldFilter[]) {
        this._worlds = GetWorldMapList(filter)
    }

    public getTokens(text: string[], option?: TParseOption): TTokenLine[] {
        return Get(text, this._worlds, option)
    }
}