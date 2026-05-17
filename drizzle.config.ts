import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
console.log(process.env.DATABASE_URL, 'db url')

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
    migrations: {
    prefix: "timestamp",
    table: "__drizzle_migrations__",
    schema: "public",
  },
});
