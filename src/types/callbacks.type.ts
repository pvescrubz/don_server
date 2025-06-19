import { PaymentStatus } from "@prisma/client"

export interface IPaymentCallback {
    id: string
    order_id: string
    site_id: string
    status: PaymentStatus
    amount: string
    account: string
    type: string
    commission: string
}
