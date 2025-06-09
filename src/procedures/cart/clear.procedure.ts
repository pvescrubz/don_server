import { ICart } from "../../services/cart/cart.type"
import { TJwtVerifyObject } from "../../services/tokens/tokens.type"
import { API_METHODS } from "../../types/api-methods.type"
import { API_GUARD, MAIN_TAGS, TTags } from "../../types/tags.type"
import Procedure from "../procedure"

class SkinsProcedure extends Procedure {
    static title = "clear"
    static method = API_METHODS.DELETE
    static tags: TTags = [API_GUARD.PRIVATE, MAIN_TAGS.CART]
    static summary = "Очистить корзину полностью"

    static paramsSchema = {
        type: "object",
        additionalProperties: false,
        properties: {},
    }

    static resultSchema = {
        type: "object",
        additionalProperties: false,
        properties: {
            id: { type: "string" },
            totalAmount: { type: "string" },
            itemsCount: { type: "integer" },
            skins: {
                type: "array",
                items: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        price: { type: "string" },
                        image: { type: "string" },
                        slug: { type: "string" },
                        game: {
                            type: "object",
                            additionalProperties: false,
                            properties: {
                                name: { type: "string" },
                            },
                        },
                    },
                },
            },
        },
    }

    async execute(_: unknown, user: TJwtVerifyObject): Promise<ICart> {
        const { userId } = user

        const dbUser = await this.services.users.getById(userId)
        if (!dbUser) throw new Error("Пользователь не найден")

        const cart = await this.services.cart.getOrCreateCart(userId)
        if (!cart) throw new Error("Корзина пользователя не найдена")

        return await this.services.cart.clear(cart.id)
    }
}

export default SkinsProcedure
