export const USER_SCHEME = {
    id: { type: "string" },
    email: { type: "string" },
    name: { type: "string" },
    steamAvatar: { type: "string" },
    steamId: { type: "string" },
    steamTradeUrl: { type: "string" },
    activatedEmail: { type: "string" },
    selectedCurrency: { type: "string" },
    balance: { type: "string" },
    ref: { type: "string" },
    _count: {
        type: "object",
        additionalProperties: false,
        properties: {
            referrals: { type: "string" },
        },
    },
}
