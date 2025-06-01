import { SkinRUST } from "@prisma/client"
import { API_METHODS } from "../../types/api-methods.type"
import { API_GUARD, MAIN_TAGS, TTags } from "../../types/tags.type"
import Procedure from "../procedure"

class SkinsProcedure extends Procedure {
    static title = "skin-rust/:slug"
    static method = API_METHODS.GET
    static tags: TTags = [API_GUARD.PUBLIC, MAIN_TAGS.SKINS]
    static summary = "получить скин RUST по слагу"

    static paramsSchema = {
        type: "object",
        additionalProperties: false,
        properties: {},
    }

    static resultSchema = {
        type: "object",
        additionalProperties: false,
        properties: {
            id: { type: "string" },
            name: { type: "string" },
            price: { type: "string" },
            imageUrl: { type: "string" },
            image: { type: "string" },
            slug: { type: "string" },

            description: {
                type: "array",
                items: {
                    type: "string",
                },
            },

            type: {
                type: "object",
                nullable: true,
                additionalProperties: true,
            },
            game: {
                type: "object",
                nullable: true,
                additionalProperties: true,
            },
        },
    }

    async execute(params: { slug: string }): Promise<SkinRUST> {
        const { slug } = params
        const skin = await this.services.skins.getSkinRustBySlug(slug)

        if (!skin) throw new Error("Скин не найден")

        return skin
    }
}

export default SkinsProcedure
