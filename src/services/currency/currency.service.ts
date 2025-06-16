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
}

export default CurrencyService
