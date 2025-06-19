export const MAIN_TAGS = {
    AUTH: "Auth",
    USER: "User",
    SKINS: "Skins",
    FILTERS: "Filters",
    CART: "Cart",
    CURRENCY: "Currency",
    CALLBACK: "Callback",
    CHECKOUT: "Checkout",
    ORDERS: "Orders",
} as const

export const HELPFUL_TAGS = {
    SIGNIN: "Signin",
    REFRESH: "Refresh",
    LOGOUT: "Logout",
    ACCESS: "Access",
    PASSPORT_STEAM: "PassportSteam",
    PASSPORT_CALLBACK: "PassportCallback",
    PAYMENT_CALLBACK: "PaymentCallback",
} as const

export const API_GUARD = {
    PUBLIC: "Public",
    PRIVATE: "Private",
    ADMINONLY: "AdminOnly",
} as const

export type TApiGuard = (typeof API_GUARD)[keyof typeof API_GUARD]
export type TMainTags = (typeof MAIN_TAGS)[keyof typeof MAIN_TAGS]
export type THelpfulTags = (typeof HELPFUL_TAGS)[keyof typeof HELPFUL_TAGS]
export type TTags = [TApiGuard, TMainTags, ...THelpfulTags[]]
