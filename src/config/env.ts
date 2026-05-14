import { z } from "zod";
// import dotenv from "dotenv";
import 'dotenv/config';

// Load .env
// dotenv.config();


const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : 4000)),

  DATABASE_URL: z.url(),
  WINSTON_LOG_LEVEL: z.enum(["error", "warn", "info", "http", "verbose", "debug", "silly"]).default("http"),
  ACCESS_TOKEN_SECRET: z.string(),

});


const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}


export const env = parsed.data;