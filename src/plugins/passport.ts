import fastifyPassport from "@fastify/passport"
import fastifySession from "@fastify/session"
import { FastifyInstance } from "fastify"
import fp from "fastify-plugin"
import SteamStrategy from "passport-steam"
import { IConfig } from "../config"

const plugin = async (fastify: FastifyInstance, options: IConfig) => {
    const { auth, app } = options

    fastify.register(fastifySession, {
        secret: auth.sessionSecret,
    })

    fastify.register(fastifyPassport.initialize())
    fastify.register(fastifyPassport.secureSession())

    fastifyPassport.registerUserSerializer(async (user, request) => {
        return user
    })

    fastifyPassport.registerUserDeserializer(async (user, request) => {
        return user
    })

    fastifyPassport.use(
        "steam",
        new SteamStrategy(
            {
                returnURL: `${app.backUrl}/api/auth/steam-callback`,
                realm: `${app.backUrl}`,
                apiKey: auth.steamKey,
            },
            function (identifier: any, profile: any, done: any) {
                return done(null, profile)
            }
        )
    )
}

export const passportPlugin = fp(plugin, {
    name: "passport-plugin",
})
