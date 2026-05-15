import type { Request, Response, NextFunction } from "express";

import bcrypt from "bcrypt";
import { handleError } from "../../lib/utils/handleError";
import {type UserJwtPayload } from "../../lib/types";
import { loginDto } from "./auth.dto";
import { AuthService } from "./auth.service";
import { ErrorLogService } from "../../services/logger";
import { db } from "../../db";
import { usersTable } from "../../db/schema";
import { eq } from "drizzle-orm";
import { handleSuccess } from "../../lib/utils/handleSuccess";

export class AuthController {
 errorLogService = new ErrorLogService() 
 authService = new AuthService()
//   constructor(private readonly authService: AuthService) {}
  async login(req: Request, res: Response) {
    const parseResult = loginDto.safeParse(req.body);
    if (!parseResult.success) {
      return handleError(req, res, 400, {
        success: false,
        message: "Validation failed",
        errors: parseResult.error.flatten().fieldErrors,
      });
    }
    const { email, password } = parseResult.data;

    try {
      const user = await this.authService.checkIfUserExists(email.trim());
      if(!user) return handleError(req, res, 401, {
        success: false,
        message: "Invalid credentials"
      })

      const passwordMatch = await bcrypt.compare(password.trim(), user.password || "");

      if(!passwordMatch) return handleError(req, res, 401, {
        success: false,
        message: "Invalid credentials"
      })

      const accessTokenPayload: UserJwtPayload = {userInfo: {userId: user.id, roleId: user.roleId}}
      const refreshTokenPayload: Pick<UserJwtPayload['userInfo'], 'userId'> = {userId: user.id} 
      const accessToken = this.authService.generateToken({payload: accessTokenPayload, tokenType: "access"})
      const refreshToken = this.authService.generateToken({payload: refreshTokenPayload, tokenType: "refresh"})
      const updatedUser = await db
          .update(usersTable)
          .set({
            refreshToken: refreshToken,
          })
          .where(eq(usersTable.id, user.id)).returning({id: usersTable.id, firstName: usersTable.firstName, lastName: usersTable.lastName, email: usersTable.email})

          return handleSuccess(req, res, 201, {data: updatedUser[0], accessToken, refreshToken})
    } catch (error) {
        this.errorLogService.logServerError(req, "auth-controller", error)
        return handleError(req, res, 500, {
        success: false,
        message: "Server error"
      })
    }
  }
}
