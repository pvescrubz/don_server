import { User } from "@prisma/client"
import { USER_SCHEME } from "../../schemes/user.scheme"
import { API_METHODS } from "../../types/api-methods.type"
import { API_GUARD, HELPFUL_TAGS, MAIN_TAGS, TTags } from "../../types/tags.type"
import Procedure from "../procedure"

class LoginProcedure extends Procedure {
    static title = "steam-callback"
    static method = API_METHODS.GET
    static tags: TTags = [
        API_GUARD.PUBLIC,
        MAIN_TAGS.AUTH,
        HELPFUL_TAGS.SIGNIN,
        HELPFUL_TAGS.PASSPORT_STEAM,
        HELPFUL_TAGS.PASSPORT_CALLBACK,
    ]
    static summary = "Колбэк стим после успешной аунтификации"

    static paramsSchema = {
        type: "object",
        additionalProperties: false,
        properties: {},
    }

    static resultSchema = {
        type: "object",
        additionalProperties: false,
        properties: USER_SCHEME,
    }

    async execute(_: unknown, user: any, context: { ref: string }): Promise<User> {
        const { personaname, avatarfull, steamid } = user._json

        const candidate = await this.services.users.getBySteamId(steamid)

        if (!candidate) {
            const { ref } = context

            return await this.services.users.createWithSteam({
                name: personaname,
                steamAvatar: avatarfull,
                steamId: steamid,
                ref,
            })
        }

        if (candidate?.steamAvatar !== avatarfull || candidate?.name !== personaname) {
            return await this.services.users.update(
                {
                    name: personaname,
                    steamAvatar: avatarfull,
                },
                candidate?.id
            )
        }

        return candidate
    }
}

export default LoginProcedure
