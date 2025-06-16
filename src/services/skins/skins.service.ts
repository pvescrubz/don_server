import { Skin } from "@prisma/client"
import { prisma } from "../../prismaClient"
import { SORT_OPTIONS } from "../filters/filters.constans"
import { TMetaRes, TSkinsRes } from "./skins.type"

export class SkinsService {
    async getSkins(params: Record<string, string>): Promise<TSkinsRes> {
        const { page, perPage, sort = SORT_OPTIONS.POPULAR.name, ...filters } = params

        const pageNumber = parseInt(page, 10)
        const perPageNumber = Math.min(Math.max(parseInt(perPage, 10), 1), 100)

        const where = this.buildWhereClause(filters)

        const orderBy =
            sort === SORT_OPTIONS.LOW_TO_HIGH.name || sort === SORT_OPTIONS.HIGH_TO_LOW.name
                ? { price: sort }
                : {}

        const [items, totalCount] = await Promise.all([
            prisma.skin.findMany({
                where,
                ...(Object.keys(orderBy).length > 0 && { orderBy }),
                skip: (pageNumber - 1) * perPageNumber,
                take: perPageNumber,
                include: {
                    game: true,
                    ...(params.game === "cs2" && {
                        killCounter: true,
                        souvenir: true,
                    }),
                },
            }),

            prisma.skin.count({ where }),
        ])

        const meta = this.getPaginationMeta(totalCount, pageNumber, perPageNumber)

        return {
            data: items,
            meta,
        }
    }

    async getBySlug(slug: string): Promise<Skin | null> {
        return await prisma.skin.findUnique({
            where: { slug },
            include: {
                category: true,
                quality: true,
                model: true,
                rarity: true,
                type: true,
                phase: true,
                souvenir: true,
                killCounter: true,
                game: true,
                exterior: true,
                hero: true,
                slot: true,
            },
        })
    }
    async getById(id: string): Promise<Skin | null> {
        return await prisma.skin.findUnique({
            where: { id },
        })
    }

    async getWeekly(): Promise<Skin[]> {
        const weeklyProducts = await prisma.weeklyProducts.findMany({
            include: {
                skin: {
                    include: {
                        game: true,
                    },
                },
            },
        })

        const allSkins = weeklyProducts.flatMap(product => (product.skin ? [product.skin] : []))

        const shuffled = allSkins.sort(() => 0.5 - Math.random())
        return shuffled
    }

    async getLastBuy(): Promise<Skin[]> {
        const lastBuy = await prisma.lastBuy.findMany({
            include: {
                skin: {
                    include: {
                        game: true,
                    },
                },
            },
        })

        const allSkins = lastBuy.flatMap(product => (product.skin ? [product.skin] : []))

        const shuffled = allSkins.sort(() => 0.5 - Math.random())
        return shuffled
    }

    private buildWhereClause(params: Record<string, string | undefined>): Record<string, any> {
        const where: Record<string, any> = {}

        const { priceFrom, priceTo, currency, search, ...filters } = params

        if (search?.trim()) {
            where.name = {
                contains: search.trim(),
                mode: "insensitive" as const,
            }
        }

        this.applyGeneralFilters(where, filters)
        this.applyPriceFilter(where, priceFrom, priceTo, currency)

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

    private applyPriceFilter(
        where: Record<string, any>,
        priceFrom?: string,
        priceTo?: string,
        currency = "RUB"
    ) {
        const from = this.parsePrice(priceFrom)
        const to = this.parsePrice(priceTo)

        if (from !== null || to !== null) {
            where.price= {}
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
