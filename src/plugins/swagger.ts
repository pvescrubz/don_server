import fastifySwagger from "@fastify/swagger"
import fastifySwaggerUi from "@fastify/swagger-ui"
import { FastifyInstance, FastifyPluginOptions } from "fastify"
import fp from "fastify-plugin"
import { MAIN_TAGS } from "../types/tags.type"

const swaggerOptions = {
    openapi: {
        info: {
            title: "Панель администратора",
            version: "1.0.0",
        },
        tags: [
            {
                name: MAIN_TAGS.AUTH,
                description: "Методы аутентификации: вход, выход, проверка токенов и т.д.",
            },
            {
                name: "Skins",
                description: "Работа с товарами: фильтрация, поиск, получение данных и т.д.",
            },
            {
                name: "Filters",
                description: "Получение доступных значений для фильтров (категории, товары и т.д.)",
            },
            {
                name: "User",
                description:
                    "Управление пользователями: просмотр, редактирование, активация и т.д.",
            },
        ],
    },
    exposeRoute: false,
}

const swaggerUiOptions = {
    routePrefix: "/",
    exposeRoute: false,
    tags: [{ name: MAIN_TAGS.AUTH, description: "Аутентификация" }],
}

const plugin = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
    fastify.register(fastifySwagger, swaggerOptions)
    fastify.register(fastifySwaggerUi, swaggerUiOptions)
}

export const swaggerPlugin = fp(plugin, {
    name: "swagger-plugin",
})
