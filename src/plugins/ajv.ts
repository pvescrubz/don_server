import Ajv from "ajv"
import ajvErrors from "ajv-errors"
import ajvFormats from "ajv-formats"
import { FastifyInstance, FastifyPluginOptions } from "fastify"
import fp from "fastify-plugin"

const plugin = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
    const ajv = new Ajv({
        removeAdditional: true,
        useDefaults: true,
        coerceTypes: true,
        allErrors: true,
    })

    ajvFormats(ajv)
    ajvErrors(ajv, { singleError: true })
    fastify.setValidatorCompiler(opt => ajv.compile(opt.schema))
}

export const ajvPlugin = fp(plugin, {
    name: "ajv-plugin",
})
