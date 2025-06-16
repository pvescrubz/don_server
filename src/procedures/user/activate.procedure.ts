import { API_METHODS } from "../../types/api-methods.type"
import { API_GUARD, MAIN_TAGS, TTags } from "../../types/tags.type"
import Procedure from "../procedure"

class ActivateEmailProcedure extends Procedure {
    static title = "activate"
    static method = API_METHODS.POST
    static tags: TTags = [API_GUARD.PUBLIC, MAIN_TAGS.USER]
    static summary = "Подтвердить email адрес"

    static paramsSchema = {
        type: "object",
        additionalProperties: false,
        properties: {
            token: {
                type: "string",
            },
        },
    }

    static resultSchema = {
        type: "object",
        additionalProperties: false,
        properties: { success: { type: "boolean" } },
    }

    async execute(params: { token: string }): Promise<{ success: boolean }> {
        const { token } = params

        const decoded = this.services.tokens.verify(token)
        if (!decoded) throw new Error("Ошибка при активации аккаунта")

        const { userId, email, type } = decoded
        if (type !== "activation") throw new Error("Недействительный токен активации")
        if (!userId || !email) throw new Error("Ошибка при активации аккаунта")

        const dbUser = await this.services.users.getById(decoded.userId)
        if (!dbUser) throw new Error("Ошибка при активации аккаунта")

        const tokensMatch = dbUser?.activationToken === token
        const emailsMatch = dbUser.email?.toLowerCase() === email.toLowerCase()
        const idsMatch = dbUser.id === userId

        if (!emailsMatch || !idsMatch || !tokensMatch) {
            throw new Error("Ошибка при активации аккаунта")
        }

        await this.services.users.update(
            {
                activatedEmail: email.toLowerCase(),
                activationToken: null,
            },
            userId
        )

        return { success: true }
    }
}

export default ActivateEmailProcedure
