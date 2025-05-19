import { API_METHODS } from "../../types/api-methods.type"
import { API_GUARD, HELPFUL_TAGS, MAIN_TAGS, TTags } from "../../types/tags.type"
import Procedure from "../procedure"

class LoginProcedure extends Procedure {
    static title = "steam-login"
    static method = API_METHODS.GET
    static tags: TTags = [
        API_GUARD.PUBLIC,
        MAIN_TAGS.AUTH,
        HELPFUL_TAGS.SIGNIN,
        HELPFUL_TAGS.PASSPORT_STEAM,
        HELPFUL_TAGS.PASSPORT_CALLBACK,
    ]
    static summary = "Логин стим"

    static paramsSchema = {
        type: "object",
        additionalProperties: false,
        properties: {},
    }

    static resultSchema = {
        type: "null",
        additionalProperties: false,
    }

    async execute(params: any): Promise<null> {
        return null
    }
}

export default LoginProcedure
