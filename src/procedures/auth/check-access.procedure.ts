import { User } from "@prisma/client"
import { USER_SCHEME } from "../../schemes/user.scheme"
import { TJwtVerifyObject } from "../../services/tokens/tokens.type"
import { API_METHODS } from "../../types/api-methods.type"
import { API_GUARD, HELPFUL_TAGS, MAIN_TAGS, TTags } from "../../types/tags.type"
import Procedure from "../procedure"

class ChechAccessProcedure extends Procedure {
    static title = "check-access"
    static method = API_METHODS.POST
    static tags: TTags = [API_GUARD.PRIVATE, MAIN_TAGS.AUTH, HELPFUL_TAGS.ACCESS]
    static summary = "Проверить access токен"

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

    async execute(_: any, user: TJwtVerifyObject): Promise<User | null> {
        const dsUser = await this.services.users.getById(user.userId)
        if (!dsUser) return null
        
        return dsUser
    }
}

export default ChechAccessProcedure
