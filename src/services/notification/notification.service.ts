import { IConfig } from "../../config"
import { OPERATION_RU, PAYMENT_METHOD_RU } from "../../constants"
import { ICheckoutNotifWithEmail } from "../../types/checkout-notification.type"

export class NotificationService {
    private TG_TOKEN: string
    private TG_CHAT: string
    private URI_API: string

    constructor(config: IConfig) {
        this.TG_TOKEN = config.notification.tgApiToken
        this.TG_CHAT = config.notification.tgChat
        this.URI_API = `https://api.telegram.org/bot${this.TG_TOKEN}/sendMessage`
    }

    async sendNotificationToTelegram(data: ICheckoutNotifWithEmail) {
        const text = await this.renderTgMessage(data)
        
        const response = await fetch(this.URI_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chat_id: this.TG_CHAT,
                parse_mode: "HTML",
                text,
            }),
        })

        if (!response.ok) {
            const errorMessage = `Ошибка отправки в Telegram: ${response.status} ${response.statusText}`
            console.error(errorMessage)
        }
    }

    private async renderTgMessage(data: ICheckoutNotifWithEmail) {
        const { paymentMethod, transactionId, amount, operation, email, skins } = data

        let message = `<b>🔔 Новый платёж</b>\n`
        message += `➖➖➖➖➖➖➖➖➖\n\n`

        message += `<b>Метод оплаты:</b> ${this.formatValue(PAYMENT_METHOD_RU[paymentMethod])}\n`
        message += `<b>ID транзакции:</b> <code>${this.formatValue(transactionId)}</code>\n`
        message += `<b>Сумма:</b> ${this.formatValue(amount)} ₽\n`
        message += `<b>Операция:</b> ${this.formatValue(OPERATION_RU[operation])}\n`
        message += `<b>Email:</b> ${this.formatValue(email)}\n`

        if (skins && skins.length > 0) {
            message += `\n<b>Предметы:</b>\n`
            message += skins.map(skin => `• ${skin.name} (${skin.price} ₽)`).join("\n")
        }

        return message
    }
    private formatValue(value: string | number | undefined | null): string {
        return value === undefined || value === null ? "–" : String(value)
    }
}
