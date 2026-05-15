import { eq } from "drizzle-orm";
import jwt, { Secret, SignOptions } from "jsonwebtoken"
import { db } from "../../db";
import { usersTable } from "../../db/schema";
import { env } from "../../config/env";

type TokenGenerateOptions = {
    payload: string | object | Buffer<ArrayBufferLike>;
    tokenType: "access" | "refresh";
};

export class AuthService {

  checkIfUserExists = async (email: string) => {
    try {
      const users = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .limit(1);
      return users[0];
    } catch (error) {
      throw error;
    }
  };

  configToken(tokenType: TokenGenerateOptions["tokenType"]) {
    if (tokenType === "refresh") {
        return {
            secret: env.REFRESH_TOKEN_SECRET as Secret,
            expiresIn: env.REFRESH_TOKEN_EXPIRY as SignOptions["expiresIn"],
        };
    }
    
    return {
        secret: env.ACCESS_TOKEN_SECRET as Secret,
        expiresIn: env.ACCESS_TOKEN_EXPIRY as SignOptions["expiresIn"],
    };
}

  generateToken = ({payload, tokenType}: TokenGenerateOptions) => {
    const { expiresIn, secret } = this.configToken(tokenType);

    return jwt.sign(payload, secret, {
        expiresIn 
    })
  }
}
