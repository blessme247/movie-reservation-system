import type { Request, Response } from "express";
export type AuthRequest = Request & {userId: number, roleId: number}
export type UserJwtPayload = {
    userInfo: {
        roleId: number
        userId: number
    }
}

export type PosterImage = {
    url: string
    assetId: string
    publicId: string
}