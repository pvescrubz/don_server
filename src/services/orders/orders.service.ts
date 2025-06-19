import { Order, Skin } from "@prisma/client"
import { FastifyBaseLogger } from "fastify"
import { prisma } from "../../prismaClient"
import { ICreateOrderData } from "./orders.type"

export class OrdersService {
    private log: FastifyBaseLogger

    constructor(params: { log: FastifyBaseLogger }) {
        this.log = params.log
    }

    async create(data: ICreateOrderData, withCart?: boolean): Promise<Order> {
        const { userId, ...rest } = data
        let skinIds: Record<"id", string>[] = []

        if (withCart) {
            const cart = await prisma.cart.findUnique({
                where: { userId },
                include: {
                    skins: true,
                },
            })

            if (!cart || cart.skins.length === 0) {
                throw new Error("Корзина пуста")
            }

            skinIds = cart.skins.map(skin => ({ id: skin.id }))
        }

        const connectUser = userId ? { user: { connect: { id: userId } } } : {}
        const connectSkins = withCart ? { skins: { connect: skinIds } } : {}

        return await prisma.order.create({
            data: {
                status: "PENDING",
                ...rest,
                ...connectUser,
                ...connectSkins,
            },
        })
    }

    async getById(id: string): Promise<(Order & { skins: Skin[] }) | null> {
        return await prisma.order.findUnique({
            where: { id },
            include: {
                skins: true,
            },
        })
    }

    async update(
        data: Partial<Order>,
        id: string,
        withSkins?: boolean
    ): Promise<Order & { skins?: Skin[] }> {
        return await prisma.order.update({
            where: {
                id,
            },
            data,
            ...(withSkins && {
                include: {
                    skins: true,
                },
            }),
        })
    }

    async delete(id: string) {
        return await prisma.order.delete({
            where: { id },
        })
    }

    async getByUserId(userId: string): Promise<Order[] | null> {
        return await prisma.order.findMany({
            where: {
                userId,
            },
            include: {
                skins: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        })
    }
}
