import { Operation, PaymentStatus } from "@prisma/client"
import crypto from "crypto"
import { FastifyBaseLogger } from "fastify"
import { IConfig } from "../../config"
import { prisma } from "../../prismaClient"
import { IAccountBalanceParams, ICheckoutRes, IInvoiceSbpRes, ISBPParams } from "./checkout.type"

export class CheckoutService {
    private log: FastifyBaseLogger
    private siteKey: string
    private apiToken: string
    private config: IConfig

    constructor(params: { log: FastifyBaseLogger; config: IConfig }) {
        this.log = params.log
        this.config = params.config
        this.siteKey = params.config.payment.paymentSiteKey
        this.apiToken = params.config.payment.paymentApiToken
    }

    async accountBalance({
        data,
        user,
        isBuySkins,
        createOrder,
        updateOrder,
        clearCart,
    }: IAccountBalanceParams): Promise<ICheckoutRes> {
        const { amount, paymentMethod, operation, email, login, region } = data
        const { balance, id } = user

        if (!email) throw new Error("Email не указан")
        if (operation === Operation.RECHARGE_ACCUNT_BALANCE) {
            throw new Error("Некорректная платежная операция")
        }

        const balanceRounded = Number(balance.toFixed(2))
        const amountRounded = Number(Number(amount).toFixed(2))
        this.checkBalance(balanceRounded, amountRounded)

        const order = await createOrder(
            {
                amount,
                paymentMethod,
                operation,
                notificationEmail: email,
                userId: id,
                ...(login && { login }),
                ...(region && { region }),
            },
            isBuySkins
        )

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                balance: {
                    decrement: amountRounded,
                },
            },
            include: {
                cart: {
                    include: {
                        skins: true,
                    },
                },
            },
        })

        if (updatedUser) {
            const transactionId = await this.generateTransactionId()
            const updatedOrder = await updateOrder(
                {
                    transactionId,
                    status: PaymentStatus.PAID,
                },
                order.id,
                isBuySkins
            )
            if (isBuySkins && updatedUser.cart) {
                await clearCart(updatedUser.cart.id)
            }

            if (updatedOrder) {
                return {
                    amount,
                    transactionId,
                    ...(isBuySkins && { skins: updatedOrder.skins }),
                }
            }
        }

        throw new Error("Неизвестная ошибка оплете с баланса аккаунта")
    }

    async sbp({
        data,
        user,
        isBuySkins,
        createOrder,
        updateOrder,
    }: ISBPParams): Promise<{ payment_url: string }> {
        const { amount, paymentMethod, operation, email, login, region } = data

        if (!email) throw new Error("Email не указан")
        if (!user && operation === Operation.BUY_SKINS) {
            throw new Error("Ошибка при оплате скинов")
        }
        const order = await createOrder(
            {
                amount,
                paymentMethod,
                operation,
                notificationEmail: email,
                userId: user?.id,
                ...(login && { login }),
                ...(region && { region }),
            },
            isBuySkins
        )

        const { id: invoiceId, payment_url } = await this.getInvoice(order.id, amount.toString())

        const updatedOrder = await updateOrder(
            {
                transactionId: invoiceId,
            },
            order.id,
            isBuySkins
        )
        if (updatedOrder) {
            return { payment_url }
        }

        throw new Error("Неизвестная ошибка оплете через СБП")
    }

    private async getInvoice(order_id: string, amount: string): Promise<IInvoiceSbpRes> {
        const success_url = `${this.config.app.frontUrl}/checkout/success`
        const fail_url = `${this.config.app.frontUrl}/checkout/error`
        const notification_url = `${this.config.app.backUrl}/api/callback/sbp`

        const invoice = await fetch(`https://${this.siteKey}/api/v2/invoices`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.apiToken}`,
            },
            body: JSON.stringify({
                order_id,
                amount,
                success_url,
                fail_url,
                notification_url,
            }),
        })

        return await invoice.json()
    }

    private async generateTransactionId(): Promise<string> {
        let isUnique = false
        let transactionId = ""

        while (!isUnique) {
            transactionId = crypto.randomBytes(16).toString("hex")

            const existing = await prisma.order.findFirst({
                where: { transactionId },
                select: { id: true },
            })

            isUnique = !existing
        }

        return transactionId
    }

    private checkBalance(balance: number, amount: number) {
        if (balance - amount < 0) {
            throw new Error("Недостаточно средст на балансе аккаунта")
        }
    }
}
