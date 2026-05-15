import type { Request } from "express";
import { AuthRequest } from "../lib/types";
import logger from "../lib/utils/logger";
export class ErrorLogService {
    logServerError = (req: AuthRequest | Request, service: string, error: unknown ) => {
        const childLogger = logger.child({ requestId: req.ip });
        const errorMessage = error instanceof Error ? error.message : "server error";
        childLogger.error(errorMessage, {service, error: error instanceof Error ? error.stack : error})
    }
}