export const SKIN_SCHEME = {
    id: { type: "string" },
    name: { type: "string" },
    price: { type: "string" },
    imageUrl: { type: "string" },
    image: { type: "string" },
    slug: { type: "string" },

    description: {
        type: "array",
        items: {
            type: "string",
        },
        nullable: true,
    },
    game: {
        type: "object",
        nullable: true,
        additionalProperties: true,
    },
    type: {
        type: "object",
        nullable: true,
        additionalProperties: true,
    },
    rarity: {
        type: "object",
        nullable: true,
        additionalProperties: true,
    },

    // --- CS-специфично ---
    category: {
        type: "object",
        nullable: true,
        additionalProperties: true,
    },
    exterior: {
        type: "object",
        nullable: true,
        additionalProperties: true,
    },
    model: {
        type: "object",
        nullable: true,
        additionalProperties: true,
    },

    phase: {
        type: "object",
        nullable: true,
        additionalProperties: true,
    },
    killCounter: {
        type: "object",
        nullable: true,
        additionalProperties: true,
    },
    souvenir: {
        type: "object",
        nullable: true,
        additionalProperties: true,
    },

    // --- DOTA-специфично ---
    hero: {
        type: "object",
        nullable: true,
        additionalProperties: true,
    },
    quality: {
        type: "object",
        nullable: true,
        additionalProperties: true,
    },
    slot: {
        type: "object",
        nullable: true,
        additionalProperties: true,
    },
}
