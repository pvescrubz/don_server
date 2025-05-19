import { JwtPayload } from "jsonwebtoken"

export interface TJwtVerifyObject extends JwtPayload {
    userId: string
}
