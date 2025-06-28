const { readFileSync } = require("fs")
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function clearAllTables() {
    console.log("🧹 Начинаем очистку таблиц...")

    async function clearTable(model, tableName) {
        try {
            const count = await model.count()
            if (count > 0) {
                await model.deleteMany({})
                console.log(`✅ Таблица "${tableName}" очищена`)
            } else {
                console.log(`🟡 Таблица "${tableName}" пуста, пропущена`)
            }
        } catch (e) {
            console.log(`⚠️ Таблица "${tableName}" не существует или недоступна — пропущена`)
        }
    }
    await clearTable(prisma.cartSkin, "cartSkin")
    await clearTable(prisma.orderSkin, "orderSkin")
    await clearTable(prisma.weeklyProducts, "weeklyProducts")
    await clearTable(prisma.lastBuy, "lastBuy")

    await clearTable(prisma.cart, "cart")
    await clearTable(prisma.order, "order")

    await clearTable(prisma.skin, "skin")
    await clearTable(prisma.game, "game")
    await clearTable(prisma.rarity, "rarity")
    await clearTable(prisma.type, "type")
    await clearTable(prisma.model, "model")
    await clearTable(prisma.souvenir, "souvenir")
    await clearTable(prisma.exterior, "exterior")
    await clearTable(prisma.killCounter, "killCounter")
    await clearTable(prisma.phase, "phase")
    await clearTable(prisma.hero, "hero")
    await clearTable(prisma.slot, "slot")
    await clearTable(prisma.quality, "quality")
    await clearTable(prisma.category, "category")

    console.log("✅ Все доступные таблицы успешно обработаны")
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
}
async function updateCategoriesWithPreviews() {
    console.log("🔄 Начинаем обновление категорий с превью...")

    const categories = await prisma.category.findMany({
        include: {
            model: true,
        },
    })

    for (const category of categories) {
        console.log(`📁 Обрабатываем категорию: ${category.name}`)

        for (const model of category.model) {
            if (!model.previewSkinId) {
                const previewSkin = await prisma.skin.findFirst({
                    where: { modelId: model.id },
                })

                if (previewSkin) {
                    await prisma.model.update({
                        where: { id: model.id },
                        data: { previewSkinId: previewSkin.id },
                    })

                    console.log(`✅ Превью установлено для model "${model.name}"`)
                } else {
                    console.log(`⚠ Не найден скин для model "${model.name}"`)
                }
            } else {
                console.log(`⏭ Пропущено: Превью уже есть для "${model.name}"`)
            }
        }
    }

    console.log("✅ Категории успешно обновлены")
}

function generateSlug(name) {
    return name
        .normalize("NFKC")
        .toLowerCase()
        .replace(/[^a-zа-яё0-9\s-]/gimu, "")
        .replace(/[\s_]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
}

const CATEGORY = {
    knife: "Нож",
    pistol: "Пистолет",
    rifle: "Автомат",
    sniper: "Снайперская винтовка",
    machinegun: "Пулемёт",
    smg: "Пистолет-пулемёт",
    shotgun: "Дробовик",
    gloves: "Перчатки",
    sticker: "Стикер",
}
const RARITY = {
    Тайное: "Covert",
    Запрещённое: "Restricted",
    Засекреченное: "Classified",
    "Армейское качество": "Mil-Spec Grade",
    "Промышленное качество": "Industrial Grade",
    Ширпотреб: "Consumer Grade",
    Контрабанда: "Contraband",
    "Экстраординарного типа": "Extraordinary",
    "Примечательного типа": "Remarkable",
    "Высшего класса": "Master",
    "Экзотичного вида": "Exotic",
}
const EXTERIOR = {
    "Прямо с завода": "Factory New",
    "Немного поношенное": "Minimal Wear",
    "После полевых испытаний": "Field-Tested",
    Поношенное: "Well-Worn",
    "Закалённое в боях": "Battle-Scarred",
}
const TYPE = {
    Набор: "Set",
    Украшение: "Wearable",
    Сокровищница: "Crate",
    Комментатор: "Announcer",
    Курьер: "Courier",
    Наклейка: "Sticker",
    Инструмент: "Tool",
    Насмешка: "Taunt",
    Разное: "Miscellaneous",
    Музыка: "Music",
    "Самоцвет/руна": "Gem/Rune",
    "Стиль интерфейса": "User Interface Style",
    Вард: "Ward",
    "Загрузочный экран": "Loading Screen",
    "Набор курсоров": "Cursor Set",
    "Ключ от сокровищницы": "Key",
    Ландшафт: "Environment",
    Оружие: "weapon",
    Броня: "armor",
    Одежда: "clothes",
    Ресурсы: "resource",
    Разное: "other",
    Другое: "another",
}

const SLOTS = {
    Пояс: "Belt",
    Голова: "Head",
    "Призванное существо": "Summon",
    Руки: "Hands",
    Животное: "Creature",
    Оружие: "Weapon",
    Плечи: "Shoulders",
    "Доп. оружие": "Off-Hand Weapon",
    Спина: "Back",
    Комментатор: "Announcer",
    "2-я способность": "Secondary Ability",
    "3-я способность": "Tertiary Ability",
    Разное: "Miscellaneous",
    Броня: "Armor",
    Курьер: "Courier",
    Шея: "Neck",
    Насмешка: "Taunt",
    Ульт: "Ultimate",
    Костюм: "Costume",
    Погода: "Weather Effect",
    "4-я способность": "Quaternary Ability",
    Музыка: "Music",
    Хвост: "Tail",
    "Тело/голова": "Body/Head",
    Древние: "Ancient",
    "Стиль интерфейса": "User Interface Style",
    Вард: "Ward",
    "Загрузочный экран": "Loading Screen",
    Голос: "Voice",
    "Мега-убийства": "Mega Kill",
    "Облик волка": "Wolf Form",
    Ноги: "Legs",
    Перчатки: "Gloves",
    "Сообщения о серии убийств": "Kill Series Message",
    "Набор курсоров": "Cursor Set",
    "Башни сил Света": "Radiant Tower",
    "Башни сил Тьмы": "Dire Tower",
    Ландшафт: "Environment",
}

async function findOrCreate(modelName, nameRaw, extraData = {}) {
    if (!nameRaw || nameRaw.trim() === "") return null

    const model = prisma[modelName]
    const trimmedName = nameRaw.trim()

    try {
        let createData = { name: trimmedName }

        if (modelName === "category") {
            createData.name = trimmedName
            createData.ruName = CATEGORY[trimmedName] || trimmedName
        }
        if (modelName === "rarity") {
            createData.name = RARITY[trimmedName] || trimmedName
            createData.ruName = trimmedName
        }
        if (modelName === "exterior") {
            createData.name = EXTERIOR[trimmedName] || trimmedName
            createData.ruName = trimmedName
        }
        if (modelName === "killCounter") {
            if (trimmedName === "statTrak") {
                createData.name = trimmedName
                createData.ruName = "StatTrak™"
                createData.flag = true
            } else {
                createData.name = trimmedName
                createData.ruName = "Без StatTrak™"
                createData.flag = false
            }
        }
        if (modelName === "souvenir") {
            if (trimmedName === "souvenir") {
                createData.name = trimmedName
                createData.ruName = "Сувенирное"
                createData.flag = true
            } else {
                createData.name = trimmedName
                createData.ruName = "Не Сувенирное"
                createData.flag = false
            }
        }
        if (modelName === "model") {
            createData.categoryId = extraData.categoryId || null
        }
        if (modelName === "rarity" || modelName === "type") {
            createData.gameId = extraData.gameId || null
        }

        if (modelName === "slot") {
            createData.name = SLOTS[trimmedName]
            createData.ruName = trimmedName
        }
        if (modelName === "type") {
            createData.name = TYPE[trimmedName]
            createData.ruName = trimmedName
        }

        const record = await model.upsert({
            where: { name: createData.name },
            update: {},
            create: createData,
        })

        return record.id
    } catch (error) {
        console.error(`❌ Ошибка при обработке ${modelName} "${trimmedName}":`, error.message)
        return null
    }
}

async function importSkinsFromJSON(filePath) {
    const modelMap = {}

    console.log("🚀 Начинаем импорт JSON...")

    const rawData = readFileSync(filePath, "utf8")
    const data = shuffleArray(JSON.parse(rawData))

    let rowCount = 0

    for (const row of data) {
        rowCount++

        try {
            const gameId = await findOrCreate("game", row.game)
            const categoryId = await findOrCreate("category", row.category)
            const exteriorId = await findOrCreate("exterior", row.exterior)
            const modelId = await findOrCreate("model", row.model, { categoryId })
            const phaseId = await findOrCreate("phase", row.phase)
            const slotId = await findOrCreate("slot", row.slot)
            const heroId = await findOrCreate("hero", row.hero)
            const qualityId = await findOrCreate("quality", row.quality)
            const slug = generateSlug(row.name)

            const rarityId = await findOrCreate("rarity", row.rarity, { gameId })
            const typeId = await findOrCreate("type", row.type, { gameId })

            let uniqueSlug = slug
            let counter = 1

            while (true) {
                const existing = await prisma.skin.findUnique({
                    where: { slug: uniqueSlug },
                })
                if (!existing) break
                uniqueSlug = `${slug}-${counter}`
                counter++
            }
            let souvenirId = null
            let killCounterId = null

            if (row.game === "cs2") {
                if (row.souvenir === true) {
                    souvenirId = await findOrCreate("souvenir", "souvenir")
                } else {
                    souvenirId = await findOrCreate("souvenir", "noSouvenir")
                }
                if (row.statTrak === true) {
                    killCounterId = await findOrCreate("killCounter", "statTrak")
                } else {
                    killCounterId = await findOrCreate("killCounter", "noStatTrak")
                }
            }

            if (row.model && !modelMap[row.model]) {
                modelMap[row.model] = modelId
            }

            await prisma.skin.create({
                data: {
                    name: row.name.trim(),
                    price: parseFloat(row.price),
                    imageUrl: row.imageUrl.trim(),
                    image: row.image.trim(),
                    description: row.description || null,
                    categoryId,
                    gameId,
                    exteriorId,
                    rarityId,
                    modelId,
                    phaseId,
                    souvenirId,
                    killCounterId,
                    slug: uniqueSlug,
                    slotId,
                    typeId,
                    heroId,
                    qualityId,
                },
            })

            console.log(`✅ Добавлен скин (${rowCount}): ${row.name}`)
        } catch (error) {
            console.error(`❌ Ошибка при добавлении "${row.name}":`, error.message)
        }
    }

    console.log(`\n🎉 Импорт завершён! Всего добавлено: ${rowCount} записей`)
    return modelMap
}

const JSON_FILE_CS = "./skins-cs.json"
const JSON_FILE_DOTA = "./skins-dota.json"
const JSON_FILE_RUST = "./skins-rust.json"

;(async () => {
    try {
        await clearAllTables()

        await importSkinsFromJSON(JSON_FILE_CS)
        await importSkinsFromJSON(JSON_FILE_DOTA)
        await importSkinsFromJSON(JSON_FILE_RUST)
        await updateCategoriesWithPreviews()
    } catch (error) {
        console.error("🚨 Произошла ошибка:", error.message)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
})()
