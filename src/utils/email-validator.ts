export const emailValidator = (email: string | null | undefined): boolean => {
    if (!email) return false
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i

    if (email.length > 254) return false
    return emailRegex.test(email)
}
