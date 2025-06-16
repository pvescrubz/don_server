import { Currency } from "@prisma/client"
import { CURRENCY_SCHEME } from "../../schemes/currency.scheme"
import { API_METHODS } from "../../types/api-methods.type"
import { API_GUARD, MAIN_TAGS, TTags } from "../../types/tags.type"
import Procedure from "../procedure"

class CurrencyProcedure extends Procedure {
    static method = API_METHODS.GET
    static tags: TTags = [API_GUARD.PUBLIC, MAIN_TAGS.CURRENCY]
    static summary = "Получить курсы валют"

    static paramsSchema = {
        type: "object",
        additionalProperties: false,
        properties: {},
    }

    static resultSchema = {
        type: "object",
        additionalProperties: false,
        properties: CURRENCY_SCHEME,
    }

    async execute(): Promise<Currency | null> {
        return await this.services.currency.get()
    }
}

export default CurrencyProcedure
