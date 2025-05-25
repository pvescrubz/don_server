import { prisma } from "../../prismaClient"
import { SORT_OPTIONS } from "./filters.constans"
import { TFiltersCs } from "./filters.type"

export class FiltersService {
    async getCSFilters(): Promise<TFiltersCs> {
        const category = await prisma.categoryCS.findMany({
            select: {
                id: true,
                name: true,
                ruName: true,
                groupName: true,
                type: {
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

        const quality = await prisma.qualityCS.findMany()
        const rarity = await prisma.rarityCS.findMany()
        const phase = await prisma.phaseCS.findMany()
        const killCounter = await prisma.killCounterCS.findMany()
        const souvenir = await prisma.souvenirCS.findMany()

        return {
            category: {
                id: "category",
                name: "category",
                ruName: "Категории",
                data: category,
            },
            quality: {
                id: "quality",
                name: "quality",
                ruName: "Износ",
                data: quality,
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

    async getDotaFilters() {
        const quality = await prisma.qualityCS.findMany()
        const rarity = await prisma.rarityCS.findMany()
        const type = await prisma.typeDOTA.findMany()
        const hero = await prisma.heroDOTA.findMany()
        const slot = await prisma.slotDOTA.findMany()

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

    async getRustFilters() {
        const type = await prisma.typeRUST.findMany()

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

export default FiltersService
