import { TSkinData } from "../../services/skins/skins.type"
import { API_METHODS } from "../../types/api-methods.type"
import { API_GUARD, MAIN_TAGS, TTags } from "../../types/tags.type"
import Procedure from "../procedure"

class SkinsProcedure extends Procedure {
    static title = "last-buy"
    static method = API_METHODS.GET
    static tags: TTags = [API_GUARD.PUBLIC, MAIN_TAGS.SKINS]
    static summary =
        "Фильрация и поиск: Значение игры в реквест параметре / остальные значения в квери"

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
    }

    async execute(): Promise<TSkinData> {
        return this.services.skins.getLastBuy()
    }
}

export default SkinsProcedure
