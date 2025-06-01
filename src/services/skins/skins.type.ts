import { SkinCS, SkinDOTA, SkinRUST } from "@prisma/client"
import { prisma } from "../../prismaClient"

export type TGameKey = keyof TGame

export type TGame = {
    cs2: typeof prisma.skinCS
    dota2: typeof prisma.skinDOTA
    rust: typeof prisma.skinRUST
}

export type TQueryParams = {
    category?: string
    quality?: string
    rarity?: string
    itemType?: string
    phase?: string
    statTrak?: string
    souvenir?: string
}

export type TSkinData = SkinCS[] | SkinDOTA[] | SkinRUST[]

export type TSkinsRes = {
    data: TSkinData
    meta: TMetaRes
}

export type TMetaRes = {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
}

