import { Cart, Skin } from "@prisma/client"

export interface ICart extends Cart {
    skins: Skin[]
}
