import type { Request, Response } from "express";
export type AuthRequest = Request & {userId: number, roleId: number}
export type JwtPayload = {
    userInfo: {
        roleId: number
        userId: number
    }
}