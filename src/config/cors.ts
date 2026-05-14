import type { CorsOptions } from "cors";
import { env } from "./env";

const NODE_ENV = env.NODE_ENV

const allowedOrigins: string[] =
  NODE_ENV === "production"
    ? (process.env.FRONTEND_APP_URL || "").split(",").map((url) => url.trim())
    : ["http://localhost:3000", "http://localhost:5173"];

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow non-browser tools like Postman

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};