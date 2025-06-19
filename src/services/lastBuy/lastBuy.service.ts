import cron from "node-cron"
import { prisma } from "../../prismaClient"

export class LastBuyService {
    async init() {
        await this.updateLastBuy()
        cron.schedule("0 3 * * 0", async () => {
            await this.updateLastBuy()
        })
    }

    private async updateLastBuy() {
        await prisma.lastBuy.deleteMany()

        const [csSkins, dotaSkins, rustSkins] = await Promise.all([
            this.getRandomSkinsByGame("cs2", 7),
            this.getRandomSkinsByGame("dota2", 7),
            this.getRandomSkinsByGame("rust", 7),
        ])

        const selectedSkins = [...csSkins, ...dotaSkins, ...rustSkins]
        await prisma.lastBuy.createMany({
            data: selectedSkins.map(skin => ({
                skinId: skin.id,
            })),
        })
    }

    private async getRandomSkinsByGame(gameName: string, count: number) {
        const game = await prisma.game.findFirst({
            where: { name: gameName },
            select: { id: true },
        })

        if (!game) {
            throw new Error(`Game ${gameName} not found`)
        }

        const skins = await prisma.skin.findMany({
            where: {
                gameId: game.id,
                price: {
                    gte: 0,
                    lte: 8000,
                },
            },
            take: 100,
            orderBy: {
                id: "asc",
            },
        })

        return this.pickRandom(skins, count)
    }

    private pickRandom<T>(arr: T[], count: number): T[] {
        const shuffled = [...arr].sort(() => 0.5 - Math.random())
        return shuffled.slice(0, count)
    }
}
