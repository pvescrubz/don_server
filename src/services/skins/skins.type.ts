import { SkinCS, SkinDOTA, SkinRUST } from "@prisma/client";
import { prisma } from "../../prismaClient";

export type TGameKey = keyof TGame

export type TGame = {
    cs: typeof prisma.skinCS
    dota: typeof prisma.skinDOTA
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

export type TSkinsResponse = {
    data: (SkinCS | SkinDOTA | SkinRUST)[]
    meta: TResponseMeta
}

export type TResponseMeta = {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
}

export type TPaginationMeta = {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
}
