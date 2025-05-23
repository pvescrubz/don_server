import fastifyAuth from "@fastify/auth"
import fastifyCookie from "@fastify/cookie"
import fastify from "fastify"
import type { IConfig } from "./config"
import { ajvPlugin, corsPlugin, swaggerPlugin, verifyToken } from "./plugins"
import { passportPlugin } from "./plugins/passport"
import getProcedures from "./procedures"
import router from "./router"
import EmailService from "./services/email/email.service"
import FiltersService from "./services/filters/filters.service"
import PassportService from "./services/passport/passport.service"
import skinsService from "./services/skins/skins.service"
import TokensService from "./services/tokens/tokens.service"
import UsersService from "./services/users/users.service"
import type { TServices } from "./types/servises.type"

export default async (config: IConfig) => {
    const app = fastify({
        logger: false,
    })

    app.register(ajvPlugin)
    app.register(corsPlugin, config)
    app.register(swaggerPlugin)

    app.register(fastifyAuth)
    app.register(verifyToken, config)
    app.register(fastifyCookie)
    app.register(passportPlugin, config)

    const services: TServices = {
        users: new UsersService({ log: app.log }),
        tokens: new TokensService(config.auth.secret),
        email: new EmailService(config),
        passport: new PassportService(),
        skins: new skinsService(),
        filters: new FiltersService(),
    }

    const procedures = getProcedures()

    await app.register(router, {
        procedures,
        services,
    })

    return app
}
