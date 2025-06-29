import fastifyAuth from "@fastify/auth"
import fastifyCookie from "@fastify/cookie"
import fastifyFormbody from "@fastify/formbody"
import fastify from "fastify"
import type { IConfig } from "./config"
import { ajvPlugin, corsPlugin, swaggerPlugin, verifyToken, verifyWebhook } from "./plugins"
import { checkClient } from "./plugins/checkClient"
import { passportPlugin } from "./plugins/passport"
import getProcedures from "./procedures"
import router from "./router"
import {
  CartService,
  CheckoutService,
  CurrencyService,
  EmailService,
  FiltersService,
  LastBuyService,
  NotificationService,
  OrdersService,
  PassportService,
  SkinsService,
  StatisticsService,
  TokensService,
  UsersService,
  WeeklyProductService,
} from "./services"
import type { TServices } from "./types/servises.type"

export default async (config: IConfig) => {
    const app = fastify({
        logger: false,
        trustProxy: true,
    })

    app.register(fastifyFormbody)
    app.register(ajvPlugin)
    app.register(corsPlugin, config)
    app.register(swaggerPlugin)
    app.register(checkClient, config)
    app.register(verifyWebhook, config)
    app.register(fastifyAuth)
    app.register(verifyToken, config)
    app.register(fastifyCookie)
    app.register(passportPlugin, config)

    const services: TServices = {
        users: new UsersService({ log: app.log }),
        tokens: new TokensService(config),
        email: new EmailService(config),
        passport: new PassportService(),
        skins: new SkinsService(),
        filters: new FiltersService(),
        cart: new CartService({ log: app.log }),
        weeklyProduct: new WeeklyProductService(),
        lastBuy: new LastBuyService(),
        currency: new CurrencyService(),
        orders: new OrdersService({ log: app.log }),
        checkout: new CheckoutService({ log: app.log, config }),
        notification: new NotificationService(config),
        statistics: new StatisticsService(),
    }

    const procedures = getProcedures()

    await app.register(router, {
        procedures,
        services,
        config,
    })

   
    await Promise.all([
        services.currency.init(),
        services.weeklyProduct.init(),
        services.lastBuy.init(),
        services.statistics.init(),
    ])

    return app
}
