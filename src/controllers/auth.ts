import type { Request, Response, NextFunction } from "express";
import { loginDto } from "../lib/dto/auth";
import { handleError } from "../lib/utils/handleError";
import { db } from "../db";
import { usersTable } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { AuthService } from "../services/auth";
import { UserJwtPayload } from "../lib/types";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

      const payload: UserJwtPayload = {userInfo: {userId: user.id, roleId: user.roleId}}
    } catch (error) {}
  }
}
