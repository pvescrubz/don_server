import { Skin } from "@prisma/client"
import { SKIN_SCHEME } from "../../schemes/skin.scheme"
import { API_METHODS } from "../../types/api-methods.type"
import { API_GUARD, MAIN_TAGS, TTags } from "../../types/tags.type"
import Procedure from "../procedure"

class SkinsProcedure extends Procedure {
    static title = "skin"
    static method = API_METHODS.GET
    static tags: TTags = [API_GUARD.PUBLIC, MAIN_TAGS.SKINS]
    static summary = "получить скин по игре и слагу"

    static paramsSchema = {
        type: "object",
        additionalProperties: false,
        required: ["slug"],
        properties: {
            slug: { type: "string" },
        },
    }

    static resultSchema = {
        type: "object",
        additionalProperties: false,
        properties: SKIN_SCHEME,
    }

    async execute(params: { slug: string }): Promise<Skin> {
        const { slug } = params

        const skin = await this.services.skins.getBySlug(slug)

        if (!skin) throw new Error("Скин не найден")

        return skin
    }
}

export default SkinsProcedure
