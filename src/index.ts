import "dotenv/config";
import build from "./app";
import load from "./config";

async function startServer() {

    const config = load()

    const app = await build(config)

    try {
        const { port } = config.app
        await app.ready()
        await app.listen({ port, host: "0.0.0.0" })

        console.log(`Server listening at http://localhost:${port}`)
    } catch (error) {
        app.log.error(error)
        process.exit(1)
    }
}

startServer()
