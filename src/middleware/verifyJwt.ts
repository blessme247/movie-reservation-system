import jwt from "jsonwebtoken";
import type { Response, NextFunction } from "express";
import { handleError } from "../lib/utils/handleError.js";
import { env } from "../config/env.js";
import { AuthRequest, JwtPayload } from "../lib/types.js";


const verifyJwt = (req: AuthRequest, res: Response, next: NextFunction) => {
    const accessTokenSecret = env.ACCESS_TOKEN_SECRET
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];
  // if (!authHeader?.startsWith("Bearer ")) return res.status(401).json({message: "Unathorized"})
  if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token!, accessTokenSecret, {}, (err, decoded) => {
      if (err) {
        return handleError(req, res, 403, { message: "Forbidden" }); // invalid token
        
      }
      const jwtPayload = decoded as JwtPayload;
      req.roleId = jwtPayload.userInfo.roleId;
      req.userId = jwtPayload.userInfo.userId;
      next();
    });
    return
  }


};

export default verifyJwt;
