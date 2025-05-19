import { FastifyBaseLogger } from "fastify"
import { TApiMethods } from "../types/api-methods.type"
import { TServices } from "../types/servises.type"
import { API_GUARD, TTags } from "../types/tags.type"

interface ProcedureParams {
    services: TServices
    log: FastifyBaseLogger
}

class Procedure {
    public services: TServices
    public log: FastifyBaseLogger

    static title: string
    static method: TApiMethods
    static tags: TTags
    static summary: string
    static description: string
    static paramsSchema: object
    static resultSchema: object

    constructor(params: ProcedureParams) {
        this.services = params.services
        this.log = params.log
    }

    async execute(params: any, user?: any): Promise<any> {
        return null
    }

    async exec(params: any): Promise<any> {
        this.log.trace({ params }, "pd.exec")
        const { user, ...data } = params

        const cls = this.constructor as typeof Procedure

        if (cls.tags.includes(API_GUARD.PUBLIC)) {
            return this.execute(data, user)
        }

        const [name, tag] = [cls.title, cls.tags[1].toLowerCase()]

        const isGranted = await this.services.users.isGranted(user.userId, `${tag}:${name}`)

        if (!isGranted) {
            const error = new Error(
                `У пользователя ${user.userId} нет доступа к выполнению процедуры ${tag}:${name}`
            )

            ;(error as any).status = 403

            throw error
        }

        return this.execute(data, user)
    }
}

export default Procedure
