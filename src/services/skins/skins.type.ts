import { Skin } from "@prisma/client"




export type TSkinsRes = {
    data: Skin[]
    meta: TMetaRes
}

export type TMetaRes = {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
}
