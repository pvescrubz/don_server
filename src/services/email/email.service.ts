import nodemailer from "nodemailer"

import { render } from "@react-email/components"
import { IConfig } from "../../config"
import { ActivateEmail } from "../../emails/ActivateEmail"

class EmailService {
    private transporter: nodemailer.Transporter
    private company: string
    private emailUser: string
    private frontUrl: string

    constructor(config: IConfig) {
        this.transporter = nodemailer.createTransport({
            host: config.email.host,
            port: +config.email.port,
            secure: +config.email.port === 465 ? true : false,
            auth: {
                user: config.email.user,
                pass: config.email.password,
            },
        })

        this.emailUser = config.email.user
        this.company = config.email.company
        this.frontUrl = config.app.frontUrl
    }

    async sendActivateEmail(token: string, email: string, username: string | null) {
        const html = await render(
            ActivateEmail({
                token,
                username,
                companyName: this.company,
                frontUrl: this.frontUrl,
            })
        )

        await this.transporter.sendMail({
            from: `"${this.company}" <${this.emailUser}>`,
            to: email,
            subject: "Активация вашего аккаунта ✔",
            html,
        })
    }
}

export default EmailService
