export interface IAuthData {
    email: string
    password: string
    name?: string
    picture?: string
    system?: boolean
    steamId?: string
}
export interface IAuthSteamData {
    email?: string
    password?: string
    name?: string
    picture?: string
    system?: boolean
    steamId: string
}
export interface ISystemAuthData {
    systemLogin: string
    systemPassword: string
}
