import { Operation, PaymentStatus } from "@prisma/client"
import { prisma } from "../../prismaClient"
import { API_METHODS } from "../../types/api-methods.type"
import { IPaymentCallback } from "../../types/callbacks.type"
import { ICheckoutNotifWithEmail } from "../../types/checkout-notification.type"
import { API_GUARD, HELPFUL_TAGS, MAIN_TAGS, TTags } from "../../types/tags.type"
import Procedure from "../procedure"

class SbpCallbackProcedure extends Procedure {
    static title = "sbp"
    static method = API_METHODS.POST
    static tags: TTags = [API_GUARD.PUBLIC, MAIN_TAGS.WEBHOOK, HELPFUL_TAGS.PAYMENT_WEBHOOK]
    static summary = "Колбэк для оплаты"

    static paramsSchema = {
        type: "object",
        additionalProperties: true,
        properties: {},
    }

    static resultSchema = {
        type: "null",
        additionalProperties: false,
        properties: {},
    }

    async execute(params: IPaymentCallback): Promise<null> {

        const { id: transactionId, order_id, status, amount } = params

        const order = await this.services.orders.getById(order_id)
        if (!order) throw new Error("Ордер не существует")
        if (order.status === PaymentStatus.PAID) return null

        const isBuySkins = order.operation === Operation.BUY_SKINS
        const isRechargeAccuntBalance = order.operation === Operation.RECHARGE_ACCUNT_BALANCE

        const updatedOrder = await this.services.orders.update(
            {
                status: status.toUpperCase() as PaymentStatus,
                transactionId,
            },
            order_id,
            isBuySkins
        )

        if (updatedOrder.status === PaymentStatus.PAID) {
            if (isRechargeAccuntBalance && updatedOrder.userId) {
                await prisma.user.update({
                    where: { id: updatedOrder.userId },
                    data: {
                        balance: {
                            increment: parseFloat((Number(updatedOrder.amount) * 1.05).toFixed(2)),
                        },
                    },
                })
            }

            if (isBuySkins && updatedOrder.userId) {
                await this.services.cart.clearByUserId(updatedOrder.userId)
            }

            const notifData: ICheckoutNotifWithEmail = {
                email: order.notificationEmail,
                amount,
                transactionId,
                operation: order.operation,
                paymentMethod: order.paymentMethod,
                skins: order.skins,
                ...(order.login && { login: order.login }),
                ...(order.region && { login: order.region }),
            }

            this.services.email.sendCheckoutEmail(notifData).catch(err => console.error(err))
            const tgMessage = this.services.notification.renderCheckoutMessage(notifData)
            this.services.notification
                .sendNotifToTelegram(tgMessage)
                .catch(err => console.error(err))
        }

        return null
    }
}

export default SbpCallbackProcedure
