import { Role, User } from "@prisma/client"
import { FastifyBaseLogger } from "fastify"
import { prisma } from "../../prismaClient"
import roles from "../../roles.json"
import { TRoles } from "../../types/role.type"
import { IAuthSteamData } from "./users.type"

class UsersService {
    private log: FastifyBaseLogger
    private roles: TRoles[]

    constructor(params: { log: FastifyBaseLogger }) {
        this.log = params.log
        this.roles = roles as TRoles[]
    }

    async init() {
        this.log.info({}, "users.init")

        await Promise.all([
            // await this.createIndex(),
            // await this.updateRoles(),
        ])

        this.log.info({ success: true }, "users.init")
    }

    async createWithSteam(data: IAuthSteamData): Promise<User> {
        const { name, picture: avatarPath, system, steamId } = data
        // const cart = await prisma.cart.create({ data: {} })

        return await prisma.user.create({
            data: {
                // cart: { connect: { id: cart.id } },
                steamId,
                ...(name && { name }),
            },
        })
    }

    async getByEmail(email: string) {
        return await prisma.user.findUnique({
            where: {
                email,
            },
        })
    }
    async getBySteamId(steamId: string) {
        return await prisma.user.findUnique({
            where: {
                steamId,
            },
        })
    }

    async getById(id: string) {
        return prisma.user.findUnique({
            where: {
                id,
            },
        })
    }

    async update(data: Partial<User>, id: string) {
        return prisma.user.update({
            where: {
                id,
            },
            data,
        })
    }

    async deleteUser(id: string) {
        return await prisma.user.delete({
            where: { id },
        })
    }

    async isGranted(id: string, permission: string): Promise<boolean> {
        this.log.info({ user: id, permission }, "users.isGranted")

        const user = await this.getById(id)
        if (!user || !user.roles) return false

        const permissions = await this.getPermissions(user.roles)
        if (!permissions || permissions.length === 0) return false

        const result = permissions.includes(permission)

        return result
    }

    async getPermissions(roles: Role[]): Promise<string[]> {
        this.log.info({ roles }, "users.getPermissions")

        const permissionsSet = new Set<string>()

        for (const role of roles) {
            const rolePermissions = await this.getPermissionsForRole(role)

            if (rolePermissions) {
                rolePermissions.forEach(p => permissionsSet.add(p))
            }
        }

        return Array.from(permissionsSet)
    }

    private async getPermissionsForRole(role: string): Promise<string[] | null> {
        this.log.info({ role }, "users.getPermissionsForRole")

        const foundRole = this.roles.find(r => r.name === role)

        if (foundRole) {
            return foundRole.permissions
        }

        this.log.warn({ role }, "Роль не найдена")
        return null
    }
}

export default UsersService
