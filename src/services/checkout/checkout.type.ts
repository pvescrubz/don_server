import { CurrencyKey, Operation, Order, PaymentMethod, Skin, User } from "@prisma/client"
import { ICart } from "../cart/cart.type"
import { ICreateOrderData } from "../orders/orders.type"

export interface ICheckoutParams {
    amount: string | number
    paymentMethod: PaymentMethod
    operation: Operation
    currency: CurrencyKey
    email?: string
}

export interface ICheckoutRes {
    amount: string | number
    transactionId: string
    skins?: Skin[]
}

export interface IAccountBalanceParams {
    data: Required<ICheckoutParams>
    user: User
    isBuySkins: boolean
    createOrder: (data: ICreateOrderData, withCart?: boolean) => Promise<Order>
    updateOrder: (
        data: Partial<Order>,
        id: string,
        withSkins?: boolean
    ) => Promise<Order & { skins?: Skin[] }>
    clearCart: (cartId: string) => Promise<ICart>
}

export interface IAccountBalanceParams {
    data: Required<ICheckoutParams>
    user: User
    isBuySkins: boolean
    createOrder: (data: ICreateOrderData, withCart?: boolean) => Promise<Order>
    updateOrder: (
        data: Partial<Order>,
        id: string,
        withSkins?: boolean
    ) => Promise<Order & { skins?: Skin[] }>
    clearCart: (cartId: string) => Promise<ICart>
}

export interface ISBPParams {
    data: Required<ICheckoutParams>
    user?: User | null
    isBuySkins: boolean
    createOrder: (data: ICreateOrderData, withCart?: boolean) => Promise<Order>
    updateOrder: (
        data: Partial<Order>,
        id: string,
        withSkins?: boolean
    ) => Promise<Order & { skins?: Skin[] }>
}

export interface IInvoiceSbpRes {
    id: string
    payment_url: string
}
