import { CurrencyKey, User } from "@prisma/client"
import { USER_SCHEME } from "../../schemes/user.scheme"
import { TJwtVerifyObject } from "../../services/tokens/tokens.type"
import { API_METHODS } from "../../types/api-methods.type"
import { API_GUARD, MAIN_TAGS, TTags } from "../../types/tags.type"
import Procedure from "../procedure"

class SkinsProcedure extends Procedure {
    static title = "change-currency"
    static method = API_METHODS.POST
    static tags: TTags = [API_GUARD.PRIVATE, MAIN_TAGS.CART]
    static summary = "Изменить валюту"

    static paramsSchema = {
        type: "object",
        additionalProperties: false,
        properties: {},
    }

    static resultSchema = {
        type: "object",
        additionalProperties: false,
        properties: USER_SCHEME,
    }

    async execute(params: { currency: string }, user: TJwtVerifyObject): Promise<User> {
        const { userId } = user
        const { currency } = params

        if (!currency) throw new Error("Ошибка при смене валюты")

        const dbUser = await this.services.users.getById(userId)
        if (!dbUser) throw new Error("Пользователь не найден")

        const updatedUser = await this.services.users.update(
            { selectedCurrency: currency as CurrencyKey },
            userId
        )

        return updatedUser
    }
}

export default SkinsProcedure
