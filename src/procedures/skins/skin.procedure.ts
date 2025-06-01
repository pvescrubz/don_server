import { SkinCS, SkinDOTA, SkinRUST } from "@prisma/client"
import { API_METHODS } from "../../types/api-methods.type"
import { API_GUARD, MAIN_TAGS, TTags } from "../../types/tags.type"
import Procedure from "../procedure"

class SkinsProcedure extends Procedure {
    static title = "skin"
    static method = API_METHODS.GET
    static tags: TTags = [API_GUARD.PUBLIC, MAIN_TAGS.SKINS]
    static summary = "получить скин по игре и слагу"

    static paramsSchema = {
        type: "object",
        additionalProperties: false,
        required: ["game", "slug"],
        properties: {
            game: { type: "string" },
            slug: { type: "string" },
        },
    }

    static resultSchema = {
        type: "object",
        additionalProperties: false,
        properties: {
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

            // --- CS-специфично ---
            category: {
                type: "object",
                nullable: true,
                additionalProperties: true,
            },
            quality: {
                type: "object",
                nullable: true,
                additionalProperties: true,
            },
            rarity: {
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
            slot: {
                type: "object",
                nullable: true,
                additionalProperties: true,
            },
        },
    }

    async execute(params: { game: string; slug: string }): Promise<SkinCS | SkinDOTA | SkinRUST> {
        const { slug, game } = params

        let skin
        if (game === "cs2") skin = await this.services.skins.getSkinCsBySlug(slug)
        if (game === "dota2") skin = await this.services.skins.getSkinDotaBySlug(slug)
        if (game === "rust") skin = await this.services.skins.getSkinRustBySlug(slug)
        if (!skin) throw new Error("Скин не найден")

        return skin
    }
}

export default SkinsProcedure
