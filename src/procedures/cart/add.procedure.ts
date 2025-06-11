import { ICart } from "../../services/cart/cart.type"
import { TJwtVerifyObject } from "../../services/tokens/tokens.type"
import { API_METHODS } from "../../types/api-methods.type"
import { API_GUARD, MAIN_TAGS, TTags } from "../../types/tags.type"
import Procedure from "../procedure"

class SkinsProcedure extends Procedure {
    static title = "add"
    static method = API_METHODS.POST
    static tags: TTags = [API_GUARD.PRIVATE, MAIN_TAGS.CART]
    static summary = "Добавить товар в корзину по ID"

    static paramsSchema = {
        type: "object",
        additionalProperties: false,
        properties: {
            skinId: { type: "string" },
        },
    }

    static resultSchema = {
        type: "object",
        additionalProperties: false,
        properties: {
            id: { type: "string" },
            totalRUB: { type: "string" },
            totalKZT: { type: "string" },
            totalUSD: { type: "string" },
            totalEUR: { type: "string" },
            itemsCount: { type: "integer" },
            skins: {
                type: "array",
                items: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        priceRUB: { type: "string" },
                        priceKZT: { type: "string" },
                        priceUSD: { type: "string" },
                        priceEUR: { type: "string" },
                        image: { type: "string" },
                        slug: { type: "string" },
                        game: {
                            type: "object",
                            additionalProperties: false,
                            properties: {
                                name: { type: "string" },
                            },
                        },

                        rarity: {
                            type: "object",
                            nullable: true,
                            additionalProperties: true,
                        },
                        exterior: {
                            type: "object",
                            nullable: true,
                            additionalProperties: true,
                        },
                    },
                },
            },
        },
    }

    async execute(params: { skinId: string }, user: TJwtVerifyObject): Promise<ICart> {
        const { userId } = user
        const { skinId } = params

        const dbUser = await this.services.users.getById(userId)
        if (!dbUser) throw new Error("Пользователь не найден")

        const cart = await this.services.cart.getOrCreateCart(userId)
        if (!cart) throw new Error("Корзина пользователя не найдена")

        const skin = await this.services.skins.getById(skinId)
        if (!skin) throw new Error("Товар не найден")

        const alreadyInCart = cart.skins.some(s => s.id === skinId)
        if (alreadyInCart) throw new Error("Этот товар уже в вашей корзине")

        return await this.services.cart.add(cart.id, skin)
    }
}

export default SkinsProcedure
