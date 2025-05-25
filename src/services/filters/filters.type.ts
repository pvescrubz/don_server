import { CategoryCS, KillCounterCS, PhaseCS, QualityCS, RarityCS, SouvenirCS } from "@prisma/client"

export type TSortName = "popular" | "asc" | "desc"

export type ISortItem = {
    id: string
    name: TSortName
    ruName: string
}

export type TFilterName = keyof TFiltersCs

export type TFilter = {
    id: string
    name: string
    ruName?: string
    data: (CategoryCS | QualityCS | RarityCS | PhaseCS | KillCounterCS | SouvenirCS)[]
}

export type TFiltersCs = {
    category: TFilter
    quality: TFilter
    rarity: TFilter
    phase: TFilter
    killCounter: TFilter
    souvenir: TFilter
    sort: ISortItem[]
}
