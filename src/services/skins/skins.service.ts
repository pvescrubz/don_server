import { prisma } from "../../prismaClient"
import { SORT_OPTIONS } from "../filters/filters.constans"
import { TGame, TGameKey, TMetaRes, TSkinData, TSkinsRes } from "./skins.type"

export class SkinsService {
    private GAME_TO_MODEL: TGame

    constructor() {
        this.GAME_TO_MODEL = {
            cs: prisma.skinCS,
            dota: prisma.skinDOTA,
            rust: prisma.skinRUST,
        }
    }

    async getSkins(params: Record<string, string>): Promise<TSkinsRes> {
        const { game, page, perPage, sort = SORT_OPTIONS.POPULAR.name, ...filters } = params

        const normalizedGame = game.toLowerCase() as TGameKey
        const model = this.GAME_TO_MODEL[normalizedGame]

        if (!model) throw new Error(`Ошибка при получении скинов`)

        const pageNumber = parseInt(page, 10)
        const perPageNumber = Math.min(Math.max(parseInt(perPage, 10), 1), 100)

        const where = this.buildWhereClause(filters)

        const orderBy =
            sort === SORT_OPTIONS.LOW_TO_HIGH.name || sort === SORT_OPTIONS.HIGH_TO_LOW.name
                ? { price: sort }
                : {}

        const [items, totalCount] = await Promise.all([
            (model as any).findMany({
                where,
                ...(Object.keys(orderBy).length > 0 && { orderBy }),
                skip: (pageNumber - 1) * perPageNumber,
                take: perPageNumber,
                ...(game === "cs" && {
                    include: {
                        killCounter: true,
                        souvenir: true,
                    },
                }),
            }),
            (model as any).count({ where }),
        ])

        const meta = this.getPaginationMeta(totalCount, pageNumber, perPageNumber)

        return {
            data: items,
            meta,
        }
    }

    async getWeekly(): Promise<TSkinData> {
        const weeklyProducts = await prisma.weeklyProducts.findMany({
            include: {
                skinsCS: {
                    include: { skin: true },
                },
                skinsDOTA: {
                    include: { skin: true },
                },
                skinsRUST: {
                    include: { skin: true },
                },
            },
        })
        const allSkins = weeklyProducts.flatMap(product => [
            ...product.skinsCS.map(s => ({ ...s.skin, game: "CS" })),
            ...product.skinsDOTA.map(s => ({ ...s.skin, game: "DOTA" })),
            ...product.skinsRUST.map(s => ({ ...s.skin, game: "RUST" })),
        ])

        const shuffled = allSkins.sort(() => 0.5 - Math.random())
        return shuffled
    }
    async getLastBuy(): Promise<TSkinData> {
        const lastBuy = await prisma.lastBuy.findMany({
            include: {
                skinsCS: {
                    include: { skin: true },
                },
                skinsDOTA: {
                    include: { skin: true },
                },
                skinsRUST: {
                    include: { skin: true },
                },
            },
        })
        const allSkins = lastBuy.flatMap(product => [
            ...product.skinsCS.map(s => ({ ...s.skin, game: "CS" })),
            ...product.skinsDOTA.map(s => ({ ...s.skin, game: "DOTA" })),
            ...product.skinsRUST.map(s => ({ ...s.skin, game: "RUST" })),
        ])

        const shuffled = allSkins.sort(() => 0.5 - Math.random())
        return shuffled
    }

    private buildWhereClause(params: Record<string, string | undefined>): Record<string, any> {
        const where: Record<string, any> = {}

        const { priceFrom, priceTo, search, ...filters } = params

        if (search?.trim()) {
            where.name = {
                contains: search.trim(),
                mode: "insensitive" as const,
            }
        }

        this.applyGeneralFilters(where, filters)
        this.applyPriceFilter(where, priceFrom, priceTo)

        return where
    }

    private applyGeneralFilters(
        where: Record<string, any>,
        filters: Record<string, string | undefined>
    ) {
        for (const [key, value] of Object.entries(filters)) {
            if (!value) continue

            const filterValues = this.parseFilterValue(value)

            where[key] = {
                name: Array.isArray(filterValues) ? { in: filterValues } : filterValues,
            }
        }
    }

    private applyPriceFilter(where: Record<string, any>, priceFrom?: string, priceTo?: string) {
        const from = this.parsePrice(priceFrom)
        const to = this.parsePrice(priceTo)

        if (from !== null || to !== null) {
            where.price = {}
            if (from !== null) where.price.gte = from
            if (to !== null) where.price.lte = to
        }
    }

    private getPaginationMeta(totalCount: number, page: number, perPage: number): TMetaRes {
        const totalPages = Math.ceil(totalCount / perPage)
        return {
            currentPage: page,
            totalPages,
            totalItems: totalCount,
            itemsPerPage: perPage,
        }
    }

    private parseFilterValue(value: string): string | string[] {
        return value.includes(",") ? value.split(",").map(v => v.trim()) : value
    }

    private parsePrice(value?: string): number | null {
        if (!value) return null
        const num = parseInt(value, 10)
        return isNaN(num) ? null : num
    }
}

export default SkinsService
