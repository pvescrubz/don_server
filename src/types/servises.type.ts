import {
  CartService,
  CheckoutService,
  CurrencyService,
  EmailService,
  FiltersService,
  LastBuyService,
  NotificationService,
  OrdersService,
  PassportService,
  SkinsService,
  StatisticsService,
  TokensService,
  UsersService,
  WeeklyProductService,
} from "../services"

export type TServices = {
    users: UsersService
    passport: PassportService
    tokens: TokensService
    email: EmailService
    skins: SkinsService
    filters: FiltersService
    weeklyProduct: WeeklyProductService
    lastBuy: LastBuyService
    cart: CartService
    currency: CurrencyService
    orders: OrdersService
    checkout: CheckoutService
    notification: NotificationService
    statistics: StatisticsService
}
