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
    payment: {
        paymentSiteKey: string
        paymentApiToken: string
    }
    email: IEmailConfig
    notification: {
        tgApiToken: string
        tgChat: string
    }
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
        payment: {
            paymentSiteKey: requader("PAYMENT_SITE_KEY"),
            paymentApiToken: requader("PAYMENT_API_TOKEN"),
        },
        email: {
            host: requader("EMAIL_HOST"),
            port: requader("EMAIL_PORT"),
            user: requader("EMAIL_USER"),
            password: requader("EMAIL_PASSWORD"),
            company: requader("COMPANY_NAME"),
        },
        notification: {
            tgApiToken: requader("TELEGRAM_TOKEN"),
            tgChat: requader("TELEGRAM_CHAT_ID"),
        },
    }
}
