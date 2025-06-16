import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { IProcedure } from "./procedures"
import { TJwtVerifyObject } from "./services/tokens/tokens.type"
import { API_METHODS } from "./types/api-methods.type"
import { TServices } from "./types/servises.type"
import { API_GUARD, HELPFUL_TAGS } from "./types/tags.type"

interface Params {
    procedures: IProcedure[]
    services: TServices
}

export default async (app: FastifyInstance, { services, procedures }: Params) => {
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

        app.route({
            method,
            url: `/api/${path}${title ? `/${title}` : ""}`,
            ...(auth.length && { preValidation: app.auth(auth) }),
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
                    const params = {
                        ...(method === API_METHODS.GET
                            ? (request.query as Record<string, unknown>)
                            : (request.body as Record<string, unknown>)),
                        ...(request.params as Record<string, unknown>),
                    }

                    const { currency, ref } = request.cookies

                    const user: TJwtVerifyObject = request.user as TJwtVerifyObject

                    params.user = user
                    if (currency) params.currency = currency
                    if (ref) params.ref = ref

                    const result = await procInstance.exec(params)

                    services.tokens.proccess(reply, tags, result, user)

                    if (tags.includes(HELPFUL_TAGS.PASSPORT_CALLBACK)) {
                        await reply.redirect(
                            `${process.env.FRONT_URL}/i/balance` ||
                                "http://localhost:3000/i/balance"
                        )
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
