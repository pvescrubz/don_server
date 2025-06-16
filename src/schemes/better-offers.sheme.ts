export const BETTER_OFFERS = {
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
}
