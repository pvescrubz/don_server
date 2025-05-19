

export const SORT_OPTIONS = {
    POPULAR: { id: "popular", name: "popular", ruName: "По популярности" },
    LOW_TO_HIGH: { id: "asc", name: "asc", ruName: "По возрастанию цены" },
    HIGH_TO_LOW: { id: "desc", name: "desc", ruName: "По убыванию цены" },
} as const

export const CUSTOM_FILTRES_ARR = ["statTrak", "souvenir"] as const

export const CUSTOM_FILTRES = {
    noStatTrak: {
        id: "noStatTrak",
        name: "noStatTrak",
        ruName: "Без StatTrak",
    },
    noSouvenir: {
        id: "noSouvenir",
        name: "noSouvenir",
        ruName: "Не сувенирное",
    },
} 
