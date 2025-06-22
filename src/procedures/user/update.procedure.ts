import { User } from "@prisma/client"
import { USER_SCHEME } from "../../schemes/user.scheme"
import { TJwtVerifyObject } from "../../services/tokens/tokens.type"
import { API_METHODS } from "../../types/api-methods.type"
import { API_GUARD, MAIN_TAGS, TTags } from "../../types/tags.type"
import { emailValidator } from "../../utils/email-validator"
import Procedure from "../procedure"

class UpdateUserProcedure extends Procedure {
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
            isSubscribedToNews: {
                type: "boolean",
            },
        },
    }

    static resultSchema = {
        type: "object",
        additionalProperties: false,
        properties: USER_SCHEME,
    }

    async execute(
        params: { steamTradeUrl: string; email: string; isSubscribedToNews: boolean },
        user: TJwtVerifyObject
    ): Promise<User> {
        const { email, ...updateData } = params

        if (email && !emailValidator(email)) throw new Error("Некорретные емейл")

        const dbUser = await this.services.users.getById(user.userId)
        if (!dbUser) throw new Error("Ошибка при обновлении данных пользователя")

        const updatedUser = await this.services.users.update(
            {
                ...updateData,
                ...(email && { email: email.toLowerCase() }),
            },
            user.userId
        )

        if (updateData.isSubscribedToNews) {
            this.services.email.sendSubscrEmail(email)
        }

        return updatedUser
    }
}

export default UpdateUserProcedure
