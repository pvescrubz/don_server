import { prisma } from "../../prismaClient"
import { CUSTOM_FILTRES_ARR, SORT_OPTIONS } from "../filters/filters.constans"
import { TGame, TGameKey, TPaginationMeta, TSkinsResponse } from "./skins.type"

export class SkinsService {
    private GAME_TO_MODEL: TGame

    constructor() {
        this.GAME_TO_MODEL = {
            cs: prisma.skinCS,
            dota: prisma.skinDOTA,
            rust: prisma.skinRUST,
        }
    }

    async getSkins(params: Record<string, string>): Promise<TSkinsResponse> {
        const {
            game,
            page = "1",
            perPage = "40",
            sort = SORT_OPTIONS.POPULAR.name,
            ...filters
        } = params

        const pageNumber = parseInt(page, 10)
        const perPageNumber = Math.min(Math.max(parseInt(perPage, 10), 1), 100)

        const normalizedGame = game.toLowerCase() as TGameKey
        const model = this.GAME_TO_MODEL[normalizedGame]

        if (!model) throw new Error(`Ошибка при получении скинов`)

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
            }),
            (model as any).count({ where }),
        ])

        const meta = this.getPaginationMeta(totalCount, pageNumber, perPageNumber)

        return {
            data: items,
            meta,
        }
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
        this.applyCustomFilter(where, filters)

        return where
    }

    private applyCustomFilter(
        where: Record<string, any>,
        filters: Record<string, string | undefined>
    ): Record<string, any> {
        const foundKeys = CUSTOM_FILTRES_ARR.filter(key => key in filters)
        if (!foundKeys.length) return where

        foundKeys.forEach(key => {
            if (`no${key.toLowerCase()}` === filters[key]?.toLowerCase()) {
                where[key] = null
            }
        })

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

            if (from !== null) {
                where.price.gte = from
            }

            if (to !== null) {
                where.price.lte = to
            }
        }
    }

    private getPaginationMeta(totalCount: number, page: number, perPage: number): TPaginationMeta {
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
