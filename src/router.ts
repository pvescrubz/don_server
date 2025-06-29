import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { IConfig } from "./config"
import { IProcedure } from "./procedures"
import { TJwtVerifyObject } from "./services/tokens/tokens.type"
import { API_METHODS } from "./types/api-methods.type"
import { TServices } from "./types/servises.type"
import { API_GUARD, HELPFUL_TAGS, MAIN_TAGS } from "./types/tags.type"

interface Params {
    procedures: IProcedure[]
    services: TServices
    config: IConfig
}

export default async (app: FastifyInstance, { services, procedures, config }: Params) => {
    for (const { Procedure, path } of procedures) {
        const { title, method, paramsSchema, resultSchema, tags, ...rest } = Procedure

        const procInstance = new Procedure({ services, log: app.log })
        const auth = []

        if (!tags.includes(API_GUARD.PUBLIC)) {
            auth.push((app as any).verifyAccess)
        }

        if (tags.includes(HELPFUL_TAGS.PASSPORT_STEAM)) {
            auth.push(services.passport.steam())
        }

        if (tags.includes(MAIN_TAGS.CHECKOUT)) {
            auth.push((app as any).checkClient)
        }

        // if (tags.includes(HELPFUL_TAGS.PAYMENT_WEBHOOK)) {
        //     auth.push((app as any).verifyWebhook)
        // }

        app.route({
            method,
            url: `/api/${path}${title ? `/${title}` : ""}`,
            ...(auth.length && { preValidation: app.auth(auth) }),

            ...(tags.includes(HELPFUL_TAGS.PAYMENT_WEBHOOK) && {
                config: { rawBody: true },
            }),
            schema: {
                ...(method === API_METHODS.GET
                    ? {
                          querystring: paramsSchema,
                      }
                    : {
                          body: paramsSchema,
                      }),
                response: {
                    200: resultSchema,
                },
                tags: [tags[1]],
                ...rest,
            },

            handler: async function (request: FastifyRequest, reply: FastifyReply) {
                try {
                    let params: Record<string, unknown> = {}

                    if (method === API_METHODS.GET) {
                        params = { ...(request.query as Record<string, unknown>) }
                    } else {
                        params = { ...(request.body as Record<string, unknown>) }
                    }

                    params = {
                        ...params,
                        ...(request.params as Record<string, unknown>),
                    }

                    if (tags.includes(HELPFUL_TAGS.PAYMENT_WEBHOOK) && "rawBody" in request) {
                        const rawBodyString = request.rawBody as string
                        const parsed = new URLSearchParams(rawBodyString)
                        for (const [key, value] of parsed) {
                            params[key] = value
                        }
                    }

                    const user: TJwtVerifyObject = request.user as TJwtVerifyObject
                    if (user) params.user = user

                    const { app_currency, ref } = request.cookies

                    params.context = {
                        ...(params.context || {}),
                        ...(app_currency && { app_currency }),
                        ...(ref && { ref }),
                    }

                    const result = await procInstance.exec(params)

                    services.tokens.proccess(reply, tags, result, user)

                    if (tags.includes(HELPFUL_TAGS.PASSPORT_CALLBACK)) {
                        await reply.redirect(`${config.app.frontUrl}/i/balance`)
                    }

                    if (tags.includes(HELPFUL_TAGS.PAYMENT_WEBHOOK)) {
                        reply.status(200).send("OK")
                    }

                    await reply.send(result)
                } catch (error) {
                    app.log.error(error)

                    let err = ""
                    if (error instanceof Error) {
                        err = error.message
                    }

                    reply.status(500).send({ error: err || "Internal Server Error" })
                }
            },
        })
    }
}
