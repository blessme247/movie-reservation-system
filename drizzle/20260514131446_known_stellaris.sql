ALTER TABLE "users" ADD COLUMN "password" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "refreshToken" varchar(3000);