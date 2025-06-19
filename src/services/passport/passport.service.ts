import fastifyPassport from "@fastify/passport"

export class PassportService {
    steam() {
        return fastifyPassport.authenticate("steam", {
            scope: ["profile"],
        })
    }
}
