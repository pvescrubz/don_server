import { CART_SCHEME } from "../../schemes/cart.scheme"
import { ICart } from "../../services/cart/cart.type"
import { TJwtVerifyObject } from "../../services/tokens/tokens.type"
import { API_METHODS } from "../../types/api-methods.type"
import { API_GUARD, MAIN_TAGS, TTags } from "../../types/tags.type"
import Procedure from "../procedure"

class SkinsProcedure extends Procedure {
    static method = API_METHODS.GET
    static tags: TTags = [API_GUARD.PRIVATE, MAIN_TAGS.CART]
    static summary = "Получить корзину"

    static paramsSchema = {
        type: "object",
        additionalProperties: false,
        properties: {},
    }

    static resultSchema = {
        type: "object",
        additionalProperties: false,
        properties: CART_SCHEME,
    }

    async execute(_: unknown, user: TJwtVerifyObject): Promise<ICart> {
        const { userId } = user

        const dbUser = await this.services.users.getById(userId)
        if (!dbUser) throw new Error("Пользователь не найден")

        const cart = await this.services.cart.getOrCreateCart(userId)
        if (!cart) throw new Error("Корзина пользователя не найдена")

        return cart
    }
}

export default SkinsProcedure
