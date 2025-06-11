import { Skin } from "@prisma/client"
import { FastifyBaseLogger } from "fastify"
import { prisma } from "../../prismaClient"
import { ICart } from "./cart.type"

class CartService {
    private log: FastifyBaseLogger

    constructor(params: { log: FastifyBaseLogger }) {
        this.log = params.log
    }

    async getOrCreateCart(userId: string): Promise<ICart> {
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                skins: {
                    include: {
                        game: true,
                        rarity: true,
                        exterior: true,
                    },
                },
            },
        })
        if (!cart) {
            return await prisma.cart.create({
                data: { userId },
                include: {
                    skins: {
                        include: {
                            game: true,
                            rarity: true,
                            exterior: true,
                            souvenir: true,
                            killCounter: true,
                        },
                    },
                },
            })
        }

        return cart
    }

    async add(cartId: string, skin: Skin): Promise<ICart> {
        return await prisma.cart.update({
            where: { id: cartId },
            include: {
                skins: {
                    include: {
                        game: true,
                        rarity: true,
                        exterior: true,
                    },
                },
            },

            data: {
                skins: { connect: { id: skin.id } },
                itemsCount: { increment: 1 },
                totalRUB: {
                    increment: Number(skin.priceRUB),
                },
                totalKZT: {
                    increment: Number(skin.priceKZT),
                },
                totalUSD: {
                    increment: Number(skin.priceUSD),
                },
                totalEUR: {
                    increment: Number(skin.priceEUR),
                },
            },
        })
    }

    async remove(cartId: string, skin: Skin): Promise<ICart> {
        return await prisma.cart.update({
            where: { id: cartId },
            include: {
                skins: {
                    include: {
                        game: true,
                        rarity: true,
                        exterior: true,
                    },
                },
            },
            data: {
                skins: {
                    disconnect: { id: skin.id },
                },
                itemsCount: {
                    decrement: 1,
                },
                totalRUB: {
                    decrement: Number(skin.priceRUB),
                },
                totalKZT: {
                    decrement: Number(skin.priceKZT),
                },
                totalUSD: {
                    decrement: Number(skin.priceUSD),
                },
                totalEUR: {
                    decrement: Number(skin.priceEUR),
                },
            },
        })
    }

    async clear(cartId: string): Promise<ICart> {
        return await prisma.cart.update({
            where: { id: cartId },
            include: {
                skins: true,
            },
            data: {
                skins: {
                    set: [],
                },
                itemsCount: 0,
                totalRUB: 0,
                totalKZT: 0,
                totalUSD: 0,
                totalEUR: 0,
            },
        })
    }
}

export default CartService
