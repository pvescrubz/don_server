import { Order } from "@prisma/client"
import { TJwtVerifyObject } from "../../services"
import { API_METHODS } from "../../types/api-methods.type"
import { API_GUARD, MAIN_TAGS, TTags } from "../../types/tags.type"
import Procedure from "../procedure"

class CheckoutProcedure extends Procedure {
    static method = API_METHODS.GET
    static tags: TTags = [API_GUARD.PRIVATE, MAIN_TAGS.ORDERS]
    static summary = "Оплата баланса аккаунта и пополнение для платформ"

    static paramsSchema = {
        type: "object",
        additionalProperties: false,
        properties: {},
    }

    static resultSchema = {
        type: "array",
        additionalProperties: true,
        properties: {},
    }

    async execute(_: unknown, user: TJwtVerifyObject): Promise<Order[] | null> {
        return await this.services.orders.getByUserId(user.userId)
    }
}

export default CheckoutProcedure
