import fastifyPassport from "@fastify/passport"

class PassportService {
    steam() {
        return fastifyPassport.authenticate("steam", {
            scope: ["profile"],
        })
    }
}

export default PassportService
