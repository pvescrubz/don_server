export const GET_SKINS_PARAMS_SCHEME = {
    game: { type: "string" },
    // global
    rarity: { type: "string" },
    type: { type: "string" },
    search: { type: "string" },

    // cs2
    category: { type: "string" },
    exterior: { type: "string" },
    model: { type: "string" },
    phase: { type: "string" },
    killCounter: { type: "string" },
    souvenir: { type: "string" },

    // dota2
    quality: { type: "string" },
    hero: { type: "string" },
    slot: { type: "string" },

    // sort
    priceFrom: { type: "integer", minimum: 0 },
    priceTo: { type: "integer", minimum: 0 },
    sort: {
        type: "string",
    },
    page: { type: "integer", minimum: 1, default: 1 },
    perPage: { type: "integer", minimum: 1, default: 48 },
}
export const GET_SKINS_RESULT_SCHEME = {
    data: {
        type: "array",
        items: {
            type: "object",
            additionalProperties: false,
            properties: {
                id: { type: "string" },
                name: { type: "string" },
                price: { type: "string" },
                imageUrl: { type: "string" },
                image: { type: "string" },
                slug: { type: "string" },
                game: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                        name: { type: "string" },
                    },
                },

                //cs
                killCounter: {
                    type: "object",
                    additionalProperties: true,
                },
                souvenir: {
                    type: "object",
                    additionalProperties: true,
                },
            },
        },
    },
    meta: {
        type: "object",
        properties: {
            currentPage: { type: "integer" },
            totalPages: { type: "integer" },
            totalItems: { type: "integer" },
            itemsPerPage: { type: "integer" },
        },
    },
}
