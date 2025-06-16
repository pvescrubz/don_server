export const CART_SCHEME = {
    id: { type: "string" },
    total: { type: "string" },
    itemsCount: { type: "integer" },
    skins: {
        type: "array",
        items: {
            type: "object",
            additionalProperties: false,
            properties: {
                id: { type: "string" },
                name: { type: "string" },
                price: { type: "string" },
                image: { type: "string" },
                slug: { type: "string" },
                game: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        name: { type: "string" },
                    },
                },

                rarity: {
                    type: "object",
                    nullable: true,
                    additionalProperties: true,
                },
                exterior: {
                    type: "object",
                    nullable: true,
                    additionalProperties: true,
                },
            },
        },
    },
}
