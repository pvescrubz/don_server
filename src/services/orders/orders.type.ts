import { Operation, PaymentMethod } from "@prisma/client"

export interface ICreateOrderData {
    amount: string | number
    paymentMethod: PaymentMethod
    operation: Operation
    notificationEmail: string
    userId?: string
}
