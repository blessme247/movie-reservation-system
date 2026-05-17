import type { Request, Response } from "express";

import bcrypt from "bcrypt";
import { handleError } from "../../lib/utils/handleError";
import { type UserJwtPayload } from "../../lib/types";
import { loginDto, registerDto } from "./auth.dto";
import { AuthService } from "./auth.service";
import { ErrorLogService } from "../../services/logger";
import { db } from "../../db";
import { rolesTable, usersTable } from "../../db/schema";
import { eq } from "drizzle-orm";
import { handleSuccess } from "../../lib/utils/handleSuccess";
import { env } from "../../config/env";

export class AuthController {
  errorLogService = new ErrorLogService();
  authService = new AuthService();
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
      const user = await this.authService.checkIfUserExists(email);
      if (!user)
        return handleError(req, res, 401, {
          success: false,
          message: "Invalid credentials",
        });

      const passwordMatch = await bcrypt.compare(password, user.password || "");

      if (!passwordMatch)
        return handleError(req, res, 401, {
          success: false,
          message: "Invalid credentials",
        });

      const accessTokenPayload: UserJwtPayload = {
        userInfo: { userId: user.id, roleId: user.roleId },
      };
      const refreshTokenPayload: Pick<UserJwtPayload["userInfo"], "userId"> = {
        userId: user.id,
      };
      const accessToken = this.authService.generateToken({
        payload: accessTokenPayload,
        tokenType: "access",
      });
      const refreshToken = this.authService.generateToken({
        payload: refreshTokenPayload,
        tokenType: "refresh",
      });
      const updatedUser = await db
        .update(usersTable)
        .set({
          refreshToken: refreshToken,
        })
        .where(eq(usersTable.id, user.id))
        .returning({
          id: usersTable.id,
          firstName: usersTable.firstName,
          lastName: usersTable.lastName,
          email: usersTable.email,
        });

      return handleSuccess(req, res, 200, {
        data: updatedUser[0],
        accessToken,
        refreshToken,
      });
    } catch (error) {
      this.errorLogService.logServerError("auth-controller_login ", error, req);
      return handleError(req, res, 500, {
        success: false,
        message: "Server error",
      });
    }
  }

  async register(req: Request, res: Response) {
    const parseResult = registerDto.safeParse(req.body);
    if (!parseResult.success) {
      return handleError(req, res, 400, {
        success: false,
        message: "Validation failed",
        errors: parseResult.error.flatten().fieldErrors,
      });
    }
    const { email, password, firstName, lastName } = parseResult.data;

    try {
      const duplicate = await this.authService.checkIfUserExists(email);
      if (duplicate)
        return handleError(req, res, 409, {
          success: false,
          message: "User with this email already exists",
        });

      const hashedPassword = await bcrypt.hash(password, env.SALT_ROUNDS);
      const role = await this.authService.getRole();

      const user: typeof usersTable.$inferInsert = {
        firstName,
        lastName,
        email,
        roleId: role.id,
        password: hashedPassword,
      };

      await db.insert(usersTable).values(user);

      return handleSuccess(req, res, 201, { message: "New user created" });
    } catch (error) {
        this.errorLogService.logServerError("auth-controller_register", error, req);
      return handleError(req, res, 500, {
        success: false,
        message: "Server error",
      });
    }
  }
}
