import { Body, Container, Head, Heading, Html, Preview, Text } from "@react-email/components"
import * as React from "react"
import { OPERATION_RU, PAYMENT_METHOD_RU } from "../constants"
import { ICheckoutNotif } from "../types/checkout-notification.type"

export const CheckoutEmail = (data: ICheckoutNotif) => {
    const { companyName, amount, transactionId, operation, paymentMethod, skins, login, region } =
        data

    const previewText = `Оплата на сайте ${companyName}`

    const formatRubles = (amount: string | number) => {
        const numAmount = typeof amount === "string" ? Number.parseFloat(amount) : amount
        return `${numAmount.toLocaleString("ru-RU")} ₽`
    }

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Body
                style={{
                    backgroundColor: "#f6f9fc",
                    fontFamily:
                        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                    margin: "0 auto",
                    padding: "20px 0",
                    textAlign: "center",
                }}
            >
                <Container
                    style={{
                        maxWidth: "600px",
                        margin: "0 auto",
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                        padding: "40px 30px",
                    }}
                >
                    {/* Заголовок */}
                    <Heading
                        as="h1"
                        style={{
                            fontSize: "24px",
                            fontWeight: "bold",
                            color: "#111827",
                            margin: "0 0 24px",
                            textAlign: "center",
                        }}
                    >
                        Спасибо за покупку в {companyName}!
                    </Heading>

                    {/* Информация о покупке */}
                    <div
                        style={{
                            backgroundColor: "#f9fafb",
                            borderRadius: "6px",
                            padding: "20px",
                            margin: "0 0 24px",
                            textAlign: "left",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: "16px",
                                color: "#374151",
                                margin: "0 0 12px",
                                fontWeight: "600",
                            }}
                        >
                            Детали покупки:
                        </Text>

                        <Text
                            style={{
                                fontSize: "14px",
                                color: "#6b7280",
                                margin: "0 0 8px",
                                lineHeight: "1.5",
                            }}
                        >
                            <strong>Сумма:</strong> {formatRubles(amount)}
                        </Text>

                        <Text
                            style={{
                                fontSize: "14px",
                                color: "#6b7280",
                                margin: "0 0 8px",
                                lineHeight: "1.5",
                            }}
                        >
                            <strong>ID транзакции:</strong> {transactionId}
                        </Text>
                        <Text
                            style={{
                                fontSize: "14px",
                                color: "#6b7280",
                                margin: "0",
                                lineHeight: "1.5",
                            }}
                        >
                            <strong>Способ оплаты:</strong> {PAYMENT_METHOD_RU[paymentMethod]}
                        </Text>
                    </div>

                    {/* Информация об операции */}
                    {operation === "BUY_SKINS" ? (
                        // Показываем список скинов для покупки скинов
                        skins &&
                        skins.length > 0 && (
                            <div
                                style={{
                                    backgroundColor: "#f0f9ff",
                                    borderRadius: "6px",
                                    padding: "20px",
                                    margin: "0 0 24px",
                                    textAlign: "left",
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: "16px",
                                        color: "#374151",
                                        margin: "0 0 16px",
                                        fontWeight: "600",
                                    }}
                                >
                                    Приобретенные скины:
                                </Text>

                                {skins.map((skin, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            padding: "12px 0",
                                            borderBottom:
                                                index < skins.length - 1
                                                    ? "1px solid #e5e7eb"
                                                    : "none",
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: "14px",
                                                color: "#374151",
                                                margin: "0",
                                                fontWeight: "500",
                                            }}
                                        >
                                            {skin.name}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: "14px",
                                                color: "#059669",
                                                margin: "0",
                                                fontWeight: "600",
                                            }}
                                        >
                                            {formatRubles(Number(skin.price).toFixed(2))}
                                        </Text>
                                    </div>
                                ))}
                            </div>
                        )
                    ) : (
                        // Показываем информацию о пополнении баланса
                        <div
                            style={{
                                backgroundColor: "#f0fdf4",
                                borderRadius: "6px",
                                padding: "20px",
                                margin: "0 0 24px",
                                textAlign: "left",
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: "16px",
                                    color: "#374151",
                                    margin: "0 0 16px",
                                    fontWeight: "600",
                                }}
                            >
                                Операция выполнена:
                            </Text>

                            <Text
                                style={{
                                    fontSize: "15px",
                                    color: "#059669",
                                    margin: "0 0 16px",
                                    fontWeight: "500",
                                    lineHeight: "1.5",
                                }}
                            >
                                ✅ {OPERATION_RU[operation]}
                            </Text>
                            {login && (
                                <Text
                                    style={{
                                        fontSize: "15px",
                                        color: "#059669",
                                        margin: "0 0 16px",
                                        fontWeight: "500",
                                        lineHeight: "1.5",
                                    }}
                                >
                                    👤 Login: {login}
                                </Text>
                            )}
                            {region && (
                                <Text
                                    style={{
                                        fontSize: "15px",
                                        color: "#059669",
                                        margin: "0 0 16px",
                                        fontWeight: "500",
                                        lineHeight: "1.5",
                                    }}
                                >
                                    🌐 Регион: {region}
                                </Text>
                            )}

                            <div
                                style={{
                                    backgroundColor: "#fef3c7",
                                    borderRadius: "4px",
                                    padding: "12px",
                                    margin: "0",
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: "14px",
                                        color: "#92400e",
                                        margin: "0 0 8px",
                                        fontWeight: "500",
                                    }}
                                >
                                    ⏱️ Важная информация:
                                </Text>
                                <Text
                                    style={{
                                        fontSize: "13px",
                                        color: "#92400e",
                                        margin: "0 0 8px",
                                        lineHeight: "1.4",
                                    }}
                                >
                                    Баланс будет зачислен в течение 15 минут после подтверждения
                                    платежа.
                                </Text>
                                <Text
                                    style={{
                                        fontSize: "13px",
                                        color: "#92400e",
                                        margin: "0",
                                        lineHeight: "1.4",
                                    }}
                                >
                                    Если баланс не поступил в указанное время, обратитесь в службу
                                    поддержки с указанием ID транзакции.
                                </Text>
                            </div>
                        </div>
                    )}

                    {/* Подвал */}
                    <Text
                        style={{
                            fontSize: "14px",
                            color: "#9ca3af",
                            margin: "24px 0 0",
                            textAlign: "center",
                            lineHeight: "1.5",
                        }}
                    >
                        Если у вас есть вопросы, свяжитесь с нашей службой поддержки.
                        <br />
                        Спасибо за выбор {companyName}!
                    </Text>
                </Container>
            </Body>
        </Html>
    )
}
