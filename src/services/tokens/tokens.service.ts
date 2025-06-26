import { FastifyReply } from "fastify"
import * as jwt from "jsonwebtoken"
import { IConfig } from "../../config"
import { IS_PRODUCTION } from "../../constants"
import { API_GUARD, HELPFUL_TAGS, TTags } from "../../types/tags.type"
import { TJwtVerifyObject } from "./tokens.type"

export class TokensService {
    private readonly JWT_SECRET: string
    private readonly TOKEN_EXPIRATION_ACCESS: number
    private readonly TOKEN_EXPIRATION_REFRESH: number

    constructor(config: IConfig) {
        this.JWT_SECRET = config.auth.secret
        this.TOKEN_EXPIRATION_ACCESS = parseInt("43200", 10)
        this.TOKEN_EXPIRATION_REFRESH = parseInt("604800", 10)
    }

    proccess(reply: FastifyReply, tags: TTags, result?: any, user?: any): void {
        if (tags.includes(HELPFUL_TAGS.ACCESS)) {
            return
        }

        if (tags.includes(API_GUARD.PRIVATE) && user && user.userId) {
            this.generateAccessToken({ userId: user.userId }, reply)
        }

        if (tags.includes(HELPFUL_TAGS.SIGNIN) && result && result.id) {
            this.generateTokens({ userId: result.id }, reply)
        }

        if (tags.includes(HELPFUL_TAGS.LOGOUT)) {
            this.clearAuthTokens(reply)
        }
    }

    sign(payload: Record<string, string>, options?: jwt.SignOptions) {
        return jwt.sign(payload, this.JWT_SECRET, options)
    }

    generateActivationToken(payload: Record<string, string>): string {
        return this.sign({ ...payload, type: "activation" }, { expiresIn: "15m" })
    }

    verify(token: string, options?: jwt.VerifyOptions): TJwtVerifyObject | null {
        try {
            return jwt.verify(token, this.JWT_SECRET, options) as TJwtVerifyObject
        } catch (e) {
            return null
        }
    }

    generateAccessToken(payload: Record<string, string>, reply: FastifyReply): void {
        const accessToken = this.sign(payload, { expiresIn: this.TOKEN_EXPIRATION_ACCESS })

        reply.setCookie("accessToken", accessToken, {
            path: "/",
            secure: true,
            httpOnly: true,
            sameSite: true,
            ...(IS_PRODUCTION && { domain: process.env.COOKIE_DOMAIN }),
        })
    }

    generateRefreshToken(payload: Record<string, string>, reply: FastifyReply): void {
        const refreshToken = this.sign(payload, { expiresIn: this.TOKEN_EXPIRATION_REFRESH })

        reply.setCookie("refreshToken", refreshToken, {
            path: "/api/auth/check-refresh",
            secure: true,
            httpOnly: true,
            sameSite: true,
            ...(IS_PRODUCTION && { domain: process.env.COOKIE_DOMAIN }),
        })
    }

    generateTokens(payload: Record<string, string>, reply: FastifyReply): void {
        this.generateAccessToken(payload, reply)
        this.generateRefreshToken(payload, reply)
    }

    clearAuthTokens(reply: FastifyReply): void {
        reply.clearCookie("accessToken", { path: "/" })
        reply.clearCookie("refreshToken", {
            path: "/api/auth/check-refresh",
        })
    }
}
