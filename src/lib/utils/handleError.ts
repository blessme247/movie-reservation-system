import type { Request, Response } from "express";
export const handleError = (req: Request, res: Response, statusCode: number,payload: Record<string, any>) => {
    return res.status(statusCode).json({payload})

}