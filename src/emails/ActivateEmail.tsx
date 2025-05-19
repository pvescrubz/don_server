import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"
import * as React from "react"

interface IActivateEmail {
    token: string
    companyName: string
    username?: string | null
    frontUrl: string
}

export const ActivateEmail = ({ token, companyName, username, frontUrl }: IActivateEmail) => {
    const previewText = `Активация аккаунта ${companyName}`

    const link = `${frontUrl}/activate?token=${token}`

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
                    {/* <Img
                        src={companyLogo}
                        alt={`${companyName} логотип`}
                        width="140"
                        height="40"
                        style={{
                            display: "block",
                            margin: "0 auto 24px",
                        }}
                    /> */}

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
                        Активация аккаунта
                    </Heading>

                    {/* Приветствие */}
                    <Text
                        style={{
                            fontSize: "16px",
                            lineHeight: "1.5",
                            color: "#4b5563",
                            marginBottom: "16px",
                            textAlign: "left",
                        }}
                    >
                        {username && <>Привет, {username}!</>}
                        {!username && <>Привет!</>}
                    </Text>

                    {/* Основной текст */}
                    <Text
                        style={{
                            fontSize: "16px",
                            lineHeight: "1.5",
                            color: "#4b5563",
                            marginBottom: "24px",
                            textAlign: "left",
                        }}
                    >
                        Команда <strong>{companyName}</strong> благодарит Вас за использование наших
                        услуг. Чтобы завершить регистрацию и активировать аккаунт, нажмите кнопку
                        ниже.
                    </Text>

                    {/* Кнопка */}
                    <Section
                        style={{
                            textAlign: "center",
                            margin: "32px 0",
                        }}
                    >
                        <Button
                            href={link}
                            style={{
                                backgroundColor: "#4f46e5",
                                color: "#ffffff",
                                fontSize: "16px",
                                fontWeight: "bold",
                                textDecoration: "none",
                                padding: "12px 24px",
                                borderRadius: "4px",
                                display: "inline-block",
                                textAlign: "center",
                            }}
                        >
                            Активировать аккаунт
                        </Button>
                    </Section>

                    {/* Текст с ссылкой */}
                    <Text
                        style={{
                            fontSize: "16px",
                            lineHeight: "1.5",
                            color: "#4b5563",
                            marginBottom: "8px",
                            textAlign: "left",
                        }}
                    >
                        Если кнопка не работает, скопируйте ссылку ниже и вставьте её в адресную
                        строку браузера:
                    </Text>
                    <Text
                        style={{
                            backgroundColor: "#f3f4f6",
                            borderRadius: "4px",
                            padding: "12px",
                            wordBreak: "break-all",
                            marginBottom: "24px",
                            textAlign: "left",
                            fontSize: "14px",
                            color: "#4f46e5",
                        }}
                    >
                        <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: "#4f46e5",
                                textDecoration: "underline",
                            }}
                        >
                            {link}
                        </a>
                    </Text>

                    {/* Предупреждение о сроке действия */}
                    <Text
                        style={{
                            fontSize: "14px",
                            lineHeight: "1.5",
                            color: "#6b7280",
                            marginBottom: "32px",
                            textAlign: "left",
                        }}
                    >
                        Ссылка будет действительна 15 минут. Если вы не запрашивали активацию
                        аккаунта — проигнорируйте это письмо.
                    </Text>

                    {/* Разделитель */}
                    <Hr
                        style={{
                            borderColor: "#e5e7eb",
                            margin: "32px 0",
                        }}
                    />

                    {/* Подвал */}
                    <Text
                        style={{
                            fontSize: "12px",
                            lineHeight: "1.5",
                            color: "#9ca3af",
                            textAlign: "center",
                            margin: "0",
                        }}
                    >
                        © {new Date().getFullYear()} {companyName}. Все права защищены.
                    </Text>
                    <Text
                        style={{
                            fontSize: "12px",
                            lineHeight: "1.5",
                            color: "#9ca3af",
                            textAlign: "center",
                            margin: "4px 0 0",
                        }}
                    >
                        Это автоматическое письмо — не отвечайте на него.
                    </Text>
                </Container>
            </Body>
        </Html>
    )
}
