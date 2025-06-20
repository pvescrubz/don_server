import { Statistics } from "@prisma/client"
import { API_METHODS } from "../../types/api-methods.type"
import { API_GUARD, MAIN_TAGS, TTags } from "../../types/tags.type"
import Procedure from "../procedure"

class CurrencyProcedure extends Procedure {
    static method = API_METHODS.GET
    static tags: TTags = [API_GUARD.PUBLIC, MAIN_TAGS.STATISTICS]
    static summary = "Получить статистику продаж"

    static paramsSchema = {
        type: "object",
        additionalProperties: false,
        properties: {},
    }

    static resultSchema = {
        type: "object",
        additionalProperties: false,
        properties: {
            total: { type: "string" },
            monthly: { type: "string" },
            weekly: { type: "string" },
            daily: { type: "string" },
        },
    }

    async execute(): Promise<Statistics | null> {
        return await this.services.statistics.get()
    }
}

export default CurrencyProcedure
