import { ItemType } from "@prisma/client"

type fdf = ItemType

export const itemTypeShema = {
    name: "string",
    id: "string",
    categoryId: "string",
    previewSkinId: "string",
}
