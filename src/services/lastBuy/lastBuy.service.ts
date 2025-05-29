import cron from "node-cron"
import { prisma } from "../../prismaClient"

export class LastBuyService {
    async init() {
        // await this.updateLastBuy()
        cron.schedule("*/7 * * * *", async () => {
            await this.updateLastBuy()
        })
    }

    private async updateLastBuy() {
        const [csProduct, dotaProduct, rustProduct] = await Promise.all([
            this.getOrCreateLastBuy("cs"),
            this.getOrCreateLastBuy("dota"),
            this.getOrCreateLastBuy("rust"),
        ])

        await Promise.all([
            prisma.lastBuyCS.deleteMany({ where: { lastBuyId: csProduct.id } }),
            prisma.lastBuyDOTA.deleteMany({ where: { lastBuyId: dotaProduct.id } }),
            prisma.lastBuyRUST.deleteMany({ where: { lastBuyId: rustProduct.id } }),
        ])

        await Promise.all([
            this.addRandomSkinsToLastBuyCS(csProduct.id),
            this.addRandomSkinsToLastBuyDOTA(dotaProduct.id),
            this.addRandomSkinsToLastBuyRUST(rustProduct.id),
        ])

    }

    private async getOrCreateLastBuy(name: string) {
        return prisma.lastBuy.upsert({
            where: { name },
            create: { name },
            update: {},
        })
    }

    private async addRandomSkinsToLastBuyCS(lastBuyId: string) {
        const skins = await prisma.skinCS.findMany({
            where: {
                price: {
                    gte: 100,
                    lte: 6000,
                },
            },
            orderBy: { id: "asc" },
            take: 100,
        })

        const selected = this.pickRandom(skins, 7)
        await prisma.lastBuyCS.createMany({
            data: selected.map(skin => ({
                lastBuyId,
                skinId: skin.id,
            })),
        })
    }

    private async addRandomSkinsToLastBuyDOTA(lastBuyId: string) {
        const skins = await prisma.skinDOTA.findMany({
            where: {
                price: {
                    gte: 100,
                    lte: 6000,
                },
            },
            orderBy: { id: "asc" },
            take: 100,
        })

        const selected = this.pickRandom(skins, 7)
        await prisma.lastBuyDOTA.createMany({
            data: selected.map(skin => ({
                lastBuyId,
                skinId: skin.id,
            })),
        })
    }

    private async addRandomSkinsToLastBuyRUST(lastBuyId: string) {
        const skins = await prisma.skinRUST.findMany({
            where: {
                price: {
                    gte: 100,
                    lte: 6000,
                },
            },
            orderBy: { id: "asc" },
            take: 100,
        })

        const selected = this.pickRandom(skins, 7)
        await prisma.lastBuyRUST.createMany({
            data: selected.map(skin => ({
                lastBuyId,
                skinId: skin.id,
            })),
        })
    }

    private pickRandom<T>(arr: T[], count: number): T[] {
        const shuffled = arr.sort(() => 0.5 - Math.random())
        return shuffled.slice(0, count)
    }
}

export default LastBuyService
