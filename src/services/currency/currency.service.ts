import { CurrencyKey } from "@prisma/client"
import { prisma } from "../../prismaClient"

export class CurrencyService {
    async init() {
        await this.create()
    }

    private async create() {
        const currency = await this.get()

        if (!currency) {
            await prisma.currency.create({
                data: {},
            })
        }
    }

    async get() {
        return await prisma.currency.findFirst({
            where: {
                isMain: true,
            },
        })
    }

    async convert(price: number | string, from: CurrencyKey, to: CurrencyKey): Promise<number> {
        const numericPrice = typeof price === "string" ? parseFloat(price) : price
        const currencyData = await this.get()

        if (!currencyData || !currencyData[from] || !currencyData[to]) {
            return 0
        }

        const fromRate = Number(currencyData[from])
        const toRate = Number(currencyData[to])

        if (isNaN(fromRate) || isNaN(toRate)) return 0

        const priceInRUB = numericPrice * fromRate
        const converted = priceInRUB / toRate

        const rounded = Number(converted.toFixed(2))
        return isNaN(rounded) ? 0 : rounded
    }
}
