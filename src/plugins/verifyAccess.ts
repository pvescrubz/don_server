import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import fp from "fastify-plugin"
import { IConfig } from "../config"
import TokensService from "../services/tokens/tokens.service"

const plugin = async (fastify: FastifyInstance, options: IConfig) => {
    const { auth } = options

    const tokensService = new TokensService(auth.secret)

    fastify.decorate("verifyAccess", async function (request: FastifyRequest, reply: FastifyReply) {
        try {
            const { accessToken, refreshToken } = request.cookies

            if (accessToken && !refreshToken) {
                const decoded = tokensService.verify(accessToken)
                ;(request as any).user = decoded
                return
            }

            if (refreshToken) {
                const decoded = tokensService.verify(refreshToken)
                ;(request as any).user = decoded
                return
            }
            reply.status(401).send({ error: "Unauthorized" })
        } catch (err: unknown) {
            reply.status(401).send({ error: "Unauthorized", message: (err as Error).message })
        }
    })
}

export const verifyToken = fp(plugin, {
    name: "verifyAccess-plugin",
})
