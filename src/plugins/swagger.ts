import fastifySwagger from "@fastify/swagger"
import fastifySwaggerUi from "@fastify/swagger-ui"
import { FastifyInstance, FastifyPluginOptions } from "fastify"
import fp from "fastify-plugin"
import { MAIN_TAGS } from "../types/tags.type"

const swaggerOptions = {
    openapi: {
        info: {
            title: "Don Endppoints",
            version: "1.0.0",
        },
        tags: [
            {
                name: MAIN_TAGS.CHECKOUT,
                description: "Оплата",
            },
            {
                name: MAIN_TAGS.CART,
                description: "Работа с корзиной: добавление, удаление, получение данных и т.д.",
            },
            {
                name: MAIN_TAGS.SKINS,
                description: "Работа с товарами: фильтрация, поиск, получение данных и т.д.",
            },
            {
                name: MAIN_TAGS.AUTH,
                description: "Методы аутентификации: вход, выход, проверка токенов и т.д.",
            },
            {
                name: MAIN_TAGS.USER,
                description:
                    "Управление пользователями: просмотр, редактирование, активация и т.д.",
            },
            {
                name: MAIN_TAGS.FILTERS,
                description: "Получение доступных значений для фильтров (категории, товары и т.д.)",
            },
            {
                name: MAIN_TAGS.CURRENCY,
                description: "Получить курсы валют",
            },
            {
                name: MAIN_TAGS.WEBHOOK,
                description: "Колбэки",
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
