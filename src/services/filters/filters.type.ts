
import { Category, Exterior, KillCounter, Phase, Rarity, Souvenir, Type } from "@prisma/client"


export type TSortName = "popular" | "asc" | "desc"

export interface ISortItem {
    id: string
    name: TSortName
    ruName: string
}
export interface ISort {
    sort: ISortItem[]
}

export interface IFilter {
    id: string
    name: string
    ruName?: string
    data: (Rarity | Type | Category | Souvenir | Exterior | KillCounter | Phase)[]
}

export interface IFiltersDOTA extends ISort {
    rarity: IFilter
    type: IFilter
    hero: IFilter
    slot: IFilter
    quality: IFilter
}

export interface IFiltersCS extends ISort {
    rarity: IFilter
    category: IFilter
    souvenir: IFilter
    exterior: IFilter
    killCounter: IFilter
    phase: IFilter
}

export interface IFiltersRUST extends ISort {
    type: IFilter
}
