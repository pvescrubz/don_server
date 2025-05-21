import { CategoryCS, PhaseCS, QualityCS, RarityCS, SouvenirCS, StatTrakCS } from "@prisma/client"

export type TSortName = "popular" | "asc" | "desc"

export type ISortItem = {
    id: string
    name: TSortName
    ruName: string
}

export type TFilterName = "category" | "quality" | "rarity" | "phase" | "other" | "sort"

export type TFilter = {
    id: string
    name: string
    ruName?: string
    data: (CategoryCS | QualityCS | RarityCS | PhaseCS | StatTrakCS | SouvenirCS)[]
}

export type TFiltersCs = {
    category: TFilter
    quality: TFilter
    rarity: TFilter
    phase: TFilter
    statTrak: TFilter
    souvenir: TFilter
    // other: TFilter
    sort: ISortItem[]
}
