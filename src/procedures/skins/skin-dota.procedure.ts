import { SkinDOTA } from "@prisma/client"
import { API_METHODS } from "../../types/api-methods.type"
import { API_GUARD, MAIN_TAGS, TTags } from "../../types/tags.type"
import Procedure from "../procedure"

class SkinsProcedure extends Procedure {
    static title = "skin-dota/:slug"
    static method = API_METHODS.GET
    static tags: TTags = [API_GUARD.PUBLIC, MAIN_TAGS.SKINS]
    static summary = "получить скин DOTA по слагу"

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

            hero: {
                type: "object",
                nullable: true,
                additionalProperties: true,
            },

            slot: {
                type: "object",
                nullable: true,
                additionalProperties: true,
            },

            type: {
                type: "object",
                nullable: true,
                additionalProperties: true,
            },

            rarity: {
                type: "object",
                nullable: true,
                additionalProperties: true,
            },

            quality: {
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

    async execute(params: { slug: string }): Promise<SkinDOTA> {
        const { slug } = params
        const skin = await this.services.skins.getSkinDotaBySlug(slug)

        if (!skin) throw new Error("Скин не найден")

        return skin
    }
}

export default SkinsProcedure
