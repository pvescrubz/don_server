import { Operation, PaymentMethod, Skin } from "@prisma/client"

export interface ICheckoutNotif {
    companyName: string
    amount: string | number
    transactionId: string
    operation: Operation
    paymentMethod: PaymentMethod
    skins?: Skin[]
}
export interface ICheckoutNotifWithEmail extends Omit<ICheckoutNotif, "companyName"> {
    email: string
}
