import { Statistics } from "@prisma/client"
import cron from "node-cron"
import { prisma } from "../../prismaClient"

export class StatisticsService {
    async init() {
        await this.create()

        cron.schedule("*/30 * * * *", async () => {
            try {
                await this.updateHourly()
            } catch (err) {
                console.error("[cron] Hourly update failed:", err)
            }
        })

        cron.schedule("0 1 * * *", async () => {
            try {
                await this.updateDaily()
            } catch (err) {
                console.error("[cron] Daily update failed:", err)
            }
        })
    }

    private async create() {
        const currency = await this.get()

        if (!currency) {
            await prisma.statistics.create({
                data: {
                    total: 18264228,
                    monthly: 27629,
                    weekly: 6840,
                    daily: 114,
                    isMain: true,
                },
            })
        }
    }

    async get(): Promise<Statistics | null> {
        return await prisma.statistics.findFirst({
            where: {
                isMain: true,
            },
        })
    }

    async updateHourly() {
        const stats = await this.get()
        if (!stats) return

        const increment = this.randomInt(15, 25)
        await prisma.statistics.update({
            where: { id: stats.id },
            data: {
                daily: stats.daily + increment,
                weekly: stats.weekly + increment,
                monthly: stats.monthly + increment,
                total: stats.total + increment,
            },
        })
    }

    async updateDaily() {
        const stats = await this.get()
        if (!stats) return
        const newDaily = this.randomInt(80, 98)
        const newWeekly = this.randomInt(6200, 6600)
        const newMonthly = this.randomInt(27000, 30000)
        const increment = newDaily

        await prisma.statistics.update({
            where: { id: stats.id },
            data: {
                daily: newDaily,
                weekly: newWeekly,
                monthly: newMonthly,
                total: stats.total + increment,
            },
        })
    }

    private randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }
}
