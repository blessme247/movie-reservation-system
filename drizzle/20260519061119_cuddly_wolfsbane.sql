ALTER TABLE "schedules" ADD COLUMN "days" integer[];--> statement-breakpoint
UPDATE "schedules" SET "days" = ARRAY[1,2,3,4,5] WHERE "days" IS NULL;--> statement-breakpoint
ALTER TABLE "schedules" ALTER COLUMN "days" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "showtimes" ADD COLUMN "time" time NOT NULL;--> statement-breakpoint
ALTER TABLE "showtimes" DROP COLUMN "totalReservations";--> statement-breakpoint
ALTER TABLE "showtimes" DROP COLUMN "datetime";