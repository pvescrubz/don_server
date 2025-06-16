import { Skin } from "@prisma/client"
import { BETTER_OFFERS } from "../../schemes/better-offers.sheme"
import { API_METHODS } from "../../types/api-methods.type"
import { API_GUARD, MAIN_TAGS, TTags } from "../../types/tags.type"
import Procedure from "../procedure"

class SkinsProcedure extends Procedure {
    static title = "last-buy"
    static method = API_METHODS.GET
    static tags: TTags = [API_GUARD.PUBLIC, MAIN_TAGS.SKINS]
    static summary = "Получить лучшие последние покупки"

    static paramsSchema = {
        type: "object",
        additionalProperties: false,
        properties: {},
    }

    static resultSchema = {
        type: "array",
        items: {
            type: "object",
            additionalProperties: false,
            properties: BETTER_OFFERS,
        },
    }

    async execute(): Promise<Skin[]> {
        return this.services.skins.getLastBuy()
    }
}

export default SkinsProcedure
