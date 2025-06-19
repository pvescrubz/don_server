import { Role, User } from "@prisma/client"
import { FastifyBaseLogger } from "fastify"
import { prisma } from "../../prismaClient"
import roles from "../../roles.json"
import { TRoles } from "../../types/role.type"
import { IAuthSteamData } from "./users.type"

export class UsersService {
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
        const { name, steamAvatar, steamId, ref } = data

        let referredById: string | undefined

        if (ref) {
            const referrer = await prisma.user.findUnique({
                where: { ref },
                select: { id: true },
            })
            if (referrer) {
                referredById = referrer.id
            }
        }

        const user = await prisma.user.create({
            data: {
                steamId,
                ...(name && { name }),
                ...(steamAvatar && { steamAvatar }),
                ...(referredById && { referredById }),
            },
            include: {
                _count: {
                    select: {
                        referrals: true,
                    },
                },
            },
        })
        await prisma.cart.create({ data: { userId: user.id } })

        return user
    }

    async getByEmail(email: string): Promise<User | null> {
        return await prisma.user.findUnique({
            where: {
                email,
            },
            include: {
                _count: {
                    select: {
                        referrals: true,
                    },
                },
            },
        })
    }
    async getBySteamId(steamId: string): Promise<User | null> {
        return await prisma.user.findUnique({
            where: {
                steamId,
            },
            include: {
                _count: {
                    select: {
                        referrals: true,
                    },
                },
            },
        })
    }

    async getById(id: string): Promise<(User & { _count: { referrals: number } }) | null> {
        return await prisma.user.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        referrals: true,
                    },
                },
            },
        })
    }

    async update(data: Partial<User>, id: string): Promise<User> {
        return await prisma.user.update({
            where: {
                id,
            },
            include: {
                _count: {
                    select: {
                        referrals: true,
                    },
                },
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
