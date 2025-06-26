import { Operation, PaymentMethod } from "@prisma/client"

export const PAYMENT_METHOD_RU = {
    [PaymentMethod.SBP]: "СБП",
    [PaymentMethod.ACCUNT_BALANCE]: `Баланс аккаунта ${process.env.COMPANY_NAME}`,
}

export const OPERATION_RU = {
    [Operation.RECHARGE_ACCUNT_BALANCE]: `Пополнение баланса аккаунта ${process.env.COMPANY_NAME}`,

    [Operation.RECHARGE_STEAM_BALANCE]: "Пополнение баланса Steam",
    [Operation.RECHARGE_PS_BALANCE]: "Пополнение баланса Play Station",
    [Operation.RECHARGE_BLIZZARD_BALANCE]: "Пополнение баланса Blizzard",
    [Operation.RECHARGE_EPIC_BALANCE]: "Пополнение баланса Epic Store",
    [Operation.RECHARGE_XBOX_BALANCE]: "Пополнение баланса XBox",

    [Operation.BUY_SKINS]: "Покупка скинов",
}

export const IS_PRODUCTION = process.env.NODE_ENV === "production"
