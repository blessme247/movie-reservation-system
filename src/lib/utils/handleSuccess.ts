import type { Request, Response } from "express";
export const handleSuccess = ( res: Response, statusCode: number, payload: Record<string, any>) => {
    return res.status(statusCode).json({payload})

}