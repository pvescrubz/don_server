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
        } else {
            s += String(value)
        }
    }

    s += xTime

    const finalString = s.toLowerCase()

    return crypto.createHmac("sha512", siteKey).update(finalString, "utf8").digest("hex")
}

const plugin = async (fastify: FastifyInstance, options: IConfig) => {
    fastify.addHook("preValidation", async (request: FastifyRequest, reply: FastifyReply) => {
     
        if (!request.url.startsWith("/api/webhook/sbp")) {
            return
        }

        const ip = request.ip.replace("::ffff:", "")
        if (!ALLOWED_IPS.includes(ip)) {
            request.log.warn(`⛔ Запрос от неразрешённого IP: ${ip}`)
            return reply.status(403).send({ error: "Forbidden IP" })
        }

        const xTime = request.headers["x-time"]
        const xSign = request.headers["x-sign"]
        const secret = options.payment.paymentSiteKey

        if (!xTime || !xSign || typeof xTime !== "string" || typeof xSign !== "string") {
            return reply.status(400).send({ error: "Missing X-Time or X-Sign" })
        }

        const rawBodyString = (request as any).rawBody as string

        if (!rawBodyString) {
            request.log.error("❌ Нет rawBody")
            return reply.status(400).send({ error: "Missing rawBody" })
        }

        const parsed = new URLSearchParams(rawBodyString)

        const params: Record<string, string> = {}
        for (const [key, value] of parsed) {
            params[key] = value
        }

        const actualSign = signWebhook(params, xTime, secret)

        if (actualSign !== xSign) {
            request.log.warn(`❌ Неверная подпись: ${xSign} ≠ ${actualSign}`)
            console.error(`❌ Неверная подпись: ${xSign} ≠ ${actualSign}`)
            return reply.status(403).send({ error: "Invalid signature" })
        }
    })
}

export const verifyWebhook = fp(plugin, {
    name: "verifyWebhook-plugin",
})
