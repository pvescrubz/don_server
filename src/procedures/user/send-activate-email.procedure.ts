import { TJwtVerifyObject } from "../../services/tokens/tokens.type"
import { API_METHODS } from "../../types/api-methods.type"
import { API_GUARD, MAIN_TAGS, TTags } from "../../types/tags.type"
import Procedure from "../procedure"

class ActivateEmailProcedure extends Procedure {
    static title = "send-activate-email"
    static method = API_METHODS.POST
    static tags: TTags = [API_GUARD.PRIVATE, MAIN_TAGS.USER]
    static summary = "Подтвердить email адрес"

    static paramsSchema = {
        type: "object",
        additionalProperties: false,
        properties: {},
    }

    static resultSchema = {
        type: "object",
        additionalProperties: false,
        properties: {
            success: { type: "boolean" },
        },
    }

    async execute(_: unknown, user: TJwtVerifyObject): Promise<{ success: boolean }> {
        const { userId } = user

        const dbUser = await this.services.users.getById(userId)
        if (!dbUser || !dbUser.email) throw new Error("Ошибка при отправке пиьсма активации")

        const newToken = this.services.tokens.generateActivationToken({
            userId,
            email: dbUser.email,
        })

        const updatedUser = await this.services.users.update({ activationToken: newToken }, userId)
        const { activationToken, email, name } = updatedUser

        if (!activationToken || !email) {
            throw new Error("Activation token or email is missing")
        }

        this.services.email
            .sendActivateEmail(activationToken, email, name)
            .catch(err => console.error(err))
        return { success: true }
    }
}

export default ActivateEmailProcedure
