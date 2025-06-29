import crypto from "crypto"
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import fp from "fastify-plugin"
import { IConfig } from "../config"

const ALLOWED_IPS = ["94.250.252.69", "178.250.156.196", "45.147.200.199"]

function signWebhook(params: Record<string, string>, xTime: string, siteKey: string): string {
    const sortedKeys = Object.keys(params).sort()
    let s = ""

    for (const key of sortedKeys) {
        const value = params[key]

        if (value === null || typeof value === "object" || Array.isArray(value)) {
            continue
        }

        if (typeof value === "boolean") {
            s += value ? "true" : "false"
            continue
        }

        s += String(value)
    }

    s += xTime

    return crypto.createHmac("sha512", siteKey).update(s.toLowerCase()).digest("hex")
}

const plugin = async (fastify: FastifyInstance, options: IConfig) => {
    fastify.decorate(
        "verifyWebhook",
        async function (request: FastifyRequest, reply: FastifyReply) {
            try {
                const ip = request.ip.replace("::ffff:", "")
                if (!ALLOWED_IPS.includes(ip)) {
                    request.log.warn(`⛔ Запрос от неразрешённого IP: ${ip}`)
                    return reply.status(403).send({ error: "Forbidden IP" })
                }

                const xTime = request.headers["x-time"]
                const xSign = request.headers["x-sign"]
                const secret = options.payment.paymentApiToken

                if (!xTime || !xSign || typeof xTime !== "string" || typeof xSign !== "string") {
                    return reply.status(400).send({ error: "Missing X-Time or X-Sign" })
                }

                const body = request.body as Record<string, string>

                const actualSign = signWebhook(body, xTime, secret)

                if (actualSign !== xSign) {
                    request.log.warn(`❌ Неверная подпись: ${xSign} ≠ ${actualSign}`)
                    return reply.status(403).send({ error: "Invalid signature" })
                }

                return
            } catch (err: unknown) {
                return reply.status(401).send({
                    error: "Unauthorized",
                    message: (err as Error).message,
                })
            }
        }
    )
}

export const verifyWebhook = fp(plugin, {
    name: "verifyWebhook-plugin",
})
