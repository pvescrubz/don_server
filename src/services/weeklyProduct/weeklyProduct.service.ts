import cron from "node-cron"
import { prisma } from "../../prismaClient"

export class WeeklyProductService {
    async init() {
        // await this.updateWeeklyProduct()
        cron.schedule("0 3 * * 0", async () => {
            await this.updateWeeklyProduct()
        })
    }

    private async updateWeeklyProduct() {
        const [csProduct, dotaProduct, rustProduct] = await Promise.all([
            this.getOrCreateWeeklyProduct("cs"),
            this.getOrCreateWeeklyProduct("dota"),
            this.getOrCreateWeeklyProduct("rust"),
        ])

        await Promise.all([
            prisma.weeklyProductsCS.deleteMany({ where: { weeklyProductId: csProduct.id } }),
            prisma.weeklyProductsDOTA.deleteMany({ where: { weeklyProductId: dotaProduct.id } }),
            prisma.weeklyProductsRUST.deleteMany({ where: { weeklyProductId: rustProduct.id } }),
        ])

        await Promise.all([
            this.addRandomSkinsToWeeklyProductCS(csProduct.id),
            this.addRandomSkinsToWeeklyProductDOTA(dotaProduct.id),
            this.addRandomSkinsToWeeklyProductRUST(rustProduct.id),
        ])
    }

    private async getOrCreateWeeklyProduct(name: string) {
        return prisma.weeklyProducts.upsert({
            where: { name },
            create: { name },
            update: {},
        })
    }

    private async addRandomSkinsToWeeklyProductCS(weeklyProductId: string) {
        const skins = await prisma.skinCS.findMany({
            where: {
                price: {
                    gte: 500,
                    lte: 3500,
                },
            },
            orderBy: { id: "asc" },
            take: 100,
        })

        const selected = this.pickRandom(skins, 7)
        await prisma.weeklyProductsCS.createMany({
            data: selected.map(skin => ({
                weeklyProductId,
                skinId: skin.id,
            })),
        })
    }

    private async addRandomSkinsToWeeklyProductDOTA(weeklyProductId: string) {
        const skins = await prisma.skinDOTA.findMany({
            where: {
                price: {
                    gte: 500,
                    lte: 3500,
                },
            },
            orderBy: { id: "asc" },
            take: 100,
        })

        const selected = this.pickRandom(skins, 7)
        await prisma.weeklyProductsDOTA.createMany({
            data: selected.map(skin => ({
                weeklyProductId,
                skinId: skin.id,
            })),
        })
    }

    private async addRandomSkinsToWeeklyProductRUST(weeklyProductId: string) {
        const skins = await prisma.skinRUST.findMany({
            where: {
                price: {
                    gte: 500,
                    lte: 3500,
                },
            },
            orderBy: { id: "asc" },
            take: 100,
        })

        const selected = this.pickRandom(skins, 7)
        await prisma.weeklyProductsRUST.createMany({
            data: selected.map(skin => ({
                weeklyProductId,
                skinId: skin.id,
            })),
        })
    }

    private pickRandom<T>(arr: T[], count: number): T[] {
        const shuffled = arr.sort(() => 0.5 - Math.random())
        return shuffled.slice(0, count)
    }
}

export default WeeklyProductService
