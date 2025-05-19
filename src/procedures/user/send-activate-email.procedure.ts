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
        properties: {
            email: {
                type: "string",
                format: "email",
                errorMessage: "Email введен не корректно",
            },
        },
    }

    static resultSchema = {
        type: "object",
        additionalProperties: false,
        properties: {},
    }

    async execute(params: { email: string }, user: TJwtVerifyObject) {
        const { userId } = user

        const dbUser = await this.services.users.getById(userId)
        if (!dbUser) return null

        const newToken = this.services.tokens.generateActivationToken({
            userId,
        })

        const updatedUser = await this.services.users.update(
            { activationToken: newToken, email: params.email },
            userId
        )
        const { activationToken, email, name } = updatedUser

        if (!activationToken || !email) {
            throw new Error("Activation token or email is missing")
        }

        await this.services.email.sendActivateEmail(activationToken, email, name)
    }
}

export default ActivateEmailProcedure
