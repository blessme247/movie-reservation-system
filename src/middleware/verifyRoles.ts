import { NextFunction, Response } from "express";
import { AuthRequest } from "../lib/types.js";
import { handleError } from "../lib/utils/handleError.js";
import { db } from "../db";
import { rolesTable } from "../db/schema";
import { eq } from "drizzle-orm";

const verifyRoles = (...allowedRoles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req?.roleId)
      return handleError(req, res, 401, {
        message: "Unauthorized"
      });

    const roles = await db.select().from(rolesTable).where(eq(rolesTable.id, req.roleId)).limit(1)
    const role = roles[0]

    if (!role) {
      console.log(`Invalid role detected: ${req.roleId}`);
      return handleError(req, res, 403, { message: "Forbidden" });
    }
    const rolesArray = [...allowedRoles];
    const result = rolesArray.includes(role.name);
    if (!result) {
      console.log("Unauthorized access attempt detected");
      return handleError(req, res, 403, { message: "Forbidden" });
    }
    next();
  };
};

export default verifyRoles;