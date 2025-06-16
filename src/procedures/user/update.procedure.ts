import { User } from "@prisma/client"
import { USER_SCHEME } from "../../schemes/user.scheme"
import { TJwtVerifyObject } from "../../services/tokens/tokens.type"
import { API_METHODS } from "../../types/api-methods.type"
import { API_GUARD, MAIN_TAGS, TTags } from "../../types/tags.type"
import Procedure from "../procedure"

class ActivateEmailProcedure extends Procedure {
    static title = "update"
    static method = API_METHODS.POST
    static tags: TTags = [API_GUARD.PRIVATE, MAIN_TAGS.USER]
    static summary = "Подтвердить email адрес"

    static paramsSchema = {
        type: "object",
        additionalProperties: false,
        properties: {
            steamTradeUrl: {
                type: "string",
            },
            email: {
                type: "string",
            },
        },
    }

    static resultSchema = {
        type: "object",
        additionalProperties: false,
        properties: USER_SCHEME,
    }

    async execute(
        params: { steamTradeUrl: string; email: string },
        user: TJwtVerifyObject
    ): Promise<User> {
        const { steamTradeUrl, email } = params

        const dbUser = await this.services.users.getById(user.userId)
        if (!dbUser) throw new Error("Ошибка при обновлении данных пользователя")

        const updatedUser = await this.services.users.update(
            {
                ...(steamTradeUrl && { steamTradeUrl }),
                ...(email && { email: email.toLowerCase() }),
            },
            user.userId
        )

        return updatedUser
    }
}

export default ActivateEmailProcedure
