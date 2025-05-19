import EmailService from "../services/email/email.service"
import FiltersService from "../services/filters/filters.service"
import PassportService from "../services/passport/passport.service"
import SkinsService from "../services/skins/skins.service"
import TokensService from "../services/tokens/tokens.service"
import UsersService from "../services/users/users.service"

export type TServices = {
    users: UsersService
    passport: PassportService
    tokens: TokensService
    email: EmailService
    skins: SkinsService
    filters: FiltersService
}
