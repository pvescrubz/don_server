import { TSkinsRes } from "../../services/skins/skins.type"
import { API_METHODS } from "../../types/api-methods.type"
import { API_GUARD, MAIN_TAGS, TTags } from "../../types/tags.type"
import Procedure from "../procedure"

class SkinsProcedure extends Procedure {
    static title = ":game"
    static method = API_METHODS.GET
    static tags: TTags = [API_GUARD.PUBLIC, MAIN_TAGS.SKINS]
    static summary =
        "Фильрация и поиск: Значение игры в реквест параметре / остальные значения в квери"

    static paramsSchema = {
        type: "object",
        additionalProperties: false,
        properties: {
            // global
            quality: { type: "string" },
            rarity: { type: "string" },
            type: { type: "string" },
            search: { type: "string" },

            // cs2
            category: { type: "string" },
            phase: { type: "string" },
            killCounter: { type: "string" },
            souvenir: { type: "string" },

            // dota2
            hero: { type: "string" },
            slot: { type: "string" },

            // sort
            priceFrom: { type: "integer", minimum: 0 },
            priceTo: { type: "integer", minimum: 0 },
            sort: {
                type: "string",
            },
            page: { type: "integer", minimum: 1, default: 1 },
            perPage: { type: "integer", minimum: 1, default: 48},
        },
    }

    static resultSchema = {
        type: "object",
        additionalProperties: false,
        properties: {
            data: {
                type: "array",
                items: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        price: { type: "string" },
                        imageUrl: { type: "string" },
                        image: { type: "string" },
                        slug: { type: "string" },

                        //cs
                        killCounter: {
                            type: "object",
                            additionalProperties: true,
                            properties: {
                                id: { type: "string" },
                                name: { type: "string" },
                                ruName: { type: "string" },
                                groupName: { type: "string" },
                                flag: { type: "boolean" },
                            },
                        },
                        souvenir: {
                            type: "object",
                            additionalProperties: true,
                            properties: {
                                id: { type: "string" },
                                name: { type: "string" },
                                ruName: { type: "string" },
                                groupName: { type: "string" },
                                flag: { type: "boolean" },
                            },
                        },
                    },
                },
            },
            meta: {
                type: "object",
                properties: {
                    currentPage: { type: "integer" },
                    totalPages: { type: "integer" },
                    totalItems: { type: "integer" },
                    itemsPerPage: { type: "integer" },
                },
            },
        },
    }

    async execute(params: Record<string, string>): Promise<TSkinsRes> {
        return this.services.skins.getSkins(params)
    }
}

export default SkinsProcedure
