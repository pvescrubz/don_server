import { Operation, PaymentMethod } from "@prisma/client"
import { TJwtVerifyObject } from "../../services"
import { ICheckoutParams } from "../../services/checkout/checkout.type"
import { API_METHODS } from "../../types/api-methods.type"
import { ICheckoutNotifWithEmail } from "../../types/checkout-notification.type"
import { API_GUARD, MAIN_TAGS, TTags } from "../../types/tags.type"
import { emailValidator } from "../../utils/email-validator"
import Procedure from "../procedure"

class CheckoutProcedure extends Procedure {
    static method = API_METHODS.POST
    static tags: TTags = [API_GUARD.PUBLIC, MAIN_TAGS.CHECKOUT]
    static summary = "Оплата баланса аккаунта и пополнение для платформ"

    static paramsSchema = {
        type: "object",
        additionalProperties: false,
        required: ["paymentMethod", "operation"],
        properties: {
            amount: { type: "string" },
            currency: { type: "string" },
            paymentMethod: { type: "string" },
            operation: { type: "string" },
            email: { type: "string" },
        },
    }

    static resultSchema = {
        type: "object",
        additionalProperties: false,
        properties: {
            success: { type: "boolean" },
            payment_url: { type: "string" },
        },
    }

    async execute(
        params: ICheckoutParams,
        user?: TJwtVerifyObject
    ): Promise<{ success: boolean; payment_url?: string }> {
        const { amount, paymentMethod, currency, operation, email } = params
  

        let dbUser = null

        if (user?.userId) {
            dbUser = await this.services.users.getById(user?.userId)
        }

        const notificationEmail = email || dbUser?.email
        if (!notificationEmail || !emailValidator(notificationEmail))
            throw new Error("Некрректный email")

        if (!operation || !Object.values(Operation).includes(operation)) {
            throw new Error("Некорректная платежная операция")
        }

        const isBuySkins = operation === Operation.BUY_SKINS
        let validatedAmount = Number(amount)

        if (isBuySkins && dbUser) {
            const cart = await this.services.cart.getOrCreateCart(dbUser.id)
            validatedAmount = Number(cart.total.toFixed(2))
        }

        if (!isBuySkins && currency !== "RUB") {
            validatedAmount = await this.services.currency.convert(validatedAmount, currency, "RUB")
        }

        const validatedParams: Required<ICheckoutParams> = {
            amount: validatedAmount,
            paymentMethod,
            currency,
            operation,
            email: notificationEmail,
        }     

        if (paymentMethod === PaymentMethod.ACCUNT_BALANCE) {
            if (!dbUser) throw new Error("Ошибка при оплате через баланс аккаунта")

            const { amount, transactionId, skins } = await this.services.checkout.accountBalance({
                data: validatedParams,
                user: dbUser,
                isBuySkins,
                createOrder: this.services.orders.create,
                updateOrder: this.services.orders.update,
                clearCart: this.services.cart.clear,
            })

            const notifData: ICheckoutNotifWithEmail = {
                email: notificationEmail,
                amount,
                transactionId,
                operation,
                paymentMethod,
                skins,
            }

            this.services.email.sendCheckoutEmail(notifData).catch(err => {
                console.error(err)
            })

            this.services.notification.sendNotificationToTelegram(notifData)

            return { success: true }
        }

        if (paymentMethod === PaymentMethod.SBP) {
            if (10 > validatedAmount) throw new Error("Минимальная сумма для оплаты 10 рублей")

            const { payment_url } = await this.services.checkout.sbp({
                data: validatedParams,
                user: dbUser || null,
                isBuySkins,
                createOrder: this.services.orders.create,
                updateOrder: this.services.orders.update,
            })
            if (!payment_url) throw new Error("Ошибка при оплате")

            return { success: true, payment_url }
        }

        return { success: false }
    }
}

export default CheckoutProcedure
