import { SORT_OPTIONS } from "../../services/filters/filters.constans"
import { TSkinsResponse } from "../../services/skins/skins.type"
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

            // cs2
            category: { type: "string" },
            search: { type: "string" },
            phase: { type: "string" },
            statTrak: {
                type: "string",
                enum: ["statTrak", "noStatTrak"],
            },
            souvenir: {
                type: "string",
                enum: ["souvenir", "noSouvenir"],
            },

            // dota2
            hero: { type: "string" },
            slot: { type: "string" },

            // sort
            priceFrom: { type: "integer", minimum: 0 },
            priceTo: { type: "integer", minimum: 0 },
            sort: {
                type: "string",
                enum: Object.values(SORT_OPTIONS).map(opt => opt.name),
                default: SORT_OPTIONS.POPULAR.name,
            },
            page: { type: "integer", minimum: 1, default: 1 },
            perPage: { type: "integer", minimum: 1, default: 40 },
        },
    }

    static resultSchema = {
        type: "object",
        additionalProperties: true,
    }

    async execute(params: Record<string, string>): Promise<TSkinsResponse> {
        return this.services.skins.getSkins(params)
    }
}

export default SkinsProcedure
