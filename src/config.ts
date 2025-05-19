import { IEmailConfig } from "./services/email/email.type"

export interface IConfig {
    app: {
        port: number
        frontUrl: string
        backUrl: string
    }
    auth: {
        secret: string
        steamKey: string
        sessionSecret: string
    }
    email: IEmailConfig
}

export default (): IConfig => {
    const requader = (name: string) => {
        if (!process.env[name]) {
            throw new Error(`Environment variable ${name} is not set`)
        }
        return process.env[name]
    }

    return {
        app: {
            port: parseInt(requader("PORT")),
            frontUrl: requader("FRONT_URL"),
            backUrl: requader("BACK_URL"),
        },
        auth: {
            secret: requader("AUTH_SECRET"),
            steamKey: requader("STEAM_CLIENT_SECRET"),
            sessionSecret: requader("SESSION_SECRET"),
        },
        email: {
            host: requader("EMAIL_HOST"),
            port: requader("EMAIL_PORT"),
            user: requader("EMAIL_USER"),
            password: requader("EMAIL_PASSWORD"),
            company: requader("COMPANY_NAME"),
        },
    }
}
