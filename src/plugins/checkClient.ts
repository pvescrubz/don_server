import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import fp from "fastify-plugin"
import { IConfig } from "../config"
import { TokensService } from "../services"

const plugin = async (fastify: FastifyInstance, options: IConfig) => {

    const tokensService = new TokensService(options)

    fastify.decorate("checkClient", async function (request: FastifyRequest, reply: FastifyReply) {
        try {
            const { accessToken } = request.cookies

            if (accessToken) {
                const decoded = tokensService.verify(accessToken)
                ;(request as any).user = decoded
                return
            }

            return
        } catch (err: unknown) {
            console.error(err)
        }
    })
}

export const checkClient = fp(plugin, {
    name: "checkClient-plugin",
})
