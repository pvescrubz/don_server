import { TJwtVerifyObject } from "../../services/tokens/tokens.type"
import { API_METHODS } from "../../types/api-methods.type"
import { API_GUARD, MAIN_TAGS, TTags } from "../../types/tags.type"
import Procedure from "../procedure"

class ActivateEmailProcedure extends Procedure {
    static title = "activate"
    static method = API_METHODS.GET
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
        properties: {
            id: { type: "string" },
            email: { type: "string" },
            name: { type: "string" },
            avatarPath: { type: "string" },
            isActivated: { type: "boolean" },
        },
    }

    async execute(params: { token: string }, user: TJwtVerifyObject): Promise<null> {
        const { token } = params
        const decoded = this.services.tokens.verify(token)

        if (!decoded || decoded.userId !== user.userId) {
            throw new Error("Ошибка при активации аккаунта")
        }

        const dbUser = await this.services.users.getById(user.userId)
        if (!dbUser || dbUser.activationToken !== token) {
            throw new Error("Ошибка при активации аккаунта")
        }

        return null
    }
}

export default ActivateEmailProcedure
