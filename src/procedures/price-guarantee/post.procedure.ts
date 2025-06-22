import { API_METHODS } from "../../types/api-methods.type"
import { API_GUARD, MAIN_TAGS, TTags } from "../../types/tags.type"
import { emailValidator } from "../../utils/email-validator"
import Procedure from "../procedure"

class PriceGuaranteeProcedure extends Procedure {
    static method = API_METHODS.POST
    static tags: TTags = [API_GUARD.PUBLIC, MAIN_TAGS.PRICE_GUARANTEE]
    static summary = "Заявка на гарантию лучшей цены"

    static paramsSchema = {
        type: "object",
        additionalProperties: false,
        properties: { email: { type: "string" }, link: { type: "string" } },
    }

    static resultSchema = {
        type: "object",
        additionalProperties: false,
        properties: {
            success: { type: "boolean" },
        },
    }

    async execute(params: { email: string; link: string }): Promise<{
        success: boolean
    }> {
        const { email, link } = params
        if (!emailValidator(email) || !link)
            throw new Error(`Ошибка при составлении заявки ${email} ${link}`)

        const tgMessage = this.services.notification.renderPriceGuaranteeMessage({ email, link })
        this.services.notification.sendNotifToTelegram(tgMessage).catch(err => console.error(err))

        return { success: true }
    }
}

export default PriceGuaranteeProcedure
