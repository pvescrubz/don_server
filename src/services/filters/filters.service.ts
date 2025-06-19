import { prisma } from "../../prismaClient"
import { SORT_OPTIONS } from "./filters.constans"
import { IFiltersCS, IFiltersDOTA, IFiltersRUST } from "./filters.type"

export class FiltersService {
    async getFiltersCS(): Promise<IFiltersCS> {
        const game = await prisma.game.findUnique({
            where: {
                name: "cs2",
            },
        })
        const rarity = await prisma.rarity.findMany({
            where: {
                gameId: game?.id,
            },
        })

        const category = await prisma.category.findMany({
            select: {
                id: true,
                name: true,
                ruName: true,
                groupName: true,
                model: {
                    select: {
                        id: true,
                        name: true,
                        groupName: true,
                        previewSkinId: true,
                        previewSkin: {
                            select: {
                                image: true,
                                imageUrl: true,
                            },
                        },
                    },
                },
            },
        })

        const exterior = await prisma.exterior.findMany()

        const phase = await prisma.phase.findMany()
        const killCounter = await prisma.killCounter.findMany()
        const souvenir = await prisma.souvenir.findMany()

        return {
            category: {
                id: "category",
                name: "category",
                ruName: "Категории",
                data: category,
            },
            exterior: {
                id: "exterior",
                name: "exterior",
                ruName: "Износ",
                data: exterior,
            },
            rarity: {
                id: "rarity",
                name: "rarity",
                ruName: "Раритетность",
                data: rarity,
            },
            phase: {
                id: "phase",
                name: "phase",
                ruName: "Фаза",
                data: phase,
            },
            killCounter: {
                id: "killCounter",
                name: "killCounter",
                ruName: "Счетчик убийств",
                data: killCounter,
            },
            souvenir: {
                id: "souvenir",
                name: "souvenir",
                ruName: "Сувенирность",
                data: souvenir,
            },

            sort: Object.values(SORT_OPTIONS),
        }
    }

    async getFiltersDOTA(): Promise<IFiltersDOTA> {
        const quality = await prisma.quality.findMany()
        // const rarity = await prisma.rarity.findMany()
        const hero = await prisma.hero.findMany()
        const slot = await prisma.slot.findMany()

        const game = await prisma.game.findUnique({
            where: {
                name: "dota2",
            },
        })
        const rarity = await prisma.rarity.findMany({
            where: {
                gameId: game?.id,
            },
        })

        const type = await prisma.type.findMany({
            where: {
                gameId: game?.id,
            },
        })

        return {
            hero: {
                id: "hero",
                name: "hero",
                ruName: "Герой",
                data: hero,
            },
            type: {
                id: "type",
                name: "type",
                ruName: "Тип",
                data: type,
            },
            slot: {
                id: "slot",
                name: "slot",
                ruName: "Слот",
                data: slot,
            },

            quality: {
                id: "quality",
                name: "quality",
                ruName: "Качество",
                data: quality,
            },
            rarity: {
                id: "rarity",
                name: "rarity",
                ruName: "Раритетность",
                data: rarity,
            },

            sort: Object.values(SORT_OPTIONS),
        }
    }

    async getFiltersRUST(): Promise<IFiltersRUST> {
        const game = await prisma.game.findUnique({
            where: {
                name: "rust",
            },
        })

        const type = await prisma.type.findMany({
            where: {
                gameId: game?.id,
            },
        })

        return {
            type: {
                id: "type",
                name: "type",
                ruName: "Тип",
                data: type,
            },

            sort: Object.values(SORT_OPTIONS),
        }
    }
}
