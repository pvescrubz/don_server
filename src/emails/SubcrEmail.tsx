import { Body, Container, Head, Heading, Html, Preview, Text } from "@react-email/components"
import * as React from "react"

export const SubscrEmail = ({ companyName }: { companyName: string }) => {
    const previewText = `Вы подписались на новости от ${companyName}`

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Body
                style={{
                    backgroundColor: "#f6f9fc",
                    fontFamily:
                        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                    margin: "0",
                    padding: "20px 0",
                }}
            >
                <Container
                    style={{
                        maxWidth: "600px",
                        margin: "0 auto",
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        padding: "40px 30px",
                    }}
                >
                    {/* Приветственная иконка - используем таблицу вместо flexbox */}
                    <table
                        style={{
                            width: "100%",
                            marginBottom: "24px",
                        }}
                    >
                        <tr>
                            <td style={{ textAlign: "center" }}>
                                <div
                                    style={{
                                        backgroundColor: "#f0f9ff",
                                        borderRadius: "50%",
                                        width: "80px",
                                        height: "80px",
                                        margin: "0 auto",
                                        textAlign: "center",
                                        lineHeight: "80px",
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: "32px",
                                            margin: "0",
                                            lineHeight: "80px",
                                            verticalAlign: "middle",
                                        }}
                                    >
                                        🎉
                                    </Text>
                                </div>
                            </td>
                        </tr>
                    </table>

                    <Heading
                        as="h1"
                        style={{
                            fontSize: "28px",
                            fontWeight: "bold",
                            color: "#111827",
                            margin: "0 0 16px",
                            textAlign: "center",
                            lineHeight: "1.2",
                        }}
                    >
                        Благодарим за подписку на {companyName}!
                    </Heading>

                    <Text
                        style={{
                            fontSize: "18px",
                            color: "#374151",
                            margin: "0 0 32px",
                            textAlign: "center",
                            lineHeight: "1.5",
                        }}
                    >
                        Мы рады приветствовать вас в нашем сообществе.
                    </Text>

                    {/* Что вы получите */}
                    <table
                        style={{
                            width: "100%",
                            backgroundColor: "#f0fdf4",
                            borderRadius: "8px",
                            marginBottom: "32px",
                        }}
                    >
                        <tr>
                            <td style={{ padding: "24px" }}>
                                <Text
                                    style={{
                                        fontSize: "18px",
                                        color: "#111827",
                                        margin: "0 0 20px",
                                        fontWeight: "600",
                                        textAlign: "center",
                                    }}
                                >
                                    Что вас ждет:
                                </Text>

                                {/* Используем таблицу для каждого пункта */}
                                <table style={{ width: "100%", marginBottom: "16px" }}>
                                    <tr>
                                        <td
                                            style={{
                                                width: "24px",
                                                verticalAlign: "top",
                                                paddingTop: "2px",
                                            }}
                                        >
                                            <Text style={{ fontSize: "16px", margin: "0" }}>
                                                📰
                                            </Text>
                                        </td>
                                        <td style={{ paddingLeft: "8px" }}>
                                            <Text
                                                style={{
                                                    fontSize: "16px",
                                                    color: "#059669",
                                                    margin: "0 0 4px",
                                                    fontWeight: "500",
                                                }}
                                            >
                                                Свежие новости и обновления
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: "14px",
                                                    color: "#6b7280",
                                                    margin: "0",
                                                    lineHeight: "1.4",
                                                }}
                                            >
                                                Будьте в курсе всех важных событий и новинок
                                            </Text>
                                        </td>
                                    </tr>
                                </table>

                                <table style={{ width: "100%", marginBottom: "16px" }}>
                                    <tr>
                                        <td
                                            style={{
                                                width: "24px",
                                                verticalAlign: "top",
                                                paddingTop: "2px",
                                            }}
                                        >
                                            <Text style={{ fontSize: "16px", margin: "0" }}>
                                                🎁
                                            </Text>
                                        </td>
                                        <td style={{ paddingLeft: "8px" }}>
                                            <Text
                                                style={{
                                                    fontSize: "16px",
                                                    color: "#059669",
                                                    margin: "0 0 4px",
                                                    fontWeight: "500",
                                                }}
                                            >
                                                Эксклюзивные предложения
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: "14px",
                                                    color: "#6b7280",
                                                    margin: "0",
                                                    lineHeight: "1.4",
                                                }}
                                            >
                                                Специальные скидки и акции только для подписчиков
                                            </Text>
                                        </td>
                                    </tr>
                                </table>

                                <table style={{ width: "100%", marginBottom: "16px" }}>
                                    <tr>
                                        <td
                                            style={{
                                                width: "24px",
                                                verticalAlign: "top",
                                                paddingTop: "2px",
                                            }}
                                        >
                                            <Text style={{ fontSize: "16px", margin: "0" }}>
                                                ⚡
                                            </Text>
                                        </td>
                                        <td style={{ paddingLeft: "8px" }}>
                                            <Text
                                                style={{
                                                    fontSize: "16px",
                                                    color: "#059669",
                                                    margin: "0 0 4px",
                                                    fontWeight: "500",
                                                }}
                                            >
                                                Первыми узнавайте о новинках
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: "14px",
                                                    color: "#6b7280",
                                                    margin: "0",
                                                    lineHeight: "1.4",
                                                }}
                                            >
                                                Получайте доступ к новым продуктам раньше всех
                                            </Text>
                                        </td>
                                    </tr>
                                </table>

                                <table style={{ width: "100%" }}>
                                    <tr>
                                        <td
                                            style={{
                                                width: "24px",
                                                verticalAlign: "top",
                                                paddingTop: "2px",
                                            }}
                                        >
                                            <Text style={{ fontSize: "16px", margin: "0" }}>
                                                💎
                                            </Text>
                                        </td>
                                        <td style={{ paddingLeft: "8px" }}>
                                            <Text
                                                style={{
                                                    fontSize: "16px",
                                                    color: "#059669",
                                                    margin: "0 0 4px",
                                                    fontWeight: "500",
                                                }}
                                            >
                                                Полезные советы и гайды
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: "14px",
                                                    color: "#6b7280",
                                                    margin: "0",
                                                    lineHeight: "1.4",
                                                }}
                                            >
                                                Экспертные советы и подробные руководства
                                            </Text>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>

                    {/* Важная информация */}
                    <table
                        style={{
                            width: "100%",
                            backgroundColor: "#fef3c7",
                            borderRadius: "6px",
                            marginBottom: "32px",
                        }}
                    >
                        <tr>
                            <td style={{ padding: "20px" }}>
                                <Text
                                    style={{
                                        fontSize: "16px",
                                        color: "#92400e",
                                        margin: "0 0 12px",
                                        fontWeight: "600",
                                        textAlign: "center",
                                    }}
                                >
                                    📧 Важно знать:
                                </Text>
                                <Text
                                    style={{
                                        fontSize: "14px",
                                        color: "#92400e",
                                        margin: "0 0 8px",
                                        lineHeight: "1.5",
                                    }}
                                >
                                    • Письма приходят не чаще 2-3 раз в неделю
                                </Text>
                                <Text
                                    style={{
                                        fontSize: "14px",
                                        color: "#92400e",
                                        margin: "0 0 8px",
                                        lineHeight: "1.5",
                                    }}
                                >
                                    • Вы можете отписаться в любой момент
                                </Text>
                                <Text
                                    style={{
                                        fontSize: "14px",
                                        color: "#92400e",
                                        margin: "0",
                                        lineHeight: "1.5",
                                    }}
                                >
                                    • Мы не передаем ваши данные третьим лицам
                                </Text>
                            </td>
                        </tr>
                    </table>

                    {/* Подвал с любовью */}
                    <table style={{ width: "100%", borderTop: "1px solid #e5e7eb" }}>
                        <tr>
                            <td style={{ paddingTop: "24px", textAlign: "center" }}>
                                <Text
                                    style={{
                                        fontSize: "16px",
                                        color: "#374151",
                                        margin: "0 0 8px",
                                        fontWeight: "500",
                                    }}
                                >
                                    С любовью, команда {companyName} ❤️
                                </Text>
                                <Text
                                    style={{
                                        fontSize: "14px",
                                        color: "#9ca3af",
                                        margin: "0",
                                        lineHeight: "1.5",
                                    }}
                                >
                                    Если у вас есть вопросы, мы всегда готовы помочь!
                                    <br />
                                    Просто свяжитесь с нашей поддержкой.
                                </Text>
                            </td>
                        </tr>
                    </table>
                </Container>
            </Body>
        </Html>
    )
}
