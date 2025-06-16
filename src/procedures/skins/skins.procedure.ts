import { GET_SKINS_PARAMS_SCHEME, GET_SKINS_RESULT_SCHEME } from "../../schemes/get-skins.scheme"
import { TSkinsRes } from "../../services/skins/skins.type"
import { API_METHODS } from "../../types/api-methods.type"
import { API_GUARD, MAIN_TAGS, TTags } from "../../types/tags.type"
import Procedure from "../procedure"

class SkinsProcedure extends Procedure {
    static method = API_METHODS.GET
    static tags: TTags = [API_GUARD.PUBLIC, MAIN_TAGS.SKINS]
    static summary =
        "Фильрация и поиск: Значение игры в реквест параметре / остальные значения в квери"

    static paramsSchema = {
        type: "object",
        additionalProperties: false,
        required: ["game"],
        properties: GET_SKINS_PARAMS_SCHEME,
    }

    static resultSchema = {
        type: "object",
        additionalProperties: false,
        properties: GET_SKINS_RESULT_SCHEME,
    }

    async execute(params: Record<string, string>): Promise<TSkinsRes> {
        return this.services.skins.getSkins(params)
    }
}

export default SkinsProcedure
