import { API_METHODS } from "../../types/api-methods.type"
import { API_GUARD, MAIN_TAGS, TTags } from "../../types/tags.type"
import Procedure from "../procedure"

class FiltersProcedure extends Procedure {
    static title = "dota2"
    static method = API_METHODS.GET
    static tags: TTags = [API_GUARD.PUBLIC, MAIN_TAGS.FILTERS]
    static summary = "Получить все фильтры DOTA для UI"

    static paramsSchema = {
        type: "object",
        additionalProperties: false,
        properties: {},
    }

    static resultSchema = {
        type: "object",
        additionalProperties: true,
    }

    async execute() {
        return this.services.filters.getDotaFilters()
    }
}

export default FiltersProcedure
