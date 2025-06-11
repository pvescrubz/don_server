import { Skin } from "@prisma/client"
import { API_METHODS } from "../../types/api-methods.type"
import { API_GUARD, MAIN_TAGS, TTags } from "../../types/tags.type"
import Procedure from "../procedure"

class SkinsProcedure extends Procedure {
    static title = "best-this-week"
    static method = API_METHODS.GET
    static tags: TTags = [API_GUARD.PUBLIC, MAIN_TAGS.SKINS]
    static summary = "Получить лучшие предложения недели"

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
            properties: {
                id: { type: "string" },
                name: { type: "string" },
                priceRUB: { type: "string" },
                priceKZT: { type: "string" },
                priceUSD: { type: "string" },
                priceEUR: { type: "string" },
                imageUrl: { type: "string" },
                image: { type: "string" },
                slug: { type: "string" },
                game: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        name: { type: "string" },
                    },
                },

                //cs
                killCounter: {
                    type: "object",
                    additionalProperties: true,
                },
                souvenir: {
                    type: "object",
                    additionalProperties: true,
                },
            },
        },
    }

    async execute(): Promise<Skin[]> {
        return this.services.skins.getWeekly()
    }
}

export default SkinsProcedure
